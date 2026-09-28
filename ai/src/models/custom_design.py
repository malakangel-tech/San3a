"""
Pydantic models for custom design recommendations.
"""

from typing import Optional, List
from pydantic import BaseModel, Field, field_validator


class CustomDesignRequest(BaseModel):
    """Request model for custom design recommendations."""
    furniture_type: str = Field(..., description="Type of furniture", min_length=2)
    dimensions: Optional[str] = Field(None, description="Dimensions of the furniture")
    number_of_people: Optional[int] = Field(None, description="Number of people to accommodate", ge=1)
    color_preference: Optional[str] = Field(None, description="Preferred color")
    wood_type: Optional[str] = Field(None, description="Preferred wood type")
    style: Optional[str] = Field(None, description="Furniture style")
    budget: Optional[float] = Field(None, description="Budget in currency units", ge=0)
    additional_requirements: Optional[str] = Field(None, description="Any additional requirements or preferences")
    
    @field_validator('furniture_type')
    @classmethod
    def validate_furniture_type(cls, v: str) -> str:
        """Validate furniture type is not empty."""
        if not v or not v.strip():
            raise ValueError('Furniture type cannot be empty')
        return v.strip()


class WoodRecommendation(BaseModel):
    """Wood type recommendation."""
    wood_type: str = Field(..., description="Recommended wood type")
    reason: str = Field(..., description="Reason for recommendation")
    durability: str = Field(..., description="Durability rating")
    cost_level: str = Field(..., description="Cost level: low, medium, high")


class ColorRecommendation(BaseModel):
    """Color recommendation."""
    color: str = Field(..., description="Recommended color")
    hex_code: Optional[str] = Field(None, description="Hex color code if applicable")
    reason: str = Field(..., description="Reason for recommendation")
    style_compatibility: List[str] = Field(..., description="Compatible styles")


class BudgetEstimate(BaseModel):
    """Budget estimation."""
    estimated_min: float = Field(..., description="Minimum estimated cost", ge=0)
    estimated_max: float = Field(..., description="Maximum estimated cost", ge=0)
    currency: str = Field(default="USD", description="Currency code")
    breakdown: dict = Field(..., description="Cost breakdown by components")
    notes: Optional[str] = Field(None, description="Additional notes about the estimate")
    
    @field_validator('estimated_max')
    @classmethod
    def validate_estimated_max(cls, v: float, info) -> float:
        """Validate that max is not less than min."""
        if 'estimated_min' in info.data and v < info.data['estimated_min']:
            raise ValueError('Estimated max must be greater than or equal to estimated min')
        return v


class ProductSuggestion(BaseModel):
    """Furniture product suggestion."""
    product_name: str = Field(..., description="Name of the suggested product")
    description: str = Field(..., description="Product description")
    features: List[str] = Field(..., description="Key features")
    estimated_price: Optional[float] = Field(None, description="Estimated price", ge=0)
    suitability_score: float = Field(..., description="Suitability score (0-100)", ge=0, le=100)
    
    @field_validator('suitability_score')
    @classmethod
    def validate_suitability_score(cls, v: float) -> float:
        """Validate suitability score is between 0 and 100."""
        if not 0 <= v <= 100:
            raise ValueError('Suitability score must be between 0 and 100')
        return v


class VendorSuggestion(BaseModel):
    """Vendor suggestion."""
    vendor_name: str = Field(..., description="Name of the vendor")
    location: Optional[str] = Field(None, description="Vendor location")
    specialties: List[str] = Field(..., description="Vendor specialties")
    rating: Optional[float] = Field(None, description="Vendor rating", ge=0, le=5)
    contact_info: Optional[str] = Field(None, description="Contact information")
    
    @field_validator('rating')
    @classmethod
    def validate_rating(cls, v: Optional[float]) -> Optional[float]:
        """Validate rating is between 0 and 5 if provided."""
        if v is not None and not 0 <= v <= 5:
            raise ValueError('Rating must be between 0 and 5')
        return v


class CarpenterRequestSummary(BaseModel):
    """Structured request summary for carpenter."""
    furniture_type: str = Field(..., description="Type of furniture")
    specifications: dict = Field(..., description="Detailed specifications")
    materials: List[str] = Field(..., description="Required materials")
    dimensions: str = Field(..., description="Exact dimensions")
    style_notes: str = Field(..., description="Style and design notes")
    special_instructions: Optional[str] = Field(None, description="Special instructions")
    estimated_completion_time: Optional[str] = Field(None, description="Estimated completion time")


class CustomDesignResponse(BaseModel):
    """Response model for custom design recommendations."""
    wood_recommendations: List[WoodRecommendation] = Field(..., description="Recommended wood types")
    color_recommendations: List[ColorRecommendation] = Field(..., description="Recommended colors")
    budget_estimate: BudgetEstimate = Field(..., description="Budget estimation")
    product_suggestions: List[ProductSuggestion] = Field(..., description="Suggested furniture products")
    vendor_suggestions: List[VendorSuggestion] = Field(..., description="Suggested vendors")
    carpenter_summary: CarpenterRequestSummary = Field(..., description="Summary for carpenter")
