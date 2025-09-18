-- Supabase Database Schema for FinSynth
-- Run this in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create User table (Supabase Auth integration)
CREATE TABLE IF NOT EXISTS "user" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Create ForecastQuery table
CREATE TABLE IF NOT EXISTS "forecastquery" (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    parsed_intent JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Create ForecastResult table
CREATE TABLE IF NOT EXISTS "forecastresult" (
    id SERIAL PRIMARY KEY,
    query_id INTEGER NOT NULL REFERENCES "forecastquery"(id) ON DELETE CASCADE,
    result JSONB DEFAULT '{}',
    assumptions_used JSONB DEFAULT '{}',
    calculation_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forecastquery_user_id ON "forecastquery"(user_id);
CREATE INDEX IF NOT EXISTS idx_forecastquery_status ON "forecastquery"(status);
CREATE INDEX IF NOT EXISTS idx_forecastquery_created_at ON "forecastquery"(created_at);
CREATE INDEX IF NOT EXISTS idx_forecastresult_query_id ON "forecastresult"(query_id);

-- Enable Row Level Security (RLS)
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "forecastquery" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "forecastresult" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON "user"
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON "user"
    FOR UPDATE USING (auth.uid() = id);

-- Forecast queries policies
CREATE POLICY "Users can view own forecast queries" ON "forecastquery"
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own forecast queries" ON "forecastquery"
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own forecast queries" ON "forecastquery"
    FOR UPDATE USING (auth.uid() = user_id);

-- Forecast results policies
CREATE POLICY "Users can view own forecast results" ON "forecastresult"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "forecastquery" 
            WHERE "forecastquery".id = "forecastresult".query_id 
            AND "forecastquery".user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own forecast results" ON "forecastresult"
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM "forecastquery" 
            WHERE "forecastquery".id = "forecastresult".query_id 
            AND "forecastquery".user_id = auth.uid()
        )
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
