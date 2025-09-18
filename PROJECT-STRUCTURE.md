# 📁 FinSynth Project Structure

This document outlines the clean, organized structure of the FinSynth application after reorganization.

## 🏗️ **Root Directory Structure**

```
FinSynth/
├── 📁 app/                          # Next.js App Router
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Main dashboard page
├── 📁 backend/                      # FastAPI Backend
│   ├── __init__.py
│   ├── main.py                      # FastAPI application entry point
│   ├── 📁 core/                     # Core configuration
│   │   ├── __init__.py
│   │   ├── auth.py                  # Supabase authentication
│   │   ├── config.py                # Application settings
│   │   ├── database.py              # Supabase database operations
│   │   └── socketio.py              # WebSocket configuration
│   ├── 📁 models/                   # Database models
│   │   ├── __init__.py
│   │   └── forecast.py              # SQLModel definitions
│   ├── 📁 routers/                  # API routes
│   │   ├── __init__.py
│   │   └── forecast.py              # Forecast endpoints
│   ├── 📁 services/                 # Business logic
│   │   ├── __init__.py
│   │   ├── background_tasks.py      # FastAPI background tasks
│   │   ├── knowledge_service.py     # AI knowledge management
│   │   ├── query_parser.py          # Natural language parsing
│   │   ├── vector_service.py        # Vector search operations
│   │   └── 📁 calculators/          # Financial calculators
│   │       ├── __init__.py
│   │       ├── large_customer_calculator.py
│   │       └── smb_calculator.py
│   └── 📁 tests/                    # Test files
│       ├── __init__.py
│       └── test_forecast.py
├── 📁 components/                   # React Components
│   ├── theme-provider.tsx           # Theme configuration
│   ├── 📁 ui/                       # Shadcn/ui components
│   │   ├── accordion.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ... (all UI components)
│   ├── 📁 features/                 # Feature-specific components
│   │   ├── assumptions-panel.tsx
│   │   ├── forecast-chart.tsx
│   │   ├── forecast-table.tsx
│   │   ├── query-input.tsx
│   │   └── summary-cards.tsx
│   └── 📁 layout/                   # Layout components
│       └── header.tsx
├── 📁 hooks/                        # React Hooks
│   ├── use-forecast.ts              # Forecast API hook
│   ├── use-mobile.ts                # Mobile detection hook
│   └── use-toast.ts                 # Toast notifications hook
├── 📁 lib/                          # Utility libraries
│   ├── supabase.ts                  # Supabase client configuration
│   └── utils.ts                     # Utility functions
├── 📁 services/                     # Frontend services
│   └── api.ts                       # API service layer
├── 📁 types/                        # TypeScript type definitions
│   └── forecast.ts                  # Forecast-related types
├── 📁 public/                       # Static assets
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
├── 📁 venv/                         # Python virtual environment
├── 📄 Configuration Files
│   ├── components.json              # Shadcn/ui configuration
│   ├── next.config.mjs              # Next.js configuration
│   ├── package.json                 # Node.js dependencies
│   ├── pnpm-lock.yaml               # Package lock file
│   ├── postcss.config.mjs           # PostCSS configuration
│   ├── requirements.txt             # Python dependencies
│   ├── tsconfig.json                # TypeScript configuration
│   └── env.example                  # Environment variables template
├── 📄 Documentation
│   ├── README.md                    # Main project documentation
│   ├── README-SETUP.md              # Setup instructions
│   ├── QUICK-START.md               # Quick start guide
│   ├── INSTALLATION-GUIDE.md        # Detailed installation guide
│   ├── INSTALL-PYTHON.md            # Python installation guide
│   ├── PRD.md                       # Product Requirements Document
│   ├── SUPABASE-MIGRATION.md        # Supabase migration guide
│   ├── REDIS-CELERY-REMOVAL.md      # Redis/Celery removal guide
│   └── PROJECT-STRUCTURE.md         # This file
└── 📄 Scripts
    ├── setup.bat                    # Setup script
    └── start.bat                    # Start script
```

## 🎯 **Key Organizational Principles**

### **1. Separation of Concerns**
- **Frontend**: React/Next.js components, hooks, and services
- **Backend**: FastAPI routes, models, and business logic
- **Shared**: Types and utilities used by both frontend and backend

### **2. Feature-Based Organization**
- **Components**: Organized by feature (query-input, forecast-table, etc.)
- **Services**: Business logic separated from UI components
- **Hooks**: Reusable state management and API interactions

### **3. Clean Architecture**
- **Core**: Configuration and infrastructure
- **Models**: Data structures and database schemas
- **Services**: Business logic and external integrations
- **Routers**: API endpoints and request handling

### **4. Scalability**
- **Modular Components**: Easy to add new features
- **Type Safety**: Full TypeScript coverage
- **Consistent Patterns**: Similar structure across features

## 🔧 **Technology Stack**

### **Frontend**
- **Framework**: Next.js 14 with App Router
- **UI Library**: Shadcn/ui with Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React hooks + custom hooks
- **Charts**: Recharts
- **Authentication**: Supabase Auth

### **Backend**
- **Framework**: FastAPI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Background Tasks**: FastAPI BackgroundTasks
- **AI Integration**: OpenAI API
- **File Generation**: openpyxl

### **Development**
- **Language**: TypeScript + Python
- **Package Manager**: pnpm (frontend) + pip (backend)
- **Linting**: ESLint + Prettier
- **Testing**: Jest + pytest

## 📋 **File Naming Conventions**

### **Components**
- **PascalCase**: `ForecastTable.tsx`, `QueryInput.tsx`
- **kebab-case**: `use-forecast.ts`, `forecast-chart.tsx`

### **Backend**
- **snake_case**: `background_tasks.py`, `query_parser.py`
- **PascalCase**: `ForecastQuery`, `ForecastResult`

### **Configuration**
- **kebab-case**: `next.config.mjs`, `postcss.config.mjs`
- **UPPER_CASE**: Environment variables

## 🚀 **Getting Started**

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Start Development**:
   ```bash
   # Backend
   python -m backend.main
   
   # Frontend (in another terminal)
   npm run dev
   ```

## 📈 **Benefits of This Structure**

- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new features
- **Developer Experience**: Consistent patterns and naming
- **Type Safety**: Full TypeScript coverage
- **Performance**: Optimized imports and lazy loading
- **Testing**: Clear test organization

This structure provides a solid foundation for the FinSynth application while maintaining clean, organized, and scalable code.
