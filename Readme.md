# 🧠 AI Research Agent

A sophisticated AI-powered research orchestrator that leverages LangChain, LangGraph, and multiple data sources to provide comprehensive research summaries with built-in quality control.

## 🌟 Features

- **Multi-Source Research**: Automatically retrieves information from ArXiv, Wikipedia, and web search
- **Intelligent Summarization**: Uses OpenAI's GPT models to create concise, focused summaries
- **Quality Control**: Built-in critic agent to review and validate research outputs
- **Persistent Storage**: PostgreSQL database for session management and conversation history
- **Interactive Frontend**: Clean Streamlit interface for easy interaction
- **Workflow Orchestration**: LangGraph-powered research pipeline with error handling
- **RESTful API**: FastAPI backend with comprehensive endpoints

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Streamlit     │    │   FastAPI       │    │   PostgreSQL    │
│   Frontend      │◄──►│   Backend       │◄──►│   Database      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   LangGraph     │
                    │   Workflow      │
                    └─────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌─────────────┐    ┌─────────────┐
            │  Retriever  │    │ Summarizer  │
            │   Agent     │    │   Agent     │
            └─────────────┘    └─────────────┘
                    │                   │
                    ▼                   ▼
            ┌─────────────┐    ┌─────────────┐
            │   Sources   │    │   OpenAI    │
            │ • ArXiv     │    │    GPT      │
            │ • Wikipedia │    │             │
            │ • Web       │    │             │
            └─────────────┘    └─────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- PostgreSQL database
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adityavkamath/AI-Research-Agent.git
   cd AI-Research-Agent
   ```

2. **Set up Python environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   # Backend dependencies
   cd Backend
   pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic
   pip install langchain langchain-openai langchain-community
   pip install langgraph
   
   # Optional: for additional data sources
   pip install arxiv wikipedia duckduckgo-search
   
   # Frontend dependencies
   cd ../Frontend
   pip install streamlit requests
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file in Backend directory
   cat > Backend/.env << EOF
   DATABASE_URL=postgresql://username:password@localhost:5432/research_agent
   OPENAI_API_KEY=your_openai_api_key_here
   EOF
   ```

5. **Set up database**
   ```bash
   cd Backend
   # Run migrations
   alembic upgrade head
   ```

6. **Start the backend**
   ```bash
   cd Backend
   python -m uvicorn main:app --reload
   ```

7. **Start the frontend** (in a new terminal)
   ```bash
   cd Frontend
   streamlit run streamlit_app.py
   ```

8. **Access the application**
   - Frontend: http://localhost:8501
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `OPENAI_API_KEY` | OpenAI API key for summarization | Required |
| `API_BASE` | Backend API URL (frontend) | `http://127.0.0.1:8000` |
| `UI_USER_ID` | Default user ID (frontend) | `1` |

### Database Configuration

The application uses PostgreSQL with the following tables:
- `users`: User management
- `research_sessions`: Research session tracking
- `messages`: Conversation history
- `summaries`: Research summaries

## 📖 Usage

### Web Interface

1. **Start a Research Session**
   - Enter your research query in the input field
   - Click "Run research 🚀"
   - Wait for the workflow to complete

2. **View Results**
   - See the AI-generated summary on the right panel
   - Browse conversation history in the main chat area
   - Switch between different research sessions in the sidebar

3. **Manage Sessions**
   - Click on session buttons in the sidebar to switch contexts
   - Each session maintains its own conversation history
   - Summaries are automatically saved

### API Usage

#### Start a Research Session
```bash
curl -X POST "http://localhost:8000/api/chat" \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": 1,
       "query": "Applications of RAG in healthcare"
     }'
```

#### Get User History
```bash
curl "http://localhost:8000/api/history/1"
```

## 🔄 Workflow Details

The research workflow follows these steps:

1. **Fetch Papers** (`fetch_papers_node`)
   - Retrieves information from ArXiv, Wikipedia, and web sources
   - Handles source failures gracefully
   - Returns structured data from multiple sources

2. **Summarize** (`summarize_node`)
   - Combines retrieved information into coherent text
   - Uses OpenAI GPT models for intelligent summarization
   - Implements chunking for large documents to avoid token limits

3. **Critic Review** (`critic_node`)
   - Evaluates summary quality and accuracy
   - Checks for hallucinations and inconsistencies
   - Can trigger re-summarization if issues are found

4. **Persist Results** (`persistence_node`)
   - Saves user queries, AI responses, and summaries to database
   - Maintains conversation history
   - Enables session management and retrieval

## 🛠️ Development

### Project Structure

```
AI-Research-Agent/
├── Backend/
│   ├── api/                 # FastAPI route handlers
│   │   ├── routes_chat.py   # Chat/research endpoints
│   │   └── routes_history.py # History management
│   ├── core/                # Core configuration
│   │   ├── config.py        # Settings management
│   │   └── utils.py         # Utility functions
│   ├── db/                  # Database layer
│   │   ├── models.py        # SQLAlchemy models
│   │   └── session.py       # Database session management
│   ├── migrations/          # Alembic database migrations
│   ├── services/            # Business logic
│   │   ├── persistence.py   # Data persistence
│   │   ├── retriever.py     # Information retrieval
│   │   └── summarizer.py    # Text summarization
│   ├── workflows/           # LangGraph workflows
│   │   ├── agents.py        # Agent definitions
│   │   ├── nodes.py         # Workflow nodes
│   │   └── research_graph.py # Graph orchestration
│   └── main.py              # FastAPI application
├── Frontend/
│   ├── streamlit_app.py     # Streamlit interface
│   └── requirements.txt     # Frontend dependencies
└── README.md
```

### Adding New Data Sources

1. **Extend the Retriever Service** (`Backend/services/retriever.py`)
   ```python
   def fetch_from_new_source(query: str):
       # Implement your data source logic
       pass
   
   # Add to retrieve_from_sources function
   elif source == "new_source":
       results[source] = fetch_from_new_source(query)
   ```

2. **Update Agent Configuration** (`Backend/workflows/agents.py`)
   ```python
   class RetrieverAgent:
       def run(self, query: str, sources: list[str] = ["arxiv", "wikipedia", "new_source"]):
           return retrieve_from_sources(query, sources)
   ```

### Database Migrations

```bash
# Create a new migration
cd Backend
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Downgrade (if needed)
alembic downgrade -1
```

## 🐛 Troubleshooting

### Common Issues

1. **Token Limit Exceeded**
   - The summarizer automatically chunks large texts
   - Adjust chunk size in `services/summarizer.py` if needed

2. **Missing Dependencies**
   - Install optional packages: `pip install arxiv wikipedia duckduckgo-search`
   - The system gracefully handles missing dependencies

3. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in environment variables
   - Ensure database exists and is accessible

4. **OpenAI API Errors**
   - Verify OPENAI_API_KEY is set correctly
   - Check API quotas and billing
   - Review rate limits

### Debugging

Enable debug logging by adding print statements or using Python's logging module:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📋 API Reference

### Endpoints

#### POST /api/chat
Start a new research session.

**Request:**
```json
{
  "user_id": 1,
  "query": "Research query"
}
```

**Response:**
```json
{
  "session_id": 123,
  "result": "Generated summary"
}
```

#### GET /api/history/{user_id}
Get research history for a user.

**Response:**
```json
[
  {
    "session_id": 123,
    "query": "Research query",
    "created_at": "2025-09-04T10:30:00",
    "messages": [
      {
        "role": "user",
        "content": "Research query",
        "timestamp": "2025-09-04T10:30:00"
      },
      {
        "role": "assistant",
        "content": "AI response",
        "timestamp": "2025-09-04T10:30:30"
      }
    ]
  }
]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [LangChain](https://github.com/langchain-ai/langchain) for the AI framework
- [LangGraph](https://github.com/langchain-ai/langgraph) for workflow orchestration
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [Streamlit](https://streamlit.io/) for the frontend interface
- [OpenAI](https://openai.com/) for the language models

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/adityavkamath/AI-Research-Agent/issues) page
2. Create a new issue with detailed information
3. Include error logs and system information

---

**Built with ❤️ using LangChain, FastAPI, and Streamlit**