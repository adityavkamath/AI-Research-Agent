from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel, Field
from typing import List, Optional
from db.session import get_db
from db import models
import traceback
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class MessageModel(BaseModel):
    role: str
    content: str
    timestamp: str

class SessionModel(BaseModel):
    session_id: int
    query: str
    created_at: str
    messages: List[MessageModel]

@router.get("/health")
def health_check():
    return {"status": "healthy", "message": "History API is working"}

@router.get("/history/{user_id}", response_model=List[SessionModel])
def get_history(user_id: int, db=Depends(get_db)):
    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            user = models.User(
                id=user_id,
                name=f"User {user_id}",
                email=f"user{user_id}@example.com"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        sessions = (
            db.query(models.ResearchSession)
            .options(joinedload(models.ResearchSession.messages))
            .filter(models.ResearchSession.user_id == user_id)
            .order_by(models.ResearchSession.created_at.desc())
            .all()
        )

        result = []
        for s in sessions:
            try:
                created_at_str = ""
                if s.created_at:
                    try:
                        created_at_str = s.created_at.strftime("%Y-%m-%d %H:%M:%S")
                    except:
                        created_at_str = str(s.created_at)

                session_data = {
                    "session_id": s.id,
                    "query": s.query or "",
                    "created_at": created_at_str,
                    "messages": []
                }

                for m in s.messages:
                    try:
                        timestamp_str = ""
                        if m.timestamp:
                            try:
                                timestamp_str = m.timestamp.strftime("%Y-%m-%d %H:%M:%S")
                            except:
                                timestamp_str = str(m.timestamp)

                        message_data = {
                            "role": m.role or "assistant", 
                            "content": m.content or "", 
                            "timestamp": timestamp_str
                        }
                        session_data["messages"].append(message_data)
                    except Exception as e:
                        print(f"Error processing message {m.id}: {e}")
                        continue
                
                result.append(session_data)
            except Exception as e:
                print(f"Error processing session {s.id}: {e}")
                continue
        
        return result
        
    except SQLAlchemyError as e:
        print(f"Database error in get_history: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Database error")
    except Exception as e:
        print(f"General error in get_history: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error")
