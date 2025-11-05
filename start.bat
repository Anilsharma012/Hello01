@echo off
REM TathaGat Admin Panel Startup Script for Windows

echo ====================================
echo   TathaGat Admin Panel Startup
echo ====================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo [OK] Node.js found
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing frontend dependencies...
    call npm install
)

echo [OK] Frontend dependencies ready
echo.

REM Start backend in a new window
echo [INFO] Starting backend server on port 5000...
start "TathaGat Backend" cmd /k "node server.js"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

echo.
echo ====================================
echo   Admin Panel is Starting!
echo ====================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3003
echo Admin:    http://localhost:3003/admin/dashboard
echo.
echo [INFO] Starting frontend server on port 3003...
echo [INFO] Browser will open automatically...
echo.

REM Start frontend
call npm start

pause
