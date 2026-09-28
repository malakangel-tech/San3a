"""
Configuration utilities for the AI module.
"""

import os
from typing import Optional
from dotenv import load_dotenv
from src.utils.exceptions import ConfigurationError
from src.utils.logger import logger

# Load environment variables from .env file
load_dotenv()


class Config:
    """Application configuration class with validation."""
    
    # Google Gemini API Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    GEMINI_TEMPERATURE: float = 0.0
    
    # Server Configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = 0
    
    # Logging Configuration
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    def __init__(self):
        """Initialize and validate configuration."""
        try:
            self.GEMINI_TEMPERATURE = float(os.getenv("GEMINI_TEMPERATURE", "0.3"))
            self.PORT = int(os.getenv("PORT", "8000"))
        except (ValueError, TypeError) as e:
            raise ConfigurationError(f"Invalid configuration value: {e}")
    
    @classmethod
    def validate(cls) -> bool:
        """Validate that required configuration is present and valid."""
        instance = cls()
        
        if not instance.GEMINI_API_KEY:
            raise ConfigurationError("GEMINI_API_KEY is required but not set")
        
        if instance.GEMINI_TEMPERATURE < 0 or instance.GEMINI_TEMPERATURE > 2:
            raise ConfigurationError("GEMINI_TEMPERATURE must be between 0 and 2")
        
        if instance.PORT < 1 or instance.PORT > 65535:
            raise ConfigurationError("PORT must be between 1 and 65535")
        
        valid_log_levels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if instance.LOG_LEVEL.upper() not in valid_log_levels:
            raise ConfigurationError(f"LOG_LEVEL must be one of {valid_log_levels}")
        
        logger.info("Configuration validated successfully")
        return True


config = Config()
