from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Wallet App API"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "change-me-in-development"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Veritabanı bağlantısı
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/wallet"
    
    class Config:
        env_file = ".env"

settings = Settings()
