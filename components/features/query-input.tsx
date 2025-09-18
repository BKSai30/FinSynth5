"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, TrendingUp } from "lucide-react"

interface QueryInputProps {
  onRunForecast: (query: string) => void
  isLoading: boolean
  error?: string
}

export function QueryInput({ onRunForecast, isLoading, error }: QueryInputProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = () => {
    if (!query.trim()) return
    onRunForecast(query)
  }

  return (
    <Card className="shadow-2xl border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-center">Autonomous Finance Modeler</CardTitle>
        <p className="text-center text-muted-foreground text-lg">
          Turn your questions into financial forecasts. Powered by AI.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="query" className="text-base font-medium">
            Enter your financial query
          </Label>
          <Input
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 'Forecast revenue for next 12 months' or 'What if we increase marketing spend by 20%?'"
            className="h-12 text-base bg-input border-border/50 focus:border-primary/50 transition-colors"
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSubmit()}
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Forecast...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-5 w-5" />
              Run Forecast
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
