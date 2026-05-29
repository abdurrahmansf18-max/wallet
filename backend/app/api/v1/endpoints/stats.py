from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from typing import Any, Dict
from datetime import datetime, timedelta

from app.api import deps
from app.database import get_session
from app.models import User, Wallet, Transaction, TransactionType

router = APIRouter()

@router.get("/", response_model=Dict[str, Any])
def get_stats(
    session: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Kullanıcının genel istatistiklerini getir (Dashboard için).
    """
    # 1. Total Balance
    wallets = session.exec(select(Wallet).where(Wallet.user_id == current_user.id)).all()
    total_balance = sum(w.balance for w in wallets)
    
    # Tarih hesaplamaları (bu ay vs geçen ay)
    now = datetime.utcnow()
    first_day_this_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    if now.month == 1:
        first_day_last_month = now.replace(year=now.year-1, month=12, day=1, hour=0, minute=0, second=0, microsecond=0)
    else:
        first_day_last_month = now.replace(month=now.month-1, day=1, hour=0, minute=0, second=0, microsecond=0)
        
    last_day_last_month = first_day_this_month - timedelta(seconds=1)

    # 2. Monthly Income
    income_this_month = session.exec(
        select(func.sum(Transaction.amount))
        .where(Transaction.user_id == current_user.id)
        .where(Transaction.type == TransactionType.INCOME)
        .where(Transaction.date >= first_day_this_month)
    ).first() or 0.0

    income_last_month = session.exec(
        select(func.sum(Transaction.amount))
        .where(Transaction.user_id == current_user.id)
        .where(Transaction.type == TransactionType.INCOME)
        .where(Transaction.date >= first_day_last_month)
        .where(Transaction.date <= last_day_last_month)
    ).first() or 0.0

    income_change = 0.0
    if income_last_month > 0:
        income_change = ((income_this_month - income_last_month) / income_last_month) * 100

    # 3. Monthly Expenses (Absolute values)
    expense_this_month = session.exec(
        select(func.sum(Transaction.amount))
        .where(Transaction.user_id == current_user.id)
        .where(Transaction.type == TransactionType.EXPENSE)
        .where(Transaction.date >= first_day_this_month)
    ).first() or 0.0
    expense_this_month = abs(expense_this_month)

    expense_last_month = session.exec(
        select(func.sum(Transaction.amount))
        .where(Transaction.user_id == current_user.id)
        .where(Transaction.type == TransactionType.EXPENSE)
        .where(Transaction.date >= first_day_last_month)
        .where(Transaction.date <= last_day_last_month)
    ).first() or 0.0
    expense_last_month = abs(expense_last_month)

    expense_change = 0.0
    if expense_last_month > 0:
        expense_change = ((expense_this_month - expense_last_month) / expense_last_month) * 100

    # 4. Savings Rate
    # Rate = (Income - Expense) / Income if Income > 0 else 0
    savings_rate_this_month = 0.0
    if income_this_month > 0:
        savings = income_this_month - expense_this_month
        savings_rate_this_month = (savings / income_this_month) * 100 if savings > 0 else 0.0
        
    savings_rate_last_month = 0.0
    if income_last_month > 0:
        savings_last = income_last_month - expense_last_month
        savings_rate_last_month = (savings_last / income_last_month) * 100 if savings_last > 0 else 0.0

    savings_change = savings_rate_this_month - savings_rate_last_month

    # Sparkline verileri (Son 6 ay)
    trend_data = []
    for i in range(5, -1, -1):
        # Ay başı ve sonu hesaplama
        month_date = now - timedelta(days=30*i)
        m_start = month_date.replace(day=1, hour=0, minute=0, second=0)
        
        if m_start.month == 12:
            m_end = m_start.replace(year=m_start.year+1, month=1) - timedelta(seconds=1)
        else:
            m_end = m_start.replace(month=m_start.month+1) - timedelta(seconds=1)
            
        m_inc = session.exec(
            select(func.sum(Transaction.amount))
            .where(Transaction.user_id == current_user.id)
            .where(Transaction.type == TransactionType.INCOME)
            .where(Transaction.date >= m_start)
            .where(Transaction.date <= m_end)
        ).first() or 0.0
        
        m_exp = session.exec(
            select(func.sum(Transaction.amount))
            .where(Transaction.user_id == current_user.id)
            .where(Transaction.type == TransactionType.EXPENSE)
            .where(Transaction.date >= m_start)
            .where(Transaction.date <= m_end)
        ).first() or 0.0
        m_exp = abs(m_exp)
        
        # Sadece mevcut bakiyeyi 1000 bazında farazi olarak arttıralım
        # Gerçek uygulamada günlük bakiye takibi için daha karmaşık sorgular gerekir.
        trend_data.append({
            "month": m_start.strftime("%b"),
            "income": m_inc,
            "expense": m_exp,
            "balance": total_balance - (m_exp - m_inc) * (5-i), # Çok basit bir tahmin
            "savingsRate": ((m_inc - m_exp) / m_inc * 100) if m_inc > 0 and (m_inc - m_exp) > 0 else 0
        })

    return {
        "totalBalance": total_balance,
        "balanceChange": 0.0, # Bu veri için geçmiş tüm bakiyeleri tutmak gerek
        "monthlyIncome": income_this_month,
        "incomeChange": income_change,
        "monthlyExpenses": expense_this_month,
        "expenseChange": expense_change,
        "savingsRate": savings_rate_this_month,
        "savingsChange": savings_change,
        "trendData": trend_data
    }
