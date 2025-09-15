"""
Database models for the ASF application.
Uses SQLModel for type-safe database operations with automatic API generation.
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlmodel import SQLModel, Field, Relationship


class User(SQLModel, table=True):
    """User model for authentication and forecast history."""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str = Field(max_length=255)
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)
    
    # Relationships
    forecast_queries: List["ForecastQuery"] = Relationship(back_populates="user")


class ForecastQuery(SQLModel, table=True):
    """Model for storing user forecast queries and parsed intents."""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    query_text: str = Field(max_length=2000)
    parsed_intent: Dict[str, Any] = Field(default_factory=dict)  # JSON field
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
    result: Dict[str, Any] = Field(default_factory=dict)  # JSON field with forecast data
    assumptions_used: Dict[str, Any] = Field(default_factory=dict)  # JSON field with assumptions
    calculation_metadata: Dict[str, Any] = Field(default_factory=dict)  # JSON field with metadata
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
    """Model for user registration."""
    email: str = Field(max_length=255)
    password: str = Field(min_length=8, max_length=100)


class UserLogin(SQLModel):
    """Model for user login."""
    email: str = Field(max_length=255)
    password: str = Field(max_length=100)


class Token(SQLModel):
    """Model for JWT token response."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class HealthResponse(SQLModel):
    """Model for health check response."""
    status: str
    timestamp: datetime
    version: str = "1.0.0"
