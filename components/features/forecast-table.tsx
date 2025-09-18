"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download } from "lucide-react"
import { ForecastResult } from "@/types/forecast"

interface ForecastTableProps {
  result: ForecastResult
  onExportExcel: () => void
}

export function ForecastTable({ result, onExportExcel }: ForecastTableProps) {
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
  const monthlyData = result.monthly_data || []

  return (
    <Card className="shadow-xl border-border/50 bg-card/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Revenue Forecast</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 bg-transparent"
            onClick={onExportExcel}
          >
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
        <div className="bg-muted/20 rounded-lg p-3 border border-border/30">
          <p className="text-sm font-medium">
            Forecast: {result.timeframe_months} Months | Total Revenue: {formatCurrency(totalRevenue)}
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
              {monthlyData.map((row, index) => (
                <TableRow key={index} className="hover:bg-muted/5 transition-colors">
                  <TableCell className="font-medium">Month {row.month || index + 1}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(row.large_customer_revenue || 0)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(row.smb_customer_revenue || 0)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    {formatCurrency(row.total_revenue || 0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
