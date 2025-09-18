import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from sqlmodel import Session, select
from ..models.user import User, UserCreate, UserLogin, UserResponse
import json

class AuthService:
    def __init__(self):
        self.users_db: Dict[str, User] = {}  # In-memory storage for now
    
    def hash_password(self, password: str) -> str:
        """Hash password using SHA-256 with salt"""
        salt = secrets.token_hex(16)
        password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return f"{salt}:{password_hash}"
    
    def verify_password(self, password: str, hashed_password: str) -> bool:
        """Verify password against hash"""
        try:
            salt, password_hash = hashed_password.split(':')
            return hashlib.sha256((password + salt).encode()).hexdigest() == password_hash
        except ValueError:
            return False
    
    def create_user(self, user_data: UserCreate) -> UserResponse:
        """Create a new user"""
        # Check if user already exists
        if user_data.email in self.users_db:
            raise ValueError("User with this email already exists")
        
        # Create new user
        user = User(
            id=len(self.users_db) + 1,
            email=user_data.email,
            password_hash=self.hash_password(user_data.password),
            company_name=user_data.company_name,
            full_name=user_data.full_name,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # Store company data if provided
        if user_data.company_data:
            user.set_company_data(user_data.company_data)
        
        # Save to in-memory database
        self.users_db[user_data.email] = user
        
        return UserResponse(
            id=user.id,
            email=user.email,
            company_name=user.company_name,
            full_name=user.full_name,
            created_at=user.created_at,
            is_active=user.is_active,
            has_company_data=bool(user.company_data)
        )
    
    def authenticate_user(self, login_data: UserLogin) -> Optional[UserResponse]:
        """Authenticate user and return user data"""
        user = self.users_db.get(login_data.email)
        if not user:
            return None
        
        if not self.verify_password(login_data.password, user.password_hash):
            return None
        
        if not user.is_active:
            return None
        
        return UserResponse(
            id=user.id,
            email=user.email,
            company_name=user.company_name,
            full_name=user.full_name,
            created_at=user.created_at,
            is_active=user.is_active,
            has_company_data=bool(user.company_data)
        )
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        return self.users_db.get(email)
    
    def get_user_company_data(self, email: str) -> Dict[str, Any]:
        """Get user's company data"""
        user = self.users_db.get(email)
        if user:
            return user.get_company_data()
        return {}
    
    def update_user_company_data(self, email: str, company_data: Dict[str, Any]) -> bool:
        """Update user's company data"""
        user = self.users_db.get(email)
        if user:
            user.set_company_data(company_data)
            user.updated_at = datetime.utcnow()
            return True
        return False

# Global auth service instance
auth_service = AuthService()
