-- ========================================================
-- AMS ENTERPRISE VISITOR MANAGEMENT SYSTEM (VMS)
-- Target Database: MySQL 8.0+ / MariaDB
-- File Location: Database_MySQL_SQL/vms_of_ams_500k.sql
-- Capacity: 500,000 Visitor Records
-- Clean Production Database (0 Mock/Test Records)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `vms_of_ams` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `vms_of_ams`;

-- --------------------------------------------------------
-- Table Structure for `visitors`
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
-- Table Structure for `users`
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
-- Default User Accounts for System Access
-- --------------------------------------------------------

INSERT INTO `users` (`id`, `username`, `name`, `role`, `password`) VALUES
('USR-01', 'admin', 'Admin User', 'Super Admin', 'admin@123'),
('USR-02', 'SA', 'SA Super Admin', 'Super Admin', 'admin123'),
('USR-03', 'security', 'Security Officer', 'Security', 'AMS@1234'),
('USR-04', 'aashis', 'Aashis', 'Employee', 'AMS@1234')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);
