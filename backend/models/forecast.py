"""
Database models for the ASF application.
Uses SQLModel for type-safe database operations with automatic API generation.
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlmodel import SQLModel, Field, Relationship, JSON, Column


class User(SQLModel, table=True):
    """User model for Supabase Auth integration."""
    
    id: str = Field(primary_key=True)  # Supabase uses UUID strings
    email: str = Field(unique=True, index=True, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)
    
    # Relationships
    forecast_queries: List["ForecastQuery"] = Relationship(back_populates="user")


class ForecastQuery(SQLModel, table=True):
    """Model for storing user forecast queries and parsed intents."""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)  # Changed to string for Supabase UUID
    query_text: str = Field(max_length=2000)
    parsed_intent: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))  # JSON field
    status: str = Field(default="pending", max_length=50)  # pending, processing, completed, failed
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = Field(default=None)
    
    # Relationships
    user: User = Relationship(back_populates="forecast_queries")
    forecast_results: List["ForecastResult"] = Relationship(back_populates="query")


class ForecastResult(SQLModel, table=True):
    """Model for storing forecast calculation results."""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    query_id: int = Field(foreign_key="forecastquery.id", index=True)
    result: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))  # JSON field with forecast data
    assumptions_used: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))  # JSON field with assumptions
    calculation_metadata: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))  # JSON field with metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    query: ForecastQuery = Relationship(back_populates="forecast_results")


# Pydantic models for API requests/responses
class ForecastRequest(SQLModel):
    """Request model for forecast endpoint."""
    query: str = Field(max_length=2000, description="Natural language financial query")


class ForecastResponse(SQLModel):
    """Response model for forecast endpoint."""
    query_id: int
    status: str
    result: Optional[Dict[str, Any]] = None
    assumptions_used: Optional[Dict[str, Any]] = None
    message: Optional[str] = None


class UserCreate(SQLModel):
    """Model for user registration with Supabase."""
    email: str = Field(max_length=255)
    password: str = Field(min_length=8, max_length=100)


class UserLogin(SQLModel):
    """Model for user login with Supabase."""
    email: str = Field(max_length=255)
    password: str = Field(max_length=100)


class SupabaseAuthResponse(SQLModel):
    """Model for Supabase authentication response."""
    access_token: str
    refresh_token: str
    expires_in: int
    token_type: str = "bearer"
    user: Dict[str, Any]


class HealthResponse(SQLModel):
    """Model for health check response."""
    status: str
    timestamp: datetime
    version: str = "1.0.0"
