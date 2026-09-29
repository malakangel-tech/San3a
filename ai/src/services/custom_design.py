"""
Service for custom design recommendations using Google Gemini API.
"""

import json
import os

import google.generativeai as genai
from pydantic import ValidationError as PydanticValidationError

from src.prompts.custom_design import (
    CUSTOM_DESIGN_SYSTEM_PROMPT,
    CUSTOM_DESIGN_USER_PROMPT,
)

from src.models.custom_design import CustomDesignResponse

from src.utils.logger import logger

from src.utils.exceptions import (
    GeminiError,
    GeminiQuotaError,
    InvalidResponseError,
)


class CustomDesignService:
    """Service for generating custom design recommendations using AI."""

    def __init__(self):
        """Initialize the Gemini client."""

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY is not configured"
            )

        genai.configure(
            api_key=api_key
        )

        self.model_name = os.getenv(
            "GEMINI_MODEL",
            "gemini-3.8-flash"
        )

        self.temperature = float(
            os.getenv(
                "GEMINI_TEMPERATURE",
                "0.4"
            )
        )

        self.model = genai.GenerativeModel(
            model_name=self.model_name,
            generation_config=genai.GenerationConfig(
                temperature=self.temperature,
            )
        )

        logger.info(
            f"CustomDesignService initialized "
            f"with model: {self.model_name}"
        )

    def generate_recommendations(
        self,
        furniture_type: str,
        dimensions: str = None,
        number_of_people: int = None,
        color_preference: str = None,
        wood_type: str = None,
        style: str = None,
        budget: float = None,
        additional_requirements: str = None
    ) -> CustomDesignResponse:
        """
        Generate comprehensive custom design recommendations.
        """

        logger.info(
            "Generating custom design recommendations "
            f"for: {furniture_type}"
        )

        try:
            # ------------------------------------------------
            # Build user prompt
            # ------------------------------------------------

            user_prompt = CUSTOM_DESIGN_USER_PROMPT.format(
                furniture_type=furniture_type or "Not specified",
                dimensions=dimensions or "Not specified",
                number_of_people=(
                    number_of_people
                    if number_of_people is not None
                    else "Not specified"
                ),
                color_preference=(
                    color_preference or "Not specified"
                ),
                wood_type=(
                    wood_type or "Not specified"
                ),
                style=(
                    style or "Not specified"
                ),
                budget=(
                    budget
                    if budget is not None
                    else "Not specified"
                ),
                additional_requirements=(
                    additional_requirements or "None"
                )
            )

            # ------------------------------------------------
            # Combine system and user prompts
            # ------------------------------------------------

            full_prompt = (
                f"{CUSTOM_DESIGN_SYSTEM_PROMPT}\n\n"
                f"{user_prompt}"
            )

            # ------------------------------------------------
            # Call Gemini
            # ------------------------------------------------

            response = self.model.generate_content(
                full_prompt
            )

            # ------------------------------------------------
            # Validate response
            # ------------------------------------------------

            if not response or not response.text:
                raise InvalidResponseError(
                    "Gemini returned an empty response"
                )

            content = response.text.strip()

            logger.debug(
                f"Raw AI response: {content[:500]}..."
            )

            # ------------------------------------------------
            # Remove Markdown fences
            # ------------------------------------------------

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

            # ------------------------------------------------
            # Parse JSON
            # ------------------------------------------------

            parsed_data = json.loads(
                content
            )

            # ------------------------------------------------
            # Validate using Pydantic
            # ------------------------------------------------

            result = CustomDesignResponse(
                **parsed_data
            )

            logger.info(
                "Custom design recommendations "
                "generated successfully"
            )

            return result

        # ----------------------------------------------------
        # JSON parsing error
        # ----------------------------------------------------

        except json.JSONDecodeError as e:

            logger.error(
                f"JSON parsing error: {e}"
            )

            raise InvalidResponseError(
                f"Failed to parse AI response as JSON: {e}"
            )

        # ----------------------------------------------------
        # Pydantic validation error
        # ----------------------------------------------------

        except PydanticValidationError as e:

            logger.error(
                f"Pydantic validation error: {e}"
            )

            raise InvalidResponseError(
                "AI response does not match "
                f"expected schema: {e}"
            )

        # ----------------------------------------------------
        # Preserve custom errors
        # ----------------------------------------------------

        except InvalidResponseError:
            raise

        except GeminiQuotaError:
            raise

        except GeminiError:
            raise

        # ----------------------------------------------------
        # Gemini / unexpected errors
        # ----------------------------------------------------

        except Exception as e:

            logger.error(
                f"Gemini API error: {e}"
            )

            error_message = str(e)

            if (
                "429" in error_message
                or "quota" in error_message.lower()
                or "rate limit" in error_message.lower()
            ):
                raise GeminiQuotaError(
                    f"Gemini quota exceeded: "
                    f"{error_message}"
                )

            raise GeminiError(
                f"Error calling Gemini API: "
                f"{error_message}"
            )