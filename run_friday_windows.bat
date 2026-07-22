@echo off
title FRIDAY AI Desktop Assistant Launcher
echo ========================================================
echo         FRIDAY AI DESKTOP ASSISTANT - WINDOWS SETUP
echo ========================================================
echo [1/3] Checking Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed on this system.
    echo Please download and install Node.js from: https://nodejs.org
    pause
    exit /b
)

echo [2/3] Installing dependencies...
call npm install

echo [3/3] Launching FRIDAY AI Desktop Assistant...
start http://localhost:3000
call npm run dev

pause
