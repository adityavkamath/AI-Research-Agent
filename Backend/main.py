from fastapi import FastAPI
from api import routes_chat, routes_history

app = FastAPI(title="AI Research Orchestrator")

app.include_router(routes_chat.router, prefix="/api", tags=["chat"])
app.include_router(routes_history.router, prefix="/api", tags=["history"])

@app.get("/")
def root():
    return {"message": "AI Research Orchestrator API running"}
