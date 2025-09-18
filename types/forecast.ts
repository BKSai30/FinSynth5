export interface ForecastRequest {
  query: string
}

export interface ForecastResponse {
  query_id: number
  status: string
  result?: ForecastResult
  assumptions_used?: AssumptionsUsed
  message?: string
}

export interface ForecastResult {
  query_id: number
  forecast_type: string
  timeframe_months: number
  monthly_data: MonthlyData[]
  summary: {
    total_revenue: number
    large_customer_revenue: number
    smb_customer_revenue: number
  }
}

export interface MonthlyData {
  month: number
  large_customer_revenue: number
  smb_customer_revenue: number
  total_revenue: number
  total_revenue_mn: number
  sales_people: number
  large_accounts_per_sales_person: number
  large_accounts_onboarded: number
  cumulative_large_customers: number
  avg_revenue_per_large_customer: number
  digital_marketing_spend: number
  avg_cac: number
  sales_enquiries: number
  conversion_rate: number
  smb_customers_onboarded: number
  cumulative_smb_customers: number
  avg_revenue_per_smb_customer: number
  large_churned_customers: number
  smb_churned_customers: number
  large_growth_rate: number
  smb_growth_rate: number
  large_churn_rate: number
  smb_churn_rate: number
}

export interface AssumptionsUsed {
  large_customer: {
    arpu: number
    growth_rate: number
    churn_rate: number
  }
  smb_customer: {
    arpu: number
    growth_rate: number
    churn_rate: number
    marketing_spend: number
    cac: number
    conversion_rate: number
  }
}

export interface ForecastError {
  detail?: string
  error?: string
  status_code?: number
  timestamp?: string
}
