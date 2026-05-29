from typing import List, Optional
import uuid
from sqlmodel import Session, select
from app.models import Bill
from app.schemas.bill import BillCreate, BillUpdate

def create_bill(session: Session, bill_in: BillCreate, user_id: uuid.UUID) -> Bill:
    db_bill = Bill.model_validate(bill_in, update={"user_id": user_id})
    session.add(db_bill)
    session.commit()
    session.refresh(db_bill)
    return db_bill

def get_bills_by_user(session: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[Bill]:
    statement = select(Bill).where(Bill.user_id == user_id).offset(skip).limit(limit)
    return session.exec(statement).all()

def get_bill(session: Session, bill_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Bill]:
    statement = select(Bill).where(Bill.id == bill_id, Bill.user_id == user_id)
    return session.exec(statement).first()

def update_bill(session: Session, db_bill: Bill, bill_in: BillUpdate) -> Bill:
    update_data = bill_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_bill, key, value)
    
    session.add(db_bill)
    session.commit()
    session.refresh(db_bill)
    return db_bill

def delete_bill(session: Session, db_bill: Bill) -> None:
    session.delete(db_bill)
    session.commit()
