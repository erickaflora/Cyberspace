from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from domains.users import schemas, service

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user in Cyberspace.
    """
    # Check if username exists
    if service.get_user_by_username(db, username=user.username):
        raise HTTPException(
            status_code=400,
            detail="Username already registered."
        )
    
    # Check if email exists
    if service.get_user_by_email(db, email=user.email):
        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    # Create the user
    return service.create_user(db=db, user=user)

@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a user's profile by their ID.
    """
    user = service.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user