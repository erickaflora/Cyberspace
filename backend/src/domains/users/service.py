from sqlalchemy.orm import Session
from pwdlib import PasswordHash
from domains.users.models import User
from domains.users.schemas import UserCreate

# Initialize the password hasher using Argon2
password_hash = PasswordHash.recommended()

def get_user_by_username(db: Session, username: str):
    """Fetch a user by username to check for duplicates or login."""
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    """Fetch a user by email."""
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    """
    1. Hashes the raw password.
    2. Creates the User model.
    3. Commits to the database.
    """
    hashed_password = password_hash.hash(user.password)
    
    db_user = User(
        username=user.username,
        email=user.email,
        profile_name=user.profile_name,
        hashed_password=hashed_password,
        is_active=True
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user