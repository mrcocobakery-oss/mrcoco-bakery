'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { toast } from 'sonner'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Don't check for cookie client-side since it's httpOnly
      // Just call the API which will read the cookie server-side
      const response = await fetch('/api/auth/me', {
        credentials: 'include' // Important: include cookies in request
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Include cookies
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      setUser(data.user)
      toast.success('Welcome back!')
      return { success: true }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  const signup = async (name, email, password, phone, referralCode) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, referralCode }),
        credentials: 'include' // Include cookies
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      setUser(data.user)
      toast.success(data.message || 'Account created successfully!')
      return { success: true, message: data.message }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  const loginWithOTP = async (phone, otp, name) => {
    try {
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, name })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'OTP verification failed')
      }

      setUser(data.user)
      toast.success('Welcome!')
      return { success: true }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      Cookies.remove('token')
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithOTP, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
