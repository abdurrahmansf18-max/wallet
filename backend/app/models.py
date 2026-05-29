from typing import Optional, List
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship
from enum import Enum
import uuid

# --- Enums for consistent values ---
class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"
    TRANSFER = "transfer"

class TransactionStatus(str, Enum):
    COMPLETED = "completed"
    PENDING = "pending"
    FAILED = "failed"

class PaymentMethodType(str, Enum):
    CARD = "card"
    BANK = "bank"

class WalletType(str, Enum):
    SAVINGS = "savings"
    CHECKING = "checking"
    INVESTMENT = "investment"
    BUDGET = "budget"
    EMERGENCY = "emergency"
    CASH = "cash"

class Period(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"
    ONCE = "once"

class NotificationType(str, Enum):
    INFO = "info"
    WARNING = "warning"
    SUCCESS = "success"
    ERROR = "error"

# --- Common Model Base ---
class BaseModel(SQLModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# --- USER Model ---
class User(BaseModel, table=True):
    email: str = Field(index=True, unique=True)
    hashed_password: str
    first_name: str # Artık zorunlu
    last_name: Optional[str] = None
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False) # Email doğrulama durumu
    profile_image_url: Optional[str] = None # Added for profile page
    google_id: Optional[str] = Field(default=None, index=True) # Google ile giriş için
    
    # Notification Settings
    email_alerts_transactions: bool = Field(default=True)
    email_alerts_bills: bool = Field(default=True)
    email_alerts_budgets: bool = Field(default=True)
    email_alerts_marketing: bool = Field(default=False)
    push_alerts_transactions: bool = Field(default=True)
    push_alerts_bills: bool = Field(default=True)
    push_alerts_budgets: bool = Field(default=True)

    # Appearance Settings
    theme: str = Field(default="system") # light, dark, system
    ui_animations: bool = Field(default=True)
    compact_mode: bool = Field(default=False)
    large_text: bool = Field(default=False)
    ui_layout: str = Field(default="default") # default, compact, expanded

    # Identity Verification
    date_of_birth: Optional[str] = Field(default=None) # YYYY-MM-DD
    full_legal_name: Optional[str] = Field(default=None)
    identity_verification_status: str = Field(default="unverified") # unverified, pending, verified, rejected
    ssn_last_four: Optional[str] = Field(default=None, max_length=4)

    # Relationships
    wallets: List["Wallet"] = Relationship(back_populates="user")
    transactions: List["Transaction"] = Relationship(back_populates="user")
    bills: List["Bill"] = Relationship(back_populates="user")
    goals: List["Goal"] = Relationship(back_populates="user")
    budgets: List["Budget"] = Relationship(back_populates="user")
    notifications: List["Notification"] = Relationship(back_populates="user") # Added for notifications
    payment_methods: List["PaymentMethod"] = Relationship(back_populates="user")

# --- PAYMENT METHOD Model ---
class PaymentMethod(BaseModel, table=True):
    type: PaymentMethodType
    name: str 
    last_four: str
    specific_type: str 
    expiry_date: Optional[str] = None
    
    user_id: uuid.UUID = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="payment_methods")

# --- WALLET Model ---
class Wallet(BaseModel, table=True):
    name: str
    type: WalletType = Field(default=WalletType.CHECKING)
    currency: str = Field(default="USD")
    balance: float = Field(default=0.0)
    description: Optional[str] = None
    color: Optional[str] = Field(default="#10b981") # Hex color code
    is_archived: bool = Field(default=False)
    
    # Foreign Key
    user_id: uuid.UUID = Field(foreign_key="user.id")
    
    # Relationships
    user: User = Relationship(back_populates="wallets")
    transactions: List["Transaction"] = Relationship(back_populates="wallet")
    goals: List["Goal"] = Relationship(back_populates="wallet")

# --- TRANSACTION Model ---
class Transaction(BaseModel, table=True):
    amount: float # Positive for income, negative for expense
    description: str
    date: datetime = Field(default_factory=datetime.utcnow)
    type: TransactionType
    status: TransactionStatus = Field(default=TransactionStatus.COMPLETED)
    category: str 
    payee: Optional[str] = None 
    
    # Foreign Keys
    wallet_id: uuid.UUID = Field(foreign_key="wallet.id")
    user_id: uuid.UUID = Field(foreign_key="user.id")
    
    # For transfers: Linking two transactions (expense from Wallet A, income to Wallet B)
    related_transaction_id: Optional[uuid.UUID] = Field(default=None, foreign_key="transaction.id")
    
    # Relationships
    wallet: Wallet = Relationship(back_populates="transactions")
    user: User = Relationship(back_populates="transactions")

# --- BILL Model ---
class Bill(BaseModel, table=True):
    name: str
    amount: float
    due_date: datetime
    frequency: Period = Field(default=Period.MONTHLY)
    is_paid: bool = Field(default=False)
    category: str
    payee: Optional[str] = None
    
    user_id: uuid.UUID = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="bills")

# --- GOAL Model ---
class Goal(BaseModel, table=True):
    name: str
    target_amount: float
    current_amount: float = Field(default=0.0)
    target_date: Optional[datetime] = None
    description: Optional[str] = None
    is_completed: bool = Field(default=False)
    
    user_id: uuid.UUID = Field(foreign_key="user.id")
    wallet_id: Optional[uuid.UUID] = Field(foreign_key="wallet.id", nullable=True) 
    
    user: User = Relationship(back_populates="goals")
    wallet: Optional[Wallet] = Relationship(back_populates="goals")

# --- BUDGET Model ---
class Budget(BaseModel, table=True):
    category: str
    amount: float 
    period: Period = Field(default=Period.MONTHLY)
    start_date: datetime
    end_date: Optional[datetime] = None
    
    user_id: uuid.UUID = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="budgets")

# --- NOTIFICATION Model --- 
class Notification(BaseModel, table=True):
    title: str
    message: str
    type: NotificationType = Field(default=NotificationType.INFO)
    is_read: bool = Field(default=False)
    
    user_id: uuid.UUID = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="notifications")

# --- CONTACT Model ---
class Contact(BaseModel, table=True):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    
    user_id: uuid.UUID = Field(foreign_key="user.id")
    user: User = Relationship()

# --- LINKED ACCOUNT Model ---
class LinkedAccount(BaseModel, table=True):
    provider: str # e.g. "Chase", "Bank of America"
    account_name: str
    mask: str # e.g. "1234"
    balance: float = Field(default=0.0)
    
    user_id: uuid.UUID = Field(foreign_key="user.id")
    user: User = Relationship()
