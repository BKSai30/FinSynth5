"""
SMB Customer Calculator for small/medium business client revenue forecasting.
Implements the business logic as specified in the PRD.
Pure Python calculations - no LLM involvement in math.
"""

from typing import List, Dict, Any, Optional


class SMBCalculator:
    """
    Calculator for SMB (small/medium business) customer revenue forecasting.
    
    Implements the business logic from the PRD:
    - Default ARPU: $5,000 per month
    - Marketing Spend: $200,000 per month
    - CAC: $1,250
    - Conversion Rate: 45%
    - Growth Rate: 3% monthly
    - Churn Rate: 5% monthly
    """
    
    def __init__(
        self, 
        default_arpu: float = 5000,
        default_marketing_spend: float = 200000,
        default_cac: float = 1250,
        default_conversion_rate: float = 0.45
    ):
        """
        Initialize calculator with default assumptions.
        
        Args:
            default_arpu: Default Average Revenue Per User for SMB customers
            default_marketing_spend: Default monthly marketing spend
            default_cac: Default Customer Acquisition Cost
            default_conversion_rate: Default conversion rate from marketing spend
        """
        self.default_arpu = default_arpu
        self.default_marketing_spend = default_marketing_spend
        self.default_cac = default_cac
        self.default_conversion_rate = default_conversion_rate
        self.default_growth_rate = 0.03  # 3% monthly growth
        self.default_churn_rate = 0.05   # 5% monthly churn
    
    def calculate(
        self,
        timeframe_months: int,
        arpu: Optional[float] = None,
        marketing_spend: Optional[float] = None,
        cac: Optional[float] = None,
        conversion_rate: Optional[float] = None,
        growth_rate: Optional[float] = None,
        churn_rate: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        """
        Calculate monthly revenue for SMB customers.
        
        Args:
            timeframe_months: Number of months to forecast
            arpu: Override ARPU (defaults to self.default_arpu)
            marketing_spend: Override marketing spend (defaults to self.default_marketing_spend)
            cac: Override CAC (defaults to self.default_cac)
            conversion_rate: Override conversion rate (defaults to self.default_conversion_rate)
            growth_rate: Override growth rate (defaults to self.default_growth_rate)
            churn_rate: Override churn rate (defaults to self.default_churn_rate)
            
        Returns:
            List of monthly data dictionaries with revenue, customers, and metadata
        """
        # Use provided values or defaults
        arpu = arpu or self.default_arpu
        marketing_spend = marketing_spend or self.default_marketing_spend
        cac = cac or self.default_cac
        conversion_rate = conversion_rate or self.default_conversion_rate
        growth_rate = growth_rate or self.default_growth_rate
        churn_rate = churn_rate or self.default_churn_rate
        
        monthly_data = []
        cumulative_customers = 0
        
        for month in range(1, timeframe_months + 1):
            # Calculate new customers from marketing spend
            # New customers = (Marketing Spend / CAC) * Conversion Rate
            new_customers = (marketing_spend / cac) * conversion_rate
            
            # Apply growth rate to marketing spend (if specified)
            if month > 1 and growth_rate > 0:
                marketing_spend = marketing_spend * (1 + growth_rate)
                # Recalculate new customers with updated marketing spend
                new_customers = (marketing_spend / cac) * conversion_rate
            
            # Apply churn to existing customers
            churned_customers = cumulative_customers * churn_rate
            
            # Update cumulative customers
            cumulative_customers = cumulative_customers + new_customers - churned_customers
            
            # Calculate revenue
            revenue = cumulative_customers * arpu
            
            # Store monthly data
            monthly_data.append({
                "month": month,
                "marketing_spend": round(marketing_spend, 2),
                "new_customers": round(new_customers, 2),
                "churned_customers": round(churned_customers, 2),
                "cumulative_customers": round(cumulative_customers, 2),
                "revenue": round(revenue, 2),
                "arpu": arpu,
                "cac": cac,
                "conversion_rate": conversion_rate,
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
            "marketing_spend": self.default_marketing_spend,
            "cac": self.default_cac,
            "conversion_rate": self.default_conversion_rate,
            "growth_rate": self.default_growth_rate,
            "churn_rate": self.default_churn_rate
        }
    
    def update_assumptions(self, **kwargs) -> None:
        """
        Update calculator assumptions.
        
        Args:
            **kwargs: Assumption overrides (arpu, marketing_spend, cac, conversion_rate, growth_rate, churn_rate)
        """
        if "arpu" in kwargs:
            self.default_arpu = kwargs["arpu"]
        if "marketing_spend" in kwargs:
            self.default_marketing_spend = kwargs["marketing_spend"]
        if "cac" in kwargs:
            self.default_cac = kwargs["cac"]
        if "conversion_rate" in kwargs:
            self.default_conversion_rate = kwargs["conversion_rate"]
        if "growth_rate" in kwargs:
            self.default_growth_rate = kwargs["growth_rate"]
        if "churn_rate" in kwargs:
            self.default_churn_rate = kwargs["churn_rate"]
