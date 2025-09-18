# 🚀 FinSynth - AI-Powered Financial Forecasting Platform

A complete AI-powered financial forecasting platform that converts natural language queries into structured financial forecasts. Built with modern technologies and featuring persistent user storage, file upload capabilities, and intelligent AI insights.

## 🎯 **What This Is**

FinSynth is a production-ready financial forecasting platform that:
- **Converts natural language queries** into structured financial forecasts
- **Uses multiple AI services** (OpenAI GPT-4, Anthropic Claude) with intelligent fallbacks
- **Performs pure Python calculations** for accurate financial modeling
- **Supports persistent user storage** with file-based database
- **Allows JSON file uploads** for custom company data
- **Provides intelligent AI insights** with rule-based fallbacks
- **Offers a beautiful, responsive dashboard** with modern UI/UX
- **Supports dark/light mode** with smooth transitions
- **Features secure authentication** with persistent login sessions

## 🏗️ **Complete Architecture**

### **Backend (FastAPI + Python)**
- ✅ **FastAPI** with async/await for high performance
- ✅ **File-based persistent storage** for user data and company information
- ✅ **Multiple AI services** (OpenAI GPT-4, Anthropic Claude) with fallbacks
- ✅ **File upload support** for JSON company data
- ✅ **Secure authentication** with password hashing
- ✅ **Advanced query parsing** with regex patterns for business scenarios
- ✅ **Financial Calculation Engines** for accurate modeling
- ✅ **Intelligent AI insights** with rule-based fallbacks

### **Frontend (Next.js + React)**
- ✅ **Next.js 14** with App Router and TypeScript
- ✅ **Tailwind CSS** for modern, responsive styling
- ✅ **File upload interface** for JSON company data
- ✅ **Persistent login sessions** with localStorage
- ✅ **Dark/Light Mode** with smooth transitions
- ✅ **Responsive design** for all devices
- ✅ **Professional UI/UX** with modern components

## 📁 **Project Structure**

```
FinSynth/
├── backend/                    # FastAPI Backend
│   ├── simple_main.py         # Main FastAPI application
│   ├── core/                  # Configuration & database
│   │   ├── config.py         # Pydantic settings
│   │   ├── database.py       # Database client
│   │   └── auth.py           # Authentication utilities
│   ├── models/               # Database models
│   ├── routers/              # API endpoints
│   ├── services/             # Business logic
│   │   ├── calculators/      # Financial engines
│   │   └── knowledge_service.py  # AI integration
│   └── tests/                # Test files
├── app/                      # Next.js Frontend (App Router)
│   ├── page.tsx             # Homepage
│   ├── login/               # Authentication pages
│   ├── forecast/            # Forecasting interface
│   ├── components/          # React components
│   │   ├── ui/             # UI component library
│   │   ├── features/       # Feature components
│   │   └── layout/         # Layout components
│   ├── lib/                # Utilities
│   │   └── utils.ts        # Utility functions
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   └── types/              # TypeScript types
├── components/             # Shared components
├── public/                # Static assets
├── requirements.txt       # Python dependencies
├── package.json          # Node.js dependencies
├── users_data.json       # Persistent user storage (auto-generated)
├── sample_company_data.json  # Sample data file
├── .gitignore           # Git ignore rules
└── README.md           # This file
```

## 🚀 **Quick Start**

### **Prerequisites**
- Python 3.10+ (recommended: Python 3.12)
- Node.js 18+
- OpenAI API key (optional - has fallbacks)
- Anthropic Claude API key (optional - has fallbacks)

### **Setup Steps**

#### 1. **Clone and Navigate**
```bash
cd FinSynth
```

#### 2. **Backend Setup**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install additional dependencies for file uploads
pip install python-multipart
```

#### 3. **Frontend Setup**
```bash
# Install Node.js dependencies
npm install
```

#### 4. **Environment Configuration (Optional)**
```bash
# Create .env file with your API keys (optional - has fallbacks)
# OPENAI_API_KEY=your-openai-api-key
# ANTHROPIC_API_KEY=your-anthropic-api-key
```

#### 5. **Start the Application**

**Terminal 1 - Backend:**
```bash
# Start FastAPI server
python backend/simple_main.py
```

**Terminal 2 - Frontend:**
```bash
# Start Next.js development server
npm run dev
```

#### 6. **Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs
- **Debug Users**: http://localhost:8001/api/v1/debug/users

## 🧠 **AI-Powered Features**

### **Natural Language Processing**
- **Input**: "Show me revenue for the next 12 months if we increase marketing spend by 20%"
- **Output**: Structured JSON with intent, parameters, and assumption overrides
- **Processing**: Multiple AI services with intelligent fallbacks

### **Advanced Query Understanding**
- **Business Models**: SaaS, Enterprise, E-commerce, Startup scenarios
- **Time Periods**: Months, years, quarterly, annual forecasts
- **Growth Scenarios**: Percentage increases, cost reductions, revenue targets
- **Optimization**: Revenue optimization, cost cutting, efficiency improvements

### **Financial Models**
- **Large Customer Model**: ARPU $16,500, sales team growth, deal closure rates
- **SMB Customer Model**: ARPU $500, marketing spend, CAC, conversion rates
- **Pure Python Calculations**: All calculations performed by deterministic functions
- **Growth Multipliers**: Customer growth, revenue optimization, expense reduction

### **Intelligent AI Insights**
- **Multiple AI Services**: OpenAI GPT-4, Anthropic Claude with fallbacks
- **Rule-based Fallbacks**: Smart insights when AI services are unavailable
- **Context-aware Analysis**: Tailored insights based on user queries
- **Actionable Recommendations**: Business advice based on forecast results

## 🔧 **Key Features**

### **Persistent User Storage**
- **File-based Database**: Users stored in `users_data.json`
- **Secure Authentication**: Password hashing with salt
- **Session Persistence**: Login survives server restarts
- **Company Data Storage**: User-specific financial data

### **File Upload System**
- **JSON File Upload**: Upload custom company data
- **Data Validation**: Ensures proper JSON format
- **Automatic Integration**: Uploaded data used in forecasting
- **Override Capability**: Replace existing company data

### **Enhanced Forecasting**
- **Smart Query Parsing**: Understands business context
- **Accurate Predictions**: Based on uploaded company data
- **Multiple Scenarios**: Different business models supported
- **Professional Insights**: AI-generated business recommendations

## 📊 **API Endpoints**

### **Authentication**
- `POST /api/v1/auth/register` - User registration with company data
- `POST /api/v1/auth/login` - User login with persistent sessions
- `GET /api/v1/auth/company-data` - Get user's company data

### **Forecasting**
- `POST /api/v1/forecast` - Create new forecast with AI insights
- `GET /api/v1/forecast/{id}` - Get specific forecast

### **File Management**
- `POST /api/v1/upload-company-data` - Upload JSON company data file

### **Debug & Monitoring**
- `GET /api/v1/debug/users` - View stored users (development only)

### **Example API Usage**

```bash
# Register a new user
curl -X POST "http://localhost:8001/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "full_name": "John Doe",
    "company_name": "TechCorp",
    "company_data": {
      "revenue": 100000,
      "expenses": 60000,
      "customers": 50
    }
  }'

# Create a forecast
curl -X POST "http://localhost:8001/api/v1/forecast" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What will be my revenue in the next 6 months if I increase my customer base by 20%",
    "company_data": {
      "revenue": 100000,
      "expenses": 60000,
      "customers": 50
    }
  }'

# Response
{
  "query_id": 4872,
  "status": "completed",
  "assumptions_used": {
    "forecast_period_months": 6,
    "customer_growth_multiplier": 1.2,
    "large_avg_revenue_per_user": 16500,
    "smb_avg_revenue_per_user": 500
  },
  "forecast_data": [...],
  "summary": {
    "final_monthly_revenue": 1112700,
    "final_monthly_profit": 980220,
    "final_total_customers": 173,
    "total_profit": 3517020
  },
  "ai_insights": "Strong revenue growth projected to $1,112,700 monthly by month 6. Excellent profit margin of 88.1% indicates strong operational efficiency."
}
```

### **Sample Company Data JSON Format**

```json
{
  "revenue": 250000,
  "expenses": 150000,
  "customers": 120,
  "company_name": "TechCorp Solutions",
  "industry": "Technology",
  "business_model": "SaaS",
  "monthly_recurring_revenue": 45000,
  "customer_acquisition_cost": 800,
  "lifetime_value": 2500,
  "churn_rate": 0.05,
  "growth_rate": 0.15,
  "employees": 25,
  "founded_year": 2020,
  "target_market": "Enterprise",
  "key_metrics": {
    "monthly_active_users": 5000,
    "conversion_rate": 0.12,
    "average_deal_size": 15000,
    "sales_cycle_days": 90
  }
}
```

## 🎨 **Frontend Features**

### **Interactive Dashboard**
- **Modern Homepage** with professional design
- **Natural Language Query Input** with AI processing
- **File Upload Interface** for JSON company data
- **Real-time Progress Updates** during processing
- **Data Visualization** with comprehensive forecast tables
- **Responsive Design** for all devices
- **Dark/Light Mode** with smooth transitions

### **User Experience**
- **Persistent Login Sessions** with localStorage
- **Secure Authentication** with password protection
- **Company Data Management** with upload capabilities
- **Professional UI/UX** with modern components
- **Error Handling** with user-friendly messages

## 🔧 **Configuration**

### **Environment Variables (Optional)**

```bash
# AI Services (Optional - has fallbacks)
OPENAI_API_KEY=your-openai-api-key-here
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Application Settings
DEBUG=true
ENVIRONMENT=development
```

**Note**: The application works without any environment variables as it has intelligent fallbacks for all AI services and uses file-based storage instead of external databases.

### **Supported Query Types**
- **Revenue Forecasting**: "What will be my revenue in the next 6 months?"
- **Growth Scenarios**: "If I increase my customer base by 20%"
- **Business Model Analysis**: "SaaS business model with $2M target"
- **Cost Optimization**: "Reduce costs by 15% over the next year"
- **Marketing Analysis**: "With $50,000 monthly marketing budget"

### **Example Queries**
- "What will be my revenue in the next 6 months if I increase my customer base by 20%"
- "I want to reach $2M revenue in 2 years with a SaaS business model"
- "Optimize my business and reduce costs by 15% over the next year"
- "What if I increase marketing spend by 20%?"
- "Forecast revenue for the next 12 months with 100% customer growth"

## 🧪 **Testing**

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📈 **Production Deployment**

### **Environment Setup**
- Use strong `JWT_SECRET`
- Set `DEBUG=false`
- Configure production database URLs
- Set up proper CORS origins

## 🔮 **Advanced Features**

### **3D Animations**
- **Three.js Integration** with React Three Fiber
- **Animated Spheres** with distortion effects
- **Floating Elements** with smooth animations
- **Interactive Controls** with OrbitControls

### **Modern UI/UX**
- **Glass Morphism Effects** with backdrop blur
- **Gradient Text** and button effects
- **Smooth Transitions** with Framer Motion
- **Responsive Grid Layouts**
- **Professional Color Schemes**

### **Supabase Integration**
- **Authentication** with built-in user management
- **Database** with PostgreSQL and real-time subscriptions
- **Row Level Security** for secure data access
- **Real-time Updates** across all connected clients

## 📚 **Documentation**

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Three.js Documentation](https://threejs.org/docs/)
- [Framer Motion](https://www.framer.com/motion/)
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
- **Hackathon Ready**: Complete working solution with professional UI

## 🏆 **Production-Ready Features**

- ✅ **Complete Working Solution** - Ready for production use
- ✅ **Professional UI/UX** - Modern design with dark/light mode
- ✅ **AI Integration** - Multiple AI services with intelligent fallbacks
- ✅ **Persistent Storage** - File-based user database
- ✅ **File Upload System** - JSON company data upload
- ✅ **Secure Authentication** - Password hashing and session management
- ✅ **Responsive Design** - Works on all devices
- ✅ **Smart Query Parsing** - Understands business context
- ✅ **Comprehensive Documentation** - Easy setup and deployment
- ✅ **No External Dependencies** - Works without databases or external services

**Ready to transform financial planning with AI! 🚀**

## 🆘 **Troubleshooting**

### **Common Issues**

1. **Backend won't start**
   - Ensure Python 3.10+ is installed
   - Install dependencies: `pip install -r requirements.txt`
   - Install file upload support: `pip install python-multipart`

2. **Frontend build errors**
   - Run `npm install` to ensure all dependencies are installed
   - Clear Next.js cache: `rm -rf .next`
   - Check Node.js version (18+ required)

3. **Login not working**
   - Check if `users_data.json` file exists
   - Verify user was registered successfully
   - Check browser console for errors

4. **File upload not working**
   - Ensure file is valid JSON format
   - Check file size (should be reasonable)
   - Verify user is logged in

5. **AI insights not working**
   - Check if API keys are set in environment variables
   - System will use fallback insights if AI services fail
   - Check console logs for specific error messages

### **Getting Help**

- Check the [FastAPI Documentation](https://fastapi.tiangolo.com/)
- Review the [Next.js Documentation](https://nextjs.org/docs)
- Check the [OpenAI API Documentation](https://platform.openai.com/docs)
- Open an issue in the repository

### **Debug Endpoints**

- **View Users**: http://localhost:8001/api/v1/debug/users
- **API Documentation**: http://localhost:8001/docs

**Happy coding! 🎉**
#   F i n S y n t h  
 