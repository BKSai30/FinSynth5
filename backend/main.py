"""
FinSynth Hackathon - AI-Powered Financial Forecasting Platform
Main FastAPI application with Supabase integration
"""

from contextlib import asynccontextmanager
from datetime import datetime
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os
import uvicorn

from .core.config import settings
from .core.database import init_db, close_db
from .routers import auth, forecast
from .services.knowledge_service import KnowledgeService


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Handles startup and shutdown events.
    """
    # Startup
    print(f"🚀 Starting {settings.app_name} in {settings.environment} mode")
    print(f"📊 Supabase URL: {settings.supabase_url}")
    print(f"🤖 OpenAI Model: {settings.openai_model}")
    
    # Initialize database
    try:
        await init_db()
        print("✅ Database initialized successfully")
        
        # Initialize knowledge service
        knowledge_service = KnowledgeService()
        await knowledge_service.initialize_knowledge_base()
        print("✅ Knowledge base initialized successfully")
        
    except Exception as e:
        print(f"❌ Initialization failed: {e}")
        # Don't raise in development mode
        if not settings.debug:
            raise
    
    # Create storage directory
    os.makedirs("storage", exist_ok=True)
    
    yield
    
    # Shutdown
    print("🛑 Shutting down application...")
    await close_db()
    print("✅ Application shutdown complete")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="AI-powered financial forecasting platform for hackathon",
    version="1.0.0",
    debug=settings.debug,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(forecast.router, prefix="/api/v1/forecast", tags=["Forecasting"])

# Mount static files for Excel reports
app.mount("/storage", StaticFiles(directory="storage"), name="storage")


@app.get("/", response_model=dict)
async def root():
    """
    Root endpoint with API information.
    """
    return {
        "message": "FinSynth Hackathon API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.utcnow().isoformat(),
        "docs_url": "/docs",
        "health_url": "/health",
        "features": [
            "AI-powered financial forecasting",
            "Natural language query processing",
            "Supabase authentication",
            "Real-time WebSocket updates",
            "Excel report generation"
        ]
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "environment": settings.environment,
        "debug": settings.debug
    }


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """
    Global HTTP exception handler.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "timestamp": datetime.utcnow().isoformat()
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """
    Global exception handler for unexpected errors.
    """
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc) if settings.debug else "An unexpected error occurred",
            "status_code": 500,
            "timestamp": datetime.utcnow().isoformat()
        }
    )


if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info" if not settings.debug else "debug"
    )
