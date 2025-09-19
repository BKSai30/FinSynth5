@echo off
echo ========================================
echo    FinSynth Project Startup Script
echo ========================================
echo.

echo Installing/Updating packages...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Package installation failed
    pause
    exit /b 1
)

echo.
echo Starting Backend Server on port 8003...
start "Backend" cmd /k "cd /d %~dp0 && python backend/simple_main.py"

echo Waiting 8 seconds for backend to start...
timeout /t 8 /nobreak > nul

echo Starting Frontend Server on port 3000...
start "Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ========================================
echo    Servers are starting up!
echo ========================================
echo.
echo Backend:  http://localhost:8003
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8003/docs
echo.
echo Wait about 15-20 seconds for both to fully start
echo Then open your browser to: http://localhost:3000
echo.
echo 💡 If you get "failed to fetch" errors:
echo 1. Wait a bit longer for servers to start
echo 2. Check that both terminal windows are running
echo 3. Try refreshing the page
echo.
echo Press any key to close this window...
pause > nul
