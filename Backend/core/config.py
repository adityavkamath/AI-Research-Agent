from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    OPENAI_API_KEY: str = ""
    DATABASE_URL: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Allow extra fields to be ignored


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()
