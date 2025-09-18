"""
Query Parser Service for converting natural language to structured intent.
Uses OpenAI API with structured prompts as specified in the PRD.
"""

import json
from typing import Dict, Any, Optional
import openai
from ..core.config import settings


class QueryParser:
    """
    Service for parsing natural language queries into structured JSON intents.
    
    Uses OpenAI GPT-4 with structured prompts to ensure consistent output format.
    The LLM never performs calculations - only translates language to intent.
    """
    
    def __init__(self):
        """Initialize OpenAI client with API key from settings."""
        self.client = openai.OpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
    
    async def parse_query(self, user_query: str, knowledge_context: str) -> Dict[str, Any]:
        """
        Parse user's natural language query into structured intent.
        
        Args:
            user_query: Natural language financial query
            knowledge_context: Relevant business knowledge from KnowledgeService
            
        Returns:
            Structured JSON object with intent and parameters
            
        Raises:
            ValueError: If parsing fails or returns invalid JSON
        """
        system_prompt = self._build_system_prompt(knowledge_context)
        
        try:
            response = await self.client.chat.completions.acreate(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_query}
                ],
                temperature=0.1,  # Low temperature for consistent output
                max_tokens=500,
                response_format={"type": "json_object"}  # Force JSON output
            )
            
            content = response.choices[0].message.content
            if not content:
                raise ValueError("Empty response from OpenAI")
            
            # Parse JSON response
            parsed_intent = json.loads(content)
            
            # Validate the parsed intent
            self._validate_intent(parsed_intent)
            
            return parsed_intent
            
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse JSON response: {e}")
        except Exception as e:
            raise ValueError(f"Query parsing failed: {e}")
    
    def _build_system_prompt(self, knowledge_context: str) -> str:
        """
        Build the system prompt for OpenAI API.
        
        Args:
            knowledge_context: Relevant business knowledge
            
        Returns:
            Formatted system prompt
        """
        return f"""
You are an expert financial parsing AI. Your task is to convert a user's natural language query about financial forecasts into a strict JSON output.

# KNOWLEDGE BASE CONTEXT:
{knowledge_context}

# INSTRUCTIONS:
1. Analyze the user's query carefully.
2. Extract the user's intent based on the knowledge base context.
3. Extract any numerical parameters or assumption overrides.
4. Output ONLY a valid JSON object matching the following schema. No other text.

# OUTPUT SCHEMA:
{{
  "intent": "string, one of [forecast_total_revenue, forecast_large_revenue, forecast_smb_revenue, explain_assumptions]",
  "timeframe_months": "integer between 1 and 36",
  "assumption_overrides": {{
    "large": {{
      "arpu": "number | null",
      "growth_rate": "number | null",
      "churn_rate": "number | null"
    }},
    "smb": {{
      "marketing_spend": "number | null",
      "cac": "number | null", 
      "conversion_rate": "number | null",
      "arpu": "number | null",
      "growth_rate": "number | null",
      "churn_rate": "number | null"
    }}
  }}
}}

# EXAMPLES:

Query: "Show me revenue for the next 6 months"
Response: {{
  "intent": "forecast_total_revenue",
  "timeframe_months": 6,
  "assumption_overrides": {{
    "large": {{"arpu": null, "growth_rate": null, "churn_rate": null}},
    "smb": {{"marketing_spend": null, "cac": null, "conversion_rate": null, "arpu": null, "growth_rate": null, "churn_rate": null}}
  }}
}}

Query: "What if we increase marketing spend by 20% for 12 months?"
Response: {{
  "intent": "forecast_total_revenue", 
  "timeframe_months": 12,
  "assumption_overrides": {{
    "large": {{"arpu": null, "growth_rate": null, "churn_rate": null}},
    "smb": {{"marketing_spend": 240000, "cac": null, "conversion_rate": null, "arpu": null, "growth_rate": null, "churn_rate": null}}
  }}
}}

Query: "Forecast large customer revenue for 18 months"
Response: {{
  "intent": "forecast_large_revenue",
  "timeframe_months": 18,
  "assumption_overrides": {{
    "large": {{"arpu": null, "growth_rate": null, "churn_rate": null}},
    "smb": {{"marketing_spend": null, "cac": null, "conversion_rate": null, "arpu": null, "growth_rate": null, "churn_rate": null}}
  }}
}}
"""
    
    def _validate_intent(self, intent: Dict[str, Any]) -> None:
        """
        Validate the parsed intent structure.
        
        Args:
            intent: Parsed intent dictionary
            
        Raises:
            ValueError: If intent is invalid
        """
        required_fields = ["intent", "timeframe_months", "assumption_overrides"]
        for field in required_fields:
            if field not in intent:
                raise ValueError(f"Missing required field: {field}")
        
        # Validate intent type
        valid_intents = [
            "forecast_total_revenue",
            "forecast_large_revenue", 
            "forecast_smb_revenue",
            "explain_assumptions"
        ]
        if intent["intent"] not in valid_intents:
            raise ValueError(f"Invalid intent: {intent['intent']}")
        
        # Validate timeframe
        timeframe = intent["timeframe_months"]
        if not isinstance(timeframe, int) or timeframe < 1 or timeframe > 36:
            raise ValueError(f"Invalid timeframe: {timeframe}")
        
        # Validate assumption_overrides structure
        overrides = intent["assumption_overrides"]
        if not isinstance(overrides, dict):
            raise ValueError("assumption_overrides must be a dictionary")
        
        for unit in ["large", "smb"]:
            if unit not in overrides:
                raise ValueError(f"Missing assumption_overrides for {unit}")
            
            unit_overrides = overrides[unit]
            if not isinstance(unit_overrides, dict):
                raise ValueError(f"assumption_overrides.{unit} must be a dictionary")
