import warnings
# Suppress BeautifulSoup parser warnings from third-party libraries
warnings.filterwarnings("ignore", message=".*looks like you're parsing an HTML document with an XML parser.*", category=UserWarning)
warnings.filterwarnings("ignore", message=".*No parser was explicitly specified.*", category=UserWarning)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import routes_chat, routes_history

app = FastAPI(
    title="AI Research Orchestrator",
    description="A sophisticated AI-powered research orchestrator using LangChain and LangGraph",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_chat.router, prefix="/api", tags=["chat"])
app.include_router(routes_history.router, prefix="/api", tags=["history"])

@app.get("/")
def root():
    return {
        "message": "AI Research Orchestrator API running",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "message": "API is running properly"
    }
