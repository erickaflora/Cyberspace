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
    tags: Optional[List[str]] = []

class PostResponse(PostBase):
    id: UUID
    created_at: datetime
    owner_id: UUID
    tags: List[TagResponse] = []
    model_config = ConfigDict(from_attributes=True)

