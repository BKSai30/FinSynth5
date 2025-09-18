from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any
from ..models.user import UserCreate, UserLogin, UserResponse
from ..services.auth_service import auth_service
import json

router = APIRouter()
security = HTTPBearer()

@router.post("/register", response_model=UserResponse)
async def register_user(user_data: UserCreate):
    """Register a new user"""
    try:
        user = auth_service.create_user(user_data)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Registration failed")

@router.post("/login", response_model=UserResponse)
async def login_user(login_data: UserLogin):
    """Login user"""
    user = auth_service.authenticate_user(login_data)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return user

@router.get("/me", response_model=UserResponse)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user info"""
    # For simplicity, we'll use email as token for now
    # In production, use proper JWT tokens
    email = credentials.credentials
    user = auth_service.get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return UserResponse(
        id=user.id,
        email=user.email,
        company_name=user.company_name,
        full_name=user.full_name,
        created_at=user.created_at,
        is_active=user.is_active,
        has_company_data=bool(user.company_data)
    )

@router.get("/company-data")
async def get_company_data(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get user's company data"""
    email = credentials.credentials
    company_data = auth_service.get_user_company_data(email)
    return {"company_data": company_data}

@router.put("/company-data")
async def update_company_data(
    company_data: Dict[str, Any],
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Update user's company data"""
    email = credentials.credentials
    success = auth_service.update_user_company_data(email, company_data)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Company data updated successfully"}

@router.post("/logout")
async def logout_user():
    """Logout user (client-side token removal)"""
    return {"message": "Logged out successfully"}