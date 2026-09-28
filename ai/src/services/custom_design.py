"""
Service for custom design recommendations using Google Gemini API.
"""

import json
import os
import google.generativeai as genai
from pydantic import ValidationError as PydanticValidationError

from src.prompts.custom_design import (
    CUSTOM_DESIGN_SYSTEM_PROMPT,
    CUSTOM_DESIGN_USER_PROMPT
)
from src.models.custom_design import CustomDesignResponse
from src.utils.logger import logger
from src.utils.exceptions import GeminiError, InvalidResponseError


class CustomDesignService:
    """Service for generating custom design recommendations using AI."""
    
    def __init__(self):
        """Initialize the Gemini client with environment variables."""
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
        self.temperature = float(os.getenv("GEMINI_TEMPERATURE", "0.4"))
        self.model = genai.GenerativeModel(
            model_name=self.model_name,
            generation_config=genai.GenerationConfig(
                temperature=self.temperature,
               
            )
        )
        logger.info("CustomDesignService initialized")
    
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
        
        Args:
            furniture_type: Type of furniture
            dimensions: Dimensions of the furniture
            number_of_people: Number of people to accommodate
            color_preference: Preferred color
            wood_type: Preferred wood type
            style: Furniture style
            budget: Budget in currency units
            additional_requirements: Any additional requirements
            
        Returns:
            CustomDesignResponse: Comprehensive design recommendations
            
        Raises:
            ValueError: If the API response cannot be parsed
            Exception: If the OpenAI API call fails
        """
        logger.info(f"Generating custom design recommendations for: {furniture_type}")
        
        try:
            user_prompt = CUSTOM_DESIGN_USER_PROMPT.format(
                furniture_type=furniture_type or "Not specified",
                dimensions=dimensions or "Not specified",
                number_of_people=number_of_people or "Not specified",
                color_preference=color_preference or "Not specified",
                wood_type=wood_type or "Not specified",
                style=style or "Not specified",
                budget=budget or "Not specified",
                additional_requirements=additional_requirements or "None"
            )
            
            # Combine system and user prompts for Gemini
            full_prompt = f"{CUSTOM_DESIGN_SYSTEM_PROMPT}\n\n{user_prompt}"
            
            response = self.model.generate_content(full_prompt)
            
            content = response.text
            logger.debug(f"Raw AI response: {content[:200]}...")
            
            parsed_data = json.loads(content)
            
            # Validate and create response model
            result = CustomDesignResponse(**parsed_data)
            logger.info("Custom design recommendations generated successfully")
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {e}")
            raise InvalidResponseError(f"Failed to parse AI response as JSON: {e}")
        except PydanticValidationError as e:
            logger.error(f"Pydantic validation error: {e}")
            raise InvalidResponseError(f"AI response does not match expected schema: {e}")
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            raise GeminiError(f"Error calling Gemini API: {e}")
