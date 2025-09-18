@echo off
echo ========================================
echo    FinSynth Project Startup Script
echo ========================================
echo.

echo Starting Backend Server on port 8001...
start "Backend" cmd /k "cd /d %~dp0 && python backend/simple_main.py"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server on port 3000...
start "Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ========================================
echo    Servers are starting up!
echo ========================================
echo.
echo Backend:  http://localhost:8001
echo Frontend: http://localhost:3000
echo.
echo Wait about 10-15 seconds for both to fully start
echo Then open your browser to: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul
