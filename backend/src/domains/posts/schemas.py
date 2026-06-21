from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from uuid import UUID
from typing import List, Optional

class TagBase(BaseModel):
    name:str = Field(..., max_length=50, min_length=1)

class TagResponse(TagBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)
    
class PostBase(BaseModel):
    content: str = Field(..., max_length=280, min_length=1)

class PostCreate(PostBase):
    tags: Optional[List[str]] = None

class LikeResponse(BaseModel):
    id: UUID
    user_id: UUID
    post_id: UUID
    model_config = ConfigDict(from_attributes=True)

class PostOwnerResponse(BaseModel):
    id: UUID
    username: str
    profile_name: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class PostResponse(PostBase):
    id: UUID
    created_at: datetime
    owner: PostOwnerResponse
    tags: List[TagResponse] = Field(default_factory=list)
    likes_count: int = 0
    model_config = ConfigDict(from_attributes=True)