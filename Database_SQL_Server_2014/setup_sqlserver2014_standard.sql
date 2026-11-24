-- ============================================================================
-- AMS ENTERPRISE VISITOR MANAGEMENT SYSTEM (VMS)
-- MICROSOFT SQL SERVER 2014 STANDARD EDITION SCHEMA & INITIALIZATION
-- Compatibility Level: 120 (SQL Server 2014 Standard / Enterprise / Express)
-- Compatible with: Windows Server 2012 / 2012 R2 IIS 8.5
-- ============================================================================

USE [master];
GO

-- 1. Create Database if not exists (Uses default SQL Server data/log directory)
IF NOT EXISTS (SELECT [name] FROM sys.databases WHERE [name] = N'vms_of_ams')
BEGIN
    PRINT '>> Creating database [vms_of_ams] on SQL Server 2014 Standard...';
    CREATE DATABASE [vms_of_ams];
END
ELSE
BEGIN
    PRINT '>> Database [vms_of_ams] already exists.';
END
GO

-- Ensure Compatibility Level is 120 (SQL Server 2014 Standard)
ALTER DATABASE [vms_of_ams] SET COMPATIBILITY_LEVEL = 120;
GO

USE [vms_of_ams];
GO

-- 2. Create Visitors Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[visitors]') AND type in (N'U'))
BEGIN
    PRINT '>> Creating table [dbo].[visitors]...';
    CREATE TABLE [dbo].[visitors] (
        [id] NVARCHAR(64) NOT NULL PRIMARY KEY CLUSTERED,
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
    CREATE NONCLUSTERED INDEX [idx_visitors_created_at] ON [dbo].[visitors]([created_at] DESC);
    PRINT '>> Table [visitors] and high-performance indexes created successfully.';
END
GO

-- 3. Create Users / Employees Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[users]') AND type in (N'U'))
BEGIN
    PRINT '>> Creating table [dbo].[users]...';
    CREATE TABLE [dbo].[users] (
        [id] NVARCHAR(64) NOT NULL PRIMARY KEY CLUSTERED,
        [username] NVARCHAR(64) NOT NULL UNIQUE,
        [name] NVARCHAR(128) NOT NULL,
        [role] NVARCHAR(32) NOT NULL,
        [password] NVARCHAR(255) NOT NULL,
        [created_at] DATETIME DEFAULT GETDATE()
    );

    -- Seed Default System Accounts
    INSERT INTO [dbo].[users] ([id], [username], [name], [role], [password]) VALUES
    ('usr-sa', 'SA', 'Super Administrator', 'Super Admin', 'admin123'),
    ('usr-sec', 'SECURITY', 'Chief Security Officer', 'Security', 'security123'),
    ('usr-desk', 'DESK', 'Front Desk Executive', 'Front Desk', 'desk123'),
    ('usr-emp', 'EMP001', 'Dhaval Patel (Host)', 'Employee', 'emp123');

    PRINT '>> Table [users] created and seeded with default credentials.';
END
GO

-- 4. Create Master Companies Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[companies]') AND type in (N'U'))
BEGIN
    PRINT '>> Creating table [dbo].[companies]...';
    CREATE TABLE [dbo].[companies] (
        [id] NVARCHAR(64) NOT NULL PRIMARY KEY,
        [code] NVARCHAR(32) NOT NULL,
        [name] NVARCHAR(128) NOT NULL,
        [created_at] DATETIME DEFAULT GETDATE()
    );

    INSERT INTO [dbo].[companies] ([id], [code], [name]) VALUES
    ('comp-1', 'AMS-HQ', 'AMS Corporate Headquarters'),
    ('comp-2', 'AMS-TECH', 'AMS Technology Solutions'),
    ('comp-3', 'AMS-MFG', 'AMS Manufacturing Plant');
END
GO

-- 5. Create Departments Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[departments]') AND type in (N'U'))
BEGIN
    PRINT '>> Creating table [dbo].[departments]...';
    CREATE TABLE [dbo].[departments] (
        [id] NVARCHAR(64) NOT NULL PRIMARY KEY,
        [name] NVARCHAR(128) NOT NULL,
        [created_at] DATETIME DEFAULT GETDATE()
    );

    INSERT INTO [dbo].[departments] ([id], [name]) VALUES
    ('dept-1', 'IT & Systems'),
    ('dept-2', 'Human Resources (HR)'),
    ('dept-3', 'Operations & Logistics'),
    ('dept-4', 'Accounts & Finance'),
    ('dept-5', 'Security & Surveillance');
END
GO

-- 6. Create Audit Trail Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[audit_logs]') AND type in (N'U'))
BEGIN
    PRINT '>> Creating table [dbo].[audit_logs]...';
    CREATE TABLE [dbo].[audit_logs] (
        [id] INT IDENTITY(1,1) PRIMARY KEY,
        [action] NVARCHAR(64) NOT NULL,
        [performedBy] NVARCHAR(128) NOT NULL,
        [targetVisitorId] NVARCHAR(64) NULL,
        [details] NVARCHAR(MAX) NULL,
        [timestamp] DATETIME DEFAULT GETDATE()
    );
END
GO

PRINT '========================================================================';
PRINT '   SQL SERVER 2014 STANDARD DATABASE [vms_of_ams] READY FOR PRODUCTION! ';
PRINT '========================================================================';
