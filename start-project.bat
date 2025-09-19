@echo off
echo Starting FinSynth Project...
echo.

echo Step 1: Starting Backend Server...
start "Backend Server" cmd /k "python backend/simple_main.py"

echo Step 2: Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Step 3: Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting!
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit..  b cfdr5e.
pause > nul
          