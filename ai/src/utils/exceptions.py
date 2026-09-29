
"""
Custom exceptions for the AI module.
"""


class AIServiceError(Exception):
    """Base exception for AI service errors."""
    pass


class GeminiError(AIServiceError):
    """Exception raised when Gemini API call fails."""
    pass


class GeminiRateLimitError(GeminiError):
    """Exception raised when Gemini API quota/rate limit is exceeded."""

    def __init__(
        self,
        message: str,
        retry_after: int | None = None,
    ):
        super().__init__(message)
        self.retry_after = retry_after


class GeminiQuotaError(GeminiRateLimitError):
    """Exception raised when Gemini API quota is exhausted."""

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
