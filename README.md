# 🏢 AMS Enterprise Visitor Management System (VMS)

An enterprise-grade, high-performance **Visitor Management and Access Control System** developed for seamless visitor registration, digital pass issuance, security screening, and real-time tracking across multi-facility corporate campuses.

---

## 🌟 Key Highlights & Capabilities

- ⚡ **High-Performance Search & Index Engine**: Built and benchmarked to search, filter, and paginate through **500,000+ records** in real-time with sub-10ms response latency.
- 🪪 **Digital Gate Pass & QR Code Verification**: Generates printable and scannable visitor entry passes featuring dynamic QR codes, host details, time validity, and access zones.
- 🛡️ **Role-Based Access Control (RBAC)**: Dedicated interfaces and permission levels for **Super Admin**, **Security Officers**, and **Front Desk Staff**.
- ⏱️ **Real-Time Check-In & Check-Out Workflow**: Live visitor status updates (`Approved`, `Pending`, `In Premise`, `Visited`, `Rejected`) with full action auditing.
- 🏢 **Multi-Entity Master Data Management**: Pre-configured support for multiple Companies, Campus Branches, and Internal Departments.
- 💾 **Dual-Storage & Database Portability**: Runs with zero-configuration in-memory/JSON storage out of the box, with complete **Microsoft SQL Server 2014 T-SQL dumps**, schema, and live `mssql` connection driver ready for enterprise database persistence and migration.
- 🐳 **Container & Cloud Ready**: Includes `Dockerfile`, `docker-compose.yml`, `render.yaml`, and `vercel.json` configurations.

---

## 🔐 Default Access Credentials

Use any of the pre-configured accounts below on the login screen ([http://localhost:3000/login](http://localhost:3000/login)):

| Role | Username / Account | Password | Primary Permissions |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `SA` | `admin123` | Full system access, Master Settings, User & Visitor DB, SQL Server Export |
| **Super Admin** | `admin` | `admin@123` | Full system access, Master Settings, User & Visitor DB, SQL Server Export |
| **Security Officer** | `security` | `AMS@1234` | Gate pass verification, Check-in/Check-out, Visitor list, Security center |

---

## 🚀 Quick Start Guide

### Option 1: One-Click Launcher (Windows)
Double-click [`Start_AMS_System.bat`](Start_AMS_System.bat) in this folder. It will:
1. Start the Express Backend API on port `5000`.
2. Start the Vite Frontend Server on port `3000`.
3. Automatically launch your browser to `http://localhost:3000/login`.

---

### Option 2: Manual Start (Terminal / PowerShell)

#### Prerequisites
- **Node.js**: v18+ or v20+ (`node -v`)
- **NPM**: v9+ or v10+ (`npm -v`)

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Start Backend API Server (Port 5000)
```bash
node server.js
```
*The backend will initialize and index records in memory with persistence to Microsoft SQL Server 2014 and `Database_SQL_Server_2014/`.*

#### 3. Start Frontend Web App (Port 3000)
In a separate terminal window:
```bash
npm run dev
```
Open [http://localhost:3000/login](http://localhost:3000/login) in your web browser.

---

### Option 3: Docker Deployment
```bash
# Build and run containers
docker-compose up --build -d

# Stop containers
docker-compose down
```

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend UI** | React 18, TypeScript, Tailwind CSS, Lucide React Icons |
| **Build Tool** | Vite 5 |
| **State & Visualization** | LocalStorage Persistence, Recharts, Framer Motion |
| **Backend API** | Node.js, Express 5, CORS, RESTful Architecture |
| **Data Engine** | Microsoft SQL Server 2014 (T-SQL), TDS 7.4 Protocol, High-speed in-memory indexing, JSON disk persistence |
| **Alternative Backends** | Python Django (`Backend_Python_Django/`) & Modular Express (`Backend_Node_Express/`) |
| **Containerization** | Docker, Docker Compose |

---

## 📡 REST API Reference

The backend API server runs on `http://localhost:5000`:

| Method | Endpoint | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/visitors` | Search and paginate visitors | `?search=<text>&status=<status>&page=<page>&limit=<limit>` |
| `GET` | `/api/custom-visitors` | Retrieve persistent registered visitors | None |
| `POST` | `/api/visitors` | Register and persist a new visitor to SQL Server 2014 & disk | JSON payload: `fullName`, `phone`, `purpose`, etc. |
| `PUT` | `/api/visitors/:id/status` | Update visitor status with audit trail in SQL Server 2014 | JSON payload: `{ "status": "In Premise", "actionTakenBy": "..." }` |
| `DELETE` | `/api/visitors/:id` | Permanently remove visitor from SQL Server 2014 and disk | URL parameter `:id` |
| `GET` | `/api/database/config` | View live Microsoft SQL Server 2014 connection status | None |
| `POST` | `/api/database/configure` | Configure SQL Server 2014 credentials dynamically | JSON payload: `{ server, port, user, password, database }` |
| `GET` | `/api/export/sql` | Download Microsoft SQL Server 2014 T-SQL dump | Returns `vms_of_ams_sqlserver2014.sql` file attachment |

---

## 📂 Project Structure

```
smit/
├── Start_AMS_System.bat           # One-click dual server launcher
├── server.js                      # Express backend API with 500k index engine
├── package.json                   # Dependencies & build scripts
├── vite.config.ts                 # Vite bundler configuration (port 3000)
├── tailwind.config.js             # Styling configuration
├── visitor_db.json                # Disk-persistent custom visitor records
│
├── src/                           # Frontend React + TypeScript application
│   ├── components/                # Modular UI components
│   │   ├── admin/                 # Administration and security controls
│   │   ├── layout/                # Top navbar, sidebar navigation
│   │   ├── pass/                  # Gate pass generator & QR pass preview
│   │   └── ...                    # Reusable widgets
│   ├── pages/                     # Core views (Dashboard, Gatepass, DB, Settings, Login)
│   ├── data/                      # Initial mock and demo account data
│   ├── types/                     # TypeScript data interfaces & types
│   └── App.tsx                    # Main root component & routing
│
├── Database_MySQL_SQL/            # Production MySQL database scripts (.sql)
├── Backend_Node_Express/          # Standalone Node/Express backend module
├── Backend_Python_Django/         # Alternative Python/Django backend module
├── docker-compose.yml             # Container orchestration
└── Dockerfile                     # Container definition
```

---

## 👥 Handover & Support Contacts

- **Author / Developer**: Smit Patel
- **Organization**: AMS
- **Project**: Enterprise Visitor Management System (VMS)
