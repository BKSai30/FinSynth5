# ⚡ FinSynth Quick Start

## 🚨 Prerequisites Check

Before running FinSynth, you need these installed:

- ✅ **Python 3.11+** - [Download here](https://www.python.org/downloads/)
- ✅ **Node.js 18+** - [Download here](https://nodejs.org/)
- ✅ **PostgreSQL 15+** - [Download here](https://www.postgresql.org/download/windows/)
- ✅ **Redis** - [Download here](https://github.com/microsoftarchive/redis/releases)

## 🏃‍♂️ 5-Minute Setup

### Step 1: Install Prerequisites
```bash
# Check if you have them installed
python --version
node --version
psql --version
redis-server --version
```

If any command fails, install the missing software using the links above.

### Step 2: Create Environment File
Create `.env` file in project root:

```env
DATABASE_URL=postgresql+asyncpg://asf_user:password@localhost:5432/asf_db
OPENAI_API_KEY=your-openai-api-key-here
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2
JWT_SECRET=your-secret-key-change-in-production-12345
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=30
APP_NAME=ASF Backend
DEBUG=true
ENVIRONMENT=development
CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001"]
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

### Step 3: Set Up Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Run these commands:
CREATE DATABASE asf_db;
CREATE USER asf_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE asf_db TO asf_user;
\c asf_db
CREATE EXTENSION IF NOT EXISTS vector;
\q
```

### Step 4: Install Dependencies
```bash
pip install -r requirements.txt
npm install
```

### Step 5: Start Services
```bash
# Run the startup script
start.bat

# Or manually in separate terminals:
# Terminal 1: redis-server
# Terminal 2: celery -A backend.workers.celery_app worker --loglevel=info
# Terminal 3: python -m backend.main
# Terminal 4: npm run dev
```

## 🎯 Access Your App

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🧪 Test It Out

Try these queries in the frontend:

1. **"Show me revenue for the next 6 months"**
2. **"What if we increase marketing spend by 20%?"**
3. **"Forecast large customer revenue for 12 months"**
4. **"Explain the current assumptions"**

## 🆘 Need Help?

If you run into issues:

1. **Check the full installation guide**: `INSTALLATION-GUIDE.md`
2. **Verify all prerequisites are installed**
3. **Make sure all services are running**
4. **Check the .env file is created correctly**

## 🎉 You're Done!

Your FinSynth AI financial forecasting platform is now running! 

The app will:
- ✅ Parse your natural language queries
- ✅ Generate financial forecasts using AI
- ✅ Show real-time progress updates
- ✅ Create beautiful charts and tables
- ✅ Export professional Excel reports
