from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel
from app.models import Period

class BudgetBase(BaseModel):
    category: str
    amount: float
    period: Period = Period.MONTHLY
    start_date: datetime = datetime.utcnow()
    end_date: Optional[datetime] = None

class BudgetCreate(BudgetBase):
    pass

class BudgetUpdate(BaseModel):
    category: Optional[str] = None
    amount: Optional[float] = None
    period: Optional[Period] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class BudgetRead(BudgetBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    spent: float = 0.0 # Computed field
