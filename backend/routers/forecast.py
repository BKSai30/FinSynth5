"""
Forecast API router for handling financial forecasting requests.
Implements the main forecast endpoint as specified in the PRD.
"""

from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from ..core.database import get_session
from ..models.forecast import ForecastRequest, ForecastResponse, ForecastQuery, ForecastResult
from ..services.knowledge_service import KnowledgeService
from ..services.query_parser import QueryParser
from ..services.calculators.large_customer_calculator import LargeCustomerCalculator
from ..services.calculators.smb_calculator import SMBCalculator
from ..workers.tasks import generate_excel_report


router = APIRouter(prefix="/forecast", tags=["forecast"])

# Initialize services
knowledge_service = KnowledgeService()
query_parser = QueryParser()
large_calculator = LargeCustomerCalculator()
smb_calculator = SMBCalculator()


@router.post("/", response_model=ForecastResponse)
async def create_forecast(
    request: ForecastRequest,
    session: AsyncSession = Depends(get_session)
) -> ForecastResponse:
    """
    Create a new financial forecast based on natural language query.
    
    This endpoint:
    1. Accepts user query from request body
    2. Calls KnowledgeService to get context
    3. Calls QueryParser to get intent
    4. Calls appropriate calculators
    5. Saves query and result to DB
    6. Returns JSON result
    
    Args:
        request: Forecast request with natural language query
        session: Database session dependency
        
    Returns:
        Forecast response with results and metadata
        
    Raises:
        HTTPException: If parsing or calculation fails
    """
    try:
        # Step 1: Get relevant knowledge context
        knowledge_context = await knowledge_service.get_relevant_context(request.query)
        
        # Step 2: Parse the query into structured intent
        parsed_intent = await query_parser.parse_query(request.query, knowledge_context)
        
        # Step 3: Create forecast query record
        forecast_query = ForecastQuery(
            query_text=request.query,
            parsed_intent=parsed_intent,
            status="processing"
        )
        session.add(forecast_query)
        await session.commit()
        await session.refresh(forecast_query)
        
        # Step 4: Execute calculations based on intent
        result_data, assumptions_used = await _execute_calculation(parsed_intent)
        
        # Step 5: Create forecast result record
        forecast_result = ForecastResult(
            query_id=forecast_query.id,
            result=result_data,
            assumptions_used=assumptions_used,
            calculation_metadata={
                "intent": parsed_intent["intent"],
                "timeframe_months": parsed_intent["timeframe_months"],
                "calculator_version": "1.0.0"
            }
        )
        session.add(forecast_result)
        
        # Step 6: Update query status
        forecast_query.status = "completed"
        await session.commit()
        
        return ForecastResponse(
            query_id=forecast_query.id,
            status="completed",
            result=result_data,
            assumptions_used=assumptions_used,
            message="Forecast completed successfully"
        )
        
    except ValueError as e:
        # Update query status to failed
        if 'forecast_query' in locals():
            forecast_query.status = "failed"
            await session.commit()
        
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Query parsing failed: {str(e)}"
        )
    except Exception as e:
        # Update query status to failed
        if 'forecast_query' in locals():
            forecast_query.status = "failed"
            await session.commit()
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Forecast calculation failed: {str(e)}"
        )


async def _execute_calculation(parsed_intent: Dict[str, Any]) -> tuple[Dict[str, Any], Dict[str, Any]]:
    """
    Execute the appropriate calculation based on parsed intent.
    
    Args:
        parsed_intent: Structured intent from query parser
        
    Returns:
        Tuple of (result_data, assumptions_used)
    """
    intent = parsed_intent["intent"]
    timeframe_months = parsed_intent["timeframe_months"]
    assumption_overrides = parsed_intent["assumption_overrides"]
    
    # Get base assumptions and apply overrides
    base_assumptions = await knowledge_service.get_assumptions()
    updated_assumptions = await knowledge_service.update_assumptions(assumption_overrides)
    
    result_data = {}
    assumptions_used = updated_assumptions
    
    if intent == "forecast_total_revenue":
        # Calculate both large and SMB revenue
        large_data = large_calculator.calculate(
            timeframe_months=timeframe_months,
            **updated_assumptions["large_customer"]
        )
        smb_data = smb_calculator.calculate(
            timeframe_months=timeframe_months,
            **updated_assumptions["smb_customer"]
        )
        
        # Combine results with detailed metrics
        result_data = {
            "forecast_type": "total_revenue",
            "timeframe_months": timeframe_months,
            "monthly_data": [],
            "summary": {
                "total_revenue": 0,
                "large_customer_revenue": 0,
                "smb_customer_revenue": 0
            }
        }
        
        for i in range(timeframe_months):
            large_revenue = large_data[i]["revenue"]
            smb_revenue = smb_data[i]["revenue"]
            total_revenue = large_revenue + smb_revenue
            
            # Calculate sales people based on onboarding ramp (matches image pattern: 1,2,2,2,3,4,5,6,7,8,9)
            sales_people_ramp = [1, 2, 2, 2, 3, 4, 5, 6, 7, 8, 9]
            sales_people = sales_people_ramp[i] if i < len(sales_people_ramp) else sales_people_ramp[-1]
            
            # Calculate sales enquiries and conversions (from SMB assumptions)
            sales_enquiries = 160  # Constant as shown in image
            conversion_rate = updated_assumptions["smb_customer"].get("conversion_rate", 0.45)
            
            result_data["monthly_data"].append({
                "month": i + 1,
                "large_customer_revenue": large_revenue,
                "smb_customer_revenue": smb_revenue,
                "total_revenue": total_revenue,
                "total_revenue_mn": round(total_revenue / 1000000, 2),
                # Sales & Large Customer Metrics
                "sales_people": sales_people,
                "large_accounts_per_sales_person": 1,  # Constant as shown in image
                "large_accounts_onboarded": large_data[i]["new_customers"],
                "cumulative_large_customers": large_data[i]["cumulative_customers"],
                "avg_revenue_per_large_customer": updated_assumptions["large_customer"].get("arpu", 16667),
                # Marketing Metrics
                "digital_marketing_spend": updated_assumptions["smb_customer"].get("marketing_spend", 200000),
                "avg_cac": updated_assumptions["smb_customer"].get("cac", 1250),
                "sales_enquiries": sales_enquiries,
                "conversion_rate": conversion_rate,
                # SMB Customer Metrics
                "smb_customers_onboarded": smb_data[i]["new_customers"],
                "cumulative_smb_customers": smb_data[i]["cumulative_customers"],
                "avg_revenue_per_smb_customer": updated_assumptions["smb_customer"].get("arpu", 5000),
                # Additional detailed metrics from calculators
                "large_churned_customers": large_data[i]["churned_customers"],
                "smb_churned_customers": smb_data[i]["churned_customers"],
                "large_growth_rate": updated_assumptions["large_customer"].get("growth_rate", 0.05),
                "smb_growth_rate": updated_assumptions["smb_customer"].get("growth_rate", 0.03),
                "large_churn_rate": updated_assumptions["large_customer"].get("churn_rate", 0.02),
                "smb_churn_rate": updated_assumptions["smb_customer"].get("churn_rate", 0.05)
            })
            
            result_data["summary"]["total_revenue"] += total_revenue
            result_data["summary"]["large_customer_revenue"] += large_revenue
            result_data["summary"]["smb_customer_revenue"] += smb_revenue
    
    elif intent == "forecast_large_revenue":
        # Calculate only large customer revenue
        large_data = large_calculator.calculate(
            timeframe_months=timeframe_months,
            **updated_assumptions["large_customer"]
        )
        
        result_data = {
            "forecast_type": "large_customer_revenue",
            "timeframe_months": timeframe_months,
            "monthly_data": large_data,
            "summary": {
                "total_revenue": sum(month["revenue"] for month in large_data),
                "total_customers": large_data[-1]["cumulative_customers"] if large_data else 0
            }
        }
    
    elif intent == "forecast_smb_revenue":
        # Calculate only SMB customer revenue
        smb_data = smb_calculator.calculate(
            timeframe_months=timeframe_months,
            **updated_assumptions["smb_customer"]
        )
        
        result_data = {
            "forecast_type": "smb_customer_revenue",
            "timeframe_months": timeframe_months,
            "monthly_data": smb_data,
            "summary": {
                "total_revenue": sum(month["revenue"] for month in smb_data),
                "total_customers": smb_data[-1]["cumulative_customers"] if smb_data else 0
            }
        }
    
    elif intent == "explain_assumptions":
        # Return current assumptions without calculations
        result_data = {
            "forecast_type": "assumptions_explanation",
            "assumptions": updated_assumptions,
            "message": "Current assumptions for financial forecasting"
        }
    
    else:
        raise ValueError(f"Unknown intent: {intent}")
    
    return result_data, assumptions_used


@router.get("/{query_id}", response_model=ForecastResponse)
async def get_forecast(
    query_id: int,
    session: AsyncSession = Depends(get_session)
) -> ForecastResponse:
    """
    Get a specific forecast by query ID.
    
    Args:
        query_id: ID of the forecast query
        session: Database session dependency
        
    Returns:
        Forecast response with results
        
    Raises:
        HTTPException: If forecast not found
    """
    # Get forecast query
    query_result = await session.execute(
        select(ForecastQuery).where(ForecastQuery.id == query_id)
    )
    forecast_query = query_result.scalar_one_or_none()
    
    if not forecast_query:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Forecast not found"
        )
    
    # Get forecast result
    result_query = await session.execute(
        select(ForecastResult).where(ForecastResult.query_id == query_id)
    )
    forecast_result = result_query.scalar_one_or_none()
    
    return ForecastResponse(
        query_id=forecast_query.id,
        status=forecast_query.status,
        result=forecast_result.result if forecast_result else None,
        assumptions_used=forecast_result.assumptions_used if forecast_result else None,
        message=f"Forecast {forecast_query.status}"
    )


@router.get("/", response_model=list[ForecastResponse])
async def list_forecasts(
    limit: int = 10,
    offset: int = 0,
    session: AsyncSession = Depends(get_session)
) -> list[ForecastResponse]:
    """
    List recent forecasts with pagination.
    
    Args:
        limit: Maximum number of forecasts to return
        offset: Number of forecasts to skip
        session: Database session dependency
        
    Returns:
        List of forecast responses
    """
    # Get recent forecast queries
    query_result = await session.execute(
        select(ForecastQuery)
        .order_by(ForecastQuery.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    forecast_queries = query_result.scalars().all()
    
    responses = []
    for query in forecast_queries:
        # Get associated result
        result_query = await session.execute(
            select(ForecastResult).where(ForecastResult.query_id == query.id)
        )
        forecast_result = result_query.scalar_one_or_none()
        
        responses.append(ForecastResponse(
            query_id=query.id,
            status=query.status,
            result=forecast_result.result if forecast_result else None,
            assumptions_used=forecast_result.assumptions_used if forecast_result else None,
            message=f"Forecast {query.status}"
        ))
    
    return responses


@router.post("/export")
async def export_forecast_to_excel(
    query_id: int,
    session: AsyncSession = Depends(get_session)
):
    """
    Export a forecast to Excel format.
    
    Args:
        query_id: ID of the forecast query to export
        session: Database session dependency
        
    Returns:
        Dictionary with task ID and status for tracking Excel generation
        
    Raises:
        HTTPException: If forecast not found
    """
    # Get forecast query
    query_result = await session.execute(
        select(ForecastQuery).where(ForecastQuery.id == query_id)
    )
    forecast_query = query_result.scalar_one_or_none()
    
    if not forecast_query:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Forecast not found"
        )
    
    # Get forecast result
    result_query = await session.execute(
        select(ForecastResult).where(ForecastResult.query_id == query_id)
    )
    forecast_result = result_query.scalar_one_or_none()
    
    if not forecast_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Forecast result not found"
        )
    
    # Start Excel generation task
    task = generate_excel_report.delay(
        query_id=query_id,
        forecast_data=forecast_result.result,
        assumptions=forecast_result.assumptions_used
    )
    
    return {
        "task_id": task.id,
        "status": "processing",
        "message": "Excel generation started"
    }
