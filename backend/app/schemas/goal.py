from typing import Optional
from uuid import UUID
from datetime import datetime
from sqlmodel import SQLModel

class GoalBase(SQLModel):
    name: str
    target_amount: float
    current_amount: float = 0.0
    target_date: Optional[datetime] = None
    description: Optional[str] = None
    is_completed: bool = False
    wallet_id: Optional[UUID] = None

class GoalCreate(GoalBase):
    pass

class GoalUpdate(SQLModel):
    name: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    target_date: Optional[datetime] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    wallet_id: Optional[UUID] = None

class GoalRead(GoalBase):
    id: UUID
    user_id: UUID
