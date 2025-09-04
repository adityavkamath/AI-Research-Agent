from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker , declarative_base
from core.config import settings

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL , future = True , echo = True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """
    Dependency function to get database session for FastAPI
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()