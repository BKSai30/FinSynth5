"use client"

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

  const largeCustomer = assumptions.large_customer || {}
  const smbCustomer = assumptions.smb_customer || {}

  return (
    <Card className="shadow-xl border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle className="text-xl">Assumptions Used</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Large Customer ARPU</p>
            <p className="text-lg font-mono font-semibold">
              {formatCurrency(largeCustomer.arpu || 0)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">SMB Customer ARPU</p>
            <p className="text-lg font-mono font-semibold">
              {formatCurrency(smbCustomer.arpu || 0)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Marketing Spend</p>
            <p className="text-lg font-mono font-semibold">
              {formatCurrency(smbCustomer.marketing_spend || 0)}/mo
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Customer Acquisition Cost</p>
            <p className="text-lg font-mono font-semibold">
              {formatCurrency(smbCustomer.cac || 0)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <p className="text-lg font-mono font-semibold">
              {Math.round((smbCustomer.conversion_rate || 0) * 100)}%
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Large Customer Growth Rate</p>
            <p className="text-lg font-mono font-semibold">
              {Math.round((largeCustomer.growth_rate || 0) * 100)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
