@echo off
echo 🚀 FinSynth Hackathon Setup Script
echo =================================

echo.
echo 📦 Setting up Python virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo ❌ Failed to create virtual environment
    pause
    exit /b 1
)

echo.
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ❌ Failed to activate virtual environment
    pause
    exit /b 1
)

echo.
echo 📥 Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)

echo.
echo 📦 Installing Node.js dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo.
echo 📋 Creating environment file...
if not exist .env (
    copy env.example .env
    echo ✅ Created .env file from template
    echo ⚠️  Please edit .env file with your API keys
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📝 Next steps:
echo 1. Edit .env file with your Supabase and OpenAI API keys
echo 2. Set up your Supabase database using supabase-schema.sql
echo 3. Run start.bat to start the application
echo.
echo 🔗 Useful links:
echo - Supabase Dashboard: https://supabase.com/dashboard
echo - OpenAI API Keys: https://platform.openai.com/api-keys
echo.
pause
