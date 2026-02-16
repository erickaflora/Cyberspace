from pwdlib import PasswordHash
from sqlalchemy.orm import Session
from core.database import get_db
from datetime import datetime, timedelta, timezone
from typing import Optional
from core.config import settings
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends
import jwt

# Initialize the password hasher using Argon2
password_hash = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def hash_password(password: str) -> str:
    """Hash a plain text password using Argon2."""
    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain text password against a hashed password."""
    return password_hash.verify(plain_password, hashed_password)

def authenticate_user(user: str, password: str, db: Session = Depends(get_db)):
    """Authenticate a user by user and password."""
    from domains.users.service import get_user_by_username

    user = get_user_by_username(db, user)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token with the given data and expiration."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

