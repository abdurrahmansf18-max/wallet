from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field
import uuid
from app.models import TransactionType, TransactionStatus

# Ortak Alanlar (Base)
class TransactionBase(SQLModel):
    amount: float = Field(gt=0) # Tutar her zaman pozitif girilmeli (0'dan buyuk)
    description: str = Field(min_length=1)
    date: datetime = Field(default_factory=datetime.utcnow)
    type: TransactionType
    status: TransactionStatus = TransactionStatus.COMPLETED
    category: str
    payee: Optional[str] = None
    wallet_id: uuid.UUID

# Oluşturma (Create)
class TransactionCreate(TransactionBase):
    # Sadece TRANSFER işlemi seçildiğinde hedef cüzdan zorunludur.
    target_wallet_id: Optional[uuid.UUID] = None 

# Güncelleme (Update) - Wallet ID ve Type değiştirilemez (Logic karışır)
class TransactionUpdate(SQLModel):
    description: Optional[str] = None
    date: Optional[datetime] = None
    category: Optional[str] = None
    payee: Optional[str] = None
    status: Optional[TransactionStatus] = None
    # Miktar değişirse bakiye güncellemesi zor olacağı için şimdilik update'de amount disable edilebilir veya complex logic yazılmalı.
    # Şimdilik basit tutalım, miktarı güncellemeye izin verelim ancak logic CRUD'da olacak.
    amount: Optional[float] = None 

# Okuma (Read)
class TransactionRead(TransactionBase):
    id: uuid.UUID
    user_id: uuid.UUID
    related_transaction_id: Optional[uuid.UUID] = None
    created_at: datetime

