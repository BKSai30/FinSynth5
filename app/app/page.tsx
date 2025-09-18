"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Download, TrendingUp, DollarSign, Users, Target } from "lucide-react"

interface ForecastData {
  month: string
  largeCustomerRev: number
  smbCustomerRev: number
  totalRevenue: number
}

interface Assumptions {
  largeCustomerARPU: number
  smbCustomerARPU: number
  marketingSpend: number
  cac: number
  conversionRate: number
}

export default function FinSynthDashboard() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<ForecastData[] | null>(null)
  const [assumptions, setAssumptions] = useState<Assumptions | null>(null)
  const [error, setError] = useState("")

  // Mock data for demonstration
  const mockData: ForecastData[] = [
    { month: "Jan 2024", largeCustomerRev: 360000, smbCustomerRev: 240000, totalRevenue: 600000 },
    { month: "Feb 2024", largeCustomerRev: 378000, smbCustomerRev: 252000, totalRevenue: 630000 },
    { month: "Mar 2024", largeCustomerRev: 396900, smbCustomerRev: 264600, totalRevenue: 661500 },
    { month: "Apr 2024", largeCustomerRev: 416745, smbCustomerRev: 277830, totalRevenue: 694575 },
    { month: "May 2024", largeCustomerRev: 437582, smbCustomerRev: 291722, totalRevenue: 729304 },
    { month: "Jun 2024", largeCustomerRev: 459461, smbCustomerRev: 306308, totalRevenue: 765769 },
    { month: "Jul 2024", largeCustomerRev: 482434, smbCustomerRev: 321623, totalRevenue: 804057 },
    { month: "Aug 2024", largeCustomerRev: 506556, smbCustomerRev: 337704, totalRevenue: 844260 },
    { month: "Sep 2024", largeCustomerRev: 531884, smbCustomerRev: 354589, totalRevenue: 886473 },
    { month: "Oct 2024", largeCustomerRev: 558478, smbCustomerRev: 372319, totalRevenue: 930797 },
    { month: "Nov 2024", largeCustomerRev: 586402, smbCustomerRev: 390935, totalRevenue: 977337 },
    { month: "Dec 2024", largeCustomerRev: 615722, smbCustomerRev: 410481, totalRevenue: 1026203 },
  ]

  const mockAssumptions: Assumptions = {
    largeCustomerARPU: 16667,
    smbCustomerARPU: 5000,
    marketingSpend: 200000,
    cac: 1250,
    conversionRate: 45,
  }

  const handleRunForecast = async () => {
    if (!query.trim()) {
      setError("Please enter a financial query")
      return
    }

    setError("")
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setData(mockData)
      setAssumptions(mockAssumptions)
      setIsLoading(false)
    }, 2000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const totalRevenue = data?.reduce((sum, item) => sum + item.totalRevenue, 0) || 0

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-6xl mx-auto py-12 px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              FinSynth
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform financial planning with AI-powered forecasting. Ask questions, get insights.
          </p>
        </div>

        {/* Query Input Card */}
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
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleRunForecast()}
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
            <Button
              onClick={handleRunForecast}
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

        {/* Results Display */}
        {data && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            {/* Summary Cards */}
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
                      <p className="text-2xl font-bold">12 Months</p>
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

            {/* Forecast Table */}
            <Card className="shadow-xl border-border/50 bg-card/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Revenue Forecast</CardTitle>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Export Excel
                  </Button>
                </div>
                <div className="bg-muted/20 rounded-lg p-3 border border-border/30">
                  <p className="text-sm font-medium">
                    Forecast: 12 Months | Total Revenue: {formatCurrency(totalRevenue)}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border/30 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/10 hover:bg-muted/20">
                        <TableHead className="font-semibold">Month</TableHead>
                        <TableHead className="font-semibold text-right">Large Customers Rev.</TableHead>
                        <TableHead className="font-semibold text-right">SMB Customers Rev.</TableHead>
                        <TableHead className="font-semibold text-right">Total Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((row, index) => (
                        <TableRow key={index} className="hover:bg-muted/5 transition-colors">
                          <TableCell className="font-medium">{row.month}</TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(row.largeCustomerRev)}</TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(row.smbCustomerRev)}</TableCell>
                          <TableCell className="text-right font-mono font-semibold">
                            {formatCurrency(row.totalRevenue)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Assumptions Panel */}
            {assumptions && (
              <Card className="shadow-xl border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-xl">Assumptions Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Large Customer ARPU</p>
                      <p className="text-lg font-mono font-semibold">{formatCurrency(assumptions.largeCustomerARPU)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">SMB Customer ARPU</p>
                      <p className="text-lg font-mono font-semibold">{formatCurrency(assumptions.smbCustomerARPU)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Marketing Spend</p>
                      <p className="text-lg font-mono font-semibold">{formatCurrency(assumptions.marketingSpend)}/mo</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Customer Acquisition Cost</p>
                      <p className="text-lg font-mono font-semibold">{formatCurrency(assumptions.cac)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      <p className="text-lg font-mono font-semibold">{assumptions.conversionRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
