from uuid import UUID
from sqlalchemy.orm import Session
from domains.users.models import User
from domains.users.schemas import UserCreate
from auth.utils import hash_password
from domains.users.schemas import UserUpdate
from fastapi import HTTPException, status

def get_user_by_username(db: Session, username: str):
    """Fetch a user by username to check for duplicates or login."""
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    """Fetch a user by email."""
    return db.query(User).filter(User.email == email).first()

def get_user(db: Session, user_id: UUID):
    """Fetch a user by their UUID."""
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate):
    """Create a new user with hashed password."""
    # Check if username exists
    if get_user_by_username(db, username=user.username):
        raise HTTPException(
            status_code=400,
            detail="Username already registered."
        )
    
    # Check if email exists
    if get_user_by_email(db, email=user.email):
        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )
    hashed_password = hash_password(user.password)
    
    user_data = user.model_dump(exclude={"password"})
    db_user = User(
        **user_data,
        hashed_password=hashed_password,
        is_active=True
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: UUID):
    """Delete a user by their UUID."""
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    db.delete(db_user)
    db.commit()
    return db_user

def update_user(db: Session, user_id: UUID, user_update: UserUpdate):
    """Update user details."""
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    update_data = user_update.model_dump(exclude_unset=True)

    if "password" in update_data:
        password = update_data.pop("password")
        db_user.hashed_password = hash_password(password)

    for key, value in update_data.items():
            setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)

    return db_user