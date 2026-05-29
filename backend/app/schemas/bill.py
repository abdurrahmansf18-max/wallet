from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field
import uuid
from app.models import Period

class BillBase(SQLModel):
    name: str = Field(min_length=1)
    amount: float = Field(default=0.0)
    due_date: datetime
    frequency: Period = Field(default=Period.MONTHLY)
    is_paid: bool = Field(default=False)
    category: str
    payee: Optional[str] = None

class BillCreate(BillBase):
    pass

class BillUpdate(SQLModel):
    name: Optional[str] = None
    amount: Optional[float] = None
    due_date: Optional[datetime] = None
    frequency: Optional[Period] = None
    is_paid: Optional[bool] = None
    category: Optional[str] = None
    payee: Optional[str] = None

class BillRead(BillBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    user_id: uuid.UUID
