from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from domains.users import schemas, service
from auth.dependencies import get_current_user
from domains.users.models import User 
from uuid import UUID

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user in Cyberspace.
    """
    created_user = service.create_user(db=db, user=user)
    if not created_user:
        raise HTTPException(status_code=400, detail="Failed to create user.")
    return created_user

@router.get("/me", response_model=schemas.UserResponse)
def get_own_profile(current_user: User = Depends(get_current_user)):
    """
    Retrieve the current logged-in user's profile.
    """
    return current_user

@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: UUID, db: Session = Depends(get_db)):
    """
    Retrieve a user's profile by their ID.
    """
    user = service.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user

@router.patch("/me", response_model=schemas.UserResponse)
def update_own_profile(
    user_update: schemas.UserUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update the current user's profile.
    """
    return service.update_user(db, user_id=current_user.id, user_update=user_update)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: UUID, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # 1. Secure the route
):
    """
    Remove a user from the system. Only owners or admins allowed.
    """
    target_user = service.get_user(db, user_id=user_id)
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    if current_user.id != target_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You are not authorized to delete this user profile."
        )
    service.delete_user(db, user_id=user_id)
    return None