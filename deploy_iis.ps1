# Automated IIS Deployment Script for Visitor Management
$source = "C:\Users\Smit Patel\Desktop\smit\dist"
$destination = "C:\inetpub\wwwroot\Visitor Management"

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  AMS Enterprise Visitor Management System - IIS Auto-Deployment" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Create Target Directory
if (!(Test-Path -Path $destination)) {
    Write-Host "[1/5] Creating directory: $destination" -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path $destination | Out-Null
} else {
    Write-Host "[1/5] Target directory already exists: $destination" -ForegroundColor Green
}

# 2. Copy Build Files
Write-Host "[2/5] Copying application files to $destination..." -ForegroundColor Yellow
Copy-Item -Path "$source\*" -Destination $destination -Recurse -Force
Write-Host "      Files copied successfully!" -ForegroundColor Green

# 3. Grant NTFS Permissions
Write-Host "[3/5] Granting IIS permissions (IIS_IUSRS, IUSR)..." -ForegroundColor Yellow
icacls $destination /grant "IIS_IUSRS:(OI)(CI)RX" /T | Out-Null
icacls $destination /grant "IUSR:(OI)(CI)RX" /T | Out-Null
Write-Host "      Permissions granted!" -ForegroundColor Green

# 4. Check & Unlock IIS Configuration Sections if IIS is installed
Write-Host "[4/5] Checking IIS sections..." -ForegroundColor Yellow
$appcmd = "$env:SystemRoot\system32\inetsrv\appcmd.exe"
if (Test-Path $appcmd) {
    & $appcmd unlock config -section:system.webServer/rewrite/rules 2>$null
    & $appcmd unlock config -section:system.webServer/handlers 2>$null
    & $appcmd unlock config -section:system.webServer/modules 2>$null
    Write-Host "      IIS configuration sections unlocked." -ForegroundColor Green
} else {
    Write-Host "      appcmd.exe not present (IIS may not be active on this PC)." -ForegroundColor DarkGray
}

# 5. Restart IIS if service is running
Write-Host "[5/5] Restarting IIS (if running)..." -ForegroundColor Yellow
if (Get-Service W3SVC -ErrorAction SilentlyContinue) {
    iisreset
    Write-Host "      IIS restarted!" -ForegroundColor Green
} else {
    Write-Host "      W3SVC service not running locally." -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Green
Write-Host "  SUCCESS: Deployment to $destination completed!" -ForegroundColor Green
Write-Host "  web.config is now active at: $destination\web.config" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green
Start-Sleep -Seconds 3
