"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { QueryInput } from "@/components/features/query-input"
import { SummaryCards } from "@/components/features/summary-cards"
import { ForecastTable } from "@/components/features/forecast-table"
import { AssumptionsPanel } from "@/components/features/assumptions-panel"
import { ForecastChart } from "@/components/features/forecast-chart"
import { useForecast } from "@/hooks/use-forecast"
import { ForecastResult, AssumptionsUsed } from "@/types/forecast"

export default function FinSynthDashboard() {
  const [query, setQuery] = useState("")
  const [currentForecast, setCurrentForecast] = useState<ForecastResult | null>(null)
  const [currentAssumptions, setCurrentAssumptions] = useState<AssumptionsUsed | null>(null)
  
  const { 
    createForecast, 
    isLoading, 
    error, 
    progress 
  } = useForecast()

  const handleRunForecast = async (queryText: string) => {
    try {
      const response = await createForecast(queryText)
      if (response.result) {
        setCurrentForecast(response.result)
        setCurrentAssumptions(response.assumptions_used || null)
      }
    } catch (err) {
      console.error("Forecast failed:", err)
    }
  }

  const handleExportExcel = async () => {
    if (!currentForecast) return
    
    try {
      // Trigger Excel generation via API
      const response = await fetch('/api/v1/forecast/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query_id: currentForecast.query_id,
          forecast_data: currentForecast,
          assumptions: currentAssumptions 
        })
      })
      
      if (response.ok) {
        const { file_url } = await response.json()
        window.open(file_url, '_blank')
      }
    } catch (err) {
      console.error("Export failed:", err)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-6xl mx-auto py-12 px-4 space-y-8">
        {/* Header */}
        <Header />

        {/* Query Input */}
        <QueryInput 
          onRunForecast={handleRunForecast}
          isLoading={isLoading}
          error={error}
        />

        {/* Progress Indicator */}
        {isLoading && progress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{progress.message}</span>
              <span>{progress.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Results Display */}
        {currentForecast && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            {/* Summary Cards */}
            <SummaryCards result={currentForecast} />

            {/* Chart Visualization */}
            <ForecastChart result={currentForecast} />

            {/* Forecast Table */}
            <ForecastTable 
              result={currentForecast}
              onExportExcel={handleExportExcel}
            />

            {/* Assumptions Panel */}
            {currentAssumptions && (
              <AssumptionsPanel assumptions={currentAssumptions} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
