"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ForecastPage() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)
  const [companyData, setCompanyData] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }
    
    setUser(JSON.parse(userData))
    
    // Fetch company data
    fetchCompanyData()
  }, [router])

  const fetchCompanyData = async () => {
    try {
      const userData = localStorage.getItem('user')
      if (!userData) return
      
      const user = JSON.parse(userData)
      const response = await fetch(`http://localhost:8003/api/v1/auth/company-data?email=${encodeURIComponent(user.email)}`)
      
      if (response.ok) {
        const data = await response.json()
        setCompanyData(data.company_data)
        console.log('Company data loaded:', data.company_data)
      } else {
        console.error('Failed to fetch company data:', response.status)
      }
    } catch (err) {
      console.error('Failed to fetch company data:', err)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.json')) {
      setUploadMessage("Please select a JSON file")
      return
    }

    setUploading(true)
    setUploadMessage("")

    try {
      const userData = localStorage.getItem('user')
      if (!userData) {
        setUploadMessage("User not found. Please login again.")
        return
      }

      const user = JSON.parse(userData)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('email', user.email)

        const response = await fetch('http://localhost:8003/api/v1/upload-company-data', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setUploadMessage(`✅ ${result.message}. File: ${result.filename}`)
        
        // Refresh company data
        await fetchCompanyData()
        
        // Clear the file input
        event.target.value = ''
      } else {
        const error = await response.json()
        setUploadMessage(`❌ ${error.detail}`)
      }
    } catch (err) {
      setUploadMessage(`❌ Upload failed: ${err}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      // Ensure we have company data
      let dataToSend = companyData
      
      // If no company data from API, try to get it from user registration data
      if (!dataToSend && user) {
        // Try to get company data from localStorage (stored during registration)
        const storedUserData = localStorage.getItem('user')
        if (storedUserData) {
          const parsedUser = JSON.parse(storedUserData)
          if (parsedUser.company_data) {
            dataToSend = parsedUser.company_data
            console.log('Using company data from registration:', dataToSend)
          }
        }
      }
      
      // If still no company data, use default values for demonstration
      if (!dataToSend || Object.keys(dataToSend).length === 0) {
        console.log('⚠️ No company data found, using default values for demonstration')
        dataToSend = {
          revenue: 100000,
          expenses: 60000,
          customers: 50
        }
      }
      
      console.log('Sending forecast request with company data:', dataToSend)
      
      const response = await fetch('http://localhost:8003/api/v1/forecast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          query,
          company_data: dataToSend
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Failed to get forecast')
      }
      
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              AI Financial Forecasting
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Welcome, {user.full_name} from {user.company_name}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            📁 Upload Company Data (Optional)
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Upload a JSON file to override your existing company data for more accurate predictions.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  dark:file:bg-gray-700 dark:file:text-gray-300
                  dark:hover:file:bg-gray-600
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {uploading && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Uploading...</span>
                </div>
              )}
            </div>
            
            {uploadMessage && (
              <div className={`p-3 rounded-lg text-sm ${
                uploadMessage.includes('✅') 
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {uploadMessage}
              </div>
            )}
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p><strong>Expected JSON format:</strong></p>
              <pre className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded text-xs overflow-x-auto">
{`{
  "revenue": 100000,
  "expenses": 60000,
  "customers": 50,
  "company_name": "Your Company",
  "industry": "Technology"
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Query Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="query" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  What would you like to forecast?
                </label>
                <textarea
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., What will be my revenue for the next 6 months if I increase my customer base by 20%?"
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  rows={4}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? "Analyzing..." : "Get Forecast"}
              </button>
            </form>
          </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Info Display */}
        {(!companyData || Object.keys(companyData).length === 0) && (
          <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded mb-6">
            <strong>Note:</strong> Using default company data for demonstration. For accurate forecasts, please register with your actual company information.
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Forecast Results</h2>
            
            {/* Forecast Period Info */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300">Forecast Period</h3>
                  <p className="text-blue-600 dark:text-blue-400">{result.forecast_period || '36 months'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300">Confidence Score</h3>
                  <p className="text-blue-600 dark:text-blue-400">{result.confidence_score || 95}%</p>
                </div>
              </div>
            </div>
            
            {/* Original vs Forecasted Comparison */}
            {result.original_data && result.forecasted_data && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Original vs Forecasted</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Revenue</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Original: ${result.original_data.revenue?.toLocaleString()}</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">Forecast: ${result.forecasted_data.revenue?.toLocaleString()}</p>
                      {result.changes?.revenue_change_pct && (
                        <p className={`text-sm font-medium ${result.changes.revenue_change_pct >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {result.changes.revenue_change_pct > 0 ? '+' : ''}{result.changes.revenue_change_pct}%
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Expenses</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Original: ${result.original_data.expenses?.toLocaleString()}</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">Forecast: ${result.forecasted_data.expenses?.toLocaleString()}</p>
                      {result.changes?.expense_change_pct && (
                        <p className={`text-sm font-medium ${result.changes.expense_change_pct <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {result.changes.expense_change_pct > 0 ? '+' : ''}{result.changes.expense_change_pct}%
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Profit</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Original: ${result.original_data.profit?.toLocaleString()}</p>
                      <p className="text-lg font-bold text-purple-600 dark:text-purple-400">Forecast: ${result.forecasted_data.profit?.toLocaleString()}</p>
                      {result.changes?.profit_change_pct && (
                        <p className={`text-sm font-medium ${result.changes.profit_change_pct >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {result.changes.profit_change_pct > 0 ? '+' : ''}{result.changes.profit_change_pct}%
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">Customers</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Original: {result.original_data.customers?.toLocaleString()}</p>
                      <p className="text-lg font-bold text-orange-600 dark:text-orange-400">Forecast: {result.forecasted_data.customers?.toLocaleString()}</p>
                      {result.changes?.customer_change_pct && (
                        <p className={`text-sm font-medium ${result.changes.customer_change_pct >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {result.changes.customer_change_pct > 0 ? '+' : ''}{result.changes.customer_change_pct}%
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Current Forecast Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">Final Monthly Revenue</h3>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  ${result.summary?.final_monthly_revenue?.toLocaleString() || 'N/A'}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-800 dark:text-red-300">Final Monthly Expenses</h3>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">
                  ${result.summary?.final_monthly_expenses?.toLocaleString() || 'N/A'}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-300">Final Monthly Profit</h3>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  ${result.summary?.final_monthly_profit?.toLocaleString() || 'N/A'}
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-800 dark:text-purple-300">Total Customers</h3>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {result.summary?.final_total_customers?.toLocaleString() || 'N/A'}
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <h3 className="font-semibold text-orange-800 dark:text-orange-300">Total Profit (All Months)</h3>
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  ${result.summary?.total_profit?.toLocaleString() || 'N/A'}
                </p>
              </div>
            </div>

            {result.result?.profit_margin && (
              <div className="mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-300 mb-2">Profit Margin</h3>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(result.result.profit_margin, 100)}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {result.result.profit_margin}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {result.ai_insights && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">AI Analysis</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-700 dark:text-gray-300">{result.ai_insights}</p>
                </div>
              </div>
            )}

            {/* Monthly Forecast Preview */}
            {result.forecast_data && result.forecast_data.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Monthly Forecast Preview (First 6 Months)</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300 dark:border-gray-600">
                        <th className="text-left py-2 text-gray-700 dark:text-gray-300">Month</th>
                        <th className="text-right py-2 text-gray-700 dark:text-gray-300">Total Customers</th>
                        <th className="text-right py-2 text-gray-700 dark:text-gray-300">Monthly Revenue</th>
                        <th className="text-right py-2 text-gray-700 dark:text-gray-300">Monthly Expenses</th>
                        <th className="text-right py-2 text-gray-700 dark:text-gray-300">Monthly Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.forecast_data.slice(0, 6).map((month: any) => (
                        <tr key={month.month} className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-2 text-gray-700 dark:text-gray-300">{month.month}</td>
                          <td className="py-2 text-right text-gray-600 dark:text-gray-400">{month.totals?.total_customers?.toLocaleString() || 'N/A'}</td>
                          <td className="py-2 text-right text-blue-600 dark:text-blue-400">${month.totals?.monthly_revenue?.toLocaleString() || 'N/A'}</td>
                          <td className="py-2 text-right text-red-600 dark:text-red-400">${month.totals?.monthly_expenses?.toLocaleString() || 'N/A'}</td>
                          <td className="py-2 text-right text-green-600 dark:text-green-400">${month.totals?.monthly_profit?.toLocaleString() || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {result.assumptions_used && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Assumptions Used</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <ul className="space-y-2">
                    {Object.entries(result.assumptions_used).map(([key, value]) => (
                      <li key={key} className="flex justify-between">
                        <span className="font-medium capitalize text-gray-700 dark:text-gray-300">{key.replace('_', ' ')}:</span>
                        <span className="text-gray-600 dark:text-gray-400">{typeof value === 'number' ? value.toLocaleString() : String(value)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-block bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
