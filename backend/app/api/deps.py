from typing import Generator, Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlmodel import Session

from app.core import security
from app.core.config import settings
from app.database import get_session
from app.models import User
from app.crud import crud_user
from app.schemas.user import Token

# Token'ın nerede olduğunu belirtiyoruz (Header: Authorization: Bearer <token>)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login/access-token")

def get_current_user(
    session: Session = Depends(get_session),
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    İstek atan kullanıcının token'ını kontrol eder ve geçerli ise User objesini döner.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Kimlik bilgileri doğrulanamadı",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Token'ı çöz
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except (JWTError, ValidationError):
        raise credentials_exception
        
    user = session.get(User, user_id)
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Kullanıcı aktif değil")
    return user
