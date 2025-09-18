import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { QueryProvider } from '@/components/query-provider'
import { AuthProvider } from '@/components/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FinSynth Hackathon - AI-Powered Financial Forecasting',
  description: 'Transform financial planning with AI-powered forecasting. Ask questions, get insights.',
  keywords: ['financial forecasting', 'AI', 'SaaS', 'revenue modeling', 'hackathon'],
  authors: [{ name: 'FinSynth Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
