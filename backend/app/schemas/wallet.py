from typing import Optional
from sqlmodel import SQLModel
from app.models import WalletType
import uuid

# Ortak Alanlar
class WalletBase(SQLModel):
    name: str
    type: WalletType = WalletType.CHECKING
    currency: str = "USD"
    description: Optional[str] = None
    color: Optional[str] = "#10b981"
    is_archived: bool = False

# Oluştururken İstenenler
class WalletCreate(WalletBase):
    initial_balance: float = 0.0 # UI'da "Initial Balance" alanı var, bunu balance'a atayacağız

# Güncellerken İstenenler (Hepsi opsiyonel)
class WalletUpdate(SQLModel):
    name: Optional[str] = None
    type: Optional[WalletType] = None
    currency: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    is_archived: Optional[bool] = None

# Okurken Gösterilenler
class WalletRead(WalletBase):
    id: uuid.UUID
    balance: float
    user_id: uuid.UUID
