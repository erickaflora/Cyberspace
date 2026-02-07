import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, index=True)
    content = Column(String(280), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # The Foreign Key links the data at the Database level
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    # The Relationship links the objects at the Python level
    owner = relationship("User", back_populates="posts")