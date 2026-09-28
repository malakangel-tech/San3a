"""
API routes for furniture analysis.
"""

from fastapi import APIRouter, HTTPException, status
from src.models.furniture import FurnitureAnalysisRequest, FurnitureAnalysisResponse, ErrorResponse
from src.services.furniture_analysis import FurnitureAnalysisService
from src.utils.logger import logger
from src.utils.exceptions import AIServiceError

router = APIRouter(prefix="/api/v1", tags=["furniture"])
service = FurnitureAnalysisService()


@router.post(
    "/analyze-furniture",
    response_model=FurnitureAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze furniture request",
    description="Analyzes natural language furniture requests and extracts structured information"
)
async def analyze_furniture(request: FurnitureAnalysisRequest) -> FurnitureAnalysisResponse:
    """
    Analyze a customer's furniture request written in natural language.
    
    Extracts structured information including:
    - Furniture type
    - Dimensions
    - Number of people
    - Color preference
    - Wood type
    - Style
    - Budget
    - Missing information
    """
    logger.info(f"Received furniture analysis request")
    
    try:
        result = service.analyze_request(request.request)
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
            detail=f"Failed to analyze furniture request: {str(e)}"
        )


@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="Health check",
    description="Check if the furniture analysis service is running"
)
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "furniture-analysis"}
