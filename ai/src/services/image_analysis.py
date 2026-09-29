
"""
Service for furniture image analysis using Google Gemini API.
"""

import json
import os

import google.generativeai as genai
from PIL import Image

from src.models.image_analysis import ImageAnalysisResponse
from src.utils.logger import logger
from src.utils.exceptions import (
    GeminiError,
    GeminiRateLimitError,
    InvalidResponseError,
)


class ImageAnalysisService:
    """Service for analyzing furniture images using Gemini."""

    def __init__(self):
        """Initialize Gemini client."""

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY is not configured"
            )

        genai.configure(api_key=api_key)

        self.model_name = os.getenv(
            "GEMINI_MODEL",
            "gemini-3.8-flash",
        )

        self.temperature = float(
            os.getenv(
                "GEMINI_TEMPERATURE",
                "0.2",
            )
        )

        self.model = genai.GenerativeModel(
            model_name=self.model_name,
            generation_config=genai.GenerationConfig(
                temperature=self.temperature,
            ),
        )

        logger.info(
            f"ImageAnalysisService initialized "
            f"with model: {self.model_name}"
        )

    def analyze_image(
        self,
        image: Image.Image,
        additional_request: str | None = None,
    ) -> ImageAnalysisResponse:
        """
        Analyze a furniture image.

        The model first determines whether the image
        contains furniture.

        If the image is not furniture, the response
        will contain is_furniture=False and the
        furniture analysis fields will remain null.

        Args:
            image:
                PIL image uploaded by the user.

            additional_request:
                Optional text instruction from the user.

        Returns:
            ImageAnalysisResponse
        """

        logger.info(
            "Starting furniture image analysis"
        )

        try:

            # ========================================
            # Prompt
            # ========================================

            prompt = """
You are an AI furniture analysis assistant.

Your FIRST and MOST IMPORTANT task is to determine
whether the uploaded image contains FURNITURE.

Furniture includes objects such as:

- sofa
- couch
- chair
- armchair
- table
- dining table
- coffee table
- desk
- bed
- wardrobe
- cabinet
- bookshelf
- TV unit
- dresser
- nightstand
- stool
- bench
- furniture sets
- other household furniture

Objects that are NOT furniture include:

- lanterns
- lamps
- candles
- decorative objects
- vases
- clocks
- phones
- electronics
- vehicles
- buildings
- people
- food
- clothing
- tools
- jewelry
- plants
- toys
- appliances
- other non-furniture objects

IMPORTANT:

Do NOT classify a decorative object as furniture.

For example:

A Ramadan lantern / Islamic lantern / candle holder
is NOT furniture.

If the image does NOT contain furniture:

- is_furniture must be false
- furniture_type must be null
- description must describe what is actually visible
- style must be null
- material must be null
- color must be null
- dimensions must be null
- number_of_people must be null
- confidence should indicate confidence in the classification
- missing_information should contain ["not_furniture"]

If the image DOES contain furniture:

- is_furniture must be true
- analyze the furniture normally
- do not invent information

Return ONLY valid JSON.

Do NOT use Markdown.

Do NOT use ```json.

Do NOT add explanations outside the JSON.

Use EXACTLY this JSON structure:

{
  "is_furniture": false,
  "furniture_type": null,
  "description": null,
  "style": null,
  "material": null,
  "color": null,
  "dimensions": null,
  "number_of_people": null,
  "confidence": null,
  "missing_information": []
}

RULES:

1. is_furniture:
   Boolean value.

   true:
   The main object in the image is furniture.

   false:
   The main object is not furniture.

2. furniture_type:
   Identify the furniture type only when
   is_furniture is true.

   If is_furniture is false:
   return null.

3. description:
   Give a short description of the visible object.

   If the image is not furniture, describe the
   visible object briefly.

4. style:
   Identify furniture style only when the image
   contains furniture.

   Examples:
   modern,
   classic,
   minimalist,
   industrial,
   traditional,
   contemporary.

   If not furniture:
   return null.

5. material:
   Identify material only when visually reasonable.

   Do not invent exact wood species.

   If not furniture:
   return null.

6. color:
   Identify the main visible furniture color.

   If not furniture:
   return null.

7. dimensions:
   Only provide dimensions if they can reasonably
   be estimated from the image.

   Otherwise return null.

8. number_of_people:
   For sofas, chairs, tables, dining sets, etc.,
   estimate seating capacity only when visually
   reasonable.

   Otherwise return null.

9. confidence:
   Number between 0 and 1.

   This represents confidence in the image
   classification and analysis.

10. missing_information:
    List information that cannot be reliably
    determined from the image.

Do NOT invent information.
"""

            # ========================================
            # Additional user request
            # ========================================

            if additional_request:

                prompt += f"""

Additional user request:

{additional_request}

Take this request into consideration while
analyzing the image.

However, do NOT override the furniture
classification.

If the object is not furniture, keep:

"is_furniture": false

and do not turn the object into furniture
just because the user requested furniture analysis.
"""

            # ========================================
            # Send image + prompt to Gemini
            # ========================================

            response = self.model.generate_content(
                [
                    prompt,
                    image,
                ]
            )

            # ========================================
            # Validate Gemini response
            # ========================================

            if not response or not response.text:
                raise InvalidResponseError(
                    "Gemini returned an empty response"
                )

            content = response.text.strip()

            logger.debug(
                f"Raw image AI response: "
                f"{content[:1000]}..."
            )

            # ========================================
            # Remove Markdown fences
            # ========================================

            if content.startswith("```json"):
                content = content[
                    len("```json"):
                ]

            elif content.startswith("```"):
                content = content[
                    len("```"):
                ]

            if content.endswith("```"):
                content = content[:-3]

            content = content.strip()

            # ========================================
            # Parse JSON
            # ========================================

            try:

                parsed_data = json.loads(
                    content
                )

            except json.JSONDecodeError as e:

                logger.error(
                    f"Image AI JSON parsing error: {e}"
                )

                raise InvalidResponseError(
                    "Failed to parse image AI response "
                    f"as JSON: {e}"
                )

            # ========================================
            # Make sure is_furniture exists
            # ========================================

            if "is_furniture" not in parsed_data:

                logger.error(
                    "AI response is missing "
                    "'is_furniture'"
                )

                raise InvalidResponseError(
                    "AI response is missing "
                    "required field: is_furniture"
                )

            # ========================================
            # Validate is_furniture type
            # ========================================

            if not isinstance(
                parsed_data["is_furniture"],
                bool,
            ):

                logger.error(
                    "Invalid is_furniture value "
                    "returned by AI"
                )

                raise InvalidResponseError(
                    "AI response field "
                    "'is_furniture' must be boolean"
                )

            # ========================================
            # Non-furniture normalization
            # ========================================

            if parsed_data["is_furniture"] is False:

                parsed_data["furniture_type"] = None
                parsed_data["style"] = None
                parsed_data["material"] = None
                parsed_data["color"] = None
                parsed_data["dimensions"] = None
                parsed_data["number_of_people"] = None

                missing_information = (
                    parsed_data.get(
                        "missing_information"
                    )
                    or []
                )

                if "not_furniture" not in missing_information:
                    missing_information.append(
                        "not_furniture"
                    )

                parsed_data[
                    "missing_information"
                ] = missing_information

            # ========================================
            # Validate response with Pydantic
            # ========================================

            result = ImageAnalysisResponse(
                **parsed_data
            )

            logger.info(
                "Furniture image analysis "
                "completed successfully. "
                f"is_furniture="
                f"{result.is_furniture}"
            )

            return result

        # ============================================
        # Preserve InvalidResponseError
        # ============================================

        except InvalidResponseError:
            raise

        # ============================================
        # Gemini rate limit / quota
        # ============================================

        except GeminiRateLimitError:
            raise

        # ============================================
        # Gemini errors
        # ============================================

        except GeminiError:
            raise

        # ============================================
        # Unexpected errors
        # ============================================

        except Exception as e:

            logger.error(
                f"Gemini image analysis error: {e}"
            )

            error_message = str(e)

            # ----------------------------------------
            # Detect Gemini 429 / quota
            # ----------------------------------------

            if (
                "429" in error_message
                or "quota" in error_message.lower()
                or "rate limit"
                in error_message.lower()
                or "resource exhausted"
                in error_message.lower()
            ):

                raise GeminiRateLimitError(
                    "Gemini API rate limit or "
                    "quota has been exceeded."
                )

            # ----------------------------------------
            # Other Gemini errors
            # ----------------------------------------

            raise GeminiError(
                "Error calling Gemini API for "
                f"image analysis: {e}"
            )
