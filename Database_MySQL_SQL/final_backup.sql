-- ========================================================
-- AMS ENTERPRISE VISITOR MANAGEMENT SYSTEM (VMS)
-- FINAL PRODUCTION DATABASE BACKUP (.sql)
-- File Location: Database_MySQL_SQL/final_backup.sql
-- Target Database: MySQL 8.0+ / MariaDB
-- Clean Production Master Template (0 Test Records)
-- Author: Smit Patel
-- ========================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- 1. Database Creation & Selection
-- --------------------------------------------------------

CREATE DATABASE IF NOT EXISTS `vms_of_ams` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `vms_of_ams`;

-- --------------------------------------------------------
-- 2. Table Structure for `visitors`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `visitors`;
CREATE TABLE IF NOT EXISTS `visitors` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `passCode` VARCHAR(32) NOT NULL,
  `fullName` VARCHAR(128) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(128) DEFAULT NULL,
  `purpose` VARCHAR(64) DEFAULT 'Guest',
  `company` VARCHAR(128) DEFAULT 'Enterprise HQ',
  `hostName` VARCHAR(128) DEFAULT 'Dhaval Sir',
  `department` VARCHAR(128) DEFAULT 'IT',
  `inTime` VARCHAR(32) DEFAULT '10:00 AM',
  `outTime` VARCHAR(32) DEFAULT '--',
  `status` VARCHAR(32) DEFAULT 'Pending',
  `actionTakenBy` VARCHAR(128) DEFAULT NULL,
  `actionTakenAt` VARCHAR(32) DEFAULT NULL,
  `rejectionReason` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_phone` (`phone`),
  INDEX `idx_passcode` (`passCode`),
  INDEX `idx_fullname` (`fullName`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Table Structure for `users`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `username` VARCHAR(64) NOT NULL UNIQUE,
  `name` VARCHAR(128) NOT NULL,
  `role` ENUM('Super Admin', 'Security', 'Employee') NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Table Structure for `companies`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `companies`;
CREATE TABLE IF NOT EXISTS `companies` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `code` VARCHAR(32) NOT NULL,
  `name` VARCHAR(128) NOT NULL,
  `status` VARCHAR(32) DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. Table Structure for `branches`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `branches`;
CREATE TABLE IF NOT EXISTS `branches` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `code` VARCHAR(32) NOT NULL,
  `name` VARCHAR(128) NOT NULL,
  `location` VARCHAR(128) DEFAULT 'Main Gate',
  `status` VARCHAR(32) DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. Table Structure for `departments`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `departments`;
CREATE TABLE IF NOT EXISTS `departments` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `code` VARCHAR(32) NOT NULL,
  `name` VARCHAR(128) NOT NULL,
  `headName` VARCHAR(128) DEFAULT 'Head',
  `status` VARCHAR(32) DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. Dumping Data for `users`
-- --------------------------------------------------------

INSERT INTO `users` (`id`, `username`, `name`, `role`, `password`) VALUES
('USR-01', 'admin', 'Admin User', 'Super Admin', 'admin@123'),
('USR-02', 'SA', 'SA Super Admin', 'Super Admin', 'admin123'),
('USR-03', 'security', 'Security Officer', 'Security', 'AMS@1234'),
('USR-04', 'aashis', 'Aashis', 'Employee', 'AMS@1234');

-- --------------------------------------------------------
-- 8. Dumping Data for `companies`
-- --------------------------------------------------------

INSERT INTO `companies` (`id`, `code`, `name`, `status`) VALUES
('CMP-01', 'HQ', 'Main Enterprise HQ', 'Active'),
('CMP-02', 'TECH', 'Tech Innovations', 'Active'),
('CMP-03', 'LOG', 'Global Logistics', 'Active');

-- --------------------------------------------------------
-- 9. Dumping Data for `branches`
-- --------------------------------------------------------

INSERT INTO `branches` (`id`, `code`, `name`, `location`, `status`) VALUES
('BR-01', 'HQ', 'Main Building HQ', 'Tower A', 'Active'),
('BR-02', 'WEST', 'West Gate Terminal', 'Gate 2', 'Active');

-- --------------------------------------------------------
-- 10. Dumping Data for `departments`
-- --------------------------------------------------------

INSERT INTO `departments` (`id`, `code`, `name`, `headName`, `status`) VALUES
('DEP-01', 'PUR', 'Purchase', 'Purchase Manager', 'Active'),
('DEP-02', 'QA', 'Quality', 'Quality Head', 'Active'),
('DEP-03', 'PRD', 'Production', 'Production Head', 'Active'),
('DEP-04', 'FAC', 'Facility', 'Facility Manager', 'Active'),
('DEP-05', 'IT', 'IT', 'IT Administrator', 'Active'),
('DEP-06', 'IC', 'IC', 'IC Lead', 'Active'),
('DEP-07', 'ACC', 'Accounts', 'Accounts Head', 'Active'),
('DEP-08', 'LOG', 'Logistics', 'Logistics Head', 'Active'),
('DEP-09', 'WHS', 'Warehouse', 'Warehouse Head', 'Active'),
('DEP-10', 'R&D', 'R&D', 'R&D Director', 'Active'),
('DEP-11', 'MKT', 'Marketing', 'Marketing Head', 'Active'),
('DEP-12', 'CLN', 'Clinical', 'Clinical Affairs Lead', 'Active'),
('DEP-13', 'ENG', 'Engineering', 'Chief Engineer', 'Active'),
('DEP-14', 'NDL', 'Needle', 'Needle Division Head', 'Active'),
('DEP-15', 'OTH', 'Other', 'General Management', 'Active');

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
