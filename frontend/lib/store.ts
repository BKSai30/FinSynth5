/**
 * Zustand store for global state management.
 * Manages forecast data, user authentication, and real-time updates.
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ForecastResult, AssumptionsUsed } from '@/types/forecast'

interface ForecastState {
  // Current forecast data
  currentForecast: ForecastResult | null
  currentAssumptions: AssumptionsUsed | null
  
  // Forecast history
  forecastHistory: ForecastResult[]
  
  // UI state
  isLoading: boolean
  error: string | null
  progress: { progress: number; message: string } | null
  
  // Actions
  setCurrentForecast: (forecast: ForecastResult | null) => void
  setCurrentAssumptions: (assumptions: AssumptionsUsed | null) => void
  addToHistory: (forecast: ForecastResult) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setProgress: (progress: { progress: number; message: string } | null) => void
  clearError: () => void
  clearProgress: () => void
}

export const useForecastStore = create<ForecastState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentForecast: null,
        currentAssumptions: null,
        forecastHistory: [],
        isLoading: false,
        error: null,
        progress: null,
        
        // Actions
        setCurrentForecast: (forecast) => 
          set({ currentForecast: forecast }, false, 'setCurrentForecast'),
        
        setCurrentAssumptions: (assumptions) => 
          set({ currentAssumptions: assumptions }, false, 'setCurrentAssumptions'),
        
        addToHistory: (forecast) => 
          set((state) => ({
            forecastHistory: [forecast, ...state.forecastHistory.slice(0, 9)] // Keep last 10
          }), false, 'addToHistory'),
        
        setLoading: (loading) => 
          set({ isLoading: loading }, false, 'setLoading'),
        
        setError: (error) => 
          set({ error }, false, 'setError'),
        
        setProgress: (progress) => 
          set({ progress }, false, 'setProgress'),
        
        clearError: () => 
          set({ error: null }, false, 'clearError'),
        
        clearProgress: () => 
          set({ progress: null }, false, 'clearProgress'),
      }),
      {
        name: 'forecast-store',
        partialize: (state) => ({
          forecastHistory: state.forecastHistory,
        }),
      }
    ),
    {
      name: 'forecast-store',
    }
  )
)

// Selectors for common use cases
export const useCurrentForecast = () => useForecastStore((state) => state.currentForecast)
export const useCurrentAssumptions = () => useForecastStore((state) => state.currentAssumptions)
export const useForecastHistory = () => useForecastStore((state) => state.forecastHistory)
export const useIsLoading = () => useForecastStore((state) => state.isLoading)
export const useError = () => useForecastStore((state) => state.error)
export const useProgress = () => useForecastStore((state) => state.progress)
