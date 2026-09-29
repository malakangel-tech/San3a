"""
API routes for custom design recommendations.
"""

from fastapi import (
    APIRouter,
    HTTPException,
    status,
)

from src.models.custom_design import (
    CustomDesignRequest,
    CustomDesignResponse,
)

from src.services.custom_design import (
    CustomDesignService,
)

from src.utils.logger import logger

from src.utils.exceptions import (
    AIServiceError,
    GeminiError,
    GeminiQuotaError,
    InvalidResponseError,
)


router = APIRouter(
    prefix="/api/v1",
    tags=["custom-design"],
)

service = CustomDesignService()


@router.post(
    "/custom-design",
    response_model=CustomDesignResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate custom design recommendations",
    description=(
        "Generates comprehensive custom design recommendations "
        "including wood types, colors, budget, products, "
        "vendors, and carpenter summary"
    ),
)
async def generate_custom_design(
    request: CustomDesignRequest,
) -> CustomDesignResponse:

    logger.info(
        f"Received custom design request "
        f"for: {request.furniture_type}"
    )

    try:

        result = service.generate_recommendations(
            furniture_type=request.furniture_type,
            dimensions=request.dimensions,
            number_of_people=request.number_of_people,
            color_preference=request.color_preference,
            wood_type=request.wood_type,
            style=request.style,
            budget=request.budget,
            additional_requirements=(
                request.additional_requirements
            ),
        )

        return result

    except GeminiQuotaError as e:

        logger.error(
            f"Gemini quota error: {e}"
        )

        headers = {}

        if e.retry_after is not None:
            headers["Retry-After"] = str(
                e.retry_after
            )

        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=str(e),
            headers=headers,
        )

    except InvalidResponseError as e:

        logger.error(
            f"Invalid AI response: {e}"
        )

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(e),
        )

    except GeminiError as e:

        logger.error(
            f"Gemini error: {e}"
        )

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(e),
        )

    except AIServiceError as e:

        logger.error(
            f"AI service error: {e}"
        )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    except Exception:

        logger.exception(
            "Unexpected error while generating "
            "custom design recommendations"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "Failed to generate custom "
                "design recommendations"
            ),
        )


@router.get(
    "/custom-design/health",
    status_code=status.HTTP_200_OK,
    summary="Health check",
    description=(
        "Check if the custom design service is running"
    ),
)
async def health_check():

    return {
        "status": "healthy",
        "service": "custom-design",
    }