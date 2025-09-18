"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    companyName: "",
    companyData: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (isLogin) {
        // Login
        const response = await fetch('http://localhost:8001/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || 'Login failed')
        }

        const user = await response.json()
        
        // Fetch company data for existing users
        try {
          const companyResponse = await fetch(`http://localhost:8001/api/v1/auth/company-data?email=${encodeURIComponent(user.email)}`)
          if (companyResponse.ok) {
            const companyData = await companyResponse.json()
            user.company_data = companyData.company_data
          }
        } catch (e) {
          console.log('Could not fetch company data:', e)
        }
        
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', user.email)
        setSuccess('Login successful! Redirecting...')
        
        setTimeout(() => {
          router.push('/forecast')
        }, 1000)
      } else {
        // Register
        let companyData = {}
        if (formData.companyData.trim()) {
          try {
            companyData = JSON.parse(formData.companyData)
          } catch (e) {
            throw new Error('Invalid JSON format for company data')
          }
        }
        
        const response = await fetch('http://localhost:8001/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            full_name: formData.fullName,
            company_name: formData.companyName,
            company_data: companyData
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || 'Registration failed')
        }

        const user = await response.json()
        // Include company data in the stored user object
        const userWithCompanyData = {
          ...user,
          company_data: companyData
        }
        localStorage.setItem('user', JSON.stringify(userWithCompanyData))
        localStorage.setItem('token', user.email)
        setSuccess('Registration successful! Redirecting...')
        
        setTimeout(() => {
          router.push('/forecast')
        }, 1000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-700 dark:text-gray-200 font-medium">
            {isLogin ? 'Sign in to your account' : 'Join FinSynth for AI-powered forecasting'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Acme Corp"
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="john@company.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="companyData" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Data (JSON - Optional)
              </label>
              <textarea
                id="companyData"
                name="companyData"
                value={formData.companyData}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={4}
                placeholder='{"revenue": 100000, "expenses": 60000, "customers": 50}'
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Optional: Upload your company's financial data for more accurate forecasts
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError("")
              setSuccess("")
            }}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="text-center mt-4">
          <a href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}