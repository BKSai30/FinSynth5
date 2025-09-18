# 🚀 FinSynth Hackathon - Quick Start Guide

## ⚡ **5-Minute Setup**

### **Step 1: Prerequisites**
- Python 3.10+ installed
- Node.js 18+ installed
- Supabase account (free)
- OpenAI API key

### **Step 2: Setup**
```bash
# Run the setup script
setup.bat
```

### **Step 3: Configure Environment**
1. Edit `.env` file with your API keys:
   ```bash
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_KEY=your-supabase-service-key
   OPENAI_API_KEY=your-openai-api-key
   ```

### **Step 4: Setup Supabase Database**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project
3. Go to SQL Editor
4. Copy and run the SQL from `supabase-schema.sql`

### **Step 5: Start Application**
```bash
# Start both frontend and backend
start.bat
```

### **Step 6: Access Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🎯 **Test the Application**

1. **Register/Login** at http://localhost:3000
2. **Try these sample queries**:
   - "Show me revenue for the next 12 months"
   - "What if we increase marketing spend by 20%?"
   - "Forecast large customer revenue for 6 months"
   - "Explain the current assumptions"

## 🔧 **Troubleshooting**

### **Backend Issues**
- Check if `.env` file exists and has correct values
- Ensure virtual environment is activated
- Verify Supabase credentials

### **Frontend Issues**
- Run `npm install` to install dependencies
- Check if backend is running on port 8000
- Clear browser cache

### **Database Issues**
- Verify Supabase project is active
- Check if schema is properly set up
- Ensure RLS policies are configured

## 📱 **Features to Demo**

- ✅ **3D Animated Homepage** with Three.js
- ✅ **Natural Language Queries** with AI processing
- ✅ **Real-time Financial Forecasts** with detailed breakdowns
- ✅ **Dark/Light Mode** with smooth transitions
- ✅ **Responsive Design** for all devices
- ✅ **Professional UI/UX** with modern animations

## 🏆 **Hackathon Ready**

This is a complete, working solution ready for hackathon presentation with:
- Professional UI with 3D animations
- AI-powered natural language processing
- Real-time financial forecasting
- Secure authentication
- Comprehensive documentation

**Ready to impress the judges! 🚀**
