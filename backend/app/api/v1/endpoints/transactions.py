from typing import List, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session
import uuid

from app.api import deps
from app.crud import crud_transaction
from app.schemas.transaction import TransactionCreate, TransactionRead
from app.database import get_session
from app.models import User

router = APIRouter()

@router.get("/", response_model=List[TransactionRead])
def read_transactions(
    session: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 100,
    wallet_id: Optional[uuid.UUID] = None
) -> Any:
    """
    İşlemleri listele. Opsiyonel olarak cüzdan ID'sine göre filtrele.
    """
    transactions = crud_transaction.get_transactions(
        session, 
        user_id=current_user.id, 
        skip=skip, 
        limit=limit,
        wallet_id=wallet_id
    )
    return transactions

@router.post("/", response_model=TransactionRead)
def create_transaction(
    *,
    session: Session = Depends(get_session),
    transaction_in: TransactionCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Yeni işlem (Gelir, Gider veya Transfer) oluştur.
    - Transfer ise 'target_wallet_id' zorunlu.
    - Bakiye otomatik güncellenir.
    """
    transaction = crud_transaction.create_transaction(session, transaction_in=transaction_in, user_id=current_user.id)
    return transaction

@router.delete("/{transaction_id}")
def delete_transaction(
    *,
    session: Session = Depends(get_session),
    transaction_id: uuid.UUID,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    İşlemi sil (Geri al).
    """
    result = crud_transaction.delete_transaction(session, transaction_id=transaction_id, user_id=current_user.id)
    return result
