import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "./components/theme-provider"
import { Navbar } from "./components/navbar"

export const metadata: Metadata = {
  title: "FinSynth - AI Financial Forecasting",
  description: "Transform financial planning with AI-powered forecasting",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-background text-foreground">
        <ThemeProvider
          defaultTheme="system"
          storageKey="finsynth-theme"
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
