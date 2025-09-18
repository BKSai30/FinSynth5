import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState, ForecastState, User, ForecastResponse, CurrentAssumptions } from '@/types/forecast'

// Auth Store
interface AuthStore extends AuthState {
  setUser: (user: User | null) => void
  setSession: (session: any | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      loading: false,
      error: null,
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearAuth: () => set({ user: null, session: null, error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, session: state.session }),
    }
  )
)

// Forecast Store
interface ForecastStore extends ForecastState {
  setForecasts: (forecasts: ForecastResponse[]) => void
  addForecast: (forecast: ForecastResponse) => void
  setCurrentForecast: (forecast: ForecastResponse | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setAssumptions: (assumptions: CurrentAssumptions | null) => void
  clearForecasts: () => void
}

export const useForecastStore = create<ForecastStore>((set) => ({
  forecasts: [],
  currentForecast: null,
  loading: false,
  error: null,
  assumptions: null,
  setForecasts: (forecasts) => set({ forecasts }),
  addForecast: (forecast) => set((state) => ({ 
    forecasts: [forecast, ...state.forecasts] 
  })),
  setCurrentForecast: (currentForecast) => set({ currentForecast }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setAssumptions: (assumptions) => set({ assumptions }),
  clearForecasts: () => set({ forecasts: [], currentForecast: null }),
}))

// Theme Store
interface ThemeStore {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
    }),
    {
      name: 'theme-storage',
    }
  )
)
