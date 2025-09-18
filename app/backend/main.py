"""
Main FastAPI application for the ASF (Autonomous Strategic Finance) backend.
Implements the complete API server as specified in the PRD.
"""

from contextlib import asynccontextmanager
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os

from .core.config import settings
from .core.database import init_db, close_db
from .core.socketio import create_socketio_app, sio
from .models.forecast import HealthResponse
from .routers import forecast
from .services.vector_service import VectorService


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Handles startup and shutdown events.
    """
    # Startup
    print(f"🚀 Starting {settings.app_name} in {settings.environment} mode")
    print(f"📊 Database URL: {settings.database_url}")
    print(f"🤖 OpenAI Model: {settings.openai_model}")
    
    # Initialize database
    try:
        await init_db()
        print("✅ Database initialized successfully")
        
        # Initialize vector service and knowledge base
        vector_service = VectorService()
        from .core.database import get_session
        async for session in get_session():
            await vector_service.initialize_knowledge_base(session)
            break
        print("✅ Vector knowledge base initialized successfully")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
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
    description="AI-powered financial forecasting platform",
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
app.include_router(forecast.router, prefix="/api/v1")

# Mount static files for Excel reports
app.mount("/storage", StaticFiles(directory="storage"), name="storage")


@app.get("/", response_model=dict)
async def root():
    """
    Root endpoint with API information.
    """
    return {
        "message": "ASF Backend API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.utcnow().isoformat(),
        "docs_url": "/docs",
        "health_url": "/health"
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint for monitoring and load balancers.
    """
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow(),
        version="1.0.0"
    )


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
    import uvicorn
    
    # Create Socket.IO app
    socketio_app = create_socketio_app(app)
    
    uvicorn.run(
        socketio_app,
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info" if not settings.debug else "debug"
    )
