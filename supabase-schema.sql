-- Create users table for FinSynth
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_company_name ON users(company_name);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Create forecasts table to store forecast history
CREATE TABLE IF NOT EXISTS forecasts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    result JSONB NOT NULL,
    assumptions_used JSONB,
    ai_insights TEXT,
    confidence_score INTEGER,
    forecast_period VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for forecasts
CREATE INDEX IF NOT EXISTS idx_forecasts_user_id ON forecasts(user_id);
CREATE INDEX IF NOT EXISTS idx_forecasts_created_at ON forecasts(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid()::text = email);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid()::text = email);

-- Create policies for forecasts table
CREATE POLICY "Users can view their own forecasts" ON forecasts
    FOR SELECT USING (user_id IN (
        SELECT id FROM users WHERE email = auth.uid()::text
    ));

CREATE POLICY "Users can insert their own forecasts" ON forecasts
    FOR INSERT WITH CHECK (user_id IN (
        SELECT id FROM users WHERE email = auth.uid()::text
    ));

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();