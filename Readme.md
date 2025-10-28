# 🧠 AI Research Agent

A sophisticated AI-powered research orchestrator that leverages LangChain, LangGraph, and multiple data sources to provide comprehensive research summaries with built-in quality control.

## ✨ Features

- **Multi-Source Research**: Integrates ArXiv, Wikipedia, and DuckDuckGo search
- **AI-Powered Analysis**: Uses advanced language models for content summarization
- **Quality Control**: Built-in validation and filtering mechanisms
- **Session Management**: Persistent chat history and research sessions
- **Modern UI**: Clean React interface with Tailwind CSS
- **RESTful API**: FastAPI backend with comprehensive endpoints

## 🏗️ Architecture

```
AI Research Agent/
├── Backend/                 # FastAPI server
│   ├── api/                # API routes and endpoints
│   ├── core/               # Configuration and utilities
│   ├── db/                 # Database models and sessions
│   ├── migrations/         # Database migrations
│   ├── services/           # Business logic services
│   └── workflows/          # LangGraph research workflows
└── Frontend/               # React application
    ├── src/
    │   ├── components/     # UI components
    │   ├── hooks/          # Custom React hooks
    │   ├── services/       # API clients
    │   └── utils/          # Helper functions
    └── public/             # Static assets
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL
- OpenAI API key

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/adityavkamath/AI-Research-Agent.git
   cd AI-Research-Agent/Backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Database setup**
   ```bash
   alembic upgrade head
   ```

6. **Start the server**
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd ../Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the Backend directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/research_agent

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# API Configuration
API_HOST=localhost
API_PORT=8000
DEBUG=true
```

## 📡 API Endpoints

### Chat & Research
- `POST /api/chat` - Start research conversation
- `GET /api/chat/status/{session_id}` - Check research status

### History Management
- `GET /api/history/sessions` - List all sessions
- `GET /api/history/{session_id}` - Get session details
- `DELETE /api/history/{session_id}` - Delete session

## 🛠️ Development

### Backend Structure

- **`workflows/`** - LangGraph research orchestration
- **`services/`** - Core business logic (retrieval, summarization, persistence)
- **`api/`** - FastAPI route handlers
- **`db/`** - SQLAlchemy models and database configuration

### Frontend Structure

- **`components/`** - Reusable UI components
- **`hooks/`** - Custom React hooks for research functionality
- **`services/`** - API integration layer

### Running Tests

```bash
# Backend tests
cd Backend
pytest

# Frontend tests
cd Frontend
npm test
```

## 📚 Technologies Used

### Backend
- **FastAPI** - Modern Python web framework
- **LangChain** - LLM application framework
- **LangGraph** - Workflow orchestration
- **SQLAlchemy** - ORM and database toolkit
- **Alembic** - Database migrations
- **PostgreSQL** - Primary database

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Framer Motion** - Animation library

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

