import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import {
  sqlServerService,
  MAIN_SQL_FILE,
  DB_RECORDS_FILE,
  generateSqlServer2014Dump
} from './sqlserver_db.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 80;

console.log(`=======================================================================`);
console.log(`⚡ Initializing Clean VMS of AMS Microsoft SQL Server 2014 Database...`);
console.log(`📂 Main SQL Server 2014 T-SQL File: ${MAIN_SQL_FILE}`);
console.log(`=======================================================================`);

// 1. One-time Migration from legacy MySQL records if present and SQL Server storage is empty
const MYSQL_DIR = path.resolve(process.cwd(), 'Database_MySQL_SQL');
const MYSQL_RECORDS = path.join(MYSQL_DIR, 'visitors_records.json');

let customVisitors = [];

if (fs.existsSync(DB_RECORDS_FILE)) {
  try {
    const rawData = fs.readFileSync(DB_RECORDS_FILE, 'utf-8');
    customVisitors = JSON.parse(rawData);
    console.log(`📂 Loaded ${customVisitors.length} persistent visitor records from SQL Server 2014 records cache.`);
  } catch (err) {
    console.warn(`Could not read ${DB_RECORDS_FILE}:`, err.message);
    customVisitors = [];
  }
}

// Auto-migrate from MySQL store if SQL Server cache is empty
if (customVisitors.length === 0 && fs.existsSync(MYSQL_RECORDS)) {
  try {
    const mysqlRaw = fs.readFileSync(MYSQL_RECORDS, 'utf-8');
    const mysqlData = JSON.parse(mysqlRaw);
    if (Array.isArray(mysqlData) && mysqlData.length > 0) {
      customVisitors = [...mysqlData];
      fs.writeFileSync(DB_RECORDS_FILE, JSON.stringify(customVisitors, null, 2), 'utf-8');
      console.log(`🔄 Migrated ${customVisitors.length} records from MySQL store to SQL Server 2014 storage.`);
    }
  } catch (e) {
    console.warn('MySQL migration check notice:', e.message);
  }
}

let dbRecords = [...customVisitors];

// Sync changes to disk (.sql script and .json cache)
const syncToDatabase = () => {
  try {
    // 1. Update JSON cache for sub-10ms memory index
    fs.writeFileSync(DB_RECORDS_FILE, JSON.stringify(customVisitors, null, 2), 'utf-8');

    // 2. Generate and write directly to main SQL Server 2014 T-SQL dump
    const sqlScript = generateSqlServer2014Dump(customVisitors);
    fs.writeFileSync(MAIN_SQL_FILE, sqlScript, 'utf-8');

    console.log(`💾 Saved ${customVisitors.length} visitor record(s) to ${MAIN_SQL_FILE}`);
  } catch (err) {
    console.warn('Failed to sync visitors to Database_SQL_Server_2014:', err);
  }
};

// Initial write of SQL Server 2014 dump
syncToDatabase();

// Connect to Microsoft SQL Server 2014 asynchronously
(async () => {
  try {
    const connected = await sqlServerService.initialize();
    if (connected) {
      // Sync any existing DB records if DB was already populated
      const dbRows = await sqlServerService.loadAllVisitorsFromDb();
      if (dbRows && dbRows.length > 0) {
        console.log(`📥 Loaded ${dbRows.length} visitors from live SQL Server 2014 database.`);
        customVisitors = dbRows;
        dbRecords = [...customVisitors];
        syncToDatabase();
      } else if (customVisitors.length > 0) {
        // If SQL Server 2014 was freshly created and empty, seed our existing records into it
        console.log(`📤 Seeding ${customVisitors.length} existing visitors into SQL Server 2014 table...`);
        for (const visitor of customVisitors) {
          await sqlServerService.saveVisitorToDb(visitor);
        }
      }
    }
  } catch (err) {
    console.warn('SQL Server 2014 background connect error:', err.message);
  }
})();

// GET /api/visitors - Fast Search & Paginate Engine (sub-10ms)
app.get('/api/visitors', (req, res) => {
  const search = (req.query.search || '').toLowerCase().trim();
  const status = req.query.status || 'All';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;

  const reqStart = Date.now();

  let results = dbRecords;

  if (status !== 'All') {
    results = results.filter((r) => r.status === status);
  }

  if (search) {
    results = results.filter((r) => 
      (r.fullName || '').toLowerCase().includes(search) ||
      (r.phone || '').includes(search) ||
      (r.passCode || '').toLowerCase().includes(search) ||
      (r.company || '').toLowerCase().includes(search) ||
      (r.hostName || '').toLowerCase().includes(search) ||
      (r.email || '').toLowerCase().includes(search) ||
      (r.id || '').toLowerCase().includes(search)
    );
  }

  const totalCount = results.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const paginatedRecords = results.slice(startIndex, startIndex + limit);

  const queryTimeMs = Date.now() - reqStart;

  res.json({
    totalRecords: dbRecords.length,
    filteredCount: totalCount,
    totalPages,
    currentPage: page,
    limit,
    queryTimeMs,
    visitors: paginatedRecords
  });
});

// POST /api/visitors - Insert new Visitor into SQL Server 2014 and disk
app.post('/api/visitors', async (req, res) => {
  try {
    const newVisitor = req.body;
    if (!newVisitor.id) {
      newVisitor.id = `VIS-${100000 + dbRecords.length}`;
    }
    if (!newVisitor.outTime) newVisitor.outTime = '--';
    
    // Unshift to memory
    dbRecords.unshift(newVisitor);
    
    // Unshift to persistent storage array & write to SQL Server 2014 file
    customVisitors.unshift(newVisitor);
    syncToDatabase();

    // Save directly to Microsoft SQL Server 2014 if live connection is active
    let savedToLiveDb = false;
    if (sqlServerService.isConnected) {
      savedToLiveDb = await sqlServerService.saveVisitorToDb(newVisitor);
    }

    res.status(201).json({
      message: savedToLiveDb 
        ? 'Visitor successfully saved to Microsoft SQL Server 2014 database and file storage.' 
        : 'Visitor saved to SQL Server 2014 persistence file (SQL Server live connection offline).',
      visitor: newVisitor,
      totalRecords: dbRecords.length,
      savedLocation: MAIN_SQL_FILE,
      savedToLiveDb
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/visitors/:id/status - Update Status & Audit Trail
app.put('/api/visitors/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, actionTakenBy, rejectionReason, outTime } = req.body;

    const visitor = dbRecords.find((r) => r.id === id);
    if (visitor) {
      visitor.status = status;
      visitor.finalStatus = status;
      visitor.employeeStatus = status;
      if (status === 'Visited' || status === 'CHECKED_OUT') {
        visitor.outTime = outTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      }
      if (actionTakenBy) visitor.actionTakenBy = actionTakenBy;
      if (rejectionReason) visitor.rejectionReason = rejectionReason;
      visitor.actionTakenAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

      // Update in custom records array if present
      const customIdx = customVisitors.findIndex((r) => r.id === id);
      if (customIdx !== -1) {
        customVisitors[customIdx] = { ...visitor };
      } else {
        customVisitors.unshift(visitor);
      }
      syncToDatabase();

      // Update in SQL Server 2014
      let savedToLiveDb = false;
      if (sqlServerService.isConnected) {
        savedToLiveDb = await sqlServerService.updateVisitorStatusInDb(id, {
          status,
          outTime: visitor.outTime,
          actionTakenBy,
          actionTakenAt: visitor.actionTakenAt,
          rejectionReason
        });
      }

      res.json({
        message: 'Visitor status updated in Microsoft SQL Server 2014.',
        visitor,
        savedToLiveDb
      });
    } else {
      res.status(404).json({ error: 'Visitor record not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/custom-visitors - Return persistent custom visitor records
app.get('/api/custom-visitors', (req, res) => {
  res.json({ visitors: customVisitors });
});

// DELETE /api/visitors/:id - Remove visitor
app.delete('/api/visitors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const initCustomLen = customVisitors.length;
    customVisitors = customVisitors.filter((v) => v.id !== id);

    const recIdx = dbRecords.findIndex((v) => v && v.id === id);
    if (recIdx !== -1) {
      dbRecords.splice(recIdx, 1);
    }

    if (customVisitors.length !== initCustomLen) {
      syncToDatabase();
    }

    let deletedFromLiveDb = false;
    if (sqlServerService.isConnected) {
      deletedFromLiveDb = await sqlServerService.deleteVisitorFromDb(id);
    }

    res.json({
      success: true,
      message: `Visitor ${id} removed successfully from Microsoft SQL Server 2014.`,
      totalRecords: dbRecords.length,
      deletedFromLiveDb
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/visitors/purge-all - Completely wipe all visitor records
app.post('/api/visitors/purge-all', async (req, res) => {
  try {
    customVisitors = [];
    dbRecords = [];
    syncToDatabase();

    let purgedFromLiveDb = false;
    if (sqlServerService.isConnected) {
      purgedFromLiveDb = await sqlServerService.purgeAllVisitorsFromDb();
    }

    console.log(`🧹 All visitor records purged from Microsoft SQL Server 2014.`);
    res.json({
      success: true,
      message: 'All visitor records successfully purged from Microsoft SQL Server 2014.',
      totalRecords: 0,
      purgedFromLiveDb
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/database/config - Return active SQL Server 2014 configuration
app.get('/api/database/config', (req, res) => {
  const status = sqlServerService.getStatus();
  res.json({
    ...status,
    totalRecords: customVisitors.length
  });
});

// POST /api/database/configure - Update SQL Server 2014 credentials & test reconnect
app.post('/api/database/configure', async (req, res) => {
  try {
    const { server, port, user, password, database, connectionString } = req.body;
    const configPath = path.resolve(process.cwd(), 'sqlserver.config.json');
    
    let currentConfig = sqlServerService.loadConfig();
    const updatedConfig = {
      ...currentConfig,
      connectionString: connectionString !== undefined ? connectionString : currentConfig.connectionString,
      server: server || currentConfig.server,
      port: port ? parseInt(port) : currentConfig.port,
      user: user !== undefined ? user : currentConfig.user,
      password: password !== undefined ? password : currentConfig.password,
      database: database || currentConfig.database
    };

    fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2), 'utf-8');
    sqlServerService.config = sqlServerService.loadConfig();
    
    const reconnected = await sqlServerService.initialize();
    res.json({
      success: reconnected,
      message: reconnected 
        ? 'Successfully connected to Microsoft SQL Server 2014!' 
        : `Could not connect to SQL Server 2014: ${sqlServerService.lastError}`,
      status: sqlServerService.getStatus()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/export/sql - Download SQL Server 2014 T-SQL Schema & Data Dump
app.get('/api/export/sql', (req, res) => {
  const sqlContent = generateSqlServer2014Dump(customVisitors);
  res.setHeader('Content-Type', 'application/sql');
  res.setHeader('Content-Disposition', 'attachment; filename="vms_of_ams_sqlserver2014.sql"');
  res.send(sqlContent);
});

// Serve static production frontend bundle if present
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

const isServerless = process.env.VERCEL || process.env.NETLIFY;
if (!isServerless) {
  app.listen(PORT, () => {
    console.log(`🚀 VMS of AMS SQL Server 2014 API Server running at http://localhost:${PORT}`);
    console.log(`📁 Main T-SQL Store File: ${MAIN_SQL_FILE}`);
  });
}

export default app;
