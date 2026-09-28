"""
Logging configuration and utilities for the AI module.
"""

import logging
import os
import sys
from typing import Optional


def setup_logger(
    name: str,
    level: Optional[str] = None,
    log_file: Optional[str] = None
) -> logging.Logger:
    """
    Set up a logger with consistent formatting.
    
    Args:
        name: Logger name
        level: Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_file: Optional file path to write logs to
        
    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(name)
    
    # Set log level from config or parameter
    log_level = level or os.getenv("LOG_LEVEL", "INFO")
    logger.setLevel(getattr(logging, log_level.upper()))
    
    # Remove existing handlers to avoid duplicates
    logger.handlers.clear()
    
    # Create formatter
    formatter = logging.Formatter(
        fmt='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # File handler (optional)
    if log_file:
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    return logger


# Module-level logger
logger = setup_logger("san3a_ai")
