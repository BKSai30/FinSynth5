# 🚀 FinSynth - AI-Powered Financial Forecasting Platform

A complete AI-powered financial forecasting platform built with modern technologies. This is a production-ready system with both backend and frontend components, featuring Supabase integration and streamlined architecture.

## 🎯 **What This Is**

FinSynth is an enterprise-grade financial forecasting platform that:
- **Converts natural language queries** into structured financial forecasts
- **Uses AI (OpenAI GPT-4)** for query parsing and knowledge retrieval
- **Performs pure Python calculations** for accurate financial modeling
- **Provides real-time updates** via WebSocket connections
- **Generates professional Excel reports** with FastAPI background tasks
- **Offers a beautiful, responsive dashboard** for data visualization
- **Uses Supabase** for authentication, database, and real-time features

## 🏗️ **Complete Architecture**

### **Backend (FastAPI + Python)**
- ✅ **FastAPI** with async/await for high performance
- ✅ **Supabase** for database, authentication, and real-time features
- ✅ **OpenAI API** integration with structured prompts
- ✅ **FastAPI BackgroundTasks** for Excel generation (no Redis/Celery needed)
- ✅ **Socket.IO** for real-time WebSocket communication
- ✅ **Supabase Auth** for secure user authentication
- ✅ **SQLModel** for type-safe database operations

### **Frontend (Next.js + React)**
- ✅ **Next.js 14** with App Router and TypeScript
- ✅ **Shadcn/ui** component library with Radix UI
- ✅ **Tailwind CSS** for modern, responsive styling
- ✅ **Zustand** for state management
- ✅ **TanStack Query** for server state synchronization
- ✅ **Socket.IO Client** for real-time updates
- ✅ **Recharts** for beautiful data visualizations
- ✅ **Supabase Auth** for user authentication

## 📁 **Project Structure**

```
FinSynth/
├── backend/                    # FastAPI Backend
│   ├── core/                   # Configuration & database
│   │   ├── config.py          # Pydantic settings
│   │   ├── database.py        # Supabase client
│   │   ├── auth.py            # Supabase authentication
│   │   └── socketio.py        # WebSocket server
│   ├── models/                # Database models
│   │   └── forecast.py        # SQLModel tables
│   ├── services/              # Business logic
│   │   ├── knowledge_service.py    # RAG pipeline
│   │   ├── query_parser.py         # OpenAI integration
│   │   ├── vector_service.py       # Vector operations
│   │   ├── background_tasks.py     # Excel generation
│   │   └── calculators/            # Financial engines
│   ├── routers/               # API endpoints
│   │   └── forecast.py        # Forecast routes
│   └── main.py                # FastAPI application
├── frontend/                   # Next.js Frontend
│   ├── app/                   # App Router pages
│   ├── components/            # React components
│   │   ├── features/          # Feature components
│   │   ├── layout/            # Layout components
│   │   └── ui/                # UI component library
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities & stores
│   │   └── supabase.ts        # Supabase client
│   ├── services/              # API services
│   └── types/                 # TypeScript types
├── components/                # Shared UI components
├── lib/                       # Shared utilities
├── requirements.txt           # Python dependencies
├── package.json               # Node.js dependencies
├── .env                       # Environment variables
└── supabase-schema.sql        # Database schema
```

## 🚀 **Quick Start**

### **Prerequisites**
- Python 3.12+
- Node.js 18+
- Supabase account
- OpenAI API key

### **Setup Steps**

1. **Clone and Install Dependencies**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
npm install
```

2. **Configure Environment**
```bash
# Copy environment template
cp env.example .env

# Edit .env with your API keys:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_KEY
# - SUPABASE_JWT_SECRET
# - OPENAI_API_KEY
```

3. **Set Up Database**
- Go to your Supabase dashboard
- Navigate to SQL Editor
- Run the SQL from `supabase-schema.sql`

4. **Start the Application**
```bash
# Backend (Terminal 1)
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

# Frontend (Terminal 2)
npm run dev
```

5. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🧠 **AI-Powered Features**

### **Natural Language Processing**
- **Input**: "Show me revenue for the next 12 months if we increase marketing spend by 20%"
- **Output**: Structured JSON with intent, parameters, and assumption overrides
- **Processing**: OpenAI GPT-4 with custom prompts for financial domain

### **Retrieval-Augmented Generation (RAG)**
- **Knowledge Base**: Vectorized financial model knowledge
- **Semantic Search**: Vector search for finding relevant context
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
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key
SUPABASE_JWT_SECRET=your-supabase-jwt-secret

# OpenAI API
OPENAI_API_KEY=your-openai-api-key-here

# Frontend Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

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

### **Environment Setup**
- Use strong `JWT_SECRET`
- Set `DEBUG=false`
- Configure production database URLs
- Set up AWS S3 for Excel storage
- Configure proper CORS origins

## 🔮 **Advanced Features**

### **Real-time Processing**
- **WebSocket Updates**: Live progress during forecast generation
- **Background Tasks**: Excel generation with FastAPI BackgroundTasks
- **Progress Tracking**: Real-time progress bars and status updates

### **Excel Report Generation**
- **Professional Formatting**: Multiple sheets with styling
- **Summary Sheet**: Key metrics and overview
- **Monthly Data**: Detailed breakdown by month
- **Assumptions Sheet**: All parameters used
- **Cloud Storage**: S3 or local storage for generated reports

### **Supabase Integration**
- **Authentication**: Built-in user management and JWT tokens
- **Database**: PostgreSQL with real-time subscriptions
- **Row Level Security**: Secure data access policies
- **Real-time**: Live updates across all connected clients

## 📚 **Documentation**

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
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

- **Advanced Analytics**: More sophisticated financial models
- **Multi-tenant Support**: Multiple organizations
- **API Rate Limiting**: Production-grade API management
- **Monitoring**: OpenTelemetry and logging
- **Enhanced UI**: More interactive dashboard features
- **Mobile App**: React Native mobile application

## 🚀 **Key Benefits of This Architecture**

- **Simplified Setup**: No Redis or Celery configuration needed
- **Built-in Auth**: Supabase handles user management
- **Real-time**: Live updates across all clients
- **Scalable**: Supabase handles database scaling
- **Modern Stack**: Latest technologies and best practices
- **Production Ready**: Secure, performant, and maintainable

**Ready to transform financial planning with AI! 🚀**