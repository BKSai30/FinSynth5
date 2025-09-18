"""
Knowledge Service for AI-powered query processing.
Handles natural language understanding and knowledge retrieval.
"""

from typing import Dict, Any, List, Optional
import openai
import json
from ..core.config import settings
from ..core.database import db


class KnowledgeService:
    """
    Service for AI-powered knowledge processing and query understanding.
    """
    
    def __init__(self):
        """Initialize OpenAI client."""
        self.client = openai.OpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
    
    async def initialize_knowledge_base(self) -> None:
        """
        Initialize the knowledge base with default financial model information.
        """
        # Default knowledge base chunks for the hackathon
        default_chunks = [
            {
                "id": "revenue_model_large",
                "content": "Large customer revenue model: Default ARPU $16,667 per month, onboarding ramp [1,1,2,2,3,4,5,6,7,8,9] customers per month, 5% monthly growth after onboarding, 2% monthly churn rate.",
                "metadata": {"category": "revenue_model", "business_unit": "large_customer"}
            },
            {
                "id": "revenue_model_smb",
                "content": "SMB customer revenue model: Default ARPU $5,000 per month, $200,000 monthly marketing spend, $1,250 CAC, 45% conversion rate, 3% monthly growth, 5% monthly churn rate.",
                "metadata": {"category": "revenue_model", "business_unit": "smb_customer"}
            },
            {
                "id": "forecast_types",
                "content": "Supported forecast types: forecast_total_revenue (combined large + SMB), forecast_large_revenue (enterprise only), forecast_smb_revenue (SMB only), explain_assumptions (return current assumptions).",
                "metadata": {"category": "forecast_types"}
            },
            {
                "id": "assumption_overrides",
                "content": "Users can override assumptions by specifying new values in queries. Common overrides: marketing spend increases/decreases, ARPU changes, CAC adjustments, conversion rate modifications.",
                "metadata": {"category": "assumptions"}
            },
            {
                "id": "timeframes",
                "content": "Default forecast period is 12 months. Supported ranges: 1-36 months. All forecasts use monthly granularity.",
                "metadata": {"category": "timeframes"}
            }
        ]
        
        # Store default chunks in database
        for chunk in default_chunks:
            try:
                await db.create("knowledge_chunks", chunk)
            except Exception as e:
                print(f"Warning: Could not store knowledge chunk {chunk['id']}: {e}")
    
    async def parse_query(self, query: str) -> Dict[str, Any]:
        """
        Parse natural language query using OpenAI to extract intent and parameters.
        
        Args:
            query: Natural language financial query
            
        Returns:
            Dictionary with parsed intent and parameters
        """
        system_prompt = """
        You are a financial forecasting AI assistant for a SaaS company. 
        Parse the user's natural language query and extract the following information:
        
        1. forecast_type: One of ["forecast_total_revenue", "forecast_large_revenue", "forecast_smb_revenue", "explain_assumptions"]
        2. timeframe_months: Number of months to forecast (default 12)
        3. assumption_overrides: Any specific assumptions the user wants to change
        
        The company has two business units:
        - Large customers: ARPU $16,667/month, onboarding ramp, 5% growth, 2% churn
        - SMB customers: ARPU $5,000/month, $200K marketing spend, $1,250 CAC, 45% conversion, 3% growth, 5% churn
        
        Return a JSON object with the parsed information.
        """
        
        user_prompt = f"""
        Parse this financial query: "{query}"
        
        Return only a valid JSON object with:
        - forecast_type: string
        - timeframe_months: number
        - assumption_overrides: object (if any)
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.1,
                max_tokens=500
            )
            
            # Parse the JSON response
            content = response.choices[0].message.content.strip()
            
            # Clean up the response (remove markdown formatting if present)
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
            
            parsed_result = json.loads(content)
            
            # Validate and set defaults
            if "forecast_type" not in parsed_result:
                parsed_result["forecast_type"] = "forecast_total_revenue"
            if "timeframe_months" not in parsed_result:
                parsed_result["timeframe_months"] = 12
            if "assumption_overrides" not in parsed_result:
                parsed_result["assumption_overrides"] = {}
            
            return parsed_result
            
        except Exception as e:
            print(f"Error parsing query: {e}")
            # Return default values if parsing fails
            return {
                "forecast_type": "forecast_total_revenue",
                "timeframe_months": 12,
                "assumption_overrides": {}
            }
    
    async def search_knowledge_base(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Search the knowledge base for relevant information.
        
        Args:
            query: Search query
            limit: Maximum number of results
            
        Returns:
            List of relevant knowledge chunks
        """
        try:
            # For now, return all chunks (simplified implementation)
            chunks = await db.get_all("knowledge_chunks", limit=limit)
            return chunks
        except Exception as e:
            print(f"Error searching knowledge base: {e}")
            return []
    
    async def explain_assumptions(self) -> Dict[str, Any]:
        """
        Return current financial model assumptions.
        
        Returns:
            Dictionary with all current assumptions
        """
        return {
            "large_customer": {
                "arpu": settings.large_customer_arpu,
                "onboarding_ramp": [1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9],
                "monthly_growth_rate": 0.05,
                "monthly_churn_rate": 0.02
            },
            "smb_customer": {
                "arpu": settings.smb_customer_arpu,
                "marketing_spend": settings.smb_marketing_spend,
                "cac": settings.smb_cac,
                "conversion_rate": settings.smb_conversion_rate,
                "monthly_growth_rate": 0.03,
                "monthly_churn_rate": 0.05
            },
            "defaults": {
                "forecast_period_months": 12,
                "supported_forecast_types": [
                    "forecast_total_revenue",
                    "forecast_large_revenue", 
                    "forecast_smb_revenue",
                    "explain_assumptions"
                ]
            }
        }
