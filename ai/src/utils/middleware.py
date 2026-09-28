"""
Middleware for request/response logging and error handling.
"""

import time
import json
from fastapi import Request, Response
from fastapi.middleware import Middleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
from src.utils.logger import logger


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for logging HTTP requests and responses."""
    
    async def dispatch(self, request: Request, call_next):
        """Process request and log details."""
        start_time = time.time()
        
        # Log request
        logger.info(f"Incoming request: {request.method} {request.url.path}")
        
        # Process request
        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            
            # Log response
            logger.info(
                f"Request completed: {request.method} {request.url.path} "
                f"- Status: {response.status_code} - Time: {process_time:.3f}s"
            )
            
            # Add processing time to response headers
            response.headers["X-Process-Time"] = str(process_time)
            
            return response
            
        except Exception as e:
            process_time = time.time() - start_time
            logger.error(
                f"Request failed: {request.method} {request.url.path} "
                f"- Error: {str(e)} - Time: {process_time:.3f}s"
            )
            raise


class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Middleware for centralized error handling."""
    
    async def dispatch(self, request: Request, call_next):
        """Process request and handle errors centrally."""
        try:
            return await call_next(request)
        except Exception as e:
            logger.error(f"Unhandled exception: {str(e)}", exc_info=True)
            # Re-raise to let FastAPI handle it with proper HTTP status
            raise
