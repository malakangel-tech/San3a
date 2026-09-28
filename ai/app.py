"""
FastAPI application for the AI module.
"""

from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes.furniture import router as furniture_router
from src.routes.custom_design import router as custom_design_router
from src.utils.config import config
from src.utils.middleware import LoggingMiddleware, ErrorHandlingMiddleware
from src.utils.logger import logger


# Create FastAPI application
app = FastAPI(
    title="San3a AI Module",
    description="AI-powered furniture analysis and custom design services",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add custom middleware
app.add_middleware(LoggingMiddleware)
app.add_middleware(ErrorHandlingMiddleware)

# Include routers
app.include_router(furniture_router)
app.include_router(custom_design_router)


@app.get("/", tags=["root"])
async def root():
    """Root endpoint with API information."""
    return {
        "name": "San3a AI Module",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "docs": "/docs",
            "health": "/api/v1/health",
            "analyze_furniture": "/api/v1/analyze-furniture",
            "custom_design": "/api/v1/custom-design"
        }
    }


@app.on_event("startup")
async def startup_event():
    """Validate configuration and initialize services on startup."""
    try:
        config.validate()
        logger.info("San3a AI Module starting up...")
    except Exception as e:
        logger.error(f"Startup failed: {e}")
        raise


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host=config.HOST,
        port=config.PORT,
        reload=True
    )
