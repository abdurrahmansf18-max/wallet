from typing import Optional
from sqlmodel import SQLModel
import uuid
from app.models import PaymentMethodType

class PaymentMethodBase(SQLModel):
    type: PaymentMethodType
    name: str # e.g. "Chase Checking" or "Visa Platinum"
    last_four: str # format "****6789" automatically done by frontend or we just store "6789"
    specific_type: str # format "Checking", "Savings", "Credit", "Debit"
    expiry_date: Optional[str] = None # For cards

class PaymentMethodCreate(PaymentMethodBase):
    pass

class PaymentMethodRead(PaymentMethodBase):
    id: uuid.UUID
    user_id: uuid.UUID
