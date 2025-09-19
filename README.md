# 🚀 FinSynth - AI-Powered Financial Forecasting Platform

<div align="center">

![FinSynth Logo](https://img.shields.io/badge/FinSynth-AI%20Financial%20Forecasting-blue?style=for-the-badge&logo=chart-line)

**Transform financial planning with AI-powered forecasting that converts natural language queries into structured financial projections.**

[![Python](https://img.shields.io/badge/Python-3.10+-green?style=flat&logo=python)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat&logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat&logo=typescript)](https://typescriptlang.org)

</div>

## 🎯 **What is FinSynth?**

FinSynth is a production-ready AI-powered financial forecasting platform that revolutionizes how businesses plan their financial future. Simply ask questions in natural language, and our AI converts them into comprehensive financial projections with detailed breakdowns.

### **Example Queries:**
- *"Show me revenue for the next 6 months if I increase my customer base by 20%"*
- *"What will be my revenue in 2 years with a SaaS business model?"*
- *"Optimize my business and reduce costs by 15% over the next year"*

## ✨ **Key Features**

### 🤖 **AI-Powered Intelligence**
- **Natural Language Processing**: Convert plain English queries into financial forecasts
- **Multiple AI Services**: OpenAI GPT-4 and Anthropic Claude with intelligent fallbacks
- **Smart Query Parsing**: Understands business context and extracts key parameters
- **Rule-based Fallbacks**: Works even when AI services are unavailable

### 📊 **Comprehensive Financial Modeling**
- **Dual Business Models**: Large Customer (Enterprise) and SMB Customer segments
- **Advanced Calculations**: Pure Python financial engines for accurate modeling
- **Seasonal Analysis**: Industry-specific seasonal patterns (Retail, Technology, Healthcare, etc.)
- **Growth Scenarios**: Customer growth, revenue optimization, cost reduction analysis

### 📈 **Professional Data Visualization**
- **Interactive Charts**: Real-time data visualization with Recharts
- **Detailed Tables**: Month-by-month breakdown of all metrics
- **Export Capabilities**: Excel and PDF report generation
- **Summary Cards**: Key performance indicators at a glance

### 🔐 **Enterprise-Grade Security**
- **Secure Authentication**: Password hashing with salt
- **Persistent Sessions**: Login survives server restarts
- **File-based Storage**: No external database dependencies
- **Supabase Integration**: Optional cloud database support

### 🎨 **Modern User Experience**
- **Responsive Design**: Works perfectly on all devices
- **Dark/Light Mode**: Smooth theme switching
- **Professional UI**: Built with Tailwind CSS and Shadcn/ui
- **Real-time Updates**: WebSocket integration for live progress

## 🏗️ **Architecture Overview**

```
FinSynth/
├── 🎨 Frontend (Next.js + React)
│   ├── Interactive Dashboard
│   ├── Natural Language Query Interface
│   ├── Data Visualization & Charts
│   └── Export & Report Generation
│
├── ⚡ Backend (FastAPI + Python)
│   ├── AI Query Processing
│   ├── Financial Calculation Engines
│   ├── User Authentication
│   └── File Upload & Management
│
└── 🧠 AI Services
    ├── OpenAI GPT-4 Integration
    ├── Anthropic Claude Integration
    └── Intelligent Fallback System
```

## 🚀 **Quick Start**

### **Prerequisites**
- Python 3.10+ (recommended: Python 3.12)
- Node.js 18+
- OpenAI API key (optional - has fallbacks)
- Anthropic Claude API key (optional - has fallbacks)

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/finsynth.git
cd finsynth
```

### **2. Backend Setup**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install additional dependencies for file uploads
pip install python-multipart
```

### **3. Frontend Setup**
```bash
# Install Node.js dependencies
npm install
```

### **4. Environment Configuration (Optional)**
```bash
# Create .env file with your API keys (optional - has fallbacks)
# OPENAI_API_KEY=your-openai-api-key
# ANTHROPIC_API_KEY=your-anthropic-api-key
```

### **5. Start the Application**

**Option A: Use the startup script (Windows)**
```bash
simple-start.bat
```

**Option B: Manual startup**

**Terminal 1 - Backend:**
```bash
python backend/simple_main.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### **6. Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8003
- **API Documentation**: http://localhost:8003/docs

## 📊 **Financial Model Structure**

Our platform uses a sophisticated dual-segment business model:

### **Large Customer Segment (Enterprise)**
- **Sales Team Growth**: Configurable sales team expansion
- **Deal Closure Rate**: Deals per salesperson per month
- **Average Revenue Per User (ARPU)**: $16,500/month
- **Customer Acquisition**: Direct sales approach

### **SMB Customer Segment**
- **Digital Marketing**: Configurable monthly marketing budget
- **Lead Generation**: Marketing spend → leads → conversions
- **Average Revenue Per User (ARPU)**: $500/month
- **Customer Acquisition**: Marketing-driven approach

### **Key Metrics Tracked**
- Sales team headcount and productivity
- Customer acquisition costs (CAC)
- Conversion rates and lead generation
- Monthly recurring revenue (MRR)
- Customer lifetime value (LTV)
- Churn rates and growth multipliers

## 🎨 **User Interface Features**

### **Dashboard**
- **Welcome Screen**: Professional landing page with project overview
- **Login/Registration**: Secure authentication with company data setup
- **Forecasting Interface**: Natural language query input with advanced options

### **Data Management**
- **File Upload**: JSON and Excel file support for company data
- **Data Validation**: Ensures proper data format and structure
- **Company Profiles**: Persistent storage of business information

### **Advanced Options**
- **Industry Selection**: Technology, Retail, Healthcare, Education, etc.
- **Seasonal Analysis**: Industry-specific seasonal pattern adjustments
- **News Impact**: External market factor integration (optional)
- **Growth Scenarios**: Custom growth multipliers and optimization

### **Results & Export**
- **Interactive Charts**: Revenue, customers, and profit visualization
- **Detailed Tables**: Month-by-month breakdown of all metrics
- **Excel Export**: Comprehensive financial projection model
- **PDF Reports**: Professional presentation-ready reports

## 🔧 **API Endpoints**

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
- `GET /health` - Health check endpoint

## 📁 **Project Structure**

```
FinSynth/
├── 📁 app/                          # Next.js Frontend
│   ├── forecast/                    # Forecasting interface
│   ├── login/                       # Authentication pages
│   ├── components/                  # React components
│   │   ├── ui/                     # Shadcn/ui components
│   │   ├── features/               # Feature-specific components
│   │   └── layout/                 # Layout components
│   ├── lib/                        # Utilities and configurations
│   ├── hooks/                      # Custom React hooks
│   └── services/                   # API services
├── 📁 backend/                      # FastAPI Backend
│   ├── simple_main.py              # Main FastAPI application
│   ├── core/                       # Configuration & database
│   │   ├── config.py              # Pydantic settings
│   │   ├── database.py            # Database client
│   │   └── auth.py                # Authentication utilities
│   ├── models/                     # Database models
│   ├── routers/                    # API endpoints
│   ├── services/                   # Business logic
│   │   ├── calculators/           # Financial engines
│   │   └── knowledge_service.py   # AI integration
│   └── tests/                      # Test files
├── 📁 components/                   # Shared components
├── 📁 public/                       # Static assets
├── 📄 Configuration Files
│   ├── package.json               # Node.js dependencies
│   ├── requirements.txt           # Python dependencies
│   ├── tsconfig.json             # TypeScript configuration
│   └── tailwind.config.js        # Tailwind CSS configuration
└── 📄 Documentation
    ├── README.md                  # This file
    └── PROJECT-STRUCTURE.md       # Detailed structure guide
```

## 🧪 **Example Usage**

### **1. Register and Login**
```bash
# Register a new user
curl -X POST "http://localhost:8003/api/v1/auth/register" \
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
```

### **2. Create a Forecast**
```bash
# Create a forecast
curl -X POST "http://localhost:8003/api/v1/forecast" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What will be my revenue in the next 6 months if I increase my customer base by 20%",
    "company_data": {
      "revenue": 100000,
      "expenses": 60000,
      "customers": 50
    }
  }'
```

### **3. Sample Response**
```json
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

## 🎯 **Supported Query Types**

### **Revenue Forecasting**
- *"Show me revenue for the next 6 months"*
- *"What will be my revenue in 2 years?"*
- *"Forecast revenue for the next 12 months"*

### **Growth Scenarios**
- *"If I increase my customer base by 20%"*
- *"What if I double my marketing spend?"*
- *"Show me growth with 100% customer increase"*

### **Business Model Analysis**
- *"SaaS business model with $2M target"*
- *"Enterprise B2B model analysis"*
- *"E-commerce retail projections"*

### **Cost Optimization**
- *"Reduce costs by 15% over the next year"*
- *"Optimize my business operations"*
- *"Cut expenses by 20%"*

## 🔧 **Configuration Options**

### **Environment Variables**
```bash
# AI Services (Optional - has fallbacks)
OPENAI_API_KEY=your-openai-api-key-here
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Application Settings
DEBUG=true
ENVIRONMENT=development
```

### **Company Data Format**
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

## 🧪 **Testing**

### **Backend Tests**
```bash
cd backend
pytest
```

### **Frontend Tests**
```bash
npm test
```

### **Manual Testing**
1. Register a new user
2. Upload company data
3. Create various forecast queries
4. Test export functionality
5. Verify data accuracy

## 🚀 **Deployment**

### **Production Environment**
1. Set `DEBUG=false`
2. Configure production database URLs
3. Set up proper CORS origins
4. Use strong JWT secrets
5. Configure reverse proxy (nginx)

### **Docker Deployment**
```dockerfile
# Backend
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
CMD ["python", "simple_main.py"]

# Frontend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY app/ .
RUN npm run build
CMD ["npm", "start"]
```

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**
- Follow PEP 8 for Python code
- Use TypeScript for frontend development
- Write tests for new features
- Update documentation as needed
- Follow conventional commit messages

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

## 🏆 **Key Benefits**

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

- **View Users**: http://localhost:8003/api/v1/debug/users
- **API Documentation**: http://localhost:8003/docs

---

<div align="center">

**Ready to transform financial planning with AI! 🚀**

Made with ❤️ by the FinSynth Team

[![GitHub stars](https://img.shields.io/github/stars/yourusername/finsynth?style=social)](https://github.com/yourusername/finsynth)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/finsynth?style=social)](https://github.com/yourusername/finsynth)

</div>