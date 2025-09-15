"""
Configuration settings for the ASF backend.
Uses Pydantic BaseSettings to load environment variables.
"""

from typing import Optional
from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database
    database_url: str = Field(
        default="postgresql+asyncpg://user:password@localhost:5432/asf_db",
        env="DATABASE_URL",
        description="PostgreSQL database URL with asyncpg driver"
    )
    
    # OpenAI API
    openai_api_key: str = Field(
        default="",
        env="OPENAI_API_KEY",
        description="OpenAI API key for GPT-4 and embeddings"
    )
    
    # Redis
    redis_url: str = Field(
        default="redis://localhost:6379/0",
        env="REDIS_URL",
        description="Redis URL for caching and Celery message broker"
    )
    
    # JWT Authentication
    jwt_secret: str = Field(
        default="your-secret-key-change-in-production",
        env="JWT_SECRET",
        description="Secret key for JWT token signing"
    )
    jwt_algorithm: str = Field(
        default="HS256",
        env="JWT_ALGORITHM",
        description="JWT signing algorithm"
    )
    jwt_expire_minutes: int = Field(
        default=30,
        env="JWT_EXPIRE_MINUTES",
        description="JWT token expiration time in minutes"
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
    
    # Celery
    celery_broker_url: str = Field(
        default="redis://localhost:6379/1",
        env="CELERY_BROKER_URL",
        description="Celery message broker URL"
    )
    celery_result_backend: str = Field(
        default="redis://localhost:6379/2",
        env="CELERY_RESULT_BACKEND",
        description="Celery result backend URL"
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


# Global settings instance
settings = Settings()
