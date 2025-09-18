from sqlmodel import SQLModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
import json

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    company_name: str
    full_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)
    
    # Company data stored as JSON
    company_data: Optional[str] = Field(default=None)  # JSON string
    
    def get_company_data(self) -> Dict[str, Any]:
        """Parse company data from JSON string"""
        if self.company_data:
            try:
                return json.loads(self.company_data)
            except json.JSONDecodeError:
                return {}
        return {}
    
    def set_company_data(self, data: Dict[str, Any]) -> None:
        """Store company data as JSON string"""
        self.company_data = json.dumps(data)

class UserCreate(SQLModel):
    email: str
    password: str
    company_name: str
    full_name: str
    company_data: Optional[Dict[str, Any]] = None

class UserLogin(SQLModel):
    email: str
    password: str

class UserResponse(SQLModel):
    id: int
    email: str
    company_name: str
    full_name: str
    created_at: datetime
    is_active: bool
    has_company_data: bool
