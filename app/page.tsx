"use client"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            FinSynth Hackathon
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-200 mb-8 font-medium">
            AI-Powered Financial Forecasting Platform
          </p>
          <div className="space-y-4">
            <p className="text-lg text-gray-800 dark:text-gray-100 font-medium">
              Transform financial planning with AI-powered forecasting
            </p>
            <p className="text-base text-gray-700 dark:text-gray-300">
              Ask questions, get insights. Our AI converts natural language queries into structured financial forecasts.
            </p>
          </div>
        <div className="mt-8 space-x-4">
          <a
            href="/login"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="inline-block bg-gray-600 text-white px-8 py-4 rounded-lg hover:bg-gray-700 text-lg font-semibold transition-all duration-200"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  )
}
