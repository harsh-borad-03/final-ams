-- ============================================================================
-- AMS ENTERPRISE VISITOR MANAGEMENT SYSTEM (VMS)
-- MICROSOFT SQL SERVER 2014 T-SQL DATABASE DUMP
-- Engine Compatibility: Microsoft SQL Server 2014 (12.x) / 2016+ / Azure SQL
-- Generated: 2026-09-26T06:14:27.325Z
-- Active Records: 0
-- Author: Smit Patel
-- ============================================================================

USE [master];
GO

IF NOT EXISTS (SELECT [name] FROM sys.databases WHERE [name] = N'vms_of_ams')
BEGIN
    CREATE DATABASE [vms_of_ams];
END
GO

USE [vms_of_ams];
GO

-- ----------------------------------------------------------------------------
-- Table Structure: [visitors]
-- ----------------------------------------------------------------------------
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
GO

-- ----------------------------------------------------------------------------
-- Table Structure: [users]
-- ----------------------------------------------------------------------------
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
GO

-- ----------------------------------------------------------------------------
-- Seed System Users
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- Stored Visitor Records (0 records)
-- ----------------------------------------------------------------------------
