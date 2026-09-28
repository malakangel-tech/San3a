# AI Module - San3a Project

## Overview

This AI module provides intelligent furniture analysis and custom design capabilities for the San3a platform. It is a standalone FastAPI service designed to be easily integrated with the main backend through REST APIs.

## Features

### 1. AI Furniture Assistant
Analyzes customer furniture requests written in natural language and converts them into structured JSON.

Extracted information includes:
- Furniture Type
- Dimensions
- Number of People
- Color Preference
- Wood Type
- Style
- Budget
- Missing Information

### 2. Smart Custom Design
AI-powered custom furniture design recommendations.

Provides:
- Wood type recommendations with durability and cost information
- Color recommendations with style compatibility
- Budget estimation with detailed breakdown
- Furniture product suggestions
- Vendor suggestions
- Structured carpenter request summary

## Installation

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- Google Gemini API key

### Setup Steps

1. **Navigate to the AI module directory:**
```bash
cd ai
```

2. **Create a virtual environment (recommended):**
```bash
python -m venv venv

# On Windows:
venv\Scripts\activate

# On Unix/MacOS:
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables:**
```bash
copy .env.example .env
# Edit .env with your actual Gemini API key and other settings
```

Required environment variables:
- `GEMINI_API_KEY`: Your Google Gemini API key (required)
- `GEMINI_MODEL`: Gemini model to use (default: gemini-2.5-flash)
- `GEMINI_TEMPERATURE`: Temperature for AI responses (default: 0.3)
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)
- `LOG_LEVEL`: Logging level (default: INFO)

## Running the Service

### Development Mode

Run with auto-reload for development:
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Or using the built-in script:
```bash
python app.py
```

### Production Mode

Run without auto-reload for production:
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

### Using Docker (Optional)

Create a `Dockerfile` in the ai directory:
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t san3a-ai .
docker run -p 8000:8000 --env-file .env san3a-ai
```

## API Endpoints

### Base URL

- Development: `http://localhost:8000`
- Production: `http://your-server:8000`

### Interactive Documentation

Once the service is running, access the interactive API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Health Check

**GET** `/api/v1/health`

Check if the service is running.

**Response:**
```json
{
  "status": "healthy",
  "service": "furniture-analysis"
}
```

### Analyze Furniture Request

**POST** `/api/v1/analyze-furniture`

Analyzes natural language furniture requests and extracts structured data.

**Request Body:**
```json
{
  "request": "I need a dining table for 6 people, modern style, oak wood, around $2000"
}
```

**Response:**
```json
{
  "furniture_type": "dining table",
  "dimensions": null,
  "number_of_people": 6,
  "color_preference": null,
  "wood_type": "oak",
  "style": "modern",
  "budget": 2000,
  "missing_information": ["dimensions", "color_preference"]
}
```

### Generate Custom Design Recommendations

**POST** `/api/v1/custom-design`

Generates comprehensive custom design recommendations based on customer requirements.

**Request Body:**
```json
{
  "furniture_type": "dining table",
  "dimensions": "200x100cm",
  "number_of_people": 6,
  "color_preference": "natural wood",
  "wood_type": "oak",
  "style": "modern",
  "budget": 2000,
  "additional_requirements": "Needs to be durable for daily use"
}
```

**Response:**
```json
{
  "wood_recommendations": [
    {
      "wood_type": "oak",
      "reason": "Durable and aesthetically pleasing",
      "durability": "high",
      "cost_level": "medium"
    }
  ],
  "color_recommendations": [
    {
      "color": "natural oak",
      "hex_code": "#D2B48C",
      "reason": "Classic and versatile",
      "style_compatibility": ["modern", "traditional"]
    }
  ],
  "budget_estimate": {
    "estimated_min": 1500,
    "estimated_max": 2500,
    "currency": "USD",
    "breakdown": {
      "materials": 800,
      "labor": 1000,
      "finishing": 400,
      "other": 300
    },
    "notes": "Price may vary based on specific design choices"
  },
  "product_suggestions": [
    {
      "product_name": "Modern Oak Dining Table",
      "description": "Sleek design with solid oak construction",
      "features": ["extendable", "scratch-resistant"],
      "estimated_price": 1800,
      "suitability_score": 95
    }
  ],
  "vendor_suggestions": [
    {
      "vendor_name": "Quality Woodworks",
      "location": "Local",
      "specialties": ["custom dining furniture"],
      "rating": 4.8,
      "contact_info": "contact@qualitywoodworks.com"
    }
  ],
  "carpenter_summary": {
    "furniture_type": "dining table",
    "specifications": {
      "seating_capacity": 6,
      "material": "solid oak"
    },
    "materials": ["oak wood", "varnish", "hardware"],
    "dimensions": "200x100cm",
    "style_notes": "Modern minimalist design with clean lines",
    "special_instructions": "Use food-safe finish",
    "estimated_completion_time": "2-3 weeks"
  }
}
```

## Integration with Backend

This AI module is designed as an independent microservice that can be easily integrated with the main San3a backend through REST APIs.

### Integration Steps

1. **Deploy the AI Service:**
   - Deploy the AI module on a server or cloud platform
   - Ensure the service is accessible via HTTP/HTTPS
   - Configure CORS to allow requests from your backend domain

2. **Configure Environment Variables:**
   - Set the appropriate `HOST` and `PORT` for your deployment
   - Configure `GEMINI_API_KEY` with your production key
   - Set `LOG_LEVEL` to `WARNING` or `ERROR` for production

3. **Backend Integration:**
   - Add the AI service base URL to your backend configuration
   - Implement HTTP client calls to the AI endpoints from your backend
   - Handle responses and errors appropriately

### Example Backend Integration (Python)

```python
import httpx
from typing import Dict, Any

class AIClient:
    """Client for interacting with the AI service."""
    
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def analyze_furniture(self, request_text: str) -> Dict[str, Any]:
        """Analyze furniture request."""
        response = await self.client.post(
            f"{self.base_url}/api/v1/analyze-furniture",
            json={"request": request_text}
        )
        response.raise_for_status()
        return response.json()
    
    async def generate_custom_design(self, requirements: Dict[str, Any]) -> Dict[str, Any]:
        """Generate custom design recommendations."""
        response = await self.client.post(
            f"{self.base_url}/api/v1/custom-design",
            json=requirements
        )
        response.raise_for_status()
        return response.json()

# Usage
ai_client = AIClient("http://localhost:8000")
result = await ai_client.analyze_furniture("I need a dining table for 6 people")
```

### Example Backend Integration (JavaScript/Node.js)

```javascript
const axios = require('axios');

class AIClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  
  async analyzeFurniture(requestText) {
    const response = await axios.post(
      `${this.baseUrl}/api/v1/analyze-furniture`,
      { request: requestText }
    );
    return response.data;
  }
  
  async generateCustomDesign(requirements) {
    const response = await axios.post(
      `${this.baseUrl}/api/v1/custom-design`,
      requirements
    );
    return response.data;
  }
}

// Usage
const aiClient = new AIClient('http://localhost:8000');
const result = await aiClient.analyzeFurniture('I need a dining table for 6 people');
```

### Security Considerations

1. **API Key Security:**
   - Never commit `.env` files to version control
   - Use environment variables or secret management services
   - Rotate API keys regularly
   - Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. **CORS Configuration:**
   - Update the CORS middleware in `app.py` to allow only specific origins
   - Remove wildcard `allow_origins=["*"]` in production

3. **Rate Limiting:**
   - Implement rate limiting to prevent API abuse
   - Consider using tools like `slowapi` or external rate limiters

4. **Authentication:**
   - Add API key authentication or JWT tokens for production
   - Implement proper authorization checks

## Project Structure

```
ai/
├── app.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── README.md             # This file
└── src/
    ├── routes/           # API route handlers
    │   ├── furniture.py
    │   └── custom_design.py
    ├── services/         # Business logic and AI services
    │   ├── furniture_analysis.py
    │   └── custom_design.py
    ├── prompts/          # AI prompt templates
    │   ├── furniture_analysis.py
    │   └── custom_design.py
    ├── models/           # Pydantic data models
    │   ├── furniture.py
    │   └── custom_design.py
    └── utils/            # Utility functions
        ├── config.py
        ├── logger.py
        ├── exceptions.py
        └── middleware.py
```

## Development

The module follows clean architecture principles:
- **Routes**: Handle HTTP requests and responses
- **Services**: Contain business logic and AI integrations
- **Models**: Define data structures and validation
- **Prompts**: Store AI prompt templates
- **Utils**: Helper functions and shared utilities
