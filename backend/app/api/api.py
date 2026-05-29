from fastapi import APIRouter
from app.api.v1.endpoints import auth, wallets, transactions, budgets, goals, bills, notifications, search, stats, reports, payment_methods

api_router = APIRouter()

# Auth rotalarÄ± (/api/v1/auth/...)
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

# Payment Methods rotalarÄ± (/api/v1/payment-methods/...)
api_router.include_router(payment_methods.router, prefix="/payment-methods", tags=["payment-methods"])

# Wallet rotaları (/api/v1/wallets/...)
api_router.include_router(wallets.router, prefix="/wallets", tags=["wallets"])

# Transaction rotaları (/api/v1/transactions/...)
api_router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])

# Budget rotaları (/api/v1/budgets/...)
api_router.include_router(budgets.router, prefix="/budgets", tags=["budgets"])

# Goal rotaları (/api/v1/goals/...)
api_router.include_router(goals.router, prefix="/goals", tags=["goals"])

# Bill rotaları (/api/v1/bills/...)
api_router.include_router(bills.router, prefix="/bills", tags=["bills"])

# Notification rotaları (/api/v1/notifications/...)
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])

# Search rotaları (/api/v1/search/...)
api_router.include_router(search.router, prefix="/search", tags=["search"])

# Stats rotaları (/api/v1/stats/...)
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])

# Reports rotaları (/api/v1/reports/...)
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
