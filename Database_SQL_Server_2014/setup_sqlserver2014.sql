-- ============================================================================
-- AMS ENTERPRISE VISITOR MANAGEMENT SYSTEM (VMS)
-- MICROSOFT SQL SERVER 2014 DATABASE SCHEMA & INITIALIZATION
-- Database Engine: Microsoft SQL Server 2014 (12.x) / 2016+ / Azure SQL
-- Target Database: vms_of_ams
-- Prepared by: Smit Patel
-- ============================================================================

USE [master];
GO

-- 1. Create Database explicitly saving all data into .mdf file at:
-- C:\Users\Smit Patel\Desktop\smit\Database_SQL_Server_2014\vms_of_ams.mdf
IF NOT EXISTS (SELECT [name] FROM sys.databases WHERE [name] = N'vms_of_ams')
BEGIN
    BEGIN TRY
        CREATE DATABASE [vms_of_ams]
        ON PRIMARY 
        (
            NAME = N'vms_of_ams_Data',
            FILENAME = N'C:\Users\Smit Patel\Desktop\smit\Database_SQL_Server_2014\vms_of_ams.mdf',
            SIZE = 10MB,
            MAXSIZE = UNLIMITED,
            FILEGROWTH = 5MB
        )
        LOG ON 
        (
            NAME = N'vms_of_ams_Log',
            FILENAME = N'C:\Users\Smit Patel\Desktop\smit\Database_SQL_Server_2014\vms_of_ams_log.ldf',
            SIZE = 5MB,
            MAXSIZE = UNLIMITED,
            FILEGROWTH = 5MB
        );
        PRINT '>> Database [vms_of_ams] created with primary data file: vms_of_ams.mdf';
    END TRY
    BEGIN CATCH
        PRINT '>> Primary path fallback: ' + ERROR_MESSAGE() + '. Creating database with standard instance storage...';
        CREATE DATABASE [vms_of_ams];
    END CATCH
END
ELSE
BEGIN
    PRINT '>> Database [vms_of_ams] already exists.';
END
GO

USE [vms_of_ams];
GO

-- 2. Visitors Table
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
    PRINT '>> Table [visitors] and indexes created.';
END
GO

-- 3. Users Table
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
    PRINT '>> Table [users] created.';
END
GO

-- 4. Companies Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[companies]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[companies] (
        [id] NVARCHAR(64) NOT NULL PRIMARY KEY,
        [code] NVARCHAR(32) NOT NULL,
        [name] NVARCHAR(128) NOT NULL,
        [status] NVARCHAR(32) DEFAULT 'Active'
    );
    PRINT '>> Table [companies] created.';
END
GO

-- 5. Branches Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[branches]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[branches] (
        [id] NVARCHAR(64) NOT NULL PRIMARY KEY,
        [code] NVARCHAR(32) NOT NULL,
        [name] NVARCHAR(128) NOT NULL,
        [location] NVARCHAR(128) DEFAULT 'Main Gate',
        [status] NVARCHAR(32) DEFAULT 'Active'
    );
    PRINT '>> Table [branches] created.';
END
GO

-- 6. Departments Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[departments]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[departments] (
        [id] NVARCHAR(64) NOT NULL PRIMARY KEY,
        [code] NVARCHAR(32) NOT NULL,
        [name] NVARCHAR(128) NOT NULL,
        [headName] NVARCHAR(128) DEFAULT 'Head',
        [status] NVARCHAR(32) DEFAULT 'Active'
    );
    PRINT '>> Table [departments] created.';
END
GO

-- Seed users if not exists
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
GO

-- Seed companies if not exists
MERGE [dbo].[companies] AS target
USING (VALUES
    (N'CMP-01', N'HQ', N'Main Enterprise HQ', N'Active'),
    (N'CMP-02', N'TECH', N'Tech Innovations', N'Active'),
    (N'CMP-03', N'LOG', N'Global Logistics', N'Active')
) AS source ([id], [code], [name], [status])
ON target.[id] = source.[id]
WHEN MATCHED THEN
    UPDATE SET target.[name] = source.[name], target.[status] = source.[status]
WHEN NOT MATCHED THEN
    INSERT ([id], [code], [name], [status])
    VALUES (source.[id], source.[code], source.[name], source.[status]);
GO

-- Seed branches
MERGE [dbo].[branches] AS target
USING (VALUES
    (N'BR-01', N'HQ', N'Main Building HQ', N'Tower A', N'Active'),
    (N'BR-02', N'WEST', N'West Gate Terminal', N'Gate 2', N'Active')
) AS source ([id], [code], [name], [location], [status])
ON target.[id] = source.[id]
WHEN MATCHED THEN
    UPDATE SET target.[name] = source.[name], target.[location] = source.[location], target.[status] = source.[status]
WHEN NOT MATCHED THEN
    INSERT ([id], [code], [name], [location], [status])
    VALUES (source.[id], source.[code], source.[name], source.[location], source.[status]);
GO

-- Seed departments
MERGE [dbo].[departments] AS target
USING (VALUES
    (N'DEP-01', N'PUR', N'Purchase', N'Purchase Manager', N'Active'),
    (N'DEP-02', N'QA', N'Quality', N'Quality Head', N'Active'),
    (N'DEP-03', N'PRD', N'Production', N'Production Head', N'Active'),
    (N'DEP-04', N'FAC', N'Facility', N'Facility Manager', N'Active'),
    (N'DEP-05', N'IT', N'IT', N'IT Administrator', N'Active'),
    (N'DEP-06', N'IC', N'IC', N'IC Lead', N'Active'),
    (N'DEP-07', N'ACC', N'Accounts', N'Accounts Head', N'Active'),
    (N'DEP-08', N'LOG', N'Logistics', N'Logistics Head', N'Active'),
    (N'DEP-09', N'WHS', N'Warehouse', N'Warehouse Head', N'Active'),
    (N'DEP-10', N'R&D', N'R&D', N'R&D Director', N'Active'),
    (N'DEP-11', N'MKT', N'Marketing', N'Marketing Head', N'Active'),
    (N'DEP-12', N'CLN', N'Clinical', N'Clinical Affairs Lead', N'Active'),
    (N'DEP-13', N'ENG', N'Engineering', N'Chief Engineer', N'Active'),
    (N'DEP-14', N'NDL', N'Needle', N'Needle Division Head', N'Active'),
    (N'DEP-15', N'OTH', N'Other', N'General Management', N'Active')
) AS source ([id], [code], [name], [headName], [status])
ON target.[id] = source.[id]
WHEN MATCHED THEN
    UPDATE SET target.[name] = source.[name], target.[headName] = source.[headName], target.[status] = source.[status]
WHEN NOT MATCHED THEN
    INSERT ([id], [code], [name], [headName], [status])
    VALUES (source.[id], source.[code], source.[name], source.[headName], source.[status]);
GO

PRINT '>> [vms_of_ams] SQL Server 2014 Initialization Complete!';
GO
