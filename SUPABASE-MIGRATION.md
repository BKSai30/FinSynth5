# 🚀 Supabase Migration Guide

This guide will help you migrate your FinSynth application from PostgreSQL to Supabase.

## 📋 Migration Checklist

### ✅ Completed Changes

1. **Backend Dependencies Updated**
   - Removed: `asyncpg`, `psycopg2-binary`, `pgvector`
   - Added: `supabase`, `postgrest`

2. **Configuration Updated**
   - Replaced `DATABASE_URL` with Supabase settings
   - Updated authentication to use Supabase Auth

3. **Database Layer Migrated**
   - Replaced SQLAlchemy async sessions with Supabase client
   - Created `SupabaseDB` wrapper class for database operations

4. **Authentication System Updated**
   - Replaced JWT with Supabase Auth
   - Updated user models to use UUID strings
   - Added proper user ownership checks

5. **Frontend Updated**
   - Added Supabase client
   - Updated API service to include auth headers
   - Removed NextAuth dependency

## 🛠️ Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and API keys

### 2. Set Up Database Tables

Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.user (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forecast queries table
CREATE TABLE public.forecastquery (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.user(id) NOT NULL,
    query_text TEXT NOT NULL,
    parsed_intent JSONB DEFAULT '{}',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create forecast results table
CREATE TABLE public.forecastresult (
    id SERIAL PRIMARY KEY,
    query_id INTEGER REFERENCES public.forecastquery(id) NOT NULL,
    result JSONB DEFAULT '{}',
    assumptions_used JSONB DEFAULT '{}',
    calculation_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forecastquery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forecastresult ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own data" ON public.user
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own forecasts" ON public.forecastquery
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own results" ON public.forecastresult
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.forecastquery 
            WHERE id = forecastresult.query_id 
            AND user_id = auth.uid()
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_forecastquery_user_id ON public.forecastquery(user_id);
CREATE INDEX idx_forecastquery_created_at ON public.forecastquery(created_at DESC);
CREATE INDEX idx_forecastresult_query_id ON public.forecastresult(query_id);
```

### 3. Configure Environment Variables

Copy `env.example` to `.env` and fill in your Supabase credentials:

```bash
cp env.example .env
```

Update the following variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_KEY`: Your Supabase service key
- `SUPABASE_JWT_SECRET`: Your Supabase JWT secret
- `NEXT_PUBLIC_SUPABASE_URL`: Same as SUPABASE_URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Same as SUPABASE_ANON_KEY

### 4. Install Dependencies

```bash
# Backend dependencies
pip install -r requirements.txt

# Frontend dependencies
npm install
```

### 5. Start the Application

```bash
# No Redis or Celery needed - using FastAPI BackgroundTasks

# Start backend (in separate terminal)
python -m backend.main

# Start frontend (in separate terminal)
npm run dev
```

## 🔧 Key Changes Made

### Backend Changes

1. **Database Operations**: All database operations now use the Supabase client instead of SQLAlchemy sessions
2. **Authentication**: Users are authenticated through Supabase Auth instead of custom JWT
3. **User Management**: User IDs are now UUID strings instead of integers
4. **Security**: Added Row Level Security policies for data isolation

### Frontend Changes

1. **Supabase Client**: Added Supabase client for authentication
2. **API Service**: Updated to include authentication headers in all requests
3. **Dependencies**: Replaced NextAuth with Supabase Auth

## 🚨 Important Notes

1. **Data Migration**: If you have existing data, you'll need to migrate it to the new schema
2. **User IDs**: All user references now use UUID strings instead of integers
3. **Authentication**: Users must sign up through Supabase Auth
4. **Row Level Security**: All data access is automatically filtered by user

## 🎯 Benefits of Supabase Migration

1. **Simplified Infrastructure**: No need to manage PostgreSQL, Redis, Celery, or auth servers separately
2. **Built-in Authentication**: Secure, scalable authentication out of the box
3. **Real-time Features**: Built-in real-time subscriptions for live updates
4. **Automatic Backups**: Managed backups and point-in-time recovery
5. **Scalability**: Auto-scaling database and edge functions
6. **Security**: Row Level Security policies for data isolation

## 🔍 Testing the Migration

1. **Create a user account** through the frontend
2. **Make a forecast request** to test the full flow
3. **Check the database** in Supabase dashboard to verify data is stored correctly
4. **Test authentication** by signing out and back in

## 🆘 Troubleshooting

### Common Issues:

1. **Authentication Errors**: Ensure your Supabase keys are correct
2. **Database Connection**: Check that your Supabase project is active
3. **RLS Policies**: Verify that Row Level Security policies are set up correctly
4. **CORS Issues**: Make sure your frontend URL is in the CORS origins list

### Getting Help:

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- Check the application logs for detailed error messages
