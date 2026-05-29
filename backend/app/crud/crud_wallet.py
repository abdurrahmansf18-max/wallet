from typing import List
from sqlmodel import Session, select
from app.models import Wallet
from app.schemas.wallet import WalletCreate, WalletUpdate
import uuid

def create_wallet(session: Session, wallet_in: WalletCreate, user_id: uuid.UUID) -> Wallet:
    # Wallet objesini manuel oluşturuyoruz çünkü user_id eksik ve initial_balance -> balance eşleşmesi lazım
    wallet_data = wallet_in.dict(exclude={"initial_balance"})
    db_obj = Wallet(**wallet_data, user_id=user_id, balance=wallet_in.initial_balance)
    
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def get_wallets_by_user(session: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[Wallet]:
    statement = select(Wallet).where(Wallet.user_id == user_id).offset(skip).limit(limit)
    return session.exec(statement).all()

def get_wallet(session: Session, wallet_id: uuid.UUID) -> Wallet | None:
    return session.get(Wallet, wallet_id)

def update_wallet(session: Session, db_wallet: Wallet, wallet_in: WalletUpdate) -> Wallet:
    wallet_data = wallet_in.dict(exclude_unset=True)
    for key, value in wallet_data.items():
        setattr(db_wallet, key, value)
    session.add(db_wallet)
    session.commit()
    session.refresh(db_wallet)
    return db_wallet

def delete_wallet(session: Session, db_wallet: Wallet) -> Wallet:
    session.delete(db_wallet)
    session.commit()
    return db_wallet
