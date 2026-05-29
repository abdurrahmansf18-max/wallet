from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import create_db_and_tables
import app.models # SQLModel tablolarini yuklemek icin sart
import os

from app.core.config import settings
from app.api.api import api_router

# Statik klasörü oluştur
os.makedirs("static/avatars", exist_ok=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Wallet Uygulamasi icin Gelismis API",
)

# Statik dosyaları sun (profil resimleri için)
app.mount("/static", StaticFiles(directory="static"), name="static")

# CORS Ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Next.js frontend adresi
    allow_credentials=True,
    allow_methods=["*"], # GET, POST, PUT, DELETE vb.
    allow_headers=["*"], # Authorization header'ı dahil
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# API Rotalarını Ekle (/api/v1 prefix ile)
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Welcome to Wallet App API"}
