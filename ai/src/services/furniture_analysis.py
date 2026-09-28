"""
Service for furniture analysis using Google Gemini API.
"""

import json
import os
from typing import Dict, Any
import google.generativeai as genai
from pydantic import ValidationError as PydanticValidationError

from src.prompts.furniture_analysis import (
    FURNITURE_ANALYSIS_SYSTEM_PROMPT,
    FURNITURE_ANALYSIS_USER_PROMPT
)
from src.models.furniture import FurnitureAnalysisResponse
from src.utils.logger import logger
from src.utils.exceptions import GeminiError, InvalidResponseError


class FurnitureAnalysisService:
    """Service for analyzing furniture requests using AI."""
    
    def __init__(self):
        """Initialize the Gemini client with environment variables."""
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
        self.temperature = float(os.getenv("GEMINI_TEMPERATURE", "0.3"))
        self.model = genai.GenerativeModel(
            model_name=self.model_name,
            generation_config=genai.GenerationConfig(
                temperature=self.temperature,
                
            )
        )
        logger.info("FurnitureAnalysisService initialized")
    
    def analyze_request(self, request_text: str) -> FurnitureAnalysisResponse:
        """
        Analyze a natural language furniture request.
        
        Args:
            request_text: The customer's furniture request in natural language
            
        Returns:
            FurnitureAnalysisResponse: Structured analysis of the request
            
        Raises:
            ValueError: If the API response cannot be parsed
            Exception: If the OpenAI API call fails
        """
        logger.info(f"Analyzing furniture request: {request_text[:100]}...")
        
        try:
            # Combine system and user prompts for Gemini
            full_prompt = f"{FURNITURE_ANALYSIS_SYSTEM_PROMPT}\n\n{FURNITURE_ANALYSIS_USER_PROMPT.format(request=request_text)}"
            
            response = self.model.generate_content(full_prompt)
            
            content = response.text
            logger.debug(f"Raw AI response: {content[:200]}...")
            
            parsed_data = json.loads(content)
            
            # Validate and create response model
            result = FurnitureAnalysisResponse(**parsed_data)
            logger.info("Furniture analysis completed successfully")
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
