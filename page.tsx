export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">
          FinSynth Hackathon
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-Powered Financial Forecasting Platform
        </p>
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            Transform financial planning with AI-powered forecasting
          </p>
          <p className="text-base text-gray-600">
            Ask questions, get insights. Our AI converts natural language queries into structured financial forecasts.
          </p>
        </div>
        <div className="mt-8">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 text-lg font-semibold">
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}
