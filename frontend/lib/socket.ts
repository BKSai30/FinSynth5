/**
 * Socket.IO client for real-time communication with the backend.
 * Handles forecast progress updates and real-time notifications.
 */

import { io, Socket } from 'socket.io-client'
import { useForecastStore } from './store'

class SocketService {
  private socket: Socket | null = null
  private isConnected = false

  connect() {
    if (this.socket?.connected) return

    const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    })

    this.socket.on('connect', () => {
      console.log('Connected to server')
      this.isConnected = true
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server')
      this.isConnected = false
    })

    this.socket.on('forecast_update', (data) => {
      console.log('Forecast update received:', data)
      this.handleForecastUpdate(data)
    })

    this.socket.on('forecast_progress', (data) => {
      console.log('Forecast progress received:', data)
      this.handleForecastProgress(data)
    })

    this.socket.on('connected', (data) => {
      console.log('Server connection confirmed:', data)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  joinForecastRoom(queryId: number) {
    if (this.socket?.connected) {
      this.socket.emit('join_forecast_room', { query_id: queryId })
    }
  }

  leaveForecastRoom(queryId: number) {
    if (this.socket?.connected) {
      this.socket.emit('leave_forecast_room', { query_id: queryId })
    }
  }

  private handleForecastUpdate(data: any) {
    const { query_id, status, data: forecastData } = data
    
    if (status === 'completed' && forecastData) {
      // Update the store with completed forecast
      useForecastStore.getState().setCurrentForecast(forecastData)
      useForecastStore.getState().addToHistory(forecastData)
      useForecastStore.getState().setLoading(false)
      useForecastStore.getState().clearProgress()
    } else if (status === 'failed') {
      useForecastStore.getState().setError('Forecast generation failed')
      useForecastStore.getState().setLoading(false)
      useForecastStore.getState().clearProgress()
    }
  }

  private handleForecastProgress(data: any) {
    const { progress, message } = data
    useForecastStore.getState().setProgress({ progress, message })
  }

  getSocket(): Socket | null {
    return this.socket
  }

  isSocketConnected(): boolean {
    return this.isConnected
  }
}

// Export singleton instance
export const socketService = new SocketService()

// React hook for using socket service
export function useSocket() {
  return {
    connect: () => socketService.connect(),
    disconnect: () => socketService.disconnect(),
    joinForecastRoom: (queryId: number) => socketService.joinForecastRoom(queryId),
    leaveForecastRoom: (queryId: number) => socketService.leaveForecastRoom(queryId),
    isConnected: socketService.isSocketConnected(),
  }
}
