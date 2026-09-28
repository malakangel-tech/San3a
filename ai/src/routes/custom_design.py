"""
API routes for custom design recommendations.
"""

from fastapi import APIRouter, HTTPException, status
from src.models.custom_design import CustomDesignRequest, CustomDesignResponse
from src.services.custom_design import CustomDesignService
from src.utils.logger import logger
from src.utils.exceptions import AIServiceError

router = APIRouter(prefix="/api/v1", tags=["custom-design"])
service = CustomDesignService()


@router.post(
    "/custom-design",
    response_model=CustomDesignResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate custom design recommendations",
    description="Generates comprehensive custom design recommendations including wood types, colors, budget, products, vendors, and carpenter summary"
)
async def generate_custom_design(request: CustomDesignRequest) -> CustomDesignResponse:
    """
    Generate comprehensive custom design recommendations based on customer requirements.
    
    Returns:
    - Wood type recommendations with durability and cost information
    - Color recommendations with style compatibility
    - Budget estimation with breakdown
    - Furniture product suggestions
    - Vendor suggestions
    - Structured carpenter request summary
    """
    logger.info(f"Received custom design request for: {request.furniture_type}")
    
    try:
        result = service.generate_recommendations(
            furniture_type=request.furniture_type,
            dimensions=request.dimensions,
            number_of_people=request.number_of_people,
            color_preference=request.color_preference,
            wood_type=request.wood_type,
            style=request.style,
            budget=request.budget,
            additional_requirements=request.additional_requirements
        )
        return result
    except AIServiceError as e:
        logger.error(f"AI service error: {e}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate custom design recommendations: {str(e)}"
        )


@router.get(
    "/custom-design/health",
    status_code=status.HTTP_200_OK,
    summary="Health check",
    description="Check if the custom design service is running"
)
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "custom-design"}
