"""
Pydantic models for furniture request analysis.
"""

from typing import Optional, List
from pydantic import BaseModel, Field, field_validator


class FurnitureAnalysisRequest(BaseModel):
    """Request model for furniture analysis."""
    request: str = Field(..., description="Natural language furniture request from customer", min_length=10)
    
    @field_validator('request')
    @classmethod
    def validate_request(cls, v: str) -> str:
        """Validate that request is not empty and has reasonable length."""
        if not v or not v.strip():
            raise ValueError('Request cannot be empty')
        if len(v.strip()) < 10:
            raise ValueError('Request must be at least 10 characters long')
        return v.strip()


class FurnitureAnalysisResponse(BaseModel):
    """Response model for furniture analysis with extracted structured data."""
    
    furniture_type: Optional[str] = Field(None, description="Type of furniture requested")
    dimensions: Optional[str] = Field(None, description="Dimensions of the furniture")
    number_of_people: Optional[int] = Field(None, description="Number of people the furniture should accommodate", ge=1)
    color_preference: Optional[str] = Field(None, description="Preferred color")
    wood_type: Optional[str] = Field(None, description="Type of wood preferred")
    style: Optional[str] = Field(None, description="Furniture style preference")
    budget: Optional[float] = Field(None, description="Budget in currency units", ge=0)
    missing_information: List[str] = Field(
        default_factory=list,
        description="List of required information that was missing from the request"
    )
    
    @field_validator('number_of_people')
    @classmethod
    def validate_number_of_people(cls, v: Optional[int]) -> Optional[int]:
        """Validate number of people is positive if provided."""
        if v is not None and v < 1:
            raise ValueError('Number of people must be at least 1')
        return v
    
    @field_validator('budget')
    @classmethod
    def validate_budget(cls, v: Optional[float]) -> Optional[float]:
        """Validate budget is non-negative if provided."""
        if v is not None and v < 0:
            raise ValueError('Budget cannot be negative')
        return v


class ErrorResponse(BaseModel):
    """Standard error response model."""
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")
