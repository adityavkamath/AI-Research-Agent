from fastapi import APIRouter, Depends
from pydantic import BaseModel
from workflows.research_graph import build_research_graph
from db.session import get_db
from db import models

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: int
    query: str

@router.post("/chat")
def chat(request: ChatRequest, db=Depends(get_db)):
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

    session = models.ResearchSession(user_id=request.user_id, query=request.query)
    db.add(session)
    db.commit()
    db.refresh(session)

    graph, initial_state = build_research_graph(db, request.user_id, request.query)

    initial_state["session_id"] = session.id
    
    result = graph.invoke(initial_state)

    return {"session_id": session.id, "result": result.get("summary", "")}
