from sqlmodel import Session, select
from app.models import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password

def get_user_by_email(session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()

def create_user(session: Session, user_create: UserCreate) -> User:
    # UserCreate modelinde 'hashed_password' yok ama User modelinde zorunlu.
    # Bu yüzden from_orm ile doğrudan dönüşüm yaparken eksik alan hatası alırız.
    # Çözüm: User nesnesini manuel veya model_validate ile oluşturup eksik alanları eklemek.
    
    # Şifreyi hashle
    hashed_password = get_password_hash(user_create.password)
    
    # User nesnesini oluştur (from_orm yerine User constructor kullanarak)
    # create_user modelindeki alanları (email, first_name, last_name, is_active) alıyoruz
    db_user = User(
        email=user_create.email,
        first_name=user_create.first_name,
        last_name=user_create.last_name,
        is_active=user_create.is_active,
        hashed_password=hashed_password # Hashlenmiş şifreyi buraya ekliyoruz
    )
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

def authenticate(session: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(session, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
