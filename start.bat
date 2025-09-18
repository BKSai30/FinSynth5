@echo off
echo 🚀 Starting FinSynth Hackathon Application
echo =========================================

echo.
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ❌ Failed to activate virtual environment
    echo Please run setup.bat first
    pause
    exit /b 1
)

echo.
echo 🌐 Starting backend server...
start "FinSynth Backend" cmd /k "venv\Scripts\activate.bat && python -m backend.main"

echo.
echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo 🎨 Starting frontend server...
start "FinSynth Frontend" cmd /k "npm run dev"

echo.
echo 🎉 Application started successfully!
echo.
echo 📱 Access the application:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8000
echo - API Docs: http://localhost:8000/docs
echo.
echo 💡 Tips:
echo - Keep both terminal windows open
echo - Check the terminal windows for any error messages
echo - Press Ctrl+C in each terminal to stop the servers
echo.
pause
