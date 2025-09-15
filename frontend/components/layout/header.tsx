/**
 * Header component for the FinSynth dashboard.
 * Displays the main branding and navigation.
 */

import { TrendingUp } from "lucide-react"

export function Header() {
  return (
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
  )
}
