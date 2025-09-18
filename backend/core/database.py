"""
Database configuration and session management.
Uses Supabase client with SQLModel for type-safe database operations.
"""

from typing import AsyncGenerator, Dict, Any, List
from supabase import create_client, Client
from sqlmodel import SQLModel
from .config import settings


# Create Supabase client
supabase: Client = create_client(settings.supabase_url, settings.supabase_service_key)


# Database operations using Supabase client
class SupabaseDB:
    """Database operations wrapper for Supabase."""
    
    def __init__(self):
        self.client = supabase
    
    async def create(self, table: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new record in the specified table."""
        result = self.client.table(table).insert(data).execute()
        return result.data[0] if result.data else None
    
    async def get_by_id(self, table: str, record_id: int) -> Dict[str, Any]:
        """Get a record by ID."""
        result = self.client.table(table).select("*").eq("id", record_id).execute()
        return result.data[0] if result.data else None
    
    async def get_all(self, table: str, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        """Get all records with pagination."""
        result = self.client.table(table).select("*").range(offset, offset + limit - 1).execute()
        return result.data
    
    async def update(self, table: str, record_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update a record by ID."""
        result = self.client.table(table).update(data).eq("id", record_id).execute()
        return result.data[0] if result.data else None
    
    async def delete(self, table: str, record_id: int) -> bool:
        """Delete a record by ID."""
        result = self.client.table(table).delete().eq("id", record_id).execute()
        return len(result.data) > 0
    
    async def query(self, table: str, filters: Dict[str, Any] = None, order_by: str = None) -> List[Dict[str, Any]]:
        """Query records with filters and ordering."""
        query = self.client.table(table).select("*")
        
        if filters:
            for key, value in filters.items():
                query = query.eq(key, value)
        
        if order_by:
            query = query.order(order_by)
        
        result = query.execute()
        return result.data


# Global database instance
db = SupabaseDB()


async def init_db() -> None:
    """
    Initialize database tables.
    Supabase handles table creation through migrations.
    """
    # Import all models to ensure they're registered
    from ..models.forecast import User, ForecastQuery, ForecastResult
    
    # Test connection
    try:
        # Try to query a table to test connection
        await db.get_all("user", limit=1)
        print("✅ Supabase connection established")
    except Exception as e:
        print(f"❌ Supabase connection failed: {e}")
        raise


async def close_db() -> None:
    """
    Close database connections.
    Supabase client doesn't need explicit closing.
    """
    print("✅ Supabase connection closed")
