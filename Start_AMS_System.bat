@echo off
title Launching AMS Enterprise Visitor Management System...
color 0b
echo =======================================================================
echo          AMS ENTERPRISE VISITOR MANAGEMENT SYSTEM (VMS)
echo =======================================================================
echo.

cd /d "%~dp0"

:: -------------------------------------------------------------------------
:: 1. Check for Embedded / Portable Node.js in bin/
:: -------------------------------------------------------------------------
if exist "%~dp0bin\node.exe" (
    echo [i] Using embedded portable Node.js runtime...
    set "PATH=%~dp0bin;%PATH%"
)

:: -------------------------------------------------------------------------
:: 2. Check if Node.js is installed / available in PATH
:: -------------------------------------------------------------------------
where node >nul 2>&1
if %errorlevel% equ 0 goto :node_found

if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%PATH%"
if exist "%ProgramFiles(x86)%\nodejs\node.exe" set "PATH=%ProgramFiles(x86)%\nodejs;%PATH%"
if exist "%LocalAppData%\Programs\node\node.exe" set "PATH=%LocalAppData%\Programs\node;%PATH%"
if exist "%USERPROFILE%\nodejs\node.exe" set "PATH=%USERPROFILE%\nodejs;%PATH%"
if exist "%USERPROFILE%\.nodejs\node.exe" set "PATH=%USERPROFILE%\.nodejs;%PATH%"

where node >nul 2>&1
if %errorlevel% equ 0 goto :node_found

echo =======================================================================
echo [!] ERROR: Node.js is not installed on this PC.
echo =======================================================================
echo.
echo Windows requires Node.js to run the Visitor Management System.
echo.
echo Choose an option below:
echo   [1] Auto-install Node.js LTS now via Windows Package Manager
echo   [2] Open official Node.js website (https://nodejs.org) to download
echo   [3] Exit
echo.
set /p nchoice="Enter option [1, 2, or 3] and press Enter: "
if "%nchoice%"=="1" (
    echo.
    echo [..] Installing Node.js LTS via winget...
    winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    echo.
    echo [OK] Installation completed! Please close this window and double-click
    echo      Start_AMS_System.bat again to start the servers.
    pause
    exit /b 0
)
if "%nchoice%"=="2" (
    start https://nodejs.org/
    echo.
    echo Download page opened. Please install Node.js (LTS), then re-run this file.
    pause
    exit /b 0
)
echo Exiting...
pause
exit /b 1

:node_found

:: -------------------------------------------------------------------------
:: 3. Launch the Application Server
:: -------------------------------------------------------------------------
echo [1/2] Starting VMS Unified Enterprise Server (Port 5000)...
start "AMS VMS - Enterprise Server (Port 5000)" cmd /k "node server.js"

:: Graceful 3-second delay
ping 127.0.0.1 -n 4 > nul

:: Check if Vite is available; if so, optionally start Vite dev on 3000
if exist "node_modules\vite\bin\vite.js" (
    echo [2/2] Starting Dev Interface (Port 3000)...
    start "AMS VMS - Frontend Web Application (Port 3000)" cmd /k "npm run dev"
    ping 127.0.0.1 -n 3 > nul
    start http://localhost:3000/login
) else (
    echo [2/2] Opening Web Application...
    start http://localhost:5000/login
)

echo.
echo =======================================================================
echo   System launched successfully!
echo.
echo   Web Application : http://localhost:3000/login  (or http://localhost:5000/login)
echo   Backend API     : http://localhost:5000
echo =======================================================================
echo.
echo Press any key to exit this launcher window (servers will remain running).
pause > nul
