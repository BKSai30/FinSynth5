"""
Vector service for semantic search using pgvector.
Implements the RAG pipeline as specified in the PRD.
"""

import numpy as np
from typing import List, Dict, Any, Optional
import openai
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import json

from ..core.config import settings
from ..core.database import get_session


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
        session: AsyncSession
    ) -> None:
        """
        Store a knowledge chunk with its embedding in the database.
        
        Args:
            chunk_id: Unique identifier for the chunk
            content: Text content of the chunk
            metadata: Additional metadata
            session: Database session
        """
        # Generate embedding
        embedding = await self.generate_embedding(content)
        
        # Convert to numpy array for pgvector
        embedding_array = np.array(embedding, dtype=np.float32)
        
        # Store in database
        query = text("""
            INSERT INTO knowledge_chunks (id, content, metadata, embedding)
            VALUES (:chunk_id, :content, :metadata, :embedding)
            ON CONFLICT (id) DO UPDATE SET
                content = EXCLUDED.content,
                metadata = EXCLUDED.metadata,
                embedding = EXCLUDED.embedding,
                updated_at = CURRENT_TIMESTAMP
        """)
        
        await session.execute(query, {
            "chunk_id": chunk_id,
            "content": content,
            "metadata": json.dumps(metadata),
            "embedding": embedding_array.tolist()
        })
        await session.commit()
    
    async def search_similar_chunks(
        self, 
        query_text: str, 
        limit: int = 5,
        session: AsyncSession = None
    ) -> List[Dict[str, Any]]:
        """
        Search for similar knowledge chunks using vector similarity.
        
        Args:
            query_text: Query text to search for
            limit: Maximum number of results to return
            session: Database session
            
        Returns:
            List of similar chunks with metadata
        """
        if session is None:
            async with get_session() as session:
                return await self._perform_search(query_text, limit, session)
        else:
            return await self._perform_search(query_text, limit, session)
    
    async def _perform_search(
        self, 
        query_text: str, 
        limit: int, 
        session: AsyncSession
    ) -> List[Dict[str, Any]]:
        """Perform the actual vector search."""
        # Generate query embedding
        query_embedding = await self.generate_embedding(query_text)
        query_array = np.array(query_embedding, dtype=np.float32)
        
        # Perform similarity search
        query = text("""
            SELECT id, content, metadata, 
                   embedding <-> :query_embedding AS distance
            FROM knowledge_chunks
            ORDER BY embedding <-> :query_embedding
            LIMIT :limit
        """)
        
        result = await session.execute(query, {
            "query_embedding": query_array.tolist(),
            "limit": limit
        })
        
        chunks = []
        for row in result:
            chunks.append({
                "id": row.id,
                "content": row.content,
                "metadata": json.loads(row.metadata) if row.metadata else {},
                "similarity": 1 - row.distance  # Convert distance to similarity
            })
        
        return chunks
    
    async def initialize_knowledge_base(self, session: AsyncSession) -> None:
        """
        Initialize the knowledge base with default chunks.
        
        Args:
            session: Database session
        """
        # Create the knowledge_chunks table if it doesn't exist
        create_table_query = text("""
            CREATE TABLE IF NOT EXISTS knowledge_chunks (
                id VARCHAR(255) PRIMARY KEY,
                content TEXT NOT NULL,
                metadata JSONB,
                embedding VECTOR(1536),  -- OpenAI text-embedding-3-small dimension
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx 
            ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops);
        """)
        
        await session.execute(create_table_query)
        await session.commit()
        
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
