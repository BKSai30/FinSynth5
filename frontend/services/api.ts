import axios from 'axios'
import { getSession } from '@/lib/supabase'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth interceptor
api.interceptors.request.use(async (config) => {
  const session = await getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

// Types
export interface ForecastRequest {
  query: string
}

export interface ForecastResponse {
  query_id: number
  status: string
  result?: any
  assumptions_used?: any
  message?: string
  created_at?: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  user: any
}

// Auth API
export const authAPI = {
  register: async (email: string, password: string, fullName?: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', {
      email,
      password,
      full_name: fullName
    })
    return response.data
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', {
      email,
      password
    })
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  getCurrentUser: async (): Promise<any> => {
    const response = await api.get('/auth/me')
    return response.data
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken })
    return response.data
  }
}

// Forecast API
export const forecastAPI = {
  createForecast: async (request: ForecastRequest): Promise<ForecastResponse> => {
    const response = await api.post('/forecast/', request)
    return response.data
  },

  getForecast: async (forecastId: number): Promise<ForecastResponse> => {
    const response = await api.get(`/forecast/${forecastId}`)
    return response.data
  },

  listForecasts: async (limit: number = 10, offset: number = 0): Promise<ForecastResponse[]> => {
    const response = await api.get(`/forecast/?limit=${limit}&offset=${offset}`)
    return response.data
  },

  getCurrentAssumptions: async (): Promise<any> => {
    const response = await api.get('/forecast/assumptions/current')
    return response.data
  }
}

// Health check
export const healthAPI = {
  check: async (): Promise<any> => {
    const response = await api.get('/health')
    return response.data
  }
}

export default api
