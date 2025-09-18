"""
Authentication and authorization utilities.
Implements Supabase Auth for authentication.
"""

from typing import Optional, Dict, Any
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client

from .config import settings
from .database import supabase
from ..models.forecast import User

# JWT token scheme
security = HTTPBearer()


async def sign_up(email: str, password: str) -> Dict[str, Any]:
    """Sign up a new user with Supabase Auth."""
    try:
        result = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Sign up failed: {str(e)}"
        )


async def sign_in(email: str, password: str) -> Dict[str, Any]:
    """Sign in a user with Supabase Auth."""
    try:
        result = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Sign in failed: {str(e)}"
        )


async def sign_out() -> None:
    """Sign out the current user."""
    try:
        supabase.auth.sign_out()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Sign out failed: {str(e)}"
        )


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify and decode a Supabase JWT token."""
    try:
        # Supabase handles JWT verification internally
        # We'll use the user from the session instead
        return None
    except Exception:
        return None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict[str, Any]:
    """Get the current authenticated user from Supabase."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = credentials.credentials
    
    try:
        # Get user from Supabase using the token
        user = supabase.auth.get_user(token)
        if not user or not user.user:
            raise credentials_exception
        
        return user.user
    except Exception:
        raise credentials_exception


async def get_current_active_user(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Get the current active user."""
    # Supabase handles user status internally
    return current_user
