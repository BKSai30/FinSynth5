@echo off
echo ========================================
echo    FinSynth Setup Script
echo ========================================

echo.
echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Installing Node.js dependencies...
npm install

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Create .env file with your configuration
echo 2. Set up PostgreSQL database
echo 3. Install and start Redis
echo 4. Run start.bat to launch all services
echo.
pause
