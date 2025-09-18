"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ForecastResult } from "@/types/forecast"

interface ForecastChartProps {
  result: ForecastResult
}

export function ForecastChart({ result }: ForecastChartProps) {
  const monthlyData = result.monthly_data || []
  
  // Transform data for chart
  const chartData = monthlyData.map((row, index) => ({
    month: `M${index + 1}`,
    largeCustomers: row.large_customer_revenue || 0,
    smbCustomers: row.smb_customer_revenue || 0,
    total: row.total_revenue || 0,
  }))

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card className="shadow-xl border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle className="text-xl">Revenue Forecast Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="largeCustomers" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Large Customers"
              />
              <Line 
                type="monotone" 
                dataKey="smbCustomers" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="SMB Customers"
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#ffc658" 
                strokeWidth={3}
                name="Total Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
