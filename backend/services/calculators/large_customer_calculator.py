"""
Large Customer Calculator for enterprise client revenue forecasting.
Implements the business logic as specified in the PRD.
Pure Python calculations - no LLM involvement in math.
"""

from typing import List, Dict, Any, Optional


class LargeCustomerCalculator:
    """
    Calculator for large customer (enterprise) revenue forecasting.
    
    Implements the business logic from the PRD:
    - Default ARPU: $16,667 per month
    - Onboarding ramp: [1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9] customers per month
    - Growth rate: 5% monthly after onboarding period
    - Churn rate: 2% monthly
    """
    
    def __init__(self, default_arpu: float = 16667):
        """
        Initialize calculator with default assumptions.
        
        Args:
            default_arpu: Default Average Revenue Per User for large customers
        """
        self.default_arpu = default_arpu
        self.onboarding_ramp = [1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9]  # M1, M2, ..., M11
        self.default_growth_rate = 0.05  # 5% monthly growth
        self.default_churn_rate = 0.02   # 2% monthly churn
    
    def calculate(
        self, 
        timeframe_months: int, 
        arpu: Optional[float] = None,
        growth_rate: Optional[float] = None,
        churn_rate: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        """
        Calculate monthly revenue for large customers.
        
        Args:
            timeframe_months: Number of months to forecast
            arpu: Override ARPU (defaults to self.default_arpu)
            growth_rate: Override growth rate (defaults to self.default_growth_rate)
            churn_rate: Override churn rate (defaults to self.default_churn_rate)
            
        Returns:
            List of monthly data dictionaries with revenue, customers, and metadata
        """
        # Use provided values or defaults
        arpu = arpu or self.default_arpu
        growth_rate = growth_rate or self.default_growth_rate
        churn_rate = churn_rate or self.default_churn_rate
        
        monthly_data = []
        cumulative_customers = 0
        
        for month in range(1, timeframe_months + 1):
            # Calculate new customers for this month
            if month <= len(self.onboarding_ramp):
                # Use onboarding ramp
                new_customers = self.onboarding_ramp[month - 1]
            else:
                # Apply growth rate to previous month's new customers
                if month == len(self.onboarding_ramp) + 1:
                    # First month after onboarding ramp
                    new_customers = self.onboarding_ramp[-1] * (1 + growth_rate)
                else:
                    # Continue growth from previous month
                    new_customers = monthly_data[-1]["new_customers"] * (1 + growth_rate)
            
            # Apply churn to existing customers
            churned_customers = cumulative_customers * churn_rate
            
            # Update cumulative customers
            cumulative_customers = cumulative_customers + new_customers - churned_customers
            
            # Calculate revenue
            revenue = cumulative_customers * arpu
            
            # Store monthly data
            monthly_data.append({
                "month": month,
                "new_customers": round(new_customers, 2),
                "churned_customers": round(churned_customers, 2),
                "cumulative_customers": round(cumulative_customers, 2),
                "revenue": round(revenue, 2),
                "arpu": arpu,
                "growth_rate": growth_rate,
                "churn_rate": churn_rate
            })
        
        return monthly_data
    
    def get_assumptions(self) -> Dict[str, Any]:
        """
        Get current assumptions used by the calculator.
        
        Returns:
            Dictionary of current assumptions
        """
        return {
            "arpu": self.default_arpu,
            "onboarding_ramp": self.onboarding_ramp,
            "growth_rate": self.default_growth_rate,
            "churn_rate": self.default_churn_rate
        }
    
    def update_assumptions(self, **kwargs) -> None:
        """
        Update calculator assumptions.
        
        Args:
            **kwargs: Assumption overrides (arpu, growth_rate, churn_rate)
        """
        if "arpu" in kwargs:
            self.default_arpu = kwargs["arpu"]
        if "growth_rate" in kwargs:
            self.default_growth_rate = kwargs["growth_rate"]
        if "churn_rate" in kwargs:
            self.default_churn_rate = kwargs["churn_rate"]
