"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Download, FileText, BarChart3, Upload, Calendar, TrendingUp, DollarSign, Users, AlertCircle } from 'lucide-react'

export default function ForecastPage() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)
  const [companyData, setCompanyData] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("")
  const [industry, setIndustry] = useState("Technology")
  const [seasonalEnabled, setSeasonalEnabled] = useState(false)
  const [newsEnabled, setNewsEnabled] = useState(false)
  const [newsApiKey, setNewsApiKey] = useState("")
  const [chartData, setChartData] = useState<any[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const router = useRouter()
  const reportRef = useRef<HTMLDivElement>(null)

  // Industry seasonal patterns
  const seasonalPatterns = {
    "Toys": { peak: [11, 12, 1], low: [6, 7, 8], multiplier: 1.5 },
    "Retail": { peak: [11, 12], low: [1, 2], multiplier: 1.3 },
    "Automotive": { peak: [3, 4, 5], low: [12, 1], multiplier: 1.2 },
    "Technology": { peak: [9, 10, 11], low: [6, 7], multiplier: 1.1 },
    "Healthcare": { peak: [1, 2, 3], low: [7, 8], multiplier: 1.05 },
    "Education": { peak: [8, 9], low: [6, 7], multiplier: 1.2 },
    "Default": { peak: [11, 12], low: [1, 2], multiplier: 1.0 }
  }

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

    setUploading(true)
    setUploadMessage("")

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('email', user.email)

      const response = await fetch('http://localhost:8003/api/v1/upload-company-data', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setUploadMessage("✅ Company data updated successfully!")
        setCompanyData(result.company_data)
        // Refresh company data
        setTimeout(() => {
          fetchCompanyData()
        }, 1000)
      } else {
        setUploadMessage("❌ Failed to update company data")
      }
    } catch (err) {
      setUploadMessage("❌ Error uploading file")
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadMessage("")

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      // Convert Excel data to our format
      const companyData = {
        revenue: jsonData[0]?.revenue || jsonData[0]?.Revenue || 0,
        expenses: jsonData[0]?.expenses || jsonData[0]?.Expenses || 0,
        customers: jsonData[0]?.customers || jsonData[0]?.Customers || 0,
        company_name: user.company_name || "Company",
        industry: industry,
        business_model: jsonData[0]?.business_model || "SaaS",
        monthly_recurring_revenue: jsonData[0]?.mrr || jsonData[0]?.MRR || 0,
        customer_acquisition_cost: jsonData[0]?.cac || jsonData[0]?.CAC || 0,
        lifetime_value: jsonData[0]?.ltv || jsonData[0]?.LTV || 0,
        churn_rate: jsonData[0]?.churn_rate || jsonData[0]?.Churn_Rate || 0.05,
        growth_rate: jsonData[0]?.growth_rate || jsonData[0]?.Growth_Rate || 0.1,
        employees: jsonData[0]?.employees || jsonData[0]?.Employees || 10,
        founded_year: jsonData[0]?.founded_year || jsonData[0]?.Founded_Year || 2020,
        target_market: jsonData[0]?.target_market || "SMB",
        key_metrics: {
          monthly_active_users: jsonData[0]?.mau || jsonData[0]?.MAU || 1000,
          conversion_rate: jsonData[0]?.conversion_rate || jsonData[0]?.Conversion_Rate || 0.1,
          average_deal_size: jsonData[0]?.deal_size || jsonData[0]?.Deal_Size || 5000,
          sales_cycle_days: jsonData[0]?.sales_cycle || jsonData[0]?.Sales_Cycle || 30
        }
      }

      // Upload the converted data
      const formData = new FormData()
      formData.append('company_data', JSON.stringify(companyData))
      formData.append('email', user.email)

      const response = await fetch('http://localhost:8003/api/v1/upload-company-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          company_data: companyData
        }),
      })

      if (response.ok) {
        setUploadMessage("✅ Excel data imported successfully!")
        setCompanyData(companyData)
      } else {
        setUploadMessage("❌ Failed to import Excel data")
      }
    } catch (err) {
      setUploadMessage("❌ Error processing Excel file")
      console.error('Excel processing error:', err)
    } finally {
      setUploading(false)
    }
  }

  const applySeasonalAdjustment = (data: any[], industry: string) => {
    if (!seasonalEnabled) return data

    const pattern = seasonalPatterns[industry as keyof typeof seasonalPatterns] || seasonalPatterns.Default
    
    return data.map((item, index) => {
      const month = (new Date().getMonth() + index + 1) % 12 || 12
      const isPeak = pattern.peak.includes(month)
      const isLow = pattern.low.includes(month)
      
      let multiplier = 1
      if (isPeak) multiplier = pattern.multiplier
      else if (isLow) multiplier = 1 / pattern.multiplier
      
      return {
        ...item,
        revenue: item.revenue * multiplier,
        customers: item.customers * (multiplier * 0.8), // Customers don't fluctuate as much
        profit: item.profit * multiplier
      }
    })
  }

  const handleRunForecast = async () => {
    if (!query.trim()) {
      setError("Please enter a forecast query")
      return
    }

    setLoading(true)
    setError("")

    try {
      const requestData = {
        query: query,
        company_data: companyData,
        industry: industry,
        seasonal_enabled: seasonalEnabled,
        news_enabled: newsEnabled,
        news_api_key: newsApiKey
      }

      const response = await fetch('http://localhost:8003/api/v1/forecast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)

      // Process data for charts
      if (data.forecast_data) {
        let processedData = data.forecast_data.map((item: any, index: number) => ({
          month: `Month ${index + 1}`,
          revenue: Math.round(item.totals?.monthly_revenue || 0),
          customers: Math.round(item.totals?.total_customers || 0),
          profit: Math.round(item.totals?.monthly_profit || 0),
          expenses: Math.round(item.totals?.monthly_expenses || 0)
        }))

        // Apply seasonal adjustment if enabled
        if (seasonalEnabled) {
          processedData = applySeasonalAdjustment(processedData, industry)
        }

        setChartData(processedData)
      }
    } catch (err) {
      console.error('Forecast error:', err)
      setError("Failed to generate forecast. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const exportToExcel = () => {
    if (!result || !result.forecast_data) return

    // Create comprehensive financial projection model
    const assumptions = result.assumptions_used || {}
    const forecastData = result.forecast_data || []
    
    // Prepare the detailed financial model data
    const financialModelData = []
    
    // Header row
    const headerRow = ['Metric / Month', ...forecastData.map((_, index) => `M${index + 1}`)]
    financialModelData.push(headerRow)
    
    // Row 1: # of sales people
    const salesPeopleRow = ['# of sales people', ...forecastData.map((item: any) => 
      Math.round(item.large_customers?.sales_team_count || 0)
    )]
    financialModelData.push(salesPeopleRow)
    
    // Row 2: # of large customer accounts they can sign per month/sales person
    const dealsPerPersonRow = ['# of large customer accounts they can sign per month/sales person', 
      ...forecastData.map(() => assumptions.large_deals_per_salesperson_per_month || 1.5)
    ]
    financialModelData.push(dealsPerPersonRow)
    
    // Row 3: # of large customer accounts onboarded per month
    const newLargeCustomersRow = ['# of large customer accounts onboarded per month', 
      ...forecastData.map((item: any) => Math.round(item.large_customers?.new_customers || 0))
    ]
    financialModelData.push(newLargeCustomersRow)
    
    // Row 4: Cumulative # of paying customers (Large)
    const cumulativeLargeRow = ['Cumulative # of paying customers (Large)', 
      ...forecastData.map((item: any) => Math.round(item.large_customers?.total_customers || 0))
    ]
    financialModelData.push(cumulativeLargeRow)
    
    // Row 5: Average revenue per customer (Large)
    const largeARPU = assumptions.large_avg_revenue_per_user || 16500
    const largeARPRow = ['Average revenue per customer (Large)', 
      ...forecastData.map(() => largeARPU)
    ]
    financialModelData.push(largeARPRow)
    
    // Row 6: Digital Marketing spend per month
    const marketingSpend = assumptions.smb_monthly_marketing_budget || 30000
    const marketingSpendRow = ['Digital Marketing spend per month', 
      ...forecastData.map(() => marketingSpend)
    ]
    financialModelData.push(marketingSpendRow)
    
    // Row 7: Average CAC
    const cac = assumptions.smb_customer_acquisition_cost || 1500
    const cacRow = ['Average CAC', 
      ...forecastData.map(() => cac)
    ]
    financialModelData.push(cacRow)
    
    // Row 8: # of sales enquiries
    const leadsRow = ['# of sales enquiries', 
      ...forecastData.map((item: any) => Math.round(item.smb_customers?.leads_generated || 0))
    ]
    financialModelData.push(leadsRow)
    
    // Row 9: % conversions from demo to sign ups
    const conversionRate = (assumptions.smb_conversion_rate || 0.45) * 100
    const conversionRow = ['% conversions from demo to sign ups', 
      ...forecastData.map(() => `${conversionRate}%`)
    ]
    financialModelData.push(conversionRow)
    
    // Row 10: # of paying customers onboarded (SMB)
    const newSMBCustomersRow = ['# of paying customers onboarded (SMB)', 
      ...forecastData.map((item: any) => Math.round(item.smb_customers?.new_customers || 0))
    ]
    financialModelData.push(newSMBCustomersRow)
    
    // Row 11: Cumulative number of paying customers (SMB)
    const cumulativeSMBRow = ['Cumulative number of paying customers (SMB)', 
      ...forecastData.map((item: any) => Math.round(item.smb_customers?.total_customers || 0))
    ]
    financialModelData.push(cumulativeSMBRow)
    
    // Row 12: Average revenue per customer (SMB)
    const smbARPU = assumptions.smb_avg_revenue_per_user || 500
    const smbARPRow = ['Average revenue per customer (SMB)', 
      ...forecastData.map(() => smbARPU)
    ]
    financialModelData.push(smbARPRow)
    
    // Row 13: Revenue from large clients
    const largeRevenueRow = ['Revenue from large clients', 
      ...forecastData.map((item: any) => Math.round(item.large_customers?.monthly_revenue || 0))
    ]
    financialModelData.push(largeRevenueRow)
    
    // Row 14: Revenue from small and medium clients
    const smbRevenueRow = ['Revenue from small and medium clients', 
      ...forecastData.map((item: any) => Math.round(item.smb_customers?.monthly_revenue || 0))
    ]
    financialModelData.push(smbRevenueRow)
    
    // Row 15: Total Revenues ($ per month)
    const totalRevenueRow = ['Total Revenues ($ per month)', 
      ...forecastData.map((item: any) => Math.round(item.totals?.monthly_revenue || 0))
    ]
    financialModelData.push(totalRevenueRow)
    
    // Row 16: Total Revenues ($ Mn per month)
    const totalRevenueMnRow = ['Total Revenues ($ Mn per month)', 
      ...forecastData.map((item: any) => 
        (Math.round(item.totals?.monthly_revenue || 0) / 1000000).toFixed(2)
      )
    ]
    financialModelData.push(totalRevenueMnRow)

    // Create the main financial model worksheet
    const financialModelSheet = XLSX.utils.aoa_to_sheet(financialModelData)
    
    // Set column widths for better readability
    const colWidths = [
      { wch: 50 }, // Metric column
      ...forecastData.map(() => ({ wch: 12 })) // Month columns
    ]
    financialModelSheet['!cols'] = colWidths

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, financialModelSheet, 'Financial Projection')

    // Add summary sheet
    const summaryData = [
      ['Forecast Summary', ''],
      ['Query', result.query || query],
      ['Forecast Period', `${result.forecast_data?.length || 0} months`],
      ['Total Revenue (All Months)', Math.round(result.forecast_data?.reduce((sum: number, item: any) => sum + (item.totals?.monthly_revenue || 0), 0) || 0)],
      ['Total Profit (All Months)', Math.round(result.forecast_data?.reduce((sum: number, item: any) => sum + (item.totals?.monthly_profit || 0), 0) || 0)],
      ['Final Monthly Revenue', Math.round(result.forecast_data?.[result.forecast_data.length - 1]?.totals?.monthly_revenue || 0)],
      ['Final Monthly Profit', Math.round(result.forecast_data?.[result.forecast_data.length - 1]?.totals?.monthly_profit || 0)],
      ['Final Total Customers', Math.round(result.forecast_data?.[result.forecast_data.length - 1]?.totals?.total_customers || 0)],
      ['', ''],
      ['Key Assumptions Used', ''],
      ['Large Customer ARPU', `$${assumptions.large_avg_revenue_per_user || 16500}`],
      ['SMB Customer ARPU', `$${assumptions.smb_avg_revenue_per_user || 500}`],
      ['Marketing Budget (Monthly)', `$${assumptions.smb_monthly_marketing_budget || 30000}`],
      ['Customer Acquisition Cost', `$${assumptions.smb_customer_acquisition_cost || 1500}`],
      ['Conversion Rate', `${((assumptions.smb_conversion_rate || 0.45) * 100).toFixed(1)}%`],
      ['Deals per Salesperson per Month', assumptions.large_deals_per_salesperson_per_month || 1.5],
      ['', ''],
      ['Company Data Used', ''],
      ...Object.entries(companyData || {}).map(([key, value]) => [key, value])
    ]

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, `financial_projection_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const exportToPDF = async () => {
    if (!reportRef.current) return

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`forecast_report_${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              AI Financial Forecasting
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome back, {user?.full_name} • {user?.company_name}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Company Data Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <Upload className="mr-2" />
            Company Data Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload JSON File
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Excel File
              </label>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleExcelUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-gray-700 dark:file:text-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industry Type
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="Technology">Technology</option>
                <option value="Toys">Toys</option>
                <option value="Retail">Retail</option>
                <option value="Automotive">Automotive</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
              </select>
            </div>
          </div>

          {uploadMessage && (
            <div className={`p-3 rounded-lg ${uploadMessage.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {uploadMessage}
            </div>
          )}

          {companyData && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Current Company Data:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                  <span className="ml-2 font-semibold">${companyData.revenue?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Customers:</span>
                  <span className="ml-2 font-semibold">{companyData.customers}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Industry:</span>
                  <span className="ml-2 font-semibold">{companyData.industry || industry}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Growth Rate:</span>
                  <span className="ml-2 font-semibold">{(companyData.growth_rate * 100)?.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Options */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4"
          >
            <TrendingUp className="mr-2" />
            Advanced Forecasting Options
            <span className="ml-2 text-sm text-gray-500">({showAdvanced ? 'Hide' : 'Show'})</span>
          </button>

          {showAdvanced && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={seasonalEnabled}
                    onChange={(e) => setSeasonalEnabled(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Enable Seasonal Analysis</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newsEnabled}
                    onChange={(e) => setNewsEnabled(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Enable News Impact Analysis</span>
                </label>
              </div>

              {newsEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    News API Key (Optional)
                  </label>
                  <input
                    type="password"
                    value={newsApiKey}
                    onChange={(e) => setNewsApiKey(e.target.value)}
                    placeholder="Enter your News API key for market analysis"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              )}

              {seasonalEnabled && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="mr-2 text-blue-600" />
                    <span className="font-semibold text-blue-800 dark:text-blue-200">Seasonal Pattern Applied</span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {industry} industry seasonal patterns will be applied to your forecast. 
                    Peak months: {seasonalPatterns[industry as keyof typeof seasonalPatterns]?.peak.join(', ') || 'N/A'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Query Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Enter Your Forecast Query
          </h2>
          <div className="space-y-4">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Show me revenue for the next 6 months if I increase my customer base by 20%"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <button
              onClick={handleRunForecast}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
            >
              {loading ? "Generating Forecast..." : "Generate Forecast"}
            </button>
          </div>
        </div>

        {/* Results */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
            <div className="flex items-center">
              <AlertCircle className="mr-2" />
              {error}
            </div>
          </div>
        )}

        {result && (
          <div ref={reportRef} className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Forecast Period</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {result.forecast_data?.length || 0} months
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Final Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      ${Math.round(result.forecast_data?.[result.forecast_data.length - 1]?.totals?.monthly_revenue || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {Math.round(result.forecast_data?.[result.forecast_data.length - 1]?.totals?.total_customers || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Profit</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      ${Math.round(result.forecast_data?.reduce((sum: number, item: any) => sum + (item.totals?.monthly_profit || 0), 0) || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Export Results</h3>
              <div className="flex space-x-4">
                <button
                  onClick={exportToExcel}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export to Excel
                </button>
                <button
                  onClick={exportToPDF}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export to PDF
                </button>
              </div>
            </div>

            {/* Monthly Forecast Chart */}
            {chartData.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                  <BarChart3 className="mr-2" />
                  Monthly Forecast Visualization
                </h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any, name: string) => [
                          typeof value === 'number' ? value.toLocaleString() : value,
                          name
                        ]}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        name="Revenue"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        name="Profit"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="customers" 
                        stroke="#8B5CF6" 
                        strokeWidth={3}
                        name="Customers"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Detailed Results Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Detailed Forecast Results
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Month
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total Customers
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Monthly Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Monthly Expenses
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Monthly Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {result.forecast_data?.slice(0, 12).map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {Math.round(item.totals?.total_customers || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          ${Math.round(item.totals?.monthly_revenue || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          ${Math.round(item.totals?.monthly_expenses || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          ${Math.round(item.totals?.monthly_profit || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {result.forecast_data?.length > 12 && (
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Showing first 12 months of {result.forecast_data.length} total months. 
                  Download Excel file for complete data.
                </p>
              )}
            </div>

            {/* AI Analysis */}
            {result.ai_analysis && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  AI Analysis
                </h3>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {result.ai_analysis}
                  </p>
                </div>
              </div>
            )}

            {/* Assumptions Used */}
            {result.assumptions_used && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Assumptions Used
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(result.assumptions_used).map(([key, value]) => (
                    <div key={key} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                      </div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {typeof value === 'number' ? value.toLocaleString() : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}