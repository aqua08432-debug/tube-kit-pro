@echo off
title TubeKit Pro — GitHub Push
color 0A

echo.
echo ============================================================
echo   TubeKit Pro — Git Push to GitHub
echo ============================================================
echo.

cd /d "C:\Users\DELL\Documents\Antigravity\Youtube Downloder\tube-kit-pro"

:: ── Check if git is installed ────────────────────────────────────────────────
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in PATH.
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [1/6] Checking git status...
git status
echo.

:: ── Stage all changes ────────────────────────────────────────────────────────
echo [2/6] Staging all changes...
git add .
echo    Done.
echo.

:: ── Commit ───────────────────────────────────────────────────────────────────
echo [3/6] Creating commit...
git commit -m "fix: complete backend rewrite with full download support

- Implemented full yt-dlp download pipeline with real progress tracking
- Added /api/file/{job_id} endpoint to serve completed downloads
- Fixed /api/status/{job_id} with real job state management
- Implemented background download task with progress hooks
- Added subtitle download support (10 languages, SRT/VTT/ASS)
- Added video trimming via start_time / end_time
- Added embed thumbnail and chapter metadata options
- Fixed next.config.mjs to proxy /api/* to Python backend in dev
- Rewrote server.py with complete, working logic
- Updated requirements.txt with all required packages
- Fixed vercel.json for Python 3.11 serverless deployment
- Updated .gitignore to cover Python and env files
- Improved frontend: retry logic, offline detection, timeout handling
- Added 10 subtitle languages to frontend
- Added advanced options panel (trim, embed)
- Real-time progress bar with accurate percentage"

echo.

:: ── Set remote if missing ────────────────────────────────────────────────────
echo [4/6] Checking remote origin...
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo    Adding remote origin...
    git remote add origin https://github.com/aqua08432-debug/tube-kit-pro.git
) else (
    echo    Remote already set.
)
echo.

:: ── Set branch to main ───────────────────────────────────────────────────────
echo [5/6] Setting branch to main...
git branch -M main
echo.

:: ── Push ─────────────────────────────────────────────────────────────────────
echo [6/6] Pushing to GitHub...
git push -u origin main
echo.

if %errorlevel% equ 0 (
    echo ============================================================
    echo   SUCCESS! Code pushed to GitHub.
    echo   Repo: https://github.com/aqua08432-debug/tube-kit-pro
    echo ============================================================
) else (
    echo ============================================================
    echo   PUSH FAILED. Common fixes:
    echo   1. Run: git pull origin main --rebase  then push again
    echo   2. If first push ever: git push -u origin main --force
    echo   3. Check GitHub login / token
    echo ============================================================
)

echo.
pause
