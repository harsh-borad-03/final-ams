# 🏢 Microsoft SQL Server 2014 Database Integration Guide
### AMS Enterprise Visitor Management System (VMS)

This document provides step-by-step instructions for running, saving, and managing the AMS Visitor Management System database using **Microsoft SQL Server 2014 (12.x)** (or higher).

---

## 📁 SQL Server 2014 Files Overview

All SQL Server 2014 database files are organized in the `Database_SQL_Server_2014/` folder:

| File Name | Purpose |
| :--- | :--- |
| **`Create_MDF_Database.sql`** | **Direct `.mdf` Creator**: Creates database `vms_of_ams` and physically stores data into `vms_of_ams.mdf` and log in `vms_of_ams_log.ldf` in this folder. |
| **`Attach_MDF_Database.sql`** | **Attach Script**: Quickly re-attaches existing `vms_of_ams.mdf` and `vms_of_ams_log.ldf` files to any SQL Server instance. |
| **`setup_sqlserver2014.sql`** | One-time initialization script. Creates database `vms_of_ams`, tables (`visitors`, `users`, `companies`, `branches`, `departments`), indexes, and default administrator credentials. |
| **`vms_of_ams.mdf`** | **Master Database File**: Binary database file where SQL Server physically stores all tables, rows, indexes, and visitor records. |
| **`vms_of_ams_log.ldf`** | **Transaction Log File**: Binary database transaction log generated alongside the `.mdf` file. |
| **`vms_of_ams_sqlserver2014.sql`** | Active, self-contained T-SQL dump automatically updated whenever visitors are registered, checked in/out, or modified. Compatible with SQL Server 2014+. |
| **`final_backup_sqlserver2014.sql`** | Clean production master template with 0 dummy records and default system accounts ready for fresh enterprise deployment. |
| **`visitors_records.json`** | High-speed disk persistence cache powering the sub-10ms search engine. |
| **`sqlserver.config.json`** *(in root)* | Connection configuration for your local or remote SQL Server 2014 instance. |

---

## 🚀 How to Create the `.mdf` File Directly in this Directory

To create and save your database directly as a **`.mdf`** file in `C:\Users\Smit Patel\Desktop\smit\Database_SQL_Server_2014\`:

1. Open **SQL Server Management Studio (SSMS 2014)**.
2. Connect to your SQL Server instance (e.g. `.` or `localhost` or `localhost\SQLEXPRESS`).
3. Click **File > Open > File...** and select:
   ```
   C:\Users\Smit Patel\Desktop\smit\Database_SQL_Server_2014\Create_MDF_Database.sql
   ```
4. Click **Execute** (or press `F5`).
5. SQL Server will physically create:
   - `C:\Users\Smit Patel\Desktop\smit\Database_SQL_Server_2014\vms_of_ams.mdf` (Data File)
   - `C:\Users\Smit Patel\Desktop\smit\Database_SQL_Server_2014\vms_of_ams_log.ldf` (Log File)
6. All visitor records, user accounts, and system tables will now be saved directly into `vms_of_ams.mdf`!

---

## ⚙️ Step 2: Configure Connection in `sqlserver.config.json`

Open `sqlserver.config.json` in the root folder and set your SQL Server 2014 credentials:

```json
{
  "enabled": true,
  "server": "localhost",
  "port": 1433,
  "user": "sa",
  "password": "YourSqlServerPassword123!",
  "database": "vms_of_ams",
  "options": {
    "encrypt": false,
    "trustServerCertificate": true,
    "enableArithAbort": true
  }
}
```

> **Note on Windows Authentication / Named Instances:**
> If you are using a named instance like `SQLEXPRESS`, you can specify:
> `"server": "localhost\\SQLEXPRESS"` or use port `1433`.

---

## 💾 Step 3: How Data Is Saved to SQL Server 2014

The system uses **Dual-Persistence Architecture**:

1. **Direct Live SQL Server 2014 Table**:
   - Whenever a visitor is added on the frontend (`Create Gate Pass / Wizard`), the backend performs a parameterized T-SQL `MERGE / INSERT` into `[dbo].[visitors]`.
   - When a security guard checks in/out a visitor (`Visited`, `In Premise`), an atomic `UPDATE [dbo].[visitors]` query runs on SQL Server.
   - When a visitor is deleted or purged, `DELETE` / `TRUNCATE` is executed on SQL Server.

2. **Continuous T-SQL Script Sync**:
   - All records are simultaneously exported to `Database_SQL_Server_2014/vms_of_ams_sqlserver2014.sql`.
   - If SQL Server is temporarily offline during server startup, the app gracefully operates using disk persistence and displays a status badge in the UI.

---

## 🔐 Default Access Accounts (Pre-Seeded)

| Account | Username | Password | Role |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `SA` | `admin123` | Full administrative control, SQL Export, Master Settings |
| **Super Admin (Alt)** | `admin` | `admin@123` | Full administrative control |
| **Security Guard** | `security` | `AMS@1234` | Gate pass verification, Check-in / Check-out |
| **Employee** | `aashis` | `AMS@1234` | Host approval access |
