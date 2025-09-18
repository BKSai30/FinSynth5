@echo off
echo ========================================
echo    Starting FinSynth Application
echo ========================================

echo.
echo Step 1: Starting Backend Server...
start "Backend Server" cmd /k "python -m backend.main"

echo.
echo Step 2: Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo    All services are starting...
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to continue...
pause > nul
