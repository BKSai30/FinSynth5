"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsLoggedIn(false)
    router.push('/')
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              FinSynth
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="/" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Home
            </a>
            
            {isLoggedIn ? (
              <>
                <a 
                  href="/forecast" 
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Forecast
                </a>
                <span className="text-gray-600 dark:text-gray-400">
                  Welcome, {user?.full_name}
                </span>
              </>
            ) : (
              <a 
                href="/login" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Login
              </a>
            )}
          </div>

          {/* Right side - Theme toggle and logout */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
            <a 
              href="/" 
              className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Home
            </a>
            
            {isLoggedIn ? (
              <>
                <a 
                  href="/forecast" 
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Forecast
                </a>
                <div className="px-3 py-2 text-gray-600 dark:text-gray-400">
                  Welcome, {user?.full_name}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <a 
                href="/login" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
