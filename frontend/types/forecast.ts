export interface ForecastRequest {
  query: string
}

export interface ForecastResponse {
  query_id: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: ForecastResult
  assumptions_used?: Assumptions
  message?: string
  created_at?: string
}

export interface ForecastResult {
  forecast_type: 'total_revenue' | 'large_customer' | 'smb_customer'
  timeframe_months: number
  monthly_data?: MonthlyData[]
  summary?: ForecastSummary
  large_customer?: LargeCustomerResult
  smb_customer?: SMBResult
}

export interface MonthlyData {
  month: number
  revenue: number
  customers?: number
  new_customers?: number
  churned_customers?: number
  total_customers?: number
  arpu?: number
  marketing_spend?: number
  leads?: number
  cac?: number
  conversion_rate?: number
}

export interface ForecastSummary {
  total_revenue: number
  average_monthly_revenue?: number
  final_customer_count?: number
  total_customers_acquired?: number
  total_customers_churned?: number
  large_customer_revenue?: number
  smb_customer_revenue?: number
  total_customers?: number
  total_marketing_spend?: number
  roi?: number
}

export interface LargeCustomerResult {
  forecast_type: 'large_customer'
  timeframe_months: number
  monthly_data: MonthlyData[]
  summary: ForecastSummary
  assumptions_used: LargeCustomerAssumptions
}

export interface SMBResult {
  forecast_type: 'smb_customer'
  timeframe_months: number
  monthly_data: MonthlyData[]
  summary: ForecastSummary
  assumptions_used: SMBAssumptions
}

export interface Assumptions {
  large_customer?: LargeCustomerAssumptions
  smb_customer?: SMBAssumptions
}

export interface LargeCustomerAssumptions {
  arpu: number
  onboarding_ramp: number[]
  monthly_growth_rate: number
  monthly_churn_rate: number
}

export interface SMBAssumptions {
  arpu: number
  marketing_spend: number
  cac: number
  conversion_rate: number
  monthly_growth_rate: number
  monthly_churn_rate: number
}

export interface CurrentAssumptions {
  large_customer: LargeCustomerAssumptions
  smb_customer: SMBAssumptions
  defaults: {
    forecast_period_months: number
    supported_forecast_types: string[]
  }
}

export interface User {
  id: string
  email: string
  full_name?: string
  created_at?: string
  updated_at?: string
}

export interface AuthState {
  user: User | null
  session: any | null
  loading: boolean
  error: string | null
}

export interface ForecastState {
  forecasts: ForecastResponse[]
  currentForecast: ForecastResponse | null
  loading: boolean
  error: string | null
  assumptions: CurrentAssumptions | null
}
