
"""
API routes for furniture analysis.
"""

from io import BytesIO

from fastapi import (
    APIRouter,
    HTTPException,
    status,
    UploadFile,
    File,
    Form,
)

from PIL import Image, UnidentifiedImageError

from src.models.furniture import (
    FurnitureAnalysisRequest,
    FurnitureAnalysisResponse,
)

from src.models.image_analysis import (
    ImageAnalysisResponse,
)

from src.services.furniture_analysis import (
    FurnitureAnalysisService,
)

from src.services.image_analysis import (
    ImageAnalysisService,
)

from src.utils.logger import logger
from src.utils.exceptions import AIServiceError


router = APIRouter(
    prefix="/api/v1",
    tags=["furniture"],
)


furniture_service = FurnitureAnalysisService()
image_service = ImageAnalysisService()


# ============================================
# ANALYZE FURNITURE TEXT
# POST /api/v1/analyze-furniture
# ============================================

@router.post(
    "/analyze-furniture",
    response_model=FurnitureAnalysisResponse,
    status_code=status.HTTP_200_OK,
)
async def analyze_furniture(
    request: FurnitureAnalysisRequest,
) -> FurnitureAnalysisResponse:

    logger.info(
        "Received furniture analysis request"
    )

    try:
        result = furniture_service.analyze_request(
            request.request
        )

        return result

    except AIServiceError as e:

        logger.error(
            f"AI service error: {e}"
        )

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        )

    except Exception as e:

        logger.error(
            f"Unexpected error: {e}"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "Failed to analyze furniture request: "
                f"{str(e)}"
            ),
        )


# ============================================
# ANALYZE FURNITURE IMAGE
# POST /api/v1/analyze-image
# ============================================

@router.post(
    "/analyze-image",
    response_model=ImageAnalysisResponse,
    status_code=status.HTTP_200_OK,
)
async def analyze_image(
    image: UploadFile = File(...),
    additional_request: str | None = Form(None),
) -> ImageAnalysisResponse:

    logger.info(
        f"Received furniture image: {image.filename}"
    )

    # ========================================
    # Validate content type
    # ========================================

    allowed_types = {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    }

    if image.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "invalid_file_type",
                "message": (
                    "Invalid image type. "
                    "Allowed types: JPEG, PNG, WEBP."
                ),
            },
        )

    try:

        # ========================================
        # Read uploaded image
        # ========================================

        image_bytes = await image.read()

        # ========================================
        # Validate file size
        # ========================================

        max_size = 10 * 1024 * 1024

        if len(image_bytes) > max_size:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail={
                    "error": "file_too_large",
                    "message": (
                        "Image size must not exceed 10 MB."
                    ),
                },
            )

        # ========================================
        # Make sure file is not empty
        # ========================================

        if not image_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "error": "empty_file",
                    "message": "Uploaded image is empty.",
                },
            )

        # ========================================
        # Open image with PIL
        # ========================================

        try:

            pil_image = Image.open(
                BytesIO(image_bytes)
            )

            # ====================================
            # Force PIL to actually decode image
            # ====================================

            pil_image.load()

        except (
            UnidentifiedImageError,
            OSError,
            ValueError,
        ) as e:

            logger.warning(
                f"Invalid/corrupted image uploaded: "
                f"{image.filename} - {e}"
            )

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "error": "invalid_image",
                    "message": (
                        "The uploaded file is not a valid "
                        "or readable image."
                    ),
                },
            )

        # ========================================
        # Analyze image with Gemini
        # ========================================

        result = image_service.analyze_image(
            image=pil_image,
            additional_request=additional_request,
        )

        return result

    # ========================================
    # Preserve HTTP errors
    # ========================================

    except HTTPException:
        raise

    # ========================================
    # AI service errors
    # ========================================

    except AIServiceError as e:

        logger.error(
            f"Image AI service error: {e}"
        )

        # ----------------------------------------
        # Gemini rate limit
        # ----------------------------------------

        if hasattr(e, "retry_after"):

            retry_after = getattr(
                e,
                "retry_after",
                None,
            )

            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={
                    "error": "gemini_rate_limit",
                    "message": str(e),
                    "retry_after": retry_after,
                },
                headers=(
                    {
                        "Retry-After": str(retry_after)
                    }
                    if retry_after
                    else None
                ),
            )

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        )

    # ========================================
    # Unexpected errors
    # ========================================

    except Exception as e:

        logger.error(
            f"Image analysis error: {e}"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "Failed to analyze image."
            ),
        )


# ============================================
# HEALTH
# GET /api/v1/health
# ============================================

@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
)
async def health_check():

    return {
        "status": "healthy",
        "service": "furniture-analysis",
    }
