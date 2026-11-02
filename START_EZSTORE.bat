@echo off
chcp 65001 >nul
cd /d "%~dp0"
title EZ-STORE R5 - PORT 3200
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js not found. Install Node 22.13 or newer.
  pause
  exit /b 1
)
node -e "const [a,b]=process.versions.node.split('.').map(Number);if(a<22||(a===22&&b<13)){console.error('Node.js 22.13+ required');process.exit(1)}"
if errorlevel 1 (
  pause
  exit /b 1
)
if not exist ".env" (
  echo Creating PRIVATE .env with admin password and encryption keys...
  node scripts\setup.js
  if errorlevel 1 (pause & exit /b 1)
  echo Save the generated admin password before continuing!
  pause
)
REM Force a dedicated local port; old store on :3000 will NOT be used.
set "PORT=3200"
set "PUBLIC_URL=http://localhost:3200"
echo.
echo ============================================
echo EZ-STORE R5 - http://localhost:3200
echo Admin: http://localhost:3200/admin
echo ============================================
echo IMPORTANT: Open port 3200, not 3000.
echo CTRL+C to close this server.
echo.
node server.js
if errorlevel 1 echo ERROR starting server. Check port 3200 or configuration.
pause
