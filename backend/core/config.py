"""
Configuration settings for the ASF backend.
Uses Pydantic BaseSettings to load environment variables.
"""

from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Supabase Configuration
    supabase_url: str = Field(
        default="",
        env="SUPABASE_URL",
        description="Supabase project URL"
    )
    supabase_anon_key: str = Field(
        default="",
        env="SUPABASE_ANON_KEY",
        description="Supabase anonymous key for client-side operations"
    )
    supabase_service_key: str = Field(
        default="",
        env="SUPABASE_SERVICE_KEY",
        description="Supabase service key for server-side operations"
    )
    
    # OpenAI API
    openai_api_key: str = Field(
        default="",
        env="OPENAI_API_KEY",
        description="OpenAI API key for GPT-4 and embeddings"
    )
    
    
    # Supabase Authentication (replaces JWT)
    supabase_jwt_secret: str = Field(
        default="",
        env="SUPABASE_JWT_SECRET",
        description="Supabase JWT secret for token verification"
    )
    
    # Application
    app_name: str = Field(
        default="ASF Backend",
        env="APP_NAME",
        description="Application name"
    )
    debug: bool = Field(
        default=False,
        env="DEBUG",
        description="Debug mode"
    )
    environment: str = Field(
        default="development",
        env="ENVIRONMENT",
        description="Environment (development, staging, production)"
    )
    
    # CORS
    cors_origins: list[str] = Field(
        default=["http://localhost:3000", "http://localhost:3001"],
        env="CORS_ORIGINS",
        description="Allowed CORS origins"
    )
    
    
    # OpenAI Model Configuration
    openai_model: str = Field(
        default="gpt-4-turbo-preview",
        env="OPENAI_MODEL",
        description="OpenAI model to use for query parsing"
    )
    openai_embedding_model: str = Field(
        default="text-embedding-3-small",
        env="OPENAI_EMBEDDING_MODEL",
        description="OpenAI embedding model for vector search"
    )
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"  # Ignore extra environment variables


# Global settings instance
settings = Settings()
