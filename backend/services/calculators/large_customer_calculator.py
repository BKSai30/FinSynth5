"""
Large Customer Revenue Calculator
Implements the financial model for large enterprise customers.
"""

from typing import Dict, Any, List
from datetime import datetime, timedelta
import math


class LargeCustomerCalculator:
    """
    Calculator for large customer revenue forecasting.
    
    Model assumptions:
    - ARPU: $16,667 per month per customer
    - Onboarding ramp: [1,1,2,2,3,4,5,6,7,8,9] customers per month
    - Monthly growth: 5% after onboarding
    - Churn rate: 2% monthly
    """
    
    def __init__(self, arpu: float = 16667.0):
        self.arpu = arpu
        self.onboarding_ramp = [1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9]
        self.monthly_growth_rate = 0.05
        self.monthly_churn_rate = 0.02
    
    def calculate_revenue(
        self, 
        months: int = 12, 
        custom_arpu: float = None,
        custom_growth_rate: float = None,
        custom_churn_rate: float = None
    ) -> Dict[str, Any]:
        """
        Calculate large customer revenue forecast.
        
        Args:
            months: Number of months to forecast
            custom_arpu: Override default ARPU
            custom_growth_rate: Override default growth rate
            custom_churn_rate: Override default churn rate
            
        Returns:
            Dictionary with monthly data and summary
        """
        # Use custom values if provided
        arpu = custom_arpu or self.arpu
        growth_rate = custom_growth_rate or self.monthly_growth_rate
        churn_rate = custom_churn_rate or self.monthly_churn_rate
        
        monthly_data = []
        total_customers = 0
        total_revenue = 0
        
        for month in range(1, months + 1):
            # Calculate new customers for this month
            if month <= len(self.onboarding_ramp):
                new_customers = self.onboarding_ramp[month - 1]
            else:
                # After onboarding, use growth rate
                new_customers = math.ceil(total_customers * growth_rate)
            
            # Apply churn to existing customers
            churned_customers = math.floor(total_customers * churn_rate)
            
            # Update total customers
            total_customers = max(0, total_customers + new_customers - churned_customers)
            
            # Calculate monthly revenue
            monthly_revenue = total_customers * arpu
            
            monthly_data.append({
                "month": month,
                "new_customers": new_customers,
                "churned_customers": churned_customers,
                "total_customers": total_customers,
                "revenue": monthly_revenue,
                "arpu": arpu
            })
            
            total_revenue += monthly_revenue
        
        return {
            "forecast_type": "large_customer",
            "timeframe_months": months,
            "monthly_data": monthly_data,
            "summary": {
                "total_revenue": total_revenue,
                "average_monthly_revenue": total_revenue / months,
                "final_customer_count": total_customers,
                "total_customers_acquired": sum([data["new_customers"] for data in monthly_data]),
                "total_customers_churned": sum([data["churned_customers"] for data in monthly_data])
            },
            "assumptions_used": {
                "arpu": arpu,
                "onboarding_ramp": self.onboarding_ramp,
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
        custom_arpu = assumptions.get("large_customer_arpu")
        custom_growth = assumptions.get("large_customer_growth_rate")
        custom_churn = assumptions.get("large_customer_churn_rate")
        
        return self.calculate_revenue(
            months=months,
            custom_arpu=custom_arpu,
            custom_growth_rate=custom_growth,
            custom_churn_rate=custom_churn
        )
