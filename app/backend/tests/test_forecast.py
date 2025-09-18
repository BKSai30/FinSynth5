"""
Tests for forecast functionality.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession
from unittest.mock import AsyncMock, patch

from ..main import app
from ..models.forecast import ForecastRequest
from ..services.calculators.large_customer_calculator import LargeCustomerCalculator
from ..services.calculators.smb_calculator import SMBCalculator


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


@pytest.fixture
def large_calculator():
    """Create large customer calculator instance."""
    return LargeCustomerCalculator()


@pytest.fixture
def smb_calculator():
    """Create SMB calculator instance."""
    return SMBCalculator()


class TestLargeCustomerCalculator:
    """Test large customer calculator."""
    
    def test_calculate_default_assumptions(self, large_calculator):
        """Test calculation with default assumptions."""
        result = large_calculator.calculate(timeframe_months=12)
        
        assert len(result) == 12
        assert all('revenue' in month for month in result)
        assert all('cumulative_customers' in month for month in result)
        
        # Check that revenue increases over time
        revenues = [month['revenue'] for month in result]
        assert revenues[-1] > revenues[0]
    
    def test_calculate_with_overrides(self, large_calculator):
        """Test calculation with assumption overrides."""
        result = large_calculator.calculate(
            timeframe_months=6,
            arpu=20000,
            growth_rate=0.1
        )
        
        assert len(result) == 6
        assert result[0]['arpu'] == 20000
        assert result[0]['growth_rate'] == 0.1


class TestSMBCalculator:
    """Test SMB calculator."""
    
    def test_calculate_default_assumptions(self, smb_calculator):
        """Test calculation with default assumptions."""
        result = smb_calculator.calculate(timeframe_months=12)
        
        assert len(result) == 12
        assert all('revenue' in month for month in result)
        assert all('cumulative_customers' in month for month in result)
    
    def test_calculate_with_overrides(self, smb_calculator):
        """Test calculation with assumption overrides."""
        result = smb_calculator.calculate(
            timeframe_months=6,
            marketing_spend=300000,
            conversion_rate=0.5
        )
        
        assert len(result) == 6
        assert result[0]['marketing_spend'] == 300000
        assert result[0]['conversion_rate'] == 0.5


class TestForecastAPI:
    """Test forecast API endpoints."""
    
    @patch('backend.services.query_parser.QueryParser.parse_query')
    @patch('backend.services.knowledge_service.KnowledgeService.get_relevant_context')
    async def test_create_forecast_success(self, mock_context, mock_parse, client):
        """Test successful forecast creation."""
        # Mock the services
        mock_context.return_value = "Mock knowledge context"
        mock_parse.return_value = {
            "intent": "forecast_total_revenue",
            "timeframe_months": 12,
            "assumption_overrides": {
                "large": {"arpu": None, "growth_rate": None, "churn_rate": None},
                "smb": {"marketing_spend": None, "cac": None, "conversion_rate": None, "arpu": None, "growth_rate": None, "churn_rate": None}
            }
        }
        
        # Make request
        response = client.post("/api/v1/forecast/", json={
            "query": "Show me revenue for the next 12 months"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "query_id" in data
        assert data["status"] == "completed"
        assert "result" in data
    
    def test_create_forecast_invalid_query(self, client):
        """Test forecast creation with invalid query."""
        response = client.post("/api/v1/forecast/", json={
            "query": ""
        })
        
        assert response.status_code == 422  # Validation error
    
    def test_health_check(self, client):
        """Test health check endpoint."""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert "version" in data


@pytest.mark.asyncio
class TestAsyncForecast:
    """Test async forecast operations."""
    
    async def test_forecast_calculation_flow(self):
        """Test the complete forecast calculation flow."""
        # This would test the full async flow
        # including database operations, AI parsing, and calculations
        pass
