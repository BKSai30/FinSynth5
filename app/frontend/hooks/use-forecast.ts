/**
 * Custom hook for forecast operations using TanStack Query.
 * Handles API calls, caching, and real-time updates.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { apiService } from '@/services/api'
import { useForecastStore } from '@/lib/store'
import { useSocket } from '@/lib/socket'
import { ForecastRequest, ForecastResponse } from '@/types/forecast'

export function useForecast() {
  const queryClient = useQueryClient()
  const { joinForecastRoom, leaveForecastRoom } = useSocket()
  const [currentQueryId, setCurrentQueryId] = useState<number | null>(null)

  // Create forecast mutation
  const createForecastMutation = useMutation({
    mutationFn: async (query: string): Promise<ForecastResponse> => {
      const request: ForecastRequest = { query }
      return await apiService.createForecast(request)
    },
    onMutate: async (variables) => {
      // Set loading state
      useForecastStore.getState().setLoading(true)
      useForecastStore.getState().clearError()
      useForecastStore.getState().setProgress({ progress: 0, message: 'Starting forecast...' })
    },
    onSuccess: (data) => {
      // Join the forecast room for real-time updates
      if (data.query_id) {
        setCurrentQueryId(data.query_id)
        joinForecastRoom(data.query_id)
      }

      // If forecast is already completed, update store immediately
      if (data.status === 'completed' && data.result) {
        useForecastStore.getState().setCurrentForecast(data.result)
        useForecastStore.getState().setCurrentAssumptions(data.assumptions_used || null)
        useForecastStore.getState().addToHistory(data.result)
        useForecastStore.getState().setLoading(false)
        useForecastStore.getState().clearProgress()
      }
    },
    onError: (error) => {
      useForecastStore.getState().setError(error.message)
      useForecastStore.getState().setLoading(false)
      useForecastStore.getState().clearProgress()
    },
  })

  // Get specific forecast query
  const getForecastQuery = useQuery({
    queryKey: ['forecast', currentQueryId],
    queryFn: () => apiService.getForecast(currentQueryId!),
    enabled: !!currentQueryId,
    refetchInterval: (data) => {
      // Stop polling if forecast is completed or failed
      return data?.status === 'completed' || data?.status === 'failed' ? false : 2000
    },
  })

  // List forecasts query
  const listForecastsQuery = useQuery({
    queryKey: ['forecasts'],
    queryFn: () => apiService.listForecasts(10, 0),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Health check query
  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: () => apiService.healthCheck(),
    refetchInterval: 30000, // 30 seconds
    retry: 3,
  })

  const createForecast = async (query: string) => {
    // Leave previous room if exists
    if (currentQueryId) {
      leaveForecastRoom(currentQueryId)
    }

    return createForecastMutation.mutateAsync(query)
  }

  const refreshForecasts = () => {
    queryClient.invalidateQueries({ queryKey: ['forecasts'] })
  }

  const clearCurrentForecast = () => {
    if (currentQueryId) {
      leaveForecastRoom(currentQueryId)
      setCurrentQueryId(null)
    }
    useForecastStore.getState().setCurrentForecast(null)
    useForecastStore.getState().setCurrentAssumptions(null)
  }

  return {
    // Mutations
    createForecast,
    
    // Queries
    currentForecast: getForecastQuery.data,
    forecasts: listForecastsQuery.data,
    health: healthQuery.data,
    
    // States
    isLoading: createForecastMutation.isPending || getForecastQuery.isLoading,
    error: createForecastMutation.error?.message || getForecastQuery.error?.message,
    progress: useForecastStore.getState().progress,
    
    // Actions
    refreshForecasts,
    clearCurrentForecast,
    
    // Query states
    isForecastLoading: getForecastQuery.isLoading,
    isForecastsLoading: listForecastsQuery.isLoading,
    isHealthLoading: healthQuery.isLoading,
  }
}

// Hook for forecast history
export function useForecastHistory() {
  const { forecasts, isForecastsLoading, refreshForecasts } = useForecast()
  
  return {
    forecasts: forecasts || [],
    isLoading: isForecastsLoading,
    refresh: refreshForecasts,
  }
}

// Hook for health monitoring
export function useHealth() {
  const { health, isHealthLoading } = useForecast()
  
  return {
    isHealthy: health?.status === 'healthy',
    health,
    isLoading: isHealthLoading,
  }
}
