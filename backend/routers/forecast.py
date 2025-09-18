"""
Forecast router for AI-powered financial forecasting.
Handles forecast creation, retrieval, and management.
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from datetime import datetime
import json

from ..core.database import db
from ..services.knowledge_service import KnowledgeService
from ..services.calculators.large_customer_calculator import LargeCustomerCalculator
from ..services.calculators.smb_calculator import SMBCalculator
from .auth import get_current_user_id

router = APIRouter()


class ForecastRequest(BaseModel):
    """Request model for forecast creation."""
    query: str


class ForecastResponse(BaseModel):
    """Response model for forecast results."""
    query_id: int
    status: str
    result: Optional[Dict[str, Any]] = None
    assumptions_used: Optional[Dict[str, Any]] = None
    message: Optional[str] = None
    created_at: Optional[datetime] = None


# Initialize services
knowledge_service = KnowledgeService()
large_calculator = LargeCustomerCalculator()
smb_calculator = SMBCalculator()


@router.post("/", response_model=ForecastResponse)
async def create_forecast(
    request: ForecastRequest,
    background_tasks: BackgroundTasks,
    user_id: str = Depends(get_current_user_id)
):
    """
    Create a new financial forecast based on natural language query.
    """
    try:
        # Parse the query using AI
        parsed_query = await knowledge_service.parse_query(request.query)
        
        # Store the query in database
        query_record = await db.create("forecast_queries", {
            "user_id": user_id,
            "query_text": request.query,
            "parsed_intent": parsed_query,
            "status": "processing",
            "created_at": "now()"
        })
        
        if not query_record:
            raise HTTPException(status_code=500, detail="Failed to store query")
        
        query_id = query_record["id"]
        
        # Process the forecast based on parsed intent
        forecast_type = parsed_query.get("forecast_type", "forecast_total_revenue")
        timeframe_months = parsed_query.get("timeframe_months", 12)
        assumption_overrides = parsed_query.get("assumption_overrides", {})
        
        result = None
        assumptions_used = {}
        
        if forecast_type == "forecast_total_revenue":
            # Calculate both large and SMB revenue
            large_result = large_calculator.calculate_with_assumptions_override(
                timeframe_months, assumption_overrides
            )
            smb_result = smb_calculator.calculate_with_assumptions_override(
                timeframe_months, assumption_overrides
            )
            
            # Combine results
            result = {
                "forecast_type": "total_revenue",
                "timeframe_months": timeframe_months,
                "large_customer": large_result,
                "smb_customer": smb_result,
                "summary": {
                    "total_revenue": (
                        large_result["summary"]["total_revenue"] + 
                        smb_result["summary"]["total_revenue"]
                    ),
                    "large_customer_revenue": large_result["summary"]["total_revenue"],
                    "smb_customer_revenue": smb_result["summary"]["total_revenue"],
                    "total_customers": (
                        large_result["summary"]["final_customer_count"] + 
                        smb_result["summary"]["final_customer_count"]
                    )
                }
            }
            assumptions_used = {
                "large_customer": large_result["assumptions_used"],
                "smb_customer": smb_result["assumptions_used"]
            }
            
        elif forecast_type == "forecast_large_revenue":
            result = large_calculator.calculate_with_assumptions_override(
                timeframe_months, assumption_overrides
            )
            assumptions_used = result["assumptions_used"]
            
        elif forecast_type == "forecast_smb_revenue":
            result = smb_calculator.calculate_with_assumptions_override(
                timeframe_months, assumption_overrides
            )
            assumptions_used = result["assumptions_used"]
            
        elif forecast_type == "explain_assumptions":
            result = await knowledge_service.explain_assumptions()
            assumptions_used = result
        
        # Store the result
        await db.create("forecast_results", {
            "query_id": query_id,
            "result": result,
            "assumptions_used": assumptions_used,
            "created_at": "now()"
        })
        
        # Update query status
        await db.update("forecast_queries", query_id, {
            "status": "completed",
            "completed_at": "now()"
        })
        
        return ForecastResponse(
            query_id=query_id,
            status="completed",
            result=result,
            assumptions_used=assumptions_used,
            message="Forecast generated successfully",
            created_at=datetime.utcnow()
        )
        
    except Exception as e:
        # Update query status to failed
        if 'query_id' in locals():
            await db.update("forecast_queries", query_id, {
                "status": "failed",
                "completed_at": "now()"
            })
        
        raise HTTPException(status_code=500, detail=f"Error generating forecast: {str(e)}")


@router.get("/{forecast_id}", response_model=ForecastResponse)
async def get_forecast(
    forecast_id: int,
    user_id: str = Depends(get_current_user_id)
):
    """
    Get a specific forecast by ID.
    """
    try:
        # Get the query
        query = await db.get_by_id("forecast_queries", forecast_id)
        if not query:
            raise HTTPException(status_code=404, detail="Forecast not found")
        
        # Check if user owns this forecast
        if query["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Get the result
        result = await db.query("forecast_results", {"query_id": forecast_id})
        
        if result:
            return ForecastResponse(
                query_id=forecast_id,
                status=query["status"],
                result=result[0]["result"],
                assumptions_used=result[0]["assumptions_used"],
                message="Forecast retrieved successfully",
                created_at=query["created_at"]
            )
        else:
            return ForecastResponse(
                query_id=forecast_id,
                status=query["status"],
                message="Forecast is still processing",
                created_at=query["created_at"]
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving forecast: {str(e)}")


@router.get("/", response_model=List[ForecastResponse])
async def list_forecasts(
    limit: int = 10,
    offset: int = 0,
    user_id: str = Depends(get_current_user_id)
):
    """
    List recent forecasts for the current user.
    """
    try:
        # Get user's queries
        queries = await db.query(
            "forecast_queries", 
            {"user_id": user_id},
            "created_at.desc"
        )
        
        # Limit and offset
        queries = queries[offset:offset + limit]
        
        forecasts = []
        for query in queries:
            # Get the result if it exists
            result = await db.query("forecast_results", {"query_id": query["id"]})
            
            forecasts.append(ForecastResponse(
                query_id=query["id"],
                status=query["status"],
                result=result[0]["result"] if result else None,
                assumptions_used=result[0]["assumptions_used"] if result else None,
                message="Forecast retrieved successfully" if result else "Forecast is still processing",
                created_at=query["created_at"]
            ))
        
        return forecasts
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing forecasts: {str(e)}")


@router.get("/assumptions/current")
async def get_current_assumptions():
    """
    Get current financial model assumptions.
    """
    try:
        assumptions = await knowledge_service.explain_assumptions()
        return {
            "assumptions": assumptions,
            "message": "Current assumptions retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving assumptions: {str(e)}")
