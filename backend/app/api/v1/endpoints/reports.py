from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from typing import Any, Dict, List
from datetime import datetime, timedelta

from app.api import deps
from app.database import get_session
from app.models import User, Wallet, Transaction, TransactionType, Goal

router = APIRouter()

@router.get("/", response_model=Dict[str, Any])
def get_reports(
    session: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user),
    period: str = "6months"  # e.g., '1month', '6months', '1year'
) -> Any:
    """
    Raporlar için her sekmenin (Income/Expense, Kategori, Birikim) veri kaynaklarını tek bir endpoint'te dön.
    """
    now = datetime.utcnow()
    
    # Kapsam belirleme
    months_to_go_back = 6
    if period == "1month":
        months_to_go_back = 1
    elif period == "1year":
        months_to_go_back = 12
        
    start_date = now - timedelta(days=30 * months_to_go_back)

    # --- 1. Income vs Expense Trendleri ---
    trend_data = []
    
    for i in range(months_to_go_back-1, -1, -1):
        month_date = now - timedelta(days=30*i)
        m_start = month_date.replace(day=1, hour=0, minute=0, second=0)
        
        if m_start.month == 12:
            m_end = m_start.replace(year=m_start.year+1, month=1) - timedelta(seconds=1)
        else:
            m_end = m_start.replace(month=m_start.month+1) - timedelta(seconds=1)
            
        income = session.exec(
            select(func.sum(Transaction.amount))
            .where(Transaction.user_id == current_user.id)
            .where(Transaction.type == TransactionType.INCOME)
            .where(Transaction.date >= m_start, Transaction.date <= m_end)
        ).first() or 0.0
        
        expense = session.exec(
            select(func.sum(Transaction.amount))
            .where(Transaction.user_id == current_user.id)
            .where(Transaction.type == TransactionType.EXPENSE)
            .where(Transaction.date >= m_start, Transaction.date <= m_end)
        ).first() or 0.0
        
        trend_data.append({
            "month": m_start.strftime("%b"),
            "income": income,
            "expense": abs(expense)
        })

    # --- 2. Category Breakdown (Sadece giderler) ---
    categories_raw = session.exec(
        select(Transaction.category, func.sum(Transaction.amount))
        .where(Transaction.user_id == current_user.id)
        .where(Transaction.type == TransactionType.EXPENSE)
        .where(Transaction.date >= start_date)
        .group_by(Transaction.category)
    ).all()
    
    category_data = []
    for row in categories_raw:
        category_data.append({
            "name": row[0],
            "value": abs(row[1])
        })
        
    # --- 3. Savings Report ---
    total_savings_goal = session.exec(
        select(func.sum(Goal.target_amount)).where(Goal.user_id == current_user.id)
    ).first() or 0.0
    
    current_savings = session.exec(
        select(func.sum(Goal.current_amount)).where(Goal.user_id == current_user.id)
    ).first() or 0.0
    
    return {
        "incomeExpense": trend_data,
        "categoryBreakdown": category_data,
        "savingsStatus": {
            "totalTarget": total_savings_goal,
            "currentSavings": current_savings,
            "progress": (current_savings / total_savings_goal * 100) if total_savings_goal > 0 else 0
        }
    }
