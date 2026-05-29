from typing import Any, List
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.api import deps
from app.crud import crud_bill
from app.models import User, Transaction, TransactionType
from app.schemas.bill import BillCreate, BillRead, BillUpdate

router = APIRouter()

@router.get("/", response_model=List[BillRead])
def read_bills(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get all bills for the current user.
    """
    bills = crud_bill.get_bills_by_user(session=session, user_id=current_user.id, skip=skip, limit=limit)
    return bills

@router.post("/", response_model=BillRead, status_code=status.HTTP_201_CREATED)
def create_bill(
    *,
    session: Session = Depends(deps.get_session),
    bill_in: BillCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create new bill.
    """
    bill = crud_bill.create_bill(session=session, bill_in=bill_in, user_id=current_user.id)
    return bill

@router.get("/history")
def get_bill_history(
    session: Session = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    # Get history based on transactions with specific categories
    transactions = session.exec(
        select(Transaction)
        .where(Transaction.user_id == current_user.id)
        .where(Transaction.type == TransactionType.EXPENSE)
    ).all()

    # Aylara göre gruplayalım
    history = {}
    for t in transactions:
        month_name = t.date.strftime("%b")
        cat = t.category if t.category in ["Utilities", "Housing", "Communication"] else "Other"

        if month_name not in history:
            history[month_name] = {"month": month_name, "Utilities": 0, "Housing": 0, "Communication": 0, "Other": 0}

        history[month_name][cat] += abs(t.amount)

    return list(history.values())

@router.get("/{id}", response_model=BillRead)
def read_bill(
    *,
    session: Session = Depends(deps.get_session),
    id: uuid.UUID,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get bill by ID.
    """
    bill = crud_bill.get_bill(session=session, bill_id=id, user_id=current_user.id)
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    return bill

@router.patch("/{id}", response_model=BillRead)
def update_bill(
    *,
    session: Session = Depends(deps.get_session),
    id: uuid.UUID,
    bill_in: BillUpdate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update a bill.
    """
    bill = crud_bill.get_bill(session=session, bill_id=id, user_id=current_user.id)
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    
    bill = crud_bill.update_bill(session=session, db_bill=bill, bill_in=bill_in)
    return bill

@router.delete("/{id}")
def delete_bill(
    *,
    session: Session = Depends(deps.get_session),
    id: uuid.UUID,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete a bill.
    """
    bill = crud_bill.get_bill(session=session, bill_id=id, user_id=current_user.id)
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    
    crud_bill.delete_bill(session=session, db_bill=bill)
    return {"message": "Bill deleted successfully"}


