/**
 * Forecast chart component using Recharts for data visualization.
 * Displays revenue trends and forecasts in an interactive chart.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area
} from "recharts"
import { ForecastResult } from "@/types/forecast"

interface ForecastChartProps {
  result: ForecastResult
}

export function ForecastChart({ result }: ForecastChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatMonth = (monthNumber: number) => {
    const date = new Date(2024, monthNumber - 1)
    return date.toLocaleDateString('en-US', { month: 'short' })
  }

  // Prepare chart data
  const chartData = result.monthly_data.map(item => ({
    month: formatMonth(item.month),
    monthNumber: item.month,
    largeCustomer: item.large_customer_revenue || 0,
    smbCustomer: item.smb_customer_revenue || 0,
    total: item.total_revenue || item.revenue || 0,
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="shadow-xl border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle className="text-xl">Revenue Forecast Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="line" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="area">Area Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value="line" className="mt-6">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: 'currentColor', opacity: 0.3 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: 'currentColor', opacity: 0.3 }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="largeCustomer" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  name="Large Customers"
                  dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="smbCustomer" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  name="SMB Customers"
                  dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={3}
                  name="Total Revenue"
                  dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 2, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="bar" className="mt-6">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: 'currentColor', opacity: 0.3 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: 'currentColor', opacity: 0.3 }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="largeCustomer" 
                  fill="hsl(var(--chart-1))" 
                  name="Large Customers"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="smbCustomer" 
                  fill="hsl(var(--chart-2))" 
                  name="SMB Customers"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="area" className="mt-6">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: 'currentColor', opacity: 0.3 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: 'currentColor', opacity: 0.3 }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="largeCustomer" 
                  stackId="1"
                  stroke="hsl(var(--chart-1))" 
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.6}
                  name="Large Customers"
                />
                <Area 
                  type="monotone" 
                  dataKey="smbCustomer" 
                  stackId="1"
                  stroke="hsl(var(--chart-2))" 
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.6}
                  name="SMB Customers"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
