# 🛠️ IIS HTTP Error 500.19 (0x8007000d) Solution & Server PC Deployment Guide

This guide provides the complete resolution for **HTTP Error 500.19 (`0x8007000d`)** occurring when hosting the **AMS Enterprise Visitor Management System** on Microsoft IIS.

---

## 📌 1. Error Summary

| Property | Value |
| :--- | :--- |
| **Error Title** | `HTTP Error 500.19 - Internal Server Error` |
| **Description** | `The requested page cannot be accessed because the related configuration data for the page is invalid.` |
| **Error Code** | `0x8007000d` (`ERROR_INVALID_DATA`) |
| **Target URL** | `http://localhost/vms/` |
| **Physical Path** | `C:\inetpub\wwwroot\Visitor Management\` |
| **Config File** | `\\?\C:\inetpub\wwwroot\Visitor Management\web.config` |
| **Line Number** | `-1` or `0` |

---

## 🔍 2. Multiple Root Causes

### Cause 1: Missing "URL Rewrite 2.1" Module *(95% of cases)*
* **Why**: The `web.config` file contains a `<rewrite><rules>...</rules></rewrite>` block for React SPA routing.
* **Problem**: Windows Server IIS does **not** install the URL Rewrite module by default. When IIS encounters `<rewrite>`, it fails immediately at line 0 because the XML element is unrecognized.

### Cause 2: Missing `iisnode` Module *(If root project `web.config` was copied)*
* **Why**: The root project `web.config` defines `<handlers><add name="iisnode".../></handlers>` and `<iisnode ... />`.
* **Problem**: If the Azure `iisnode` MSI extension is not installed, IIS throws `0x8007000d` upon reading `<iisnode>`.

### Cause 3: Sub-Application Routing Conflict (`/vms/`)
* **Why**: Hosting under `http://localhost/vms/` creates an IIS child application under `Default Web Site`.
* **Problem**: If the parent site defines identical MIME types without `<remove>` tags or rewrites incorrectly to `/index.html` instead of relative `index.html`, IIS configuration conflicts occur.

### Cause 4: XML Syntax or Character Encoding
* **Why**: Unescaped `&` characters in database connection strings (`&amp;` is required in XML) or saving `web.config` with UTF-8 BOM / UTF-16 will trigger `0x8007000d`.

### Cause 5: Folder Permissions
* **Why**: The IIS application pool identity (`IIS_IUSRS` / `IUSR`) lacks Read/Execute permissions on `C:\inetpub\wwwroot\Visitor Management\`.

---

## 🚀 3. Quick Automated Fix (One-Click)

On the **Server PC**, run the provided script **as Administrator**:
👉 [`Fix_IIS_Server_500_19.bat`](file:///C:/Users/Smit%20Patel/Desktop/smit/Fix_IIS_Server_500_19.bat)

It will automatically:
1. Download Microsoft IIS URL Rewrite Module 2.1 (x64).
2. Silently install it.
3. Grant proper NTFS permissions to `IIS_IUSRS` and `IUSR`.
4. Perform an `iisreset`.

---

## 💻 4. Manual PowerShell Commands (Server PC)

If running commands directly in an Administrator PowerShell prompt on the Server PC:

```powershell
# Step 1: Download & Install Microsoft IIS URL Rewrite 2.1 (x64)
Write-Host "[1/3] Downloading IIS URL Rewrite 2.1..." -ForegroundColor Cyan
Invoke-WebRequest -Uri "https://download.microsoft.com/download/1/2/8/128E2E03-C533-4BB4-A56E-E600608735B4/rewrite_amd64_en-US.msi" -OutFile "$env:TEMP\rewrite_amd64.msi"

Write-Host "[2/3] Installing URL Rewrite Module..." -ForegroundColor Cyan
Start-Process msiexec.exe -ArgumentList "/i `"$env:TEMP\rewrite_amd64.msi`" /quiet /norestart" -Wait

# Step 2: Grant IIS Folder Permissions
Write-Host "[3/3] Setting folder permissions for IIS..." -ForegroundColor Cyan
icacls "C:\inetpub\wwwroot\Visitor Management" /grant "IIS_IUSRS:(OI)(CI)RX" /T
icacls "C:\inetpub\wwwroot\Visitor Management" /grant "IUSR:(OI)(CI)RX" /T

# Step 3: Restart IIS
iisreset
Write-Host "IIS successfully updated and restarted!" -ForegroundColor Green
```

---

## 📄 5. Clean, Production-Ready `web.config`

Place this in `C:\inetpub\wwwroot\Visitor Management\web.config`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>

  <!-- Database Connection Strings for Microsoft SQL Server 2014 -->
  <connectionStrings>
    <add name="VmsDatabase" 
         connectionString="Server=localhost;Database=vms_of_ams;User Id=sa;Password=YOUR_PASSWORD;TrustServerCertificate=True;Encrypt=False;" 
         providerName="System.Data.SqlClient" />
  </connectionStrings>

  <system.webServer>
    
    <!-- React SPA Rewrite for /vms/ sub-application -->
    <rewrite>
      <rules>
        <rule name="React SPA Routing" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/(api)" negate="true" />
          </conditions>
          <action type="Rewrite" url="index.html" />
        </rule>
      </rules>
    </rewrite>

    <!-- MIME Types with safety remove tags to prevent inheritance duplicates -->
    <staticContent>
      <remove fileExtension=".js" />
      <mimeMap fileExtension=".js" mimeType="application/javascript" />
      <remove fileExtension=".json" />
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <remove fileExtension=".woff" />
      <mimeMap fileExtension=".woff" mimeType="application/font-woff" />
      <remove fileExtension=".woff2" />
      <mimeMap fileExtension=".woff2" mimeType="font/woff2" />
      <remove fileExtension=".webp" />
      <mimeMap fileExtension=".webp" mimeType="image/webp" />
      <remove fileExtension=".svg" />
      <mimeMap fileExtension=".svg" mimeType="image/svg+xml" />
    </staticContent>

    <!-- Security Headers -->
    <httpProtocol>
      <customHeaders>
        <add name="X-Content-Type-Options" value="nosniff" />
        <add name="X-Frame-Options" value="SAMEORIGIN" />
        <add name="X-XSS-Protection" value="1; mode=block" />
      </customHeaders>
    </httpProtocol>

  </system.webServer>
</configuration>
```

---

## ⚡ 6. Running the Backend API on the Server PC

The IIS website serves the **Frontend Web Application**. The Express API backend (`server.js`) handles database requests on port 5000.

Run either:
1. **Interactive Mode**:
   ```cmd
   cd /d "C:\inetpub\wwwroot\Visitor Management"
   node server.js
   ```
2. **Persistent Windows Service Mode (using PM2 - Recommended)**:
   ```cmd
   npm install -g pm2
   pm2 start "C:\inetpub\wwwroot\Visitor Management\server.js" --name "vms-backend"
   pm2 startup
   pm2 save
   ```
