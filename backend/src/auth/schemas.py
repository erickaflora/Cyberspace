from pydantic import BaseModel
from typing import Optional


class Token(BaseModel):
    """Response model for token endpoint"""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Token payload data"""
    user_id: Optional[int] = None
    username: Optional[str] = None
