'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { toast } from 'sonner'

const AdminContext = createContext({})

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = () => {
    const adminToken = Cookies.get('admin_token')
    if (adminToken === 'admin_logged_in') {
      const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'mrcocoadmin'
      setAdmin({ username: ADMIN_USERNAME })
    }
    setLoading(false)
  }

  const loginAdmin = (username, password) => {
    // Check against environment variables or default secure credentials
    const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'mrcocoadmin'
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'MrCoco@2025#Secure'
    
    // Debug logging
    console.log('Login attempt:', { username, passwordLength: password.length })
    console.log('Expected credentials:', { 
      username: ADMIN_USERNAME, 
      passwordLength: ADMIN_PASSWORD.length,
      envUsername: process.env.NEXT_PUBLIC_ADMIN_USERNAME,
      envPassword: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
      usernameMatch: username === ADMIN_USERNAME,
      passwordMatch: password === ADMIN_PASSWORD
    })
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAdmin({ username: ADMIN_USERNAME })
      Cookies.set('admin_token', 'admin_logged_in', { expires: 7 })
      toast.success('Welcome to Admin Panel!')
      return { success: true }
    } else {
      toast.error('Invalid credentials')
      return { success: false, error: 'Invalid username or password' }
    }
  }

  const logoutAdmin = () => {
    setAdmin(null)
    Cookies.remove('admin_token')
    toast.success('Logged out successfully')
  }

  return (
    <AdminContext.Provider value={{ admin, loading, loginAdmin, logoutAdmin, checkAdminAuth }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}
