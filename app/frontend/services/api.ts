/**
 * API service for communicating with the ASF backend.
 * Handles all HTTP requests to the forecast endpoints.
 */

import { ForecastRequest, ForecastResponse, ForecastError } from '../types/forecast'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

class ApiService {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  /**
   * Create a new forecast request
   */
  async createForecast(request: ForecastRequest): Promise<ForecastResponse> {
    const response = await fetch(`${this.baseUrl}/forecast/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error: ForecastError = await response.json()
      throw new Error(error.detail || error.error || 'Failed to create forecast')
    }

    return response.json()
  }

  /**
   * Get a specific forecast by ID
   */
  async getForecast(queryId: number): Promise<ForecastResponse> {
    const response = await fetch(`${this.baseUrl}/forecast/${queryId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error: ForecastError = await response.json()
      throw new Error(error.detail || error.error || 'Failed to get forecast')
    }

    return response.json()
  }

  /**
   * List recent forecasts with pagination
   */
  async listForecasts(limit: number = 10, offset: number = 0): Promise<ForecastResponse[]> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    })

    const response = await fetch(`${this.baseUrl}/forecast/?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error: ForecastError = await response.json()
      throw new Error(error.detail || error.error || 'Failed to list forecasts')
    }

    return response.json()
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    const response = await fetch(`${this.baseUrl.replace('/api/v1', '')}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Health check failed')
    }

    return response.json()
  }
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService
