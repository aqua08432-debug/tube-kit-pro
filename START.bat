@echo off
title TubeKit Pro — Local Dev Server
color 0A

echo.
echo ============================================================
echo   TubeKit Pro — Starting Local Development
echo ============================================================
echo.

cd /d "C:\Users\DELL\Documents\Antigravity\Youtube Downloder\tube-kit-pro"

:: ── Install Python dependencies ──────────────────────────────────────────────
echo [1/4] Checking Python dependencies...
pip install -r requirements.txt -q
if %errorlevel% neq 0 (
    echo [WARN] pip install had issues. Trying to continue...
)
echo    Done.
echo.

:: ── Install Node dependencies ────────────────────────────────────────────────
echo [2/4] Checking Node dependencies...
if not exist node_modules (
    echo    node_modules not found. Running npm install...
    npm install
) else (
    echo    node_modules exists. Skipping.
)
echo.

:: ── Start Python backend in new window ──────────────────────────────────────
echo [3/4] Starting Python backend on http://localhost:8000 ...
start "TubeKit API (Python)" cmd /k "cd /d "%~dp0" && python server.py"
timeout /t 2 /nobreak >nul
echo    Python backend starting in separate window.
echo.

:: ── Start Next.js frontend ───────────────────────────────────────────────────
echo [4/4] Starting Next.js frontend on http://localhost:3000 ...
echo.
echo ============================================================
echo   API  →  http://localhost:8000/api/health
echo   App  →  http://localhost:3000
echo ============================================================
echo.
npm run dev
