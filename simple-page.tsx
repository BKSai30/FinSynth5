export default function SimplePage() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          FinSynth Hackathon
        </h1>
        <p className="text-xl text-gray-600">
          AI-Powered Financial Forecasting Platform
        </p>
        <div className="mt-8">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}
