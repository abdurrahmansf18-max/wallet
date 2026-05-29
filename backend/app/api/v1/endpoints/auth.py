from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
from pydantic import EmailStr

from app.crud import crud_user
from app.schemas.user import UserCreate, UserRead, Token, UserUpdatePassword
from app.database import get_session
from app.core.security import create_access_token, verify_password, get_password_hash
from app.core.config import settings
from app.models import User

router = APIRouter()

@router.post("/register", response_model=UserRead)
def register(user_in: UserCreate, session: Session = Depends(get_session)) -> Any:
    """
    Yeni kullanıcı oluştur. Şifre kuralları ve email formatı otomatik kontrol edilir.
    """
    # 1. Email kontrolü (Unique mi?)
    user = crud_user.get_user_by_email(session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="Bu email adresi ile kayıtlı bir kullanıcı zaten var.",
        )
    # 2. Şifre eşleşme kontrolü
    if user_in.password != user_in.confirm_password:
         raise HTTPException(
            status_code=400,
            detail="Şifreler eşleşmiyor.",
        )
        
    # 3. Kayıt işlemi
    # NOT: Gerçek bir uygulamada burada kullanıcıya bir "Doğrulama Emaili" gönderilmeli.
    # Şimdilik kullanıcıyı oluşturuyoruz ancak is_verified=False olarak başlayacak (Modelde tanımladık)
    user = crud_user.create_user(session, user_create=user_in)
    return user

@router.post("/login/access-token", response_model=Token)
def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
) -> Any:
    """
    OAuth2 uyumlu token girişi (Login)
    """
    user = crud_user.authenticate(session, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Hatalı email veya şifre",
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Kullanıcı aktif değil")
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/password-recovery/{email}")
def recover_password(email: EmailStr, session: Session = Depends(get_session)) -> Any:
    """
    Şifre sıfırlama emaili gönder.
    """
    user = crud_user.get_user_by_email(session, email=email)
    if not user:
        # Güvenlik gereği "Böyle bir kullanıcı yok" demek yerine "Varsa email gönderildi" demek daha iyidir.
        # Ama geliştirme aşamasında net hata dönebiliriz.
        raise HTTPException(
            status_code=404,
            detail="Bu email adresine sahip kullanıcı bulunamadı.",
        )
    
    # TODO: Burada Email gönderme servisini (SMTP) çağıracağız.
    # Şimdilik konsola yazdıralım.
    password_reset_token = create_access_token(user.id, expires_delta=timedelta(hours=1))
    print(f"--- EMAIL GÖNDERİLDİ ---")
    print(f"Kime: {email}")
    print(f"Link: https://bizim-frontend.com/reset-password?token={password_reset_token}")
    print(f"------------------------")
    
    return {"message": "Şifre sıfırlama talimatları email adresinize gönderildi."}

@router.post("/reset-password")
def reset_password(
    token: str = Body(...),
    new_password: str = Body(...),
    session: Session = Depends(get_session)
) -> Any:
    """
    Token ile şifreyi yenile.
    """
    # TODO: Token'ı doğrula ve şifreyi güncelle
    # Bu kısmı Security modülünü geliştirdiğimizde detaylandıracağız.
    return {"message": "Şifreniz başarıyla güncellendi."}

@router.post("/google")
def google_login(
    google_token: str = Body(..., embed=True),
    session: Session = Depends(get_session)
) -> Any:
    """
    Google'dan gelen ID Token ile giriş yap veya kayıt ol.
    """
    # TODO: Google Kütüphanesi ile token'ı doğrula
    # verify_google_token(google_token) -> email, name, google_id
    
    # Eger email bizde varsa giris yap, yoksa yeni kayit olustur.
    return {"message": "Google girişi henüz aktif değil (Credentials gerekli)."}


from app.api import deps
from app.schemas.user import UserUpdate, IdentityVerificationUpdate
from fastapi import UploadFile, File
import os
import shutil

@router.get("/me", response_model=UserRead)
def read_current_user(current_user: User = Depends(deps.get_current_user)) -> Any:
    """
    Get current user.
    """
    return current_user

@router.post("/me/avatar", response_model=UserRead)
async def upload_avatar(
    *,
    session: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user),
    file: UploadFile = File(...)
) -> Any:
    """
    Upload profile picture.
    """
    # Create static directory if it doesn't exist
    upload_dir = "static/avatars"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    filename = f"{current_user.id}.{file_extension}"
    file_path = os.path.join(upload_dir, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Assuming frontend is served from root or same server,
    # or you're running backend at localhost:8000
    file_url = f"http://localhost:8000/static/avatars/{filename}"
    
    current_user.profile_image_url = file_url
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    
    return current_user

@router.patch("/me", response_model=UserRead)
def update_current_user(
    *,
    session: Session = Depends(get_session),
    user_in: UserUpdate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update current user.
    """
    user_data = user_in.model_dump(exclude_unset=True)
    for field, value in user_data.items():
        setattr(current_user, field, value)
    
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user

@router.post("/change-password")
def change_password(
    password_in: UserUpdatePassword,
    session: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Change current user's password.
    """
    if not verify_password(password_in.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=400,
            detail="Incorrect current password",
        )
    
    if password_in.current_password == password_in.new_password:
        raise HTTPException(
            status_code=400,
            detail="New password cannot be the same as the current password",
        )

    if password_in.new_password != password_in.confirm_new_password:
        raise HTTPException(
            status_code=400,
            detail="Mismatched passwords",
        )
        
    hashed_password = get_password_hash(password_in.new_password)
    current_user.hashed_password = hashed_password
    session.add(current_user)
    session.commit()
    return {"message": "Password updated successfully"}

@router.post("/me/verify-identity", response_model=UserRead)
def verify_identity(
    verification_in: IdentityVerificationUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Verify user identity using SSN and DoB.
    """
    if current_user.identity_verification_status == "verified":
        raise HTTPException(status_code=400, detail="Identity already verified.")

    # Ssn_last_four saklıyoruz
    ssn_clean = verification_in.ssn.replace("-", "")
    current_user.ssn_last_four = ssn_clean[-4:] if len(ssn_clean) >= 4 else "0000"
    current_user.date_of_birth = verification_in.date_of_birth
    current_user.full_legal_name = verification_in.full_legal_name
    current_user.identity_verification_status = "pending" # In real life, it might call an external API and become verified.

    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    return current_user

