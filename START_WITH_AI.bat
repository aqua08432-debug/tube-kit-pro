@echo off
echo ============================================
echo   TubeKit Pro - With AI Features
echo   (Requires ANTHROPIC_API_KEY to be set)
echo ============================================
echo.
set /p ANTHROPIC_API_KEY="Paste your Anthropic API key (sk-ant-...): "
echo.
echo Starting Python Backend with AI enabled...
start "TubeKit Backend" cmd /k "cd /d "%~dp0" && set ANTHROPIC_API_KEY=%ANTHROPIC_API_KEY% && python server.py"
timeout /t 3 /nobreak > nul

echo Starting Next.js Frontend...
start "TubeKit Frontend" cmd /k "cd /d "%~dp0" && npm run dev"
timeout /t 4 /nobreak > nul

echo.
echo AI Summarizer and Notes are now enabled!
echo Website: http://localhost:3000
echo.
start http://localhost:3000
pause
