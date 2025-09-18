import { useState } from "react"
import { apiService } from "@/services/api"
import { ForecastRequest, ForecastResponse } from "@/types/forecast"

interface Progress {
  progress: number
  message: string
}

export function useForecast() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)

  const createForecast = async (query: string): Promise<ForecastResponse> => {
    setIsLoading(true)
    setError(null)
    setProgress({ progress: 0, message: "Starting forecast..." })

    try {
      setProgress({ progress: 25, message: "Parsing query..." })
      
      const request: ForecastRequest = { query }
      const response = await apiService.createForecast(request)
      
      setProgress({ progress: 100, message: "Forecast completed!" })
      
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create forecast"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
      setProgress(null)
    }
  }

  return {
    createForecast,
    isLoading,
    error,
    progress,
  }
}
