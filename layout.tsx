import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FinSynth Hackathon - AI-Powered Financial Forecasting',
  description: 'Transform financial planning with AI-powered forecasting. Ask questions, get insights.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
