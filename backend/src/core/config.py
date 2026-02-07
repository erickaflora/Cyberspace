from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str
    DB_PORT: str = "5432"
    DATABASE_URL: str

    model_config = {"extra": "ignore"}

settings = Settings()