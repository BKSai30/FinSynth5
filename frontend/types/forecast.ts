/**
 * TypeScript type definitions for forecast-related data structures.
 * These types align with the backend API schemas.
 */

export interface ForecastData {
  month: string
  largeCustomerRev: number
  smbCustomerRev: number
  totalRevenue: number
}

export interface Assumptions {
  largeCustomerARPU: number
  smbCustomerARPU: number
  marketingSpend: number
  cac: number
  conversionRate: number
}

export interface ForecastRequest {
  query: string
}

export interface ForecastResponse {
  query_id: number
  status: string
  result?: ForecastResult | null
  assumptions_used?: AssumptionsUsed | null
  message?: string | null
}

export interface ForecastResult {
  forecast_type: string
  timeframe_months: number
  monthly_data: MonthlyData[]
  summary: ForecastSummary
}

export interface MonthlyData {
  month: number
  large_customer_revenue?: number
  smb_customer_revenue?: number
  total_revenue?: number
  new_customers?: number
  churned_customers?: number
  cumulative_customers?: number
  revenue?: number
  arpu?: number
  growth_rate?: number
  churn_rate?: number
  marketing_spend?: number
  cac?: number
  conversion_rate?: number
}

export interface ForecastSummary {
  total_revenue: number
  large_customer_revenue?: number
  smb_customer_revenue?: number
  total_customers?: number
}

export interface AssumptionsUsed {
  large_customer: {
    arpu: number
    growth_rate: number
    churn_rate: number
  }
  smb_customer: {
    arpu: number
    marketing_spend: number
    cac: number
    conversion_rate: number
    growth_rate: number
    churn_rate: number
  }
}

export interface ForecastError {
  error: string
  detail?: string
  status_code: number
  timestamp: string
}
