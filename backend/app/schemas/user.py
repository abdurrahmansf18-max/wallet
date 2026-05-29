from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import EmailStr, field_validator
import uuid
import re

# Ortak özellikler (Base)
class UserBase(SQLModel):
    email: EmailStr
    first_name: str = Field(min_length=3, max_length=30) # Zorunlu, en az 3 karakter
    last_name: Optional[str] = Field(default=None, max_length=50) # Opsiyonel
    is_active: bool = True

# Kayıt olurken istenecekler (Create)
class UserCreate(UserBase):
    password: str
    confirm_password: str

    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if len(v) < 8 or len(v) > 30:
            raise ValueError('Password must be between 8 and 30 characters.')
        if not re.search(r"\d", v):
             raise ValueError('Password must contain at least one number.')
        if not re.search(r"[A-Z]", v):
            raise ValueError('Password must contain at least one uppercase letter.')
        if not re.search(r"[a-z]", v):
            raise ValueError('Password must contain at least one lowercase letter.')
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError('Password must contain at least one special character (!@#$...).')
        return v

# API'den dönerken gösterilecekler (Read) - Sifre haric
class UserRead(UserBase):
    id: uuid.UUID
    profile_image_url: Optional[str] = None
    is_verified: bool = False # Email doğrulaması yapıldı mı?
    
    # Notification Settings
    email_alerts_transactions: bool = True
    email_alerts_bills: bool = True
    email_alerts_budgets: bool = True
    email_alerts_marketing: bool = False
    push_alerts_transactions: bool = True
    push_alerts_bills: bool = True
    push_alerts_budgets: bool = True
    theme: str = 'system'
    ui_animations: bool = True
    compact_mode: bool = False
    large_text: bool = False
    ui_layout: str = 'default'

    # Identity Verification
    date_of_birth: Optional[str] = None
    full_legal_name: Optional[str] = None
    identity_verification_status: str = "unverified"
    ssn_last_four: Optional[str] = None

# Token dönüş modeli
class Token(SQLModel):
    access_token: str
    token_type: str

class UserUpdate(SQLModel):
    first_name: Optional[str] = Field(default=None, min_length=3, max_length=30)
    last_name: Optional[str] = Field(default=None, max_length=50)
    email: Optional[EmailStr] = None
    profile_image_url: Optional[str] = None
    email_alerts_transactions: Optional[bool] = None
    email_alerts_bills: Optional[bool] = None
    email_alerts_budgets: Optional[bool] = None
    email_alerts_marketing: Optional[bool] = None
    push_alerts_transactions: Optional[bool] = None
    push_alerts_bills: Optional[bool] = None
    push_alerts_budgets: Optional[bool] = None
    theme: Optional[str] = None
    ui_animations: Optional[bool] = None
    compact_mode: Optional[bool] = None
    large_text: Optional[bool] = None
    ui_layout: Optional[str] = None

class IdentityVerificationUpdate(SQLModel):
    ssn: str = Field(min_length=9, max_length=11)
    date_of_birth: str
    full_legal_name: str

class UserUpdatePassword(SQLModel):
    current_password: str
    new_password: str
    confirm_new_password: str

    @field_validator('new_password')
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if len(v) < 8 or len(v) > 30:
            raise ValueError('Password must be between 8 and 30 characters.')
        if not re.search(r"\d", v):
             raise ValueError('Password must contain at least one number.')
        if not re.search(r"[A-Z]", v):
            raise ValueError('Password must contain at least one uppercase letter.')
        if not re.search(r"[a-z]", v):
            raise ValueError('Password must contain at least one lowercase letter.')
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError('Password must contain at least one special character (!@#$...).')
        return v





