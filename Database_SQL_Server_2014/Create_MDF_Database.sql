-- ============================================================================
-- AMS ENTERPRISE VISITOR MANAGEMENT SYSTEM (VMS)
-- SCRIPT: CREATE SQL SERVER 2014 DATABASE WITH DEDICATED .MDF & .LDF FILES
-- Location: C:\Users\Smit Patel\Desktop\smit\Database_SQL_Server_2014\
-- ============================================================================

USE [master];
GO

-- 1. If database already exists, close connections and drop it (Optional - uncomment if fresh start needed)
-- IF EXISTS (SELECT [name] FROM sys.databases WHERE [name] = N'vms_of_ams')
-- BEGIN
--     ALTER DATABASE [vms_of_ams] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
--     DROP DATABASE [vms_of_ams];
--     PRINT '>> Existing database dropped for fresh initialization.';
-- END
-- GO

-- 2. Create the Database storing all table data in .mdf file
IF NOT EXISTS (SELECT [name] FROM sys.databases WHERE [name] = N'vms_of_ams')
BEGIN
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
    PRINT '================================================================================';
    PRINT '>> SUCCESS: Database [vms_of_ams] created!';
    PRINT '>> Primary Data File (.mdf): C:\Users\Smit Patel\Desktop\smit\Database_SQL_Server_2014\vms_of_ams.mdf';
    PRINT '>> Transaction Log   (.ldf): C:\Users\Smit Patel\Desktop\smit\Database_SQL_Server_2014\vms_of_ams_log.ldf';
    PRINT '================================================================================';
END
ELSE
BEGIN
    PRINT '>> Database [vms_of_ams] already exists.';
END
GO

USE [vms_of_ams];
GO

-- 3. Create Visitors Table inside the .mdf file
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
    PRINT '>> Table [visitors] created successfully inside vms_of_ams.mdf.';
END
GO

-- 4. Create Users Table inside the .mdf file
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
    PRINT '>> Table [users] created successfully inside vms_of_ams.mdf.';
END
GO

-- 5. Seed default accounts
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

PRINT '>> Setup complete. All data will be saved inside vms_of_ams.mdf!';
GO
