import mssql from 'mssql';
import fs from 'fs';
import path from 'path';

// Paths
const DB_DIR = path.resolve(process.cwd(), 'Database_SQL_Server_2014');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export const MAIN_SQL_FILE = path.join(DB_DIR, 'vms_of_ams_sqlserver2014.sql');
export const DB_RECORDS_FILE = path.join(DB_DIR, 'visitors_records.json');
const CONFIG_FILE = path.resolve(process.cwd(), 'sqlserver.config.json');

// Helper to escape SQL string literals in T-SQL (N'...')
export const escapeTSql = (val) => {
  if (val === null || val === undefined) return 'NULL';
  const str = String(val).replace(/'/g, "''");
  return `N'${str}'`;
};

// Generate Full Microsoft SQL Server 2014 (.sql) Script
export const generateSqlServer2014Dump = (records = []) => {
  let sql = `-- ============================================================================\n`;
  sql += `-- AMS ENTERPRISE VISITOR MANAGEMENT SYSTEM (VMS)\n`;
  sql += `-- MICROSOFT SQL SERVER 2014 T-SQL DATABASE DUMP\n`;
  sql += `-- Engine Compatibility: Microsoft SQL Server 2014 (12.x) / 2016+ / Azure SQL\n`;
  sql += `-- Generated: ${new Date().toISOString()}\n`;
  sql += `-- Active Records: ${records.length}\n`;
  sql += `-- Author: Smit Patel\n`;
  sql += `-- ============================================================================\n\n`;

  sql += `USE [master];\nGO\n\n`;
  sql += `IF NOT EXISTS (SELECT [name] FROM sys.databases WHERE [name] = N'vms_of_ams')\n`;
  sql += `BEGIN\n    CREATE DATABASE [vms_of_ams];\nEND\nGO\n\n`;
  sql += `USE [vms_of_ams];\nGO\n\n`;

  sql += `-- ----------------------------------------------------------------------------\n`;
  sql += `-- Table Structure: [visitors]\n`;
  sql += `-- ----------------------------------------------------------------------------\n`;
  sql += `IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[visitors]') AND type in (N'U'))\n`;
  sql += `BEGIN\n`;
  sql += `    CREATE TABLE [dbo].[visitors] (\n`;
  sql += `        [id] NVARCHAR(64) NOT NULL PRIMARY KEY,\n`;
  sql += `        [passCode] NVARCHAR(32) NOT NULL,\n`;
  sql += `        [fullName] NVARCHAR(128) NOT NULL,\n`;
  sql += `        [phone] NVARCHAR(20) NOT NULL,\n`;
  sql += `        [email] NVARCHAR(128) NULL,\n`;
  sql += `        [purpose] NVARCHAR(64) DEFAULT 'Guest',\n`;
  sql += `        [company] NVARCHAR(128) DEFAULT 'Enterprise HQ',\n`;
  sql += `        [hostName] NVARCHAR(128) DEFAULT 'Dhaval Sir',\n`;
  sql += `        [department] NVARCHAR(128) DEFAULT 'IT',\n`;
  sql += `        [inTime] NVARCHAR(32) DEFAULT '10:00 AM',\n`;
  sql += `        [outTime] NVARCHAR(32) DEFAULT '--',\n`;
  sql += `        [status] NVARCHAR(32) DEFAULT 'Pending',\n`;
  sql += `        [actionTakenBy] NVARCHAR(128) NULL,\n`;
  sql += `        [actionTakenAt] NVARCHAR(32) NULL,\n`;
  sql += `        [rejectionReason] NVARCHAR(MAX) NULL,\n`;
  sql += `        [created_at] DATETIME DEFAULT GETDATE()\n`;
  sql += `    );\n`;
  sql += `    CREATE NONCLUSTERED INDEX [idx_visitors_phone] ON [dbo].[visitors]([phone]);\n`;
  sql += `    CREATE NONCLUSTERED INDEX [idx_visitors_passcode] ON [dbo].[visitors]([passCode]);\n`;
  sql += `    CREATE NONCLUSTERED INDEX [idx_visitors_fullname] ON [dbo].[visitors]([fullName]);\n`;
  sql += `    CREATE NONCLUSTERED INDEX [idx_visitors_status] ON [dbo].[visitors]([status]);\n`;
  sql += `END\nGO\n\n`;

  sql += `-- ----------------------------------------------------------------------------\n`;
  sql += `-- Table Structure: [users]\n`;
  sql += `-- ----------------------------------------------------------------------------\n`;
  sql += `IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[users]') AND type in (N'U'))\n`;
  sql += `BEGIN\n`;
  sql += `    CREATE TABLE [dbo].[users] (\n`;
  sql += `        [id] NVARCHAR(64) NOT NULL PRIMARY KEY,\n`;
  sql += `        [username] NVARCHAR(64) NOT NULL UNIQUE,\n`;
  sql += `        [name] NVARCHAR(128) NOT NULL,\n`;
  sql += `        [role] NVARCHAR(32) NOT NULL,\n`;
  sql += `        [password] NVARCHAR(255) NOT NULL,\n`;
  sql += `        [created_at] DATETIME DEFAULT GETDATE()\n`;
  sql += `    );\n`;
  sql += `END\nGO\n\n`;

  sql += `-- ----------------------------------------------------------------------------\n`;
  sql += `-- Seed System Users\n`;
  sql += `-- ----------------------------------------------------------------------------\n`;
  sql += `MERGE [dbo].[users] AS target\n`;
  sql += `USING (VALUES\n`;
  sql += `    (N'USR-01', N'admin', N'Admin User', N'Super Admin', N'admin@123'),\n`;
  sql += `    (N'USR-02', N'SA', N'SA Super Admin', N'Super Admin', N'admin123'),\n`;
  sql += `    (N'USR-03', N'security', N'Security Officer', N'Security', N'AMS@1234'),\n`;
  sql += `    (N'USR-04', N'aashis', N'Aashis', N'Employee', N'AMS@1234')\n`;
  sql += `) AS source ([id], [username], [name], [role], [password])\n`;
  sql += `ON target.[id] = source.[id]\n`;
  sql += `WHEN MATCHED THEN\n`;
  sql += `    UPDATE SET target.[name] = source.[name], target.[role] = source.[role], target.[password] = source.[password]\n`;
  sql += `WHEN NOT MATCHED THEN\n`;
  sql += `    INSERT ([id], [username], [name], [role], [password])\n`;
  sql += `    VALUES (source.[id], source.[username], source.[name], source.[role], source.[password]);\nGO\n\n`;

  sql += `-- ----------------------------------------------------------------------------\n`;
  sql += `-- Stored Visitor Records (${records.length} records)\n`;
  sql += `-- ----------------------------------------------------------------------------\n`;

  if (records.length > 0) {
    for (const r of records) {
      sql += `MERGE [dbo].[visitors] AS target\n`;
      sql += `USING (SELECT ${escapeTSql(r.id)} AS [id]) AS source\n`;
      sql += `ON target.[id] = source.[id]\n`;
      sql += `WHEN MATCHED THEN\n`;
      sql += `    UPDATE SET\n`;
      sql += `        target.[passCode] = ${escapeTSql(r.passCode || 'VP-2026')},\n`;
      sql += `        target.[fullName] = ${escapeTSql(r.fullName)},\n`;
      sql += `        target.[phone] = ${escapeTSql(r.phone)},\n`;
      sql += `        target.[email] = ${escapeTSql(r.email || null)},\n`;
      sql += `        target.[purpose] = ${escapeTSql(r.purpose || 'Guest')},\n`;
      sql += `        target.[company] = ${escapeTSql(r.company || 'Enterprise HQ')},\n`;
      sql += `        target.[hostName] = ${escapeTSql(r.hostName || 'Staff')},\n`;
      sql += `        target.[department] = ${escapeTSql(r.department || 'IT')},\n`;
      sql += `        target.[inTime] = ${escapeTSql(r.inTime || '10:00 AM')},\n`;
      sql += `        target.[outTime] = ${escapeTSql(r.outTime || '--')},\n`;
      sql += `        target.[status] = ${escapeTSql(r.status || 'Pending')},\n`;
      sql += `        target.[actionTakenBy] = ${escapeTSql(r.actionTakenBy || null)},\n`;
      sql += `        target.[actionTakenAt] = ${escapeTSql(r.actionTakenAt || null)},\n`;
      sql += `        target.[rejectionReason] = ${escapeTSql(r.rejectionReason || null)}\n`;
      sql += `WHEN NOT MATCHED THEN\n`;
      sql += `    INSERT ([id], [passCode], [fullName], [phone], [email], [purpose], [company], [hostName], [department], [inTime], [outTime], [status], [actionTakenBy], [actionTakenAt], [rejectionReason])\n`;
      sql += `    VALUES (${escapeTSql(r.id)}, ${escapeTSql(r.passCode || 'VP-2026')}, ${escapeTSql(r.fullName)}, ${escapeTSql(r.phone)}, ${escapeTSql(r.email || null)}, ${escapeTSql(r.purpose || 'Guest')}, ${escapeTSql(r.company || 'Enterprise HQ')}, ${escapeTSql(r.hostName || 'Staff')}, ${escapeTSql(r.department || 'IT')}, ${escapeTSql(r.inTime || '10:00 AM')}, ${escapeTSql(r.outTime || '--')}, ${escapeTSql(r.status || 'Pending')}, ${escapeTSql(r.actionTakenBy || null)}, ${escapeTSql(r.actionTakenAt || null)}, ${escapeTSql(r.rejectionReason || null)});\nGO\n\n`;
    }
  }

  return sql;
};

class SqlServerDatabaseService {
  constructor() {
    this.pool = null;
    this.isConnected = false;
    this.lastError = null;
    this.config = this.loadConfig();
  }

  loadConfig() {
    let cfg = {
      enabled: true,
      server: process.env.MSSQL_SERVER || 'localhost',
      port: parseInt(process.env.MSSQL_PORT) || 1433,
      user: process.env.MSSQL_USER || 'sa',
      password: process.env.MSSQL_PASSWORD || '',
      database: process.env.MSSQL_DATABASE || 'vms_of_ams',
      connectionString: process.env.SQLSERVER_CONNECTION_STRING || process.env.DATABASE_URL || '',
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectTimeout: 4000,
        requestTimeout: 8000
      }
    };

    if (fs.existsSync(CONFIG_FILE)) {
      try {
        const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        cfg = { ...cfg, ...parsed };
      } catch (e) {
        console.warn('⚠️ Could not parse sqlserver.config.json:', e.message);
      }
    }

    // Also check web.config for connectionStrings
    if (!cfg.connectionString) {
      const candidates = [
        path.resolve(process.cwd(), 'web.config'),
        path.resolve(process.cwd(), 'dist', 'web.config')
      ];
      for (const cp of candidates) {
        if (fs.existsSync(cp)) {
          try {
            const xml = fs.readFileSync(cp, 'utf-8');
            const match = xml.match(/connectionString=["']([^"']+)["']/i);
            if (match && match[1]) {
              cfg.connectionString = match[1];
              break;
            }
          } catch {}
        }
      }
    }

    // Sync parameters from connectionString if present
    if (cfg.connectionString) {
      try {
        const parsed = new mssql.ConnectionPool(cfg.connectionString);
        if (parsed && parsed.config) {
          if (parsed.config.server) cfg.server = parsed.config.server;
          if (parsed.config.port) cfg.port = parsed.config.port;
          if (parsed.config.user !== undefined) cfg.user = parsed.config.user;
          if (parsed.config.password !== undefined) cfg.password = parsed.config.password;
          if (parsed.config.database) cfg.database = parsed.config.database;
          if (parsed.config.options) cfg.options = { ...cfg.options, ...parsed.config.options };
        }
      } catch (e) {
        console.warn('⚠️ Could not parse connectionString format:', e.message);
      }
    } else {
      const portPart = cfg.port && cfg.port !== 1433 ? `,${cfg.port}` : '';
      cfg.connectionString = `Server=${cfg.server}${portPart};Database=${cfg.database};User Id=${cfg.user};Password=${cfg.password};TrustServerCertificate=True;Encrypt=False;`;
    }

    return cfg;
  }

  getMaskedConnectionString() {
    if (!this.config.connectionString) {
      const portPart = this.config.port && this.config.port !== 1433 ? `,${this.config.port}` : '';
      return `Server=${this.config.server}${portPart};Database=${this.config.database};User Id=${this.config.user};Password=*****;TrustServerCertificate=True;Encrypt=False;`;
    }
    return this.config.connectionString.replace(/(Password|pwd)\s*=\s*[^;]+/gi, '$1=*****');
  }

  async initialize() {
    if (!this.config.enabled) {
      console.log('ℹ️ Microsoft SQL Server 2014 live connection disabled in config.');
      return false;
    }

    console.log(`🔌 Attempting to connect to Microsoft SQL Server 2014 (${this.config.server}:${this.config.port})...`);
    console.log(`🔗 Active Connection String: ${this.getMaskedConnectionString()}`);

    try {
      // Connect to master first to verify/create database if necessary
      const masterConfig = {
        ...this.config,
        database: 'master'
      };

      const masterPool = await new mssql.ConnectionPool(this.config.connectionString ? { ...new mssql.ConnectionPool(this.config.connectionString).config, database: 'master' } : masterConfig).connect();
      console.log('✅ Connected to SQL Server 2014 host. Checking database [vms_of_ams]...');

      const mdfPath = path.join(DB_DIR, 'vms_of_ams.mdf');
      const ldfPath = path.join(DB_DIR, 'vms_of_ams_log.ldf');

      // Ensure database exists and explicitly target .mdf / .ldf in Database_SQL_Server_2014
      await masterPool.request().query(`
        IF NOT EXISTS (SELECT [name] FROM sys.databases WHERE [name] = N'${this.config.database}')
        BEGIN
            BEGIN TRY
                CREATE DATABASE [${this.config.database}]
                ON PRIMARY 
                (
                    NAME = N'${this.config.database}_Data',
                    FILENAME = N'${mdfPath}',
                    SIZE = 10MB,
                    MAXSIZE = UNLIMITED,
                    FILEGROWTH = 5MB
                )
                LOG ON 
                (
                    NAME = N'${this.config.database}_Log',
                    FILENAME = N'${ldfPath}',
                    SIZE = 5MB,
                    MAXSIZE = UNLIMITED,
                    FILEGROWTH = 5MB
                );
            END TRY
            BEGIN CATCH
                CREATE DATABASE [${this.config.database}];
            END CATCH
        END
      `);
      await masterPool.close();

      // Now connect to target database
      this.pool = await new mssql.ConnectionPool(this.config.connectionString || this.config).connect();
      this.isConnected = true;
      this.lastError = null;
      console.log(`🎉 Successfully connected to SQL Server 2014 database: [${this.config.database}]!`);

      // Initialize Schema and tables
      await this.initSchema();
      return true;
    } catch (err) {
      this.isConnected = false;
      this.lastError = err.message;
      console.warn(`⚠️ Microsoft SQL Server 2014 connection offline: ${err.message}`);
      console.warn(`📂 Dual Persistence Active: Visitor data is being saved continuously to Database_SQL_Server_2014/vms_of_ams_sqlserver2014.sql and visitors_records.json.`);
      return false;
    }
  }

  async initSchema() {
    if (!this.isConnected || !this.pool) return;
    try {
      const req = this.pool.request();
      await req.query(`
        IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[visitors]') AND type in (N'U'))
        BEGIN
            CREATE TABLE [dbo].[visitors] (
                [id] NVARCHAR(64) NOT NULL PRIMARY KEY,
                [passCode] NVARCHAR(32) NOT NULL,
                [fullName] NVARCHAR(128) NOT NULL,
                [phone] NVARCHAR(20) NOT NULL,
                [email] NVARCHAR(128) NULL,
                [purpose] NVARCHAR(64) DEFAULT 'Guest',
                [company] NVARCHAR(128) DEFAULT 'Enterprise HQ',
                [hostName] NVARCHAR(128) DEFAULT 'Dhaval Sir',
                [department] NVARCHAR(128) DEFAULT 'IT',
                [inTime] NVARCHAR(32) DEFAULT '10:00 AM',
                [outTime] NVARCHAR(32) DEFAULT '--',
                [status] NVARCHAR(32) DEFAULT 'Pending',
                [actionTakenBy] NVARCHAR(128) NULL,
                [actionTakenAt] NVARCHAR(32) NULL,
                [rejectionReason] NVARCHAR(MAX) NULL,
                [created_at] DATETIME DEFAULT GETDATE()
            );
            CREATE NONCLUSTERED INDEX [idx_visitors_phone] ON [dbo].[visitors]([phone]);
            CREATE NONCLUSTERED INDEX [idx_visitors_passcode] ON [dbo].[visitors]([passCode]);
            CREATE NONCLUSTERED INDEX [idx_visitors_fullname] ON [dbo].[visitors]([fullName]);
            CREATE NONCLUSTERED INDEX [idx_visitors_status] ON [dbo].[visitors]([status]);
        END

        IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[users]') AND type in (N'U'))
        BEGIN
            CREATE TABLE [dbo].[users] (
                [id] NVARCHAR(64) NOT NULL PRIMARY KEY,
                [username] NVARCHAR(64) NOT NULL UNIQUE,
                [name] NVARCHAR(128) NOT NULL,
                [role] NVARCHAR(32) NOT NULL,
                [password] NVARCHAR(255) NOT NULL,
                [created_at] DATETIME DEFAULT GETDATE()
            );
        END

        IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[companies]') AND type in (N'U'))
        BEGIN
            CREATE TABLE [dbo].[companies] (
                [id] NVARCHAR(64) NOT NULL PRIMARY KEY,
                [code] NVARCHAR(32) NOT NULL,
                [name] NVARCHAR(128) NOT NULL,
                [status] NVARCHAR(32) DEFAULT 'Active'
            );
        END

        IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[branches]') AND type in (N'U'))
        BEGIN
            CREATE TABLE [dbo].[branches] (
                [id] NVARCHAR(64) NOT NULL PRIMARY KEY,
                [code] NVARCHAR(32) NOT NULL,
                [name] NVARCHAR(128) NOT NULL,
                [location] NVARCHAR(128) DEFAULT 'Main Gate',
                [status] NVARCHAR(32) DEFAULT 'Active'
            );
        END

        IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[departments]') AND type in (N'U'))
        BEGIN
            CREATE TABLE [dbo].[departments] (
                [id] NVARCHAR(64) NOT NULL PRIMARY KEY,
                [code] NVARCHAR(32) NOT NULL,
                [name] NVARCHAR(128) NOT NULL,
                [headName] NVARCHAR(128) DEFAULT 'Head',
                [status] NVARCHAR(32) DEFAULT 'Active'
            );
        END
      `);

      // Seed Default Users
      await this.pool.request().query(`
        MERGE [dbo].[users] AS target
        USING (VALUES
            (N'USR-01', N'admin', N'Admin User', N'Super Admin', N'admin@123'),
            (N'USR-02', N'SA', N'SA Super Admin', N'Super Admin', N'admin123'),
            (N'USR-03', N'security', N'Security Officer', N'Security', N'AMS@1234'),
            (N'USR-04', N'aashis', N'Aashis', N'Employee', N'AMS@1234')
        ) AS source ([id], [username], [name], [role], [password])
        ON target.[id] = source.[id]
        WHEN MATCHED THEN
            UPDATE SET target.[name] = source.[name], target.[role] = source.[role], target.[password] = source.[password]
        WHEN NOT MATCHED THEN
            INSERT ([id], [username], [name], [role], [password])
            VALUES (source.[id], source.[username], source.[name], source.[role], source.[password]);
      `);

      console.log('✅ SQL Server 2014 Schema and default users verified in database.');
    } catch (err) {
      console.warn('⚠️ SQL Server 2014 Schema Init error:', err.message);
    }
  }

  async loadAllVisitorsFromDb() {
    if (!this.isConnected || !this.pool) return null;
    try {
      const result = await this.pool.request().query(`
        SELECT [id], [passCode], [fullName], [phone], [email], [purpose], [company], [hostName],
               [department], [inTime], [outTime], [status], [actionTakenBy], [actionTakenAt], [rejectionReason]
        FROM [dbo].[visitors]
        ORDER BY [created_at] DESC
      `);
      return result.recordset || [];
    } catch (err) {
      console.warn('Failed to query visitors from SQL Server 2014:', err.message);
      return null;
    }
  }

  async saveVisitorToDb(visitor) {
    if (!this.isConnected || !this.pool) return false;
    try {
      const req = this.pool.request();
      req.input('id', mssql.NVarChar(64), visitor.id);
      req.input('passCode', mssql.NVarChar(32), visitor.passCode || 'VP-2026');
      req.input('fullName', mssql.NVarChar(128), visitor.fullName);
      req.input('phone', mssql.NVarChar(20), visitor.phone);
      req.input('email', mssql.NVarChar(128), visitor.email || null);
      req.input('purpose', mssql.NVarChar(64), visitor.purpose || 'Guest');
      req.input('company', mssql.NVarChar(128), visitor.company || 'Enterprise HQ');
      req.input('hostName', mssql.NVarChar(128), visitor.hostName || 'Staff');
      req.input('department', mssql.NVarChar(128), visitor.department || 'IT');
      req.input('inTime', mssql.NVarChar(32), visitor.inTime || '10:00 AM');
      req.input('outTime', mssql.NVarChar(32), visitor.outTime || '--');
      req.input('status', mssql.NVarChar(32), visitor.status || 'Pending');
      req.input('actionTakenBy', mssql.NVarChar(128), visitor.actionTakenBy || null);
      req.input('actionTakenAt', mssql.NVarChar(32), visitor.actionTakenAt || null);
      req.input('rejectionReason', mssql.NVarChar(mssql.MAX), visitor.rejectionReason || null);

      await req.query(`
        MERGE [dbo].[visitors] AS target
        USING (SELECT @id AS id) AS source
        ON target.[id] = source.[id]
        WHEN MATCHED THEN
          UPDATE SET
            target.[passCode] = @passCode,
            target.[fullName] = @fullName,
            target.[phone] = @phone,
            target.[email] = @email,
            target.[purpose] = @purpose,
            target.[company] = @company,
            target.[hostName] = @hostName,
            target.[department] = @department,
            target.[inTime] = @inTime,
            target.[outTime] = @outTime,
            target.[status] = @status,
            target.[actionTakenBy] = @actionTakenBy,
            target.[actionTakenAt] = @actionTakenAt,
            target.[rejectionReason] = @rejectionReason
        WHEN NOT MATCHED THEN
          INSERT ([id], [passCode], [fullName], [phone], [email], [purpose], [company], [hostName], [department], [inTime], [outTime], [status], [actionTakenBy], [actionTakenAt], [rejectionReason])
          VALUES (@id, @passCode, @fullName, @phone, @email, @purpose, @company, @hostName, @department, @inTime, @outTime, @status, @actionTakenBy, @actionTakenAt, @rejectionReason);
      `);
      return true;
    } catch (err) {
      console.warn('Error saving visitor to SQL Server 2014:', err.message);
      return false;
    }
  }

  async updateVisitorStatusInDb(id, { status, outTime, actionTakenBy, actionTakenAt, rejectionReason }) {
    if (!this.isConnected || !this.pool) return false;
    try {
      const req = this.pool.request();
      req.input('id', mssql.NVarChar(64), id);
      req.input('status', mssql.NVarChar(32), status);
      req.input('outTime', mssql.NVarChar(32), outTime || '--');
      req.input('actionTakenBy', mssql.NVarChar(128), actionTakenBy || null);
      req.input('actionTakenAt', mssql.NVarChar(32), actionTakenAt || null);
      req.input('rejectionReason', mssql.NVarChar(mssql.MAX), rejectionReason || null);

      await req.query(`
        UPDATE [dbo].[visitors]
        SET [status] = @status,
            [outTime] = CASE WHEN @outTime IS NOT NULL AND @outTime <> '--' THEN @outTime ELSE [outTime] END,
            [actionTakenBy] = COALESCE(@actionTakenBy, [actionTakenBy]),
            [actionTakenAt] = COALESCE(@actionTakenAt, [actionTakenAt]),
            [rejectionReason] = COALESCE(@rejectionReason, [rejectionReason])
        WHERE [id] = @id;
      `);
      return true;
    } catch (err) {
      console.warn('Error updating visitor in SQL Server 2014:', err.message);
      return false;
    }
  }

  async deleteVisitorFromDb(id) {
    if (!this.isConnected || !this.pool) return false;
    try {
      const req = this.pool.request();
      req.input('id', mssql.NVarChar(64), id);
      await req.query(`DELETE FROM [dbo].[visitors] WHERE [id] = @id;`);
      return true;
    } catch (err) {
      console.warn('Error deleting visitor from SQL Server 2014:', err.message);
      return false;
    }
  }

  async purgeAllVisitorsFromDb() {
    if (!this.isConnected || !this.pool) return false;
    try {
      await this.pool.request().query(`TRUNCATE TABLE [dbo].[visitors];`);
      return true;
    } catch (err) {
      console.warn('Error truncating visitors table in SQL Server 2014:', err.message);
      return false;
    }
  }

  getStatus() {
    return {
      storageType: 'Microsoft SQL Server 2014 (T-SQL)',
      engine: 'SQL Server 2014 (12.x) / TDS Protocol 7.4',
      isConnected: this.isConnected,
      connectionString: this.getMaskedConnectionString(),
      rawConnectionString: this.config.connectionString || '',
      server: this.config.server,
      port: this.config.port,
      database: this.config.database,
      user: this.config.user,
      lastError: this.lastError,
      mdfFile: path.join(DB_DIR, 'vms_of_ams.mdf'),
      ldfFile: path.join(DB_DIR, 'vms_of_ams_log.ldf'),
      mainSqlFile: MAIN_SQL_FILE,
      recordsFile: DB_RECORDS_FILE,
      dualPersistence: true
    };
  }
}

export const sqlServerService = new SqlServerDatabaseService();
