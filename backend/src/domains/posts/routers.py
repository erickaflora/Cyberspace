from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from core.database import get_db
from domains.posts import schemas, service

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)

@router.get("/", response_model=List[schemas.PostResponse])
def read_posts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve the Cyberspace feed (newest first).
    """
    return service.get_posts(db, skip=skip, limit=limit)

@router.post("/", response_model=schemas.PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    post: schemas.PostCreate, 
    user_id: UUID, # TEMPORARY: Manually pass the User ID until add Auth
    db: Session = Depends(get_db)
):
    """
    Create a new post in Cyberspace.
    """
    # In the future, 'user_id' will come from the logged-in user's token
    return service.create_post(db=db, post=post, user_id=user_id)

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: UUID, 
    user_id: UUID, # TEMPORARY: Manually pass the User ID until add Auth
    db: Session = Depends(get_db)
):
    """
    Delete a post from Cyberspace.
    """
    success = service.delete_post(db=db, post_id=post_id, user_id=user_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found or not authorized to delete."
)