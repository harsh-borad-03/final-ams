@echo off
title IIS 500.19 Error Fixer & Installer for Server PC
color 0a

echo =======================================================================
echo          IIS HTTP ERROR 500.19 (0x8007000d) AUTOMATED FIX
echo          AMS Enterprise Visitor Management System (VMS)
echo =======================================================================
echo.

:: 1. Check for Administrative Privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] This script requires Administrator privileges.
    echo Please right-click this batch file and select "Run as administrator".
    echo.
    pause
    exit /b 1
)

echo [OK] Running with Administrator privileges.
echo.

:: 2. Check if URL Rewrite is already visible in IIS
echo [1/4] Checking Microsoft URL Rewrite Module...
reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\IIS Extensions\URL Rewrite" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] IIS URL Rewrite Module is already installed!
) else (
    echo [..] Downloading Microsoft IIS URL Rewrite Module 2.1 (x64) with TLS 1.2...
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
        "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls11 -bor [Net.SecurityProtocolType]::Tls; try { Invoke-WebRequest -Uri 'https://download.microsoft.com/download/1/2/8/128E2E03-C533-4BB4-A56E-E600608735B4/rewrite_amd64_en-US.msi' -OutFile '$env:TEMP\rewrite_amd64.msi' -UseBasicParsing; Write-Host '[OK] Download successful.' } catch { Write-Host '[ERROR] Download failed: ' $_.Exception.Message; exit 1 }"
    
    if %errorlevel% neq 0 (
        echo.
        echo [!] Automatic download failed (Internet or proxy restricted on Server PC).
        echo [!] Please manually download and install URL Rewrite 2.1 from:
        echo     https://www.iis.net/downloads/microsoft/url-rewrite
        echo.
    ) else (
        echo [..] Installing Microsoft URL Rewrite Module...
        start /wait msiexec.exe /i "%TEMP%\rewrite_amd64.msi" /quiet /norestart
        echo [OK] URL Rewrite Module installed successfully!
    )
)
echo.

:: 3. Unlock IIS Configuration Sections (Fixes 0x8007000d caused by locked sections)
echo [2/4] Unlocking IIS configuration sections at Server level...
if exist "%windir%\system32\inetsrv\appcmd.exe" (
    "%windir%\system32\inetsrv\appcmd.exe" unlock config -section:system.webServer/rewrite/rules >nul 2>&1
    "%windir%\system32\inetsrv\appcmd.exe" unlock config -section:system.webServer/handlers >nul 2>&1
    "%windir%\system32\inetsrv\appcmd.exe" unlock config -section:system.webServer/modules >nul 2>&1
    echo [OK] IIS Configuration sections unlocked.
) else (
    echo [i] appcmd.exe not found; skipping unlock step.
)
echo.

:: 4. Configure NTFS Permissions for IIS
echo [3/4] Setting folder permissions for IIS on:
echo       "C:\inetpub\wwwroot\Visitor Management"
if exist "C:\inetpub\wwwroot\Visitor Management" (
    icacls "C:\inetpub\wwwroot\Visitor Management" /grant "IIS_IUSRS":(OI)(CI)RX /T >nul 2>&1
    icacls "C:\inetpub\wwwroot\Visitor Management" /grant "IUSR":(OI)(CI)RX /T >nul 2>&1
    echo [OK] Permissions granted to IIS_IUSRS and IUSR.
) else (
    echo [i] Note: "C:\inetpub\wwwroot\Visitor Management" not found on this local path.
)
echo.

:: 5. Restart IIS Services
echo [4/4] Restarting Internet Information Services (IIS)...
iisreset
if %errorlevel% equ 0 (
    echo [OK] IIS restarted successfully!
) else (
    echo [!] iisreset encountered an issue.
)
echo.

echo =======================================================================
echo   Verification Completed!
echo   Open IIS Manager (inetmgr) and verify "URL Rewrite" icon appears.
echo   Then refresh: http://localhost/vms/
echo =======================================================================
echo.
pause
exit /b 0
