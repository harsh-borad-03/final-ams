import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Database Configuration: Storage Target -> Database_MySQL_SQL/vms_of_ams_500k.sql
const DB_DIR = path.resolve(process.cwd(), '../Database_MySQL_SQL');
const DB_DIR_FALLBACK = path.resolve(process.cwd(), 'Database_MySQL_SQL');
const TARGET_DIR = fs.existsSync(DB_DIR) ? DB_DIR : DB_DIR_FALLBACK;

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const MAIN_SQL_FILE = path.join(TARGET_DIR, 'vms_of_ams_500k.sql');
const DB_RECORDS_FILE = path.join(TARGET_DIR, 'visitors_records.json');

console.log(`⚡ Initializing Clean VMS of AMS Database Engine...`);
console.log(`📂 Main Storage SQL: ${MAIN_SQL_FILE}`);

let dbRecords = [];
if (fs.existsSync(DB_RECORDS_FILE)) {
  try {
    const rawData = fs.readFileSync(DB_RECORDS_FILE, 'utf-8');
    dbRecords = JSON.parse(rawData);
    console.log(`📂 Loaded ${dbRecords.length} records from Database_MySQL_SQL.`);
  } catch (err) {
    console.warn(`Could not read ${DB_RECORDS_FILE}:`, err);
    dbRecords = [];
  }
}

console.log(`✅ Clean Database Ready (${dbRecords.length} records).`);

// Helper to escape SQL values
const escapeSql = (val) => {
  if (val === null || val === undefined) return 'NULL';
  const str = String(val);
  return `'` + str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r') + `'`;
};

// Helper to generate full MySQL SQL dump
const generate500kSqlScript = (records) => {
  let sql = `-- ========================================================\n`;
  sql += `-- AMS SYSTEM / VISITOR MANAGEMENT DATABASE DUMP (.sql)\n`;
  sql += `-- Target Database: MySQL 8.0+ / MariaDB\n`;
  sql += `-- Total Records: 500,000 Visitor Entry Logs Capacity\n`;
  sql += `-- Synced: ${new Date().toISOString()}\n`;
  sql += `-- ========================================================\n\n`;
  sql += `CREATE DATABASE IF NOT EXISTS \`vms_of_ams\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n`;
  sql += `USE \`vms_of_ams\`;\n\n`;
  sql += `CREATE TABLE IF NOT EXISTS \`visitors\` (\n`;
  sql += `  \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,\n`;
  sql += `  \`passCode\` VARCHAR(32) NOT NULL,\n`;
  sql += `  \`fullName\` VARCHAR(128) NOT NULL,\n`;
  sql += `  \`phone\` VARCHAR(20) NOT NULL,\n`;
  sql += `  \`email\` VARCHAR(128) DEFAULT NULL,\n`;
  sql += `  \`purpose\` VARCHAR(64) DEFAULT 'Guest',\n`;
  sql += `  \`company\` VARCHAR(128) DEFAULT 'Enterprise HQ',\n`;
  sql += `  \`hostName\` VARCHAR(128) DEFAULT 'Dhaval Sir',\n`;
  sql += `  \`department\` VARCHAR(128) DEFAULT 'IT',\n`;
  sql += `  \`inTime\` VARCHAR(32) DEFAULT '10:00 AM',\n`;
  sql += `  \`outTime\` VARCHAR(32) DEFAULT '05:00 PM',\n`;
  sql += `  \`status\` VARCHAR(32) DEFAULT 'Pending',\n`;
  sql += `  \`actionTakenBy\` VARCHAR(128) DEFAULT NULL,\n`;
  sql += `  \`actionTakenAt\` VARCHAR(32) DEFAULT NULL,\n`;
  sql += `  \`rejectionReason\` TEXT DEFAULT NULL,\n`;
  sql += `  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n`;
  sql += `  INDEX \`idx_phone\` (\`phone\`),\n`;
  sql += `  INDEX \`idx_passcode\` (\`passCode\`),\n`;
  sql += `  INDEX \`idx_fullname\` (\`fullName\`),\n`;
  sql += `  INDEX \`idx_status\` (\`status\`)\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  sql += `CREATE TABLE IF NOT EXISTS \`users\` (\n`;
  sql += `  \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,\n`;
  sql += `  \`username\` VARCHAR(64) NOT NULL UNIQUE,\n`;
  sql += `  \`name\` VARCHAR(128) NOT NULL,\n`;
  sql += `  \`role\` ENUM('Super Admin', 'Security', 'Employee') NOT NULL,\n`;
  sql += `  \`password\` VARCHAR(255) NOT NULL,\n`;
  sql += `  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  sql += `INSERT INTO \`users\` (\`id\`, \`username\`, \`name\`, \`role\`, \`password\`) VALUES\n`;
  sql += `('USR-01', 'admin', 'Admin User', 'Super Admin', 'admin@123'),\n`;
  sql += `('USR-02', 'SA', 'SA Super Admin', 'Super Admin', 'admin123'),\n`;
  sql += `('USR-03', 'security', 'Security Officer', 'Security', 'AMS@1234'),\n`;
  sql += `('USR-04', 'aashis', 'Aashis', 'Employee', 'AMS@1234')\n`;
  sql += `ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`);\n\n`;

  if (records.length > 0) {
    sql += `INSERT INTO \`visitors\` (\n`;
    sql += `  \`id\`, \`passCode\`, \`fullName\`, \`phone\`, \`email\`, \`purpose\`, \`company\`, \`hostName\`, \`department\`, \`inTime\`, \`outTime\`, \`status\`, \`actionTakenBy\`, \`actionTakenAt\`, \`rejectionReason\`\n`;
    sql += `) VALUES\n`;

    const rows = records.map((r) => {
      return `  (${escapeSql(r.id)}, ${escapeSql(r.passCode || 'VP-2026')}, ${escapeSql(r.fullName)}, ${escapeSql(r.phone)}, ${escapeSql(r.email || null)}, ${escapeSql(r.purpose || 'Guest')}, ${escapeSql(r.company || 'Enterprise HQ')}, ${escapeSql(r.hostName || 'Staff')}, ${escapeSql(r.department || 'IT')}, ${escapeSql(r.inTime || '10:00 AM')}, ${escapeSql(r.outTime || '--')}, ${escapeSql(r.status || 'Pending')}, ${escapeSql(r.actionTakenBy || null)}, ${escapeSql(r.actionTakenAt || null)}, ${escapeSql(r.rejectionReason || null)})`;
    });

    sql += rows.join(',\n') + '\n';
    sql += `ON DUPLICATE KEY UPDATE\n`;
    sql += `  \`passCode\` = VALUES(\`passCode\`),\n`;
    sql += `  \`fullName\` = VALUES(\`fullName\`),\n`;
    sql += `  \`phone\` = VALUES(\`phone\`),\n`;
    sql += `  \`email\` = VALUES(\`email\`),\n`;
    sql += `  \`purpose\` = VALUES(\`purpose\`),\n`;
    sql += `  \`company\` = VALUES(\`company\`),\n`;
    sql += `  \`hostName\` = VALUES(\`hostName\`),\n`;
    sql += `  \`department\` = VALUES(\`department\`),\n`;
    sql += `  \`inTime\` = VALUES(\`inTime\`),\n`;
    sql += `  \`outTime\` = VALUES(\`outTime\`),\n`;
    sql += `  \`status\` = VALUES(\`status\`),\n`;
    sql += `  \`actionTakenBy\` = VALUES(\`actionTakenBy\`),\n`;
    sql += `  \`actionTakenAt\` = VALUES(\`actionTakenAt\`),\n`;
    sql += `  \`rejectionReason\` = VALUES(\`rejectionReason\`);\n`;
  }
  return sql;
};

// Helper to persist records to vms_of_ams_500k.sql
const syncToDatabase = () => {
  try {
    fs.writeFileSync(DB_RECORDS_FILE, JSON.stringify(dbRecords, null, 2), 'utf-8');
    const sqlScript = generate500kSqlScript(dbRecords);
    fs.writeFileSync(MAIN_SQL_FILE, sqlScript, 'utf-8');
    console.log(`💾 Saved ${dbRecords.length} visitor record(s) to ${MAIN_SQL_FILE}`);
  } catch (err) {
    console.warn('Failed to sync visitor to Database_MySQL_SQL:', err);
  }
};

// GET /api/visitors - Fast Search & Paginate Engine
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

// POST /api/visitors - Insert new Visitor into vms_of_ams_500k.sql
app.post('/api/visitors', (req, res) => {
  const newVisitor = req.body;
  if (!newVisitor.id) {
    newVisitor.id = `VIS-${100000 + dbRecords.length}`;
  }
  if (!newVisitor.outTime) newVisitor.outTime = '--';
  
  dbRecords.unshift(newVisitor);
  syncToDatabase();

  res.status(201).json({
    message: 'Visitor successfully saved to vms_of_ams_500k.sql.',
    visitor: newVisitor,
    totalRecords: dbRecords.length
  });
});

// PUT /api/visitors/:id/status - Update Status & Audit Trail in vms_of_ams_500k.sql
app.put('/api/visitors/:id/status', (req, res) => {
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

    syncToDatabase();
    res.json({ message: 'Visitor status updated in vms_of_ams_500k.sql.', visitor });
  } else {
    res.status(404).json({ error: 'Visitor record not found.' });
  }
});

// GET /api/custom-visitors
app.get('/api/custom-visitors', (req, res) => {
  res.json({ visitors: dbRecords });
});

// DELETE /api/visitors/:id - Remove visitor from vms_of_ams_500k.sql
app.delete('/api/visitors/:id', (req, res) => {
  const { id } = req.params;
  const initLen = dbRecords.length;
  dbRecords = dbRecords.filter((v) => v.id !== id);

  if (dbRecords.length !== initLen) {
    syncToDatabase();
  }

  res.json({
    success: true,
    message: `Visitor ${id} removed successfully from vms_of_ams_500k.sql.`,
    totalRecords: dbRecords.length
  });
});

app.listen(PORT, () => {
  console.log(`🚀 VMS of AMS Modular Server running on port ${PORT}`);
  console.log(`📁 Saving data to ${MAIN_SQL_FILE}`);
});

export default app;
