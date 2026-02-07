from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from uuid import UUID
from typing import Optional

class PostBase(BaseModel):
    content: str = Field(..., max_length=280, min_length=1)

class PostCreate(PostBase):
    pass
class PostResponse(PostBase):
    id: UUID
    created_at: datetime
    owner_id: UUID

    model_config = ConfigDict(from_attributes=True)

    