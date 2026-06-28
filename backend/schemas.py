from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    accent_color: str
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True

class UserPreferencesUpdate(BaseModel):
    accent_color: Optional[str] = None
    avatar_url: Optional[str] = None
    full_name: Optional[str] = None

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None

    @field_validator("title")
    @classmethod
    def title_must_not_be_blank(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Title cannot be empty.")
        if len(cleaned) < 3:
            raise ValueError("Title must be at least 3 characters.")
        return cleaned

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None

    @field_validator("title")
    @classmethod
    def title_must_not_be_blank(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Title cannot be empty.")
        if len(cleaned) < 3:
            raise ValueError("Title must be at least 3 characters.")
        return cleaned

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] 
    is_completed: bool  
    owner_id: int

    class Config:
        from_attributes = True