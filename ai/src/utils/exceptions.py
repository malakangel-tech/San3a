"""
Custom exceptions for the AI module.
"""


class AIServiceError(Exception):
    """Base exception for AI service errors."""
    pass


class GeminiError(AIServiceError):
    """Exception raised when Gemini API call fails."""
    pass


class InvalidResponseError(AIServiceError):
    """Exception raised when AI response cannot be parsed or validated."""
    pass


class ConfigurationError(AIServiceError):
    """Exception raised when configuration is invalid or missing."""
    pass


class ValidationError(AIServiceError):
    """Exception raised when request validation fails."""
    pass
