# 🚀 ASF - Autonomous Strategic Finance

A complete AI-powered financial forecasting platform built according to the comprehensive PRD specifications. This is a production-ready system with both backend and frontend components.

## 🎯 **What This Is**

ASF is an enterprise-grade financial forecasting platform that:
- **Converts natural language queries** into structured financial forecasts
- **Uses AI (OpenAI GPT-4)** for query parsing and knowledge retrieval
- **Performs pure Python calculations** for accurate financial modeling
- **Provides real-time updates** via WebSocket connections
- **Generates professional Excel reports** with background processing
- **Offers a beautiful, responsive dashboard** for data visualization

## 🏗️ **Complete Architecture**

### **Backend (FastAPI + Python)**
- ✅ **FastAPI** with async/await for high performance
- ✅ **PostgreSQL** with pgvector for semantic search
- ✅ **OpenAI API** integration with structured prompts
- ✅ **Redis** for caching and Celery message broker
- ✅ **Celery** for background Excel generation
- ✅ **Socket.IO** for real-time WebSocket communication
- ✅ **JWT Authentication** with secure token handling
- ✅ **SQLModel** for type-safe database operations

### **Frontend (Next.js + React)**
- ✅ **Next.js 14** with App Router and TypeScript
- ✅ **Shadcn/ui** component library with Radix UI
- ✅ **Tailwind CSS** for modern, responsive styling
- ✅ **Zustand** for state management
- ✅ **TanStack Query** for server state synchronization
- ✅ **Socket.IO Client** for real-time updates
- ✅ **Recharts** for beautiful data visualizations
- ✅ **NextAuth.js** ready for authentication

## 📁 **Project Structure**

```
finsynth-dashboard/
├── backend/                    # FastAPI Backend
│   ├── core/                   # Configuration & database
│   │   ├── config.py          # Pydantic settings
│   │   ├── database.py        # Async SQLAlchemy
│   │   ├── auth.py            # JWT authentication
│   │   └── socketio.py        # WebSocket server
│   ├── models/                # Database models
│   │   └── forecast.py        # SQLModel tables
│   ├── services/              # Business logic
│   │   ├── knowledge_service.py    # RAG pipeline
│   │   ├── query_parser.py         # OpenAI integration
│   │   ├── vector_service.py       # pgvector operations
│   │   └── calculators/            # Financial engines
│   ├── routers/               # API endpoints
│   │   └── forecast.py        # Forecast routes
│   ├── workers/               # Background tasks
│   │   ├── celery_app.py      # Celery configuration
│   │   └── tasks.py           # Excel generation
│   └── main.py                # FastAPI application
├── frontend/                   # Next.js Frontend
│   ├── app/                   # App Router pages
│   ├── components/            # React components
│   │   ├── features/          # Feature components
│   │   ├── layout/            # Layout components
│   │   └── ui/                # UI component library
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities & stores
│   ├── services/              # API services
│   └── types/                 # TypeScript types
├── docker-compose.yml         # Development environment
├── Dockerfile.backend         # Backend container
├── Dockerfile.frontend        # Frontend container
└── requirements.txt           # Python dependencies
```

## 🚀 **Quick Start**

### **Option 1: Docker Compose (Recommended)**

```bash
# Clone and setup
git clone <repository>
cd finsynth-dashboard

# Create environment file
cp .env.example .env
# Edit .env with your OpenAI API key

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### **Option 2: Local Development**

```bash
# Backend setup
cd backend
pip install -r requirements.txt
python -m backend.main

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev

# Celery worker (new terminal)
celery -A backend.workers.celery_app worker --loglevel=info
```

## 🧠 **AI-Powered Features**

### **Natural Language Processing**
- **Input**: "Show me revenue for the next 12 months if we increase marketing spend by 20%"
- **Output**: Structured JSON with intent, parameters, and assumption overrides
- **Processing**: OpenAI GPT-4 with custom prompts for financial domain

### **Retrieval-Augmented Generation (RAG)**
- **Knowledge Base**: Vectorized financial model knowledge
- **Semantic Search**: pgvector for finding relevant context
- **Context Injection**: Relevant knowledge injected into LLM prompts

### **Pure Python Calculations**
- **Large Customer Model**: ARPU $16,667, onboarding ramp, 5% growth, 2% churn
- **SMB Customer Model**: ARPU $5,000, marketing spend, CAC, conversion rates
- **No LLM Math**: All calculations performed by deterministic Python functions

## 📊 **API Endpoints**

### **Core Endpoints**
- `GET /` - API information
- `GET /health` - Health check with system status
- `GET /docs` - Interactive Swagger documentation

### **Forecast Endpoints**
- `POST /api/v1/forecast/` - Create new forecast
- `GET /api/v1/forecast/{id}` - Get specific forecast
- `GET /api/v1/forecast/` - List recent forecasts

### **Example API Usage**

```bash
# Create a forecast
curl -X POST "http://localhost:8000/api/v1/forecast/" \
  -H "Content-Type: application/json" \
  -d '{"query": "Show me revenue for the next 12 months"}'

# Response
{
  "query_id": 1,
  "status": "completed",
  "result": {
    "forecast_type": "total_revenue",
    "timeframe_months": 12,
    "monthly_data": [...],
    "summary": {
      "total_revenue": 1026203,
      "large_customer_revenue": 615722,
      "smb_customer_revenue": 410481
    }
  },
  "assumptions_used": {...}
}
```

## 🎨 **Frontend Features**

### **Interactive Dashboard**
- **Query Input**: Natural language financial queries
- **Real-time Progress**: WebSocket updates during processing
- **Data Visualization**: Multiple chart types (line, bar, area)
- **Export Functionality**: Download Excel reports
- **Responsive Design**: Works on desktop and mobile

### **State Management**
- **Zustand Store**: Global state for forecasts and UI
- **TanStack Query**: Server state synchronization and caching
- **Real-time Updates**: Socket.IO client for live progress

### **Component Architecture**
- **Feature Components**: QueryInput, ForecastTable, ForecastChart
- **Layout Components**: Header, Navigation, Sidebar
- **UI Components**: Complete shadcn/ui component library

## 🔧 **Configuration**

### **Environment Variables**

```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/asf_db

# OpenAI API
OPENAI_API_KEY=your-openai-api-key-here

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT Authentication
JWT_SECRET=your-secret-key-change-in-production

# Application
DEBUG=true
ENVIRONMENT=development
```

### **Supported Query Types**
- `forecast_total_revenue` - Combined large + SMB revenue
- `forecast_large_revenue` - Enterprise customer revenue only
- `forecast_smb_revenue` - Small/medium business revenue only
- `explain_assumptions` - Return current assumptions

### **Example Queries**
- "Show me revenue for the next 6 months"
- "What if we increase marketing spend by 20%?"
- "Forecast large customer revenue for 18 months"
- "Explain the current assumptions"

## 🧪 **Testing**

```bash
# Backend tests
cd backend
pytest
pytest --cov=backend

# Frontend tests
cd frontend
npm test
npm run test:coverage
```

## 📈 **Production Deployment**

### **Docker Deployment**
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale celery-worker=3
```

### **Environment Setup**
- Use strong `JWT_SECRET`
- Set `DEBUG=false`
- Configure production database URLs
- Set up AWS S3 for Excel storage
- Configure proper CORS origins

## 🔮 **Advanced Features**

### **Real-time Processing**
- **WebSocket Updates**: Live progress during forecast generation
- **Background Tasks**: Excel generation with Celery workers
- **Progress Tracking**: Real-time progress bars and status updates

### **Excel Report Generation**
- **Professional Formatting**: Multiple sheets with styling
- **Summary Sheet**: Key metrics and overview
- **Monthly Data**: Detailed breakdown by month
- **Assumptions Sheet**: All parameters used
- **S3 Storage**: Cloud storage for generated reports

### **Vector Search**
- **Knowledge Base**: Vectorized financial model knowledge
- **Semantic Search**: Find relevant context for queries
- **RAG Pipeline**: Enhanced AI responses with business context

## 📚 **Documentation**

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Recharts](https://recharts.org/)
- [OpenAI API](https://platform.openai.com/docs)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 **What's Next?**

This implementation provides a complete, production-ready foundation for AI-powered financial forecasting. The system is designed to scale and can be extended with:

- **User Authentication**: NextAuth.js integration
- **Advanced Analytics**: More sophisticated financial models
- **Multi-tenant Support**: Multiple organizations
- **API Rate Limiting**: Production-grade API management
- **Monitoring**: OpenTelemetry and logging
- **Caching**: Redis caching strategies

**Ready to transform financial planning with AI! 🚀**