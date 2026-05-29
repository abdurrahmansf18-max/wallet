from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
import uuid

from app.api import deps
from app.database import get_session
from app.models import User, PaymentMethod
from app.schemas.payment_method import PaymentMethodCreate, PaymentMethodRead

router = APIRouter()

@router.get("/", response_model=List[PaymentMethodRead])
def read_payment_methods(
    session: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    statement = select(PaymentMethod).where(PaymentMethod.user_id == current_user.id)
    return session.exec(statement).all()

@router.post("/", response_model=PaymentMethodRead)
def create_payment_method(
    *,
    session: Session = Depends(get_session),
    method_in: PaymentMethodCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    db_method = PaymentMethod.model_validate(method_in, update={"user_id": current_user.id})
    session.add(db_method)
    session.commit()
    session.refresh(db_method)
    return db_method

@router.delete("/{method_id}")
def delete_payment_method(
    *,
    session: Session = Depends(get_session),
    method_id: uuid.UUID,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    db_method = session.get(PaymentMethod, method_id)
    if not db_method:
        raise HTTPException(status_code=404, detail="Payment method not found")
    if db_method.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    session.delete(db_method)
    session.commit()
    return {"ok": True}
