# 🚀 FinSynth Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
# Run the setup script
setup.bat

# Or manually:
pip install -r requirements.txt
npm install
```

### 2. Create Environment File
Create a `.env` file in the project root with:

```env
# Database Configuration
DATABASE_URL=postgresql+asyncpg://asf_user:password@localhost:5432/asf_db

# OpenAI API (Required for AI features)
OPENAI_API_KEY=your-openai-api-key-here

# Redis Configuration
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2

# JWT Authentication
JWT_SECRET=your-secret-key-change-in-production-12345
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=30

# Application Settings
APP_NAME=ASF Backend
DEBUG=true
ENVIRONMENT=development
CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001"]

# OpenAI Model Configuration
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

### 3. Set Up Database

#### Install PostgreSQL
- Download from: https://www.postgresql.org/download/windows/
- During installation, set password for `postgres` user

#### Create Database
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database and user
CREATE DATABASE asf_db;
CREATE USER asf_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE asf_db TO asf_user;

-- Enable vector extension
\c asf_db
CREATE EXTENSION IF NOT EXISTS vector;
\q
```

### 4. Install Redis
- Download from: https://github.com/microsoftarchive/redis/releases
- Or use Docker: `docker run -d -p 6379:6379 redis:alpine`

### 5. Start All Services
```bash
# Run the startup script
start.bat

# Or manually start each service:
# Terminal 1: redis-server
# Terminal 2: celery -A backend.workers.celery_app worker --loglevel=info
# Terminal 3: python -m backend.main
# Terminal 4: npm run dev
```

## Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Test Queries

Try these sample queries in the frontend:

1. "Show me revenue for the next 6 months"
2. "What if we increase marketing spend by 20%?"
3. "Forecast large customer revenue for 12 months"
4. "Explain the current assumptions"

## Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials in .env
   - Verify database exists

2. **Redis Connection Error**
   - Ensure Redis is running on port 6379
   - Check Redis URL in .env

3. **OpenAI API Error**
   - Verify your API key is valid
   - Check you have credits in your OpenAI account

4. **Port Already in Use**
   - Make sure ports 3000, 8000, and 6379 are available
   - Kill existing processes if needed

### Manual Service Start:

If the batch script doesn't work, start services manually:

```bash
# Terminal 1 - Redis
redis-server

# Terminal 2 - Celery Worker
celery -A backend.workers.celery_app worker --loglevel=info

# Terminal 3 - Backend
python -m backend.main

# Terminal 4 - Frontend
npm run dev
```

## Production Deployment

For production deployment:

1. Set `DEBUG=false` in .env
2. Use strong `JWT_SECRET`
3. Configure production database URLs
4. Set up AWS S3 for Excel storage
5. Configure proper CORS origins
6. Use environment-specific settings
