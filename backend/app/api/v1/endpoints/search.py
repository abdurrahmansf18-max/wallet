from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlmodel import select, or_, Session as SQLSession
from app.api.deps import get_session, get_current_user
from app.models import User, Wallet, Transaction, Bill, Goal

router = APIRouter()

@router.get("/")
def global_search(
    query: str = Query(..., min_length=1, description="Ara"),
    db: SQLSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Kullanıcının cüzdanları, işlemleri, faturaları ve hedefleri arasında genel arama yapar.
    """
    search_results = []
    
    # Wallet Search
    wallet_stmt = select(Wallet).where(
        Wallet.user_id == current_user.id,
        or_(
            Wallet.name.ilike(f"%{query}%"),
            Wallet.description.ilike(f"%{query}%")
        )
    ).limit(5)
    wallets = db.exec(wallet_stmt).all()
    
    for w in wallets:
        search_results.append({
            "id": str(w.id),
            "title": w.name,
            "type": "Wallet",
            "href": f"/wallets/{w.id}"
        })

    # Transaction Search
    transaction_stmt = select(Transaction).where(
        Transaction.user_id == current_user.id,
        or_(
            Transaction.description.ilike(f"%{query}%"),
            Transaction.category.ilike(f"%{query}%"),
            Transaction.payee.ilike(f"%{query}%")
        )
    ).limit(10)
    transactions = db.exec(transaction_stmt).all()
    
    for t in transactions:
        search_results.append({
            "id": str(t.id),
            "title": f"{t.description} ({t.amount} {t.wallet.currency if t.wallet else ''})",
            "type": "Transaction",
            "href": f"/wallets/{t.wallet_id}"
        })

    # Bill Search
    bill_stmt = select(Bill).where(
        Bill.user_id == current_user.id,
        or_(
            Bill.name.ilike(f"%{query}%"),
            Bill.category.ilike(f"%{query}%"),
            Bill.payee.ilike(f"%{query}%")
        )
    ).limit(5)
    bills = db.exec(bill_stmt).all()
    
    for b in bills:
        search_results.append({
            "id": str(b.id),
            "title": f"{b.name} ({b.amount})",
            "type": "Bill",
            "href": "/bills"
        })

    # Goal Search
    goal_stmt = select(Goal).where(
        Goal.user_id == current_user.id,
        or_(
            Goal.name.ilike(f"%{query}%"),
            Goal.description.ilike(f"%{query}%")
        )
    ).limit(5)
    goals = db.exec(goal_stmt).all()
    
    for g in goals:
        search_results.append({
            "id": str(g.id),
            "title": g.name,
            "type": "Goal",
            "href": f"/goals/{g.id}"
        })

    return search_results
