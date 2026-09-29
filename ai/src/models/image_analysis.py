
"""
Pydantic models for furniture image analysis.
"""

from typing import Optional, List

from pydantic import BaseModel, Field


class ImageAnalysisResponse(BaseModel):
    """Structured response returned after analyzing an image."""

    is_furniture: bool = Field(
        ...,
        description=(
            "Whether the main object in the image "
            "is furniture"
        ),
    )

    furniture_type: Optional[str] = Field(
        None,
        description="Detected furniture type",
    )

    description: Optional[str] = Field(
        None,
        description="Description of the visible object",
    )

    style: Optional[str] = Field(
        None,
        description="Detected furniture style",
    )

    material: Optional[str] = Field(
        None,
        description="Detected material",
    )

    color: Optional[str] = Field(
        None,
        description="Detected main color",
    )

    dimensions: Optional[str] = Field(
        None,
        description="Estimated dimensions if visually inferable",
    )

    number_of_people: Optional[int] = Field(
        None,
        description="Estimated seating capacity",
        ge=1,
    )

    confidence: Optional[float] = Field(
        None,
        description="AI confidence from 0 to 1",
        ge=0,
        le=1,
    )

    missing_information: List[str] = Field(
        default_factory=list,
        description=(
            "Information that cannot reliably be "
            "determined from the image"
        ),
    )
