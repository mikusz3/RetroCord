@echo off
title RetroCord Communicator
echo.
echo  ========================================
echo   RetroCord Communicator - Starting...
echo  ========================================
echo.

cd /d "%~dp0backend"

echo  Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
  echo  ERROR: Node.js not found! Please install Node.js 10.24.1
  echo  Download: https://nodejs.org/dist/v10.24.1/node-v10.24.1-x86.msi
  pause
  exit /b 1
)

echo  Starting server on http://localhost:3001
echo  Press Ctrl+C to stop
echo.

node src\index.js

pause
