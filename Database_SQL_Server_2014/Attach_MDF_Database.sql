-- ============================================================================
-- AMS ENTERPRISE VISITOR MANAGEMENT SYSTEM (VMS)
-- SCRIPT: ATTACH EXISTING .MDF & .LDF FILES TO MICROSOFT SQL SERVER 2014
-- Location: C:\Users\Smit Patel\Desktop\smit\Database_SQL_Server_2014\
-- ============================================================================

USE [master];
GO

IF NOT EXISTS (SELECT [name] FROM sys.databases WHERE [name] = N'vms_of_ams')
BEGIN
    CREATE DATABASE [vms_of_ams]
    ON (FILENAME = N'C:\Users\Smit Patel\Desktop\smit\Database_SQL_Server_2014\vms_of_ams.mdf'),
       (FILENAME = N'C:\Users\Smit Patel\Desktop\smit\Database_SQL_Server_2014\vms_of_ams_log.ldf')
    FOR ATTACH;

    PRINT '>> Database [vms_of_ams] attached successfully from vms_of_ams.mdf!';
END
ELSE
BEGIN
    PRINT '>> Database [vms_of_ams] is already attached in this SQL Server instance.';
END
GO
