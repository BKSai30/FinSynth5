# 📁 FinSynth Project Structure

This document provides a detailed overview of the FinSynth project structure, explaining the purpose and organization of each directory and file.

## 🏗️ **Root Directory Structure**

```
FinSynth/
├── 📁 app/                          # Next.js Frontend Application
├── 📁 backend/                      # FastAPI Backend Application
├── 📁 components/                   # Shared React Components
├── 📁 public/                       # Static Assets
├── 📁 hooks/                        # Custom React Hooks
├── 📁 lib/                          # Utility Libraries
├── 📁 services/                     # Frontend Services
├── 📁 types/                        # TypeScript Type Definitions
├── 📄 Configuration Files
├── 📄 Documentation Files
└── 📄 Scripts
```

## 📱 **Frontend Structure (`app/`)**

### **Next.js App Router Structure**
```
app/
├── globals.css                      # Global CSS styles
├── layout.tsx                       # Root layout component
├── page.tsx                         # Homepage component
├── forecast/                        # Forecasting interface
│   └── page.tsx                     # Main forecast page
├── login/                           # Authentication pages
│   └── page.tsx                     # Login/register page
├── components/                      # App-specific components
│   ├── ui/                         # Shadcn/ui components
│   ├── features/                   # Feature-specific components
│   └── layout/                     # Layout components
├── lib/                            # Utilities and configurations
├── hooks/                          # Custom React hooks
├── services/                       # API services
└── types/                          # TypeScript types
```

### **Key Frontend Files**
- **`app/page.tsx`**: Landing page with project overview
- **`app/forecast/page.tsx`**: Main forecasting interface with charts and tables
- **`app/login/page.tsx`**: Authentication interface
- **`app/components/ui/`**: Reusable UI components (buttons, cards, etc.)
- **`app/lib/utils.ts`**: Utility functions and helpers

## ⚡ **Backend Structure (`backend/`)**

### **FastAPI Application Structure**
```
backend/
├── simple_main.py                   # Main FastAPI application (port 8003)
├── main.py                         # Alternative structured FastAPI app (port 8000)
├── core/                           # Core configuration and infrastructure
│   ├── config.py                   # Pydantic settings and configuration
│   ├── database.py                 # Database operations and Supabase client
│   ├── auth.py                     # Authentication utilities
│   └── socketio.py                 # WebSocket configuration
├── models/                         # Database models and schemas
│   ├── user.py                     # User model definitions
│   └── forecast.py                 # Forecast model definitions
├── routers/                        # API route handlers
│   ├── auth.py                     # Authentication endpoints
│   └── forecast.py                 # Forecast endpoints
├── services/                       # Business logic and services
│   ├── auth_service.py             # Authentication business logic
│   ├── background_tasks.py         # Background task processing
│   ├── knowledge_service.py        # AI knowledge management
│   ├── query_parser.py             # Natural language query parsing
│   ├── vector_service.py           # Vector search operations
│   └── calculators/                # Financial calculation engines
│       ├── large_customer_calculator.py
│       └── smb_calculator.py
└── tests/                          # Test files
    └── test_forecast.py            # Forecast functionality tests
```

### **Key Backend Files**
- **`simple_main.py`**: Main application with comprehensive forecasting logic
- **`core/config.py`**: Environment variables and application settings
- **`core/database.py`**: Supabase integration and database operations
- **`services/query_parser.py`**: Natural language processing for queries
- **`services/calculators/`**: Financial calculation engines

## 🧩 **Shared Components (`components/`)**

### **Component Organization**
```
components/
├── ui/                             # Shadcn/ui component library
│   ├── button.tsx                  # Button component
│   ├── card.tsx                    # Card component
│   ├── input.tsx                   # Input component
│   ├── table.tsx                   # Table component
│   └── ... (50+ UI components)
├── features/                       # Feature-specific components
│   ├── assumptions-panel.tsx       # Assumptions configuration
│   ├── forecast-chart.tsx          # Chart visualization
│   ├── forecast-table.tsx          # Data table display
│   ├── query-input.tsx             # Query input interface
│   └── summary-cards.tsx           # Summary metrics cards
├── layout/                         # Layout components
│   └── header.tsx                  # Application header
├── auth-provider.tsx               # Authentication context
├── query-provider.tsx              # Query state management
└── theme-provider.tsx              # Theme management
```

## 🔧 **Configuration Files**

### **Package Management**
- **`package.json`**: Node.js dependencies and scripts
- **`package-lock.json`**: Locked dependency versions
- **`pnpm-lock.yaml`**: PNPM lock file
- **`requirements.txt`**: Python dependencies

### **Build Configuration**
- **`next.config.mjs`**: Next.js configuration
- **`tsconfig.json`**: TypeScript configuration
- **`tailwind.config.js`**: Tailwind CSS configuration
- **`postcss.config.mjs`**: PostCSS configuration
- **`components.json`**: Shadcn/ui configuration

### **Environment Configuration**
- **`.env.example`**: Environment variables template
- **`.env`**: Local environment variables (gitignored)

## 📚 **Documentation Files**

### **Project Documentation**
- **`README.md`**: Main project documentation
- **`CONTRIBUTING.md`**: Contribution guidelines
- **`LICENSE`**: MIT License
- **`PROJECT-STRUCTURE.md`**: This file

### **Setup Documentation**
- **`README-SETUP.md`**: Detailed setup instructions
- **`QUICK-START.md`**: Quick start guide
- **`SUPABASE-MIGRATION.md`**: Database migration guide

## 🚀 **Scripts and Automation**

### **Startup Scripts**
- **`simple-start.bat`**: Windows startup script (recommended)
- **`start-project.bat`**: Alternative startup script
- **`start.bat`**: Basic startup script

### **Setup Scripts**
- **`setup.bat`**: Project setup script

## 📊 **Data Files**

### **Sample Data**
- **`sample_company_data.json`**: Example company data structure
- **`users_data.json`**: User database (auto-generated, gitignored)

### **Database Files**
- **`init.sql`**: Database initialization script
- **`supabase-schema.sql`**: Supabase database schema

## 🎨 **Static Assets (`public/`)**

### **Images and Icons**
- **`placeholder-logo.png`**: Company logo placeholder
- **`placeholder-logo.svg`**: SVG logo placeholder
- **`placeholder-user.jpg`**: User avatar placeholder
- **`placeholder.jpg`**: General image placeholder
- **`placeholder.svg`**: SVG placeholder

## 🔗 **Key Dependencies**

### **Frontend Dependencies**
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling framework
- **Shadcn/ui**: Component library
- **Recharts**: Chart visualization
- **Framer Motion**: Animations
- **Three.js**: 3D graphics
- **Axios**: HTTP client

### **Backend Dependencies**
- **FastAPI**: Web framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation
- **Supabase**: Database and authentication
- **OpenAI**: AI integration
- **Anthropic**: Claude AI integration
- **Python-multipart**: File upload support

## 🏗️ **Architecture Patterns**

### **Frontend Architecture**
- **Component-Based**: Modular React components
- **Hook-Based State**: Custom hooks for state management
- **Service Layer**: API services for backend communication
- **Type Safety**: Full TypeScript coverage

### **Backend Architecture**
- **Layered Architecture**: Clear separation of concerns
- **Service Pattern**: Business logic in services
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Configurable dependencies

## 🔄 **Data Flow**

### **Forecast Generation Flow**
1. **User Input**: Natural language query
2. **Query Parsing**: Extract assumptions and parameters
3. **Calculation**: Run financial models
4. **AI Analysis**: Generate insights
5. **Response**: Return structured data
6. **Visualization**: Display charts and tables
7. **Export**: Generate Excel/PDF reports

### **Authentication Flow**
1. **Registration**: Create user account
2. **Login**: Authenticate user
3. **Session**: Maintain login state
4. **Authorization**: Protect routes and data
5. **Company Data**: Load user-specific data

## 🧪 **Testing Structure**

### **Test Organization**
```
tests/
├── backend/                        # Backend tests
│   ├── test_forecast.py           # Forecast functionality
│   └── test_auth.py               # Authentication tests
├── frontend/                       # Frontend tests
│   ├── components/                # Component tests
│   └── pages/                     # Page tests
└── integration/                    # Integration tests
    └── test_api.py                # API integration tests
```

## 📈 **Performance Considerations**

### **Frontend Optimization**
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Next.js image optimization
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Browser and CDN caching

### **Backend Optimization**
- **Async/Await**: Non-blocking operations
- **Connection Pooling**: Database connection management
- **Caching**: Redis caching (optional)
- **Rate Limiting**: API rate limiting

## 🔒 **Security Considerations**

### **Authentication Security**
- **Password Hashing**: SHA-256 with salt
- **Session Management**: Secure session handling
- **CORS Configuration**: Proper CORS setup
- **Input Validation**: Pydantic validation

### **Data Security**
- **File Upload Validation**: Secure file handling
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization
- **Environment Variables**: Secure configuration

## 🚀 **Deployment Structure**

### **Production Deployment**
```
production/
├── docker/                         # Docker configurations
│   ├── Dockerfile.backend          # Backend container
│   ├── Dockerfile.frontend         # Frontend container
│   └── docker-compose.yml          # Multi-container setup
├── nginx/                          # Reverse proxy config
│   └── nginx.conf                  # Nginx configuration
└── scripts/                        # Deployment scripts
    ├── deploy.sh                   # Deployment script
    └── backup.sh                   # Backup script
```

This structure provides a solid foundation for the FinSynth application while maintaining clean, organized, and scalable code. Each directory and file has a specific purpose and follows established patterns for maintainability and extensibility.