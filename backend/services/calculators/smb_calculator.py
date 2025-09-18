"""
SMB Customer Revenue Calculator
Implements the financial model for small and medium business customers.
"""

from typing import Dict, Any, List
from datetime import datetime, timedelta
import math


class SMBCalculator:
    """
    Calculator for SMB customer revenue forecasting.
    
    Model assumptions:
    - ARPU: $5,000 per month per customer
    - Marketing spend: $200,000 per month
    - CAC: $1,250 per customer
    - Conversion rate: 45%
    - Monthly growth: 3%
    - Churn rate: 5% monthly
    """
    
    def __init__(
        self, 
        arpu: float = 5000.0,
        marketing_spend: float = 200000.0,
        cac: float = 1250.0,
        conversion_rate: float = 0.45
    ):
        self.arpu = arpu
        self.marketing_spend = marketing_spend
        self.cac = cac
        self.conversion_rate = conversion_rate
        self.monthly_growth_rate = 0.03
        self.monthly_churn_rate = 0.05
    
    def calculate_revenue(
        self, 
        months: int = 12,
        custom_arpu: float = None,
        custom_marketing_spend: float = None,
        custom_cac: float = None,
        custom_conversion_rate: float = None,
        custom_growth_rate: float = None,
        custom_churn_rate: float = None
    ) -> Dict[str, Any]:
        """
        Calculate SMB customer revenue forecast.
        
        Args:
            months: Number of months to forecast
            custom_arpu: Override default ARPU
            custom_marketing_spend: Override default marketing spend
            custom_cac: Override default CAC
            custom_conversion_rate: Override default conversion rate
            custom_growth_rate: Override default growth rate
            custom_churn_rate: Override default churn rate
            
        Returns:
            Dictionary with monthly data and summary
        """
        # Use custom values if provided
        arpu = custom_arpu or self.arpu
        marketing_spend = custom_marketing_spend or self.marketing_spend
        cac = custom_cac or self.cac
        conversion_rate = custom_conversion_rate or self.conversion_rate
        growth_rate = custom_growth_rate or self.monthly_growth_rate
        churn_rate = custom_churn_rate or self.monthly_churn_rate
        
        monthly_data = []
        total_customers = 0
        total_revenue = 0
        total_marketing_spend = 0
        
        for month in range(1, months + 1):
            # Calculate leads from marketing spend
            leads = marketing_spend / cac
            
            # Calculate new customers from leads
            new_customers = math.floor(leads * conversion_rate)
            
            # Apply churn to existing customers
            churned_customers = math.floor(total_customers * churn_rate)
            
            # Update total customers
            total_customers = max(0, total_customers + new_customers - churned_customers)
            
            # Calculate monthly revenue
            monthly_revenue = total_customers * arpu
            
            monthly_data.append({
                "month": month,
                "marketing_spend": marketing_spend,
                "leads": leads,
                "new_customers": new_customers,
                "churned_customers": churned_customers,
                "total_customers": total_customers,
                "revenue": monthly_revenue,
                "arpu": arpu,
                "cac": cac,
                "conversion_rate": conversion_rate
            })
            
            total_revenue += monthly_revenue
            total_marketing_spend += marketing_spend
            
            # Apply growth to marketing spend for next month
            marketing_spend = marketing_spend * (1 + growth_rate)
        
        return {
            "forecast_type": "smb_customer",
            "timeframe_months": months,
            "monthly_data": monthly_data,
            "summary": {
                "total_revenue": total_revenue,
                "average_monthly_revenue": total_revenue / months,
                "total_marketing_spend": total_marketing_spend,
                "final_customer_count": total_customers,
                "total_customers_acquired": sum([data["new_customers"] for data in monthly_data]),
                "total_customers_churned": sum([data["churned_customers"] for data in monthly_data]),
                "roi": (total_revenue - total_marketing_spend) / total_marketing_spend if total_marketing_spend > 0 else 0
            },
            "assumptions_used": {
                "arpu": arpu,
                "marketing_spend": self.marketing_spend,
                "cac": cac,
                "conversion_rate": conversion_rate,
                "monthly_growth_rate": growth_rate,
                "monthly_churn_rate": churn_rate
            }
        }
    
    def calculate_with_assumptions_override(
        self, 
        months: int, 
        assumptions: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Calculate revenue with custom assumptions.
        
        Args:
            months: Number of months to forecast
            assumptions: Dictionary with assumption overrides
            
        Returns:
            Dictionary with forecast results
        """
        custom_arpu = assumptions.get("smb_customer_arpu")
        custom_marketing_spend = assumptions.get("smb_marketing_spend")
        custom_cac = assumptions.get("smb_cac")
        custom_conversion_rate = assumptions.get("smb_conversion_rate")
        custom_growth = assumptions.get("smb_growth_rate")
        custom_churn = assumptions.get("smb_churn_rate")
        
        return self.calculate_revenue(
            months=months,
            custom_arpu=custom_arpu,
            custom_marketing_spend=custom_marketing_spend,
            custom_cac=custom_cac,
            custom_conversion_rate=custom_conversion_rate,
            custom_growth_rate=custom_growth,
            custom_churn_rate=custom_churn
        )
