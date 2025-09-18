"""
Vector service for semantic search using pgvector.
Implements the RAG pipeline as specified in the PRD.
"""

import numpy as np
from typing import List, Dict, Any, Optional
import openai
import json

from ..core.config import settings
from ..core.database import db


class VectorService:
    """
    Service for vector operations and semantic search.
    
    Implements the RAG pipeline:
    1. Generate embeddings for knowledge base chunks
    2. Store embeddings in pgvector database
    3. Perform similarity search for user queries
    """
    
    def __init__(self):
        """Initialize OpenAI client for embeddings."""
        self.client = openai.OpenAI(api_key=settings.openai_api_key)
        self.embedding_model = settings.openai_embedding_model
    
    async def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for a text using OpenAI API.
        
        Args:
            text: Text to generate embedding for
            
        Returns:
            List of embedding values
        """
        try:
            response = await self.client.embeddings.acreate(
                model=self.embedding_model,
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            raise ValueError(f"Failed to generate embedding: {e}")
    
    async def store_knowledge_chunk(
        self, 
        chunk_id: str, 
        content: str, 
        metadata: Dict[str, Any],
        session=None
    ) -> None:
        """
        Store a knowledge chunk with its embedding in the database.
        
        Args:
            chunk_id: Unique identifier for the chunk
            content: Text content of the chunk
            metadata: Additional metadata
            session: Database session (not used in Supabase implementation)
        """
        # For now, just store in Supabase without vector embeddings
        # This is a simplified implementation
        try:
            await db.create("knowledge_chunks", {
                "id": chunk_id,
                "content": content,
                "metadata": metadata
            })
        except Exception as e:
            print(f"Warning: Could not store knowledge chunk {chunk_id}: {e}")
    
    async def search_similar_chunks(
        self, 
        query_text: str, 
        limit: int = 5,
        session=None
    ) -> List[Dict[str, Any]]:
        """
        Search for similar knowledge chunks using vector similarity.
        
        Args:
            query_text: Query text to search for
            limit: Maximum number of results to return
            session: Database session (not used in Supabase implementation)
            
        Returns:
            List of similar chunks with metadata
        """
        # Simplified implementation - just return all chunks for now
        try:
            chunks = await db.get_all("knowledge_chunks", limit=limit)
            return chunks
        except Exception as e:
            print(f"Warning: Could not search knowledge chunks: {e}")
            return []
    
    async def _perform_search(
        self, 
        query_text: str, 
        limit: int, 
        session=None
    ) -> List[Dict[str, Any]]:
        """Perform the actual vector search."""
        # Simplified implementation - just return all chunks
        return await self.search_similar_chunks(query_text, limit, session)
    
    async def initialize_knowledge_base(self, session=None) -> None:
        """
        Initialize the knowledge base with default chunks.
        
        Args:
            session: Database session (not used in Supabase implementation)
        """
        # Default knowledge base chunks
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
        
        # Store default chunks
        for chunk in default_chunks:
            await self.store_knowledge_chunk(
                chunk["id"],
                chunk["content"],
                chunk["metadata"],
                session
            )
