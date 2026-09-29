"""
Service for furniture analysis using Google Gemini API.
"""

import json
import os
from typing import Any, Dict, List, Optional

import google.generativeai as genai
from pydantic import ValidationError as PydanticValidationError

from src.prompts.furniture_analysis import (
    FURNITURE_ANALYSIS_SYSTEM_PROMPT,
    FURNITURE_ANALYSIS_USER_PROMPT,
)

from src.models.furniture import FurnitureAnalysisResponse

from src.utils.logger import logger

from src.utils.exceptions import (
    GeminiError,
    GeminiQuotaError,
    InvalidResponseError,
)


class FurnitureAnalysisService:
    """Service for analyzing furniture requests using AI."""

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
            "gemini-3.8-flash",
        )

        self.temperature = float(
            os.getenv(
                "GEMINI_TEMPERATURE",
                "0.3"
            )
        )

        self.model = genai.GenerativeModel(
            model_name=self.model_name,
            generation_config=genai.GenerationConfig(
                temperature=self.temperature,
            ),
        )

        logger.info(
            f"FurnitureAnalysisService initialized "
            f"with model: {self.model_name}"
        )

    def analyze_request(
        self,
        request_text: str,
        products: Optional[
            List[Dict[str, Any]]
        ] = None,
        vendors: Optional[
            List[Dict[str, Any]]
        ] = None,
    ) -> FurnitureAnalysisResponse:
        """
        Analyze a natural language furniture request.

        Args:
            request_text:
                Customer's natural language request.

            products:
                Products retrieved from the database.

            vendors:
                Vendors retrieved from the database.

        Returns:
            FurnitureAnalysisResponse
        """

        logger.info(
            f"Analyzing furniture request: "
            f"{request_text[:100]}..."
        )

        try:
            # ------------------------------------------------
            # Make sure products and vendors are lists
            # ------------------------------------------------

            products = products or []
            vendors = vendors or []

            # ------------------------------------------------
            # Convert database data to JSON
            # ------------------------------------------------

            products_context = json.dumps(
                products,
                ensure_ascii=False,
                default=str,
            )

            vendors_context = json.dumps(
                vendors,
                ensure_ascii=False,
                default=str,
            )

            # ------------------------------------------------
            # Original furniture prompt
            # ------------------------------------------------

            base_prompt = (
                FURNITURE_ANALYSIS_SYSTEM_PROMPT
                + "\n\n"
                + FURNITURE_ANALYSIS_USER_PROMPT.format(
                    request=request_text
                )
            )

            # ------------------------------------------------
            # Complete prompt with Products + Vendors
            # ------------------------------------------------

            full_prompt = f"""
{base_prompt}

==================================================
SAN3A DATABASE CONTEXT
==================================================

The Node.js backend searched the database and
provided the following products and vendors.

--------------------------------------------------
PRODUCTS
--------------------------------------------------

{products_context}

--------------------------------------------------
VENDORS
--------------------------------------------------

{vendors_context}

==================================================
IMPORTANT AI INSTRUCTIONS
==================================================

Analyze the customer's furniture request.

Your main task is to extract the customer's
furniture requirements.

Do NOT invent information.

If the customer did not provide a value,
use null.

For example:

- furniture_type -> null if not specified
- dimensions -> null if not specified
- number_of_people -> null if not specified
- color_preference -> null if not specified
- wood_type -> null if not specified
- style -> null if not specified
- budget -> null if not specified

missing_information must contain the names of
important fields that were not provided.

==================================================
OUTPUT FORMAT
==================================================

Return ONLY valid JSON.

Do NOT return Markdown.

Do NOT use:

```json

Do NOT add explanations before or after JSON.

Return exactly this structure:

{{
    "furniture_type": null,
    "dimensions": null,
    "number_of_people": null,
    "color_preference": null,
    "wood_type": null,
    "style": null,
    "budget": null,
    "missing_information": []
}}

==================================================
VALIDATION RULES
==================================================

1. furniture_type:
   string or null

2. dimensions:
   string or null

3. number_of_people:
   integer or null

4. color_preference:
   string or null

5. wood_type:
   string or null

6. style:
   string or null

7. budget:
   number or null

8. missing_information:
   array of strings

Never invent customer requirements.

==================================================
CUSTOMER REQUEST
==================================================

{request_text}
"""

            logger.debug(
                f"Sending request to Gemini. "
                f"Products count: {len(products)}, "
                f"Vendors count: {len(vendors)}"
            )

            # ------------------------------------------------
            # Call Gemini
            # ------------------------------------------------

            response = self.model.generate_content(
                full_prompt
            )

            # ------------------------------------------------
            # Validate Gemini response
            # ------------------------------------------------

            if not response or not response.text:
                raise InvalidResponseError(
                    "Gemini returned an empty response"
                )

            content = response.text.strip()

            logger.debug(
                f"Raw AI response: {content[:1000]}..."
            )

            # ------------------------------------------------
            # Remove Markdown code fences
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

            result = FurnitureAnalysisResponse(
                **parsed_data
            )

            logger.info(
                "Furniture analysis completed successfully"
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
        # Our custom errors
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