from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List, Annotated
from uuid import UUID
from core.database import get_db
from domains.posts import schemas, service
from auth.dependencies import get_current_active_user
from domains.users.models import User

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)

@router.get("/", response_model=List[schemas.PostResponse])
def read_posts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve the Cyberspace feed (newest first).
    """
    posts = service.get_posts(db, skip=skip, limit=limit)
    return [
        schemas.PostResponse(
            id=p.id,
            content=p.content,
            created_at=p.created_at,
            owner_id=p.owner_id,
            tags=p.tags,
            likes_count=p.likes.count()
        )
        for p in posts
    ]

@router.post("/", response_model=schemas.PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    post: schemas.PostCreate, 
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db)
):
    """
    Create a new post in Cyberspace.
    """
    # Use the current user's ID from the JWT token
    return service.create_post(db=db, post=post, user_id=current_user.id)

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: UUID, 
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db)
):
    """
    Delete a post from Cyberspace.
    """
    success = service.delete_post(db=db, post_id=post_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found or not authorized to delete."
)
    
@router.get("/{post_id}", response_model=schemas.PostResponse, status_code=status.HTTP_200_OK)
def get_post(
    post_id: UUID, 
    db: Session = Depends(get_db)
):
    """
    Retrieve a specific post by its ID with its total likes.
    """
    post = service.get_post(db=db, post_id=post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")
    return schemas.PostResponse(
        id=post.id,
        content=post.content,
        created_at=post.created_at,
        owner_id=post.owner_id,
        tags=post.tags,
        likes_count=post.likes.count()
    )

@router.post("/{post_id}/like", status_code=status.HTTP_200_OK)
def toggle_like(
    post_id: UUID, 
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db)
):
    """
    Like or unlike a post.
    """
    post = service.get_post(db=db, post_id=post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")
    
    liked = service.toggle_like(db=db, post_id=post_id, user_id=current_user.id)
    return {"liked": liked}