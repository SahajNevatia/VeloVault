@echo off
echo ==============================================
echo   Starting VeloVault Full-Stack Application
echo   Connected to: MongoDB Atlas
echo ==============================================
echo.

echo [1/2] Starting Backend API Server (Port 5000)...
start "VeloVault Backend" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend Dev Server (Port 3000)...
start "VeloVault Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ==============================================
echo   All servers launched!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo ==============================================
echo.
pause
