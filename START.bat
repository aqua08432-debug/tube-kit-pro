@echo off
echo ============================================
echo   TubeKit Pro - Starting Everything
echo ============================================
echo.
echo [1/2] Starting Python Backend (port 8000)...
start "TubeKit Backend" cmd /k "cd /d "%~dp0" && python server.py"
timeout /t 3 /nobreak > nul

echo [2/2] Starting Next.js Frontend (port 3000)...
start "TubeKit Frontend" cmd /k "cd /d "%~dp0" && npm run dev"
timeout /t 4 /nobreak > nul

echo.
echo ============================================
echo   Both servers are starting!
echo   Website:     http://localhost:3000
echo   Backend API: http://localhost:8000
echo   Admin Panel: http://localhost:3000/admin
echo   Admin Pass:  tubekit2024
echo ============================================
echo.
start http://localhost:3000
pause
