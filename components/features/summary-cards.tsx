"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Users, Target } from "lucide-react"
import { ForecastResult } from "@/types/forecast"

interface SummaryCardsProps {
  result: ForecastResult
}

export function SummaryCards({ result }: SummaryCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const summary = result.summary || {}
  const totalRevenue = summary.total_revenue || 0
  const timeframe = result.timeframe_months || 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-1/10">
              <DollarSign className="h-5 w-5 text-chart-1" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold font-mono">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-2/10">
              <Users className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Forecast Period</p>
              <p className="text-2xl font-bold">{timeframe} Months</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-3/10">
              <Target className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Growth Rate</p>
              <p className="text-2xl font-bold">+5.25%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
