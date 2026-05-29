from typing import Any, List
from datetime import datetime
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.api import deps
from app.database import get_session
from app.models import Budget, User, Transaction, TransactionType
from app.schemas.budget import BudgetCreate, BudgetRead, BudgetUpdate

router = APIRouter()

def calculate_spent(session: Session, user_id: uuid.UUID, category: str) -> float:
    # Calculate total spent for this category in the current month
    today = datetime.utcnow()
    start_of_month = datetime(today.year, today.month, 1)
    
    transactions = session.exec(
        select(Transaction)
        .where(Transaction.user_id == user_id)
        .where(Transaction.category == category)
        .where(Transaction.type == TransactionType.EXPENSE)
        .where(Transaction.date >= start_of_month)
    ).all()
    
    return sum(t.amount for t in transactions)

@router.get("/", response_model=List[BudgetRead])
def read_budgets(
    session: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    budgets = session.exec(select(Budget).where(Budget.user_id == current_user.id).offset(skip).limit(limit)).all()
    
    response = []
    for budget in budgets:
        spent = calculate_spent(session, current_user.id, budget.category)
        
        # Create a dict from the budget object and add the computed 'spent' field
        budget_dict = budget.dict()
        budget_dict['spent'] = spent
        response.append(BudgetRead(**budget_dict))
        
    return response

@router.post("/", response_model=BudgetRead)
def create_budget(
    *,
    session: Session = Depends(get_session),
    budget_in: BudgetCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    budget = Budget(**budget_in.dict())
    budget.user_id = current_user.id
    session.add(budget)
    session.commit()
    session.refresh(budget)
    
    spent = calculate_spent(session, current_user.id, budget.category)
    budget_dict = budget.dict()
    budget_dict['spent'] = spent
    return BudgetRead(**budget_dict)

@router.put("/{id}", response_model=BudgetRead)
def update_budget(
    *,
    session: Session = Depends(get_session),
    id: uuid.UUID,
    budget_in: BudgetUpdate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    budget = session.get(Budget, id)
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    if budget.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    budget_data = budget_in.dict(exclude_unset=True)
    for key, value in budget_data.items():
        setattr(budget, key, value)
        
    session.add(budget)
    session.commit()
    session.refresh(budget)
    
    spent = calculate_spent(session, current_user.id, budget.category)
    budget_dict = budget.dict()
    budget_dict['spent'] = spent
    return BudgetRead(**budget_dict)

@router.delete("/{id}", response_model=BudgetRead)
def delete_budget(
    *,
    session: Session = Depends(get_session),
    id: uuid.UUID,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    budget = session.get(Budget, id)
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    if budget.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    session.delete(budget)
    session.commit()
    
    # Return with 0 spent.
    budget_dict = budget.dict()
    budget_dict['spent'] = 0.0
    return BudgetRead(**budget_dict)

@router.get("/insights")
def get_budget_insights(
    session: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    # Gerçek bütçe analizi
    budgets = session.exec(select(Budget).where(Budget.user_id == current_user.id)).all()
    recommendations = []
    trends = []
    
    for b in budgets:
        spent = calculate_spent(session, current_user.id, b.category)
        if b.amount > 0:
            percentage = (spent / b.amount) * 100
            if percentage >= 100:
                recommendations.append(f"Consider increasing your {b.category} budget, you've exceeded it!")
            elif percentage >= 80:
                recommendations.append(f"Watch out for {b.category}, you're at {percentage:.1f}% of your budget.")
                
        trends.append({
            "category": b.category,
            "budgeted": b.amount,
            "spent": spent,
            "forecast": spent * 1.2 # basit bir tahmin
        })
        
    return {
        "recommendations": recommendations if recommendations else ["You're doing great! No immediate recommendations."],
        "trends": trends,
        "forecast": sum(t["forecast"] for t in trends)
    }
