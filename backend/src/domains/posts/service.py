from sqlalchemy.orm import Session
from domains.posts.models import Post
from domains.posts.schemas import PostCreate
from uuid import UUID

def get_posts(db: Session, skip: int = 0, limit: int = 100):
    """
    Fetches the feed, ordered by newest first.
    """
    return db.query(Post)\
        .order_by(Post.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()

def create_post(db: Session, post: PostCreate, user_id: UUID):
    """
    Creates a new post linked to the specific user (owner_id).
    """
    db_post = Post(
        content=post.content,
        owner_id=user_id # Link the post to the user who sent the request
    )
    
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def delete_post(db: Session, post_id: UUID, user_id: UUID):
    """
    Deletes a post if it belongs to the requesting user.
    """
    post = db.query(Post).filter(Post.id == post_id, Post.owner_id == user_id).first()
    if post:
        db.delete(post)
        db.commit()
        return True
    return False