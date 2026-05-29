from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import EmailStr, field_validator
import uuid
import re

# Ortak ozellikler (Base)
class UserBase(SQLModel):
    email: EmailStr
    first_name: str = Field(min_length=3, max_length=30)
    last_name: Optional[str] = Field(default=None, max_length=50)
    is_active: bool = True

# Kayit olurken istenecekler (Create)
class UserCreate(UserBase):
    password: str
    confirm_password: str

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if len(v) < 8 or len(v) > 30:
            raise ValueError("Password must be between 8 and 30 characters.")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number.")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter.")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError("Password must contain at least one special character (!@#$...).")
        return v

# API'den donerken gosterilecekler (Read)
class UserRead(UserBase):
    id: uuid.UUID
    profile_image_url: Optional[str] = None
    is_verified: bool = False

# Token donus modeli
class Token(SQLModel):
    access_token: str
    token_type: str

class UserUpdate(SQLModel):
    first_name: Optional[str] = Field(default=None, min_length=3, max_length=30)
    last_name: Optional[str] = Field(default=None, max_length=50)
    email: Optional[EmailStr] = None
    profile_image_url: Optional[str] = None
