from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from workflows.research_graph import build_research_graph
from db.session import get_db
from db import models
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class ChatRequest(BaseModel):
    user_id: int = Field(..., gt=0, description="User ID must be positive")
    query: str = Field(..., min_length=1, max_length=1000, description="Research query")

class ChatResponse(BaseModel):
    session_id: int
    result: str
    status: str = "success"
    message: Optional[str] = None

@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, db=Depends(get_db)):
    try:
        # Get or create user
        user = db.query(models.User).filter(models.User.id == request.user_id).first()
        if not user:
            user = models.User(
                id=request.user_id,
                name=f"User {request.user_id}",
                email=f"user{request.user_id}@example.com"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Create research session
        session = models.ResearchSession(user_id=request.user_id, query=request.query)
        db.add(session)
        db.commit()
        db.refresh(session)

        # Build and execute research graph
        graph, initial_state = build_research_graph(db, request.user_id, request.query)
        initial_state["session_id"] = session.id
        
        result = graph.invoke(initial_state)
        summary = result.get("summary", "")
        
        if not summary:
            logger.warning(f"No summary generated for session {session.id}")
            summary = "Research completed but no summary was generated."

        return ChatResponse(
            session_id=session.id,
            result=summary,
            status="success",
            message="Research completed successfully"
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        # If we have a session, mark it with error
        try:
            if 'session' in locals():
                error_msg = models.Message(
                    session_id=session.id,
                    content=f"Error: {str(e)}",
                    role="system"
                )
                db.add(error_msg)
                db.commit()
        except:
            pass
        
        raise HTTPException(
            status_code=500,
            detail=f"Research processing failed: {str(e)}"
        )
