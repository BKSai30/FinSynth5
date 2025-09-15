/**
 * Assumptions panel component displaying the assumptions used in the forecast.
 * Shows all key parameters and their values.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AssumptionsUsed } from "@/types/forecast"

interface AssumptionsPanelProps {
  assumptions: AssumptionsUsed
}

export function AssumptionsPanel({ assumptions }: AssumptionsPanelProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  return (
    <Card className="shadow-xl border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle className="text-xl">Assumptions Used</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Large Customer Assumptions */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-primary">Large Customers</h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">ARPU</p>
                <p className="text-lg font-mono font-semibold">
                  {formatCurrency(assumptions.large_customer.arpu)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className="text-lg font-mono font-semibold">
                  {formatPercentage(assumptions.large_customer.growth_rate)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Churn Rate</p>
                <p className="text-lg font-mono font-semibold">
                  {formatPercentage(assumptions.large_customer.churn_rate)}
                </p>
              </div>
            </div>
          </div>

          {/* SMB Customer Assumptions */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-primary">SMB Customers</h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">ARPU</p>
                <p className="text-lg font-mono font-semibold">
                  {formatCurrency(assumptions.smb_customer.arpu)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Marketing Spend</p>
                <p className="text-lg font-mono font-semibold">
                  {formatCurrency(assumptions.smb_customer.marketing_spend)}/mo
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Customer Acquisition Cost</p>
                <p className="text-lg font-mono font-semibold">
                  {formatCurrency(assumptions.smb_customer.cac)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-lg font-mono font-semibold">
                  {formatPercentage(assumptions.smb_customer.conversion_rate)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className="text-lg font-mono font-semibold">
                  {formatPercentage(assumptions.smb_customer.growth_rate)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Churn Rate</p>
                <p className="text-lg font-mono font-semibold">
                  {formatPercentage(assumptions.smb_customer.churn_rate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
