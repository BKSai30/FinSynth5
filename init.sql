-- Initialize ASF Database
-- This script sets up the database with required extensions

-- Enable pgvector extension for vector operations
CREATE EXTENSION IF NOT EXISTS vector;

-- Create database if it doesn't exist
-- CREATE DATABASE asf_db;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE asf_db TO asf_user;

-- Create schemas if needed
-- CREATE SCHEMA IF NOT EXISTS public;

-- The application will create tables automatically via SQLModel
-- This script just ensures the vector extension is available
