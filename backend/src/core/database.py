from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from core.config import settings


engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    """Modern 2.0+ Declarative Mapping Base Class with built-in type safety."""
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()