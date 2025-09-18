"""
Knowledge Service for retrieving relevant business context.
Uses vector embeddings and semantic search as specified in the PRD.
"""

from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession

from .vector_service import VectorService


class KnowledgeService:
    """
    Service for retrieving relevant business knowledge and assumptions.
    
    In the full implementation, this would:
    1. Generate embeddings for knowledge base chunks
    2. Store embeddings in pgvector database
    3. Perform semantic search on user queries
    4. Return most relevant context chunks
    """
    
    def __init__(self):
        """Initialize with vector service for semantic search."""
        self.vector_service = VectorService()
        self.knowledge_base = self._load_knowledge_base()
    
    def _load_knowledge_base(self) -> str:
        """
        Load hardcoded knowledge base with business logic and assumptions.
        This represents the financial model knowledge that would be vectorized.
        """
        return """
        # ASF Financial Model Knowledge Base
        
        ## Business Units
        - **Large Customers**: Enterprise clients with high ARPU
        - **SMB Customers**: Small and medium business clients with lower ARPU
        
        ## Revenue Model
        ### Large Customer Revenue
        - **Default ARPU**: $16,667 per month
        - **Onboarding Ramp**: [1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9] customers per month
        - **Growth Rate**: 5% monthly growth after onboarding period
        - **Churn Rate**: 2% monthly churn
        
        ### SMB Customer Revenue
        - **Default ARPU**: $5,000 per month
        - **Marketing Spend**: $200,000 per month
        - **Customer Acquisition Cost (CAC)**: $1,250
        - **Conversion Rate**: 45%
        - **Growth Rate**: 3% monthly growth
        - **Churn Rate**: 5% monthly churn
        
        ## Key Metrics
        - **Total Revenue**: Large Customer Revenue + SMB Customer Revenue
        - **Customer Acquisition**: Marketing Spend / CAC
        - **Monthly Growth**: Applied to existing customer base
        
        ## Assumption Overrides
        Users can override any assumption by specifying new values in their query.
        Common overrides include:
        - Marketing spend increases/decreases
        - ARPU changes
        - CAC adjustments
        - Conversion rate modifications
        
        ## Forecast Types
        1. **Total Revenue Forecast**: Combined revenue from both business units
        2. **Large Customer Forecast**: Revenue from enterprise clients only
        3. **SMB Customer Forecast**: Revenue from small/medium business clients only
        4. **Assumption Analysis**: Explain current assumptions and their impact
        
        ## Timeframes
        - Default forecast period: 12 months
        - Supported ranges: 1-36 months
        - Monthly granularity for all forecasts
        """
    
    async def get_relevant_context(self, user_query: str, session: AsyncSession = None) -> str:
        """
        Get relevant business context for a user query using semantic search.
        
        Args:
            user_query: Natural language query from user
            session: Database session for vector search
            
        Returns:
            Relevant knowledge base context from semantic search
        """
        try:
            # Perform semantic search using vector service
            similar_chunks = await self.vector_service.search_similar_chunks(
                user_query, 
                limit=3, 
                session=session
            )
            
            # Combine relevant chunks into context
            if similar_chunks:
                context_parts = []
                for chunk in similar_chunks:
                    context_parts.append(f"**{chunk['metadata'].get('category', 'General')}**: {chunk['content']}")
                
                return "\n\n".join(context_parts)
            else:
                # Fallback to full knowledge base if no similar chunks found
                return self.knowledge_base
                
        except Exception as e:
            # Fallback to full knowledge base on error
            print(f"Vector search failed: {e}")
            return self.knowledge_base
    
    async def get_assumptions(self) -> Dict[str, Any]:
        """
        Get current default assumptions for calculations.
        
        Returns:
            Dictionary of default assumptions
        """
        return {
            "large_customer": {
                "arpu": 16667,
                "onboarding_ramp": [1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9],
                "growth_rate": 0.05,
                "churn_rate": 0.02
            },
            "smb_customer": {
                "arpu": 5000,
                "marketing_spend": 200000,
                "cac": 1250,
                "conversion_rate": 0.45,
                "growth_rate": 0.03,
                "churn_rate": 0.05
            }
        }
    
    async def update_assumptions(self, overrides: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update assumptions with user overrides.
        
        Args:
            overrides: Dictionary of assumption overrides from parsed query
            
        Returns:
            Updated assumptions dictionary
        """
        assumptions = await self.get_assumptions()
        
        # Apply overrides
        if "large" in overrides:
            assumptions["large_customer"].update(overrides["large"])
        if "smb" in overrides:
            assumptions["smb_customer"].update(overrides["smb"])
            
        return assumptions
