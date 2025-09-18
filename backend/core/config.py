"""
Configuration settings for the FinSynth Hackathon backend.
Uses Pydantic BaseSettings to load environment variables.
"""

from typing import List, Optional
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
    supabase_jwt_secret: str = Field(
        default="",
        env="SUPABASE_JWT_SECRET",
        description="Supabase JWT secret for token verification"
    )
    
    # OpenAI API
    openai_api_key: str = Field(
        default="",
        env="OPENAI_API_KEY",
        description="OpenAI API key for GPT-4 and embeddings"
    )
    
    # Application
    app_name: str = Field(
        default="FinSynth Hackathon",
        env="APP_NAME",
        description="Application name"
    )
    debug: bool = Field(
        default=True,
        env="DEBUG",
        description="Debug mode"
    )
    environment: str = Field(
        default="development",
        env="ENVIRONMENT",
        description="Environment (development, staging, production)"
    )
    
    # CORS
    cors_origins: List[str] = Field(
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
    
    # Financial Model Defaults
    large_customer_arpu: float = Field(
        default=16667.0,
        env="LARGE_CUSTOMER_ARPU",
        description="Average Revenue Per User for large customers"
    )
    smb_customer_arpu: float = Field(
        default=5000.0,
        env="SMB_CUSTOMER_ARPU",
        description="Average Revenue Per User for SMB customers"
    )
    smb_marketing_spend: float = Field(
        default=200000.0,
        env="SMB_MARKETING_SPEND",
        description="Monthly marketing spend for SMB customers"
    )
    smb_cac: float = Field(
        default=1250.0,
        env="SMB_CAC",
        description="Customer Acquisition Cost for SMB customers"
    )
    smb_conversion_rate: float = Field(
        default=0.45,
        env="SMB_CONVERSION_RATE",
        description="Conversion rate for SMB customers"
    )
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"


# Global settings instance
settings = Settings()
