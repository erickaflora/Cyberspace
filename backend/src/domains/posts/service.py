from typing import List
from sqlalchemy.orm import Session
from domains.posts.models import Post, Tag
from domains.posts.schemas import PostCreate
from uuid import UUID

def get_or_create_tags(db: Session, tag_names: List[str]):
    """
    Finds existing tags or creates new ones if they don't exist.
    """
    tag_objects = []
    for name in tag_names:
        name = name.lower().strip()
        tag = db.query(Tag).filter(Tag.name == name).first()
        if not tag:
            tag = Tag(name=name)
            db.add(tag)
            db.flush() # Flush to get the ID without committing the whole transaction
        tag_objects.append(tag)
    return tag_objects

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
    tag_objects = get_or_create_tags(db, post.tags)
    
    db_post = Post(
        content=post.content,
        owner_id=user_id, # Link the post to the user who sent the request
        tags=tag_objects # Associate tags with the post
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