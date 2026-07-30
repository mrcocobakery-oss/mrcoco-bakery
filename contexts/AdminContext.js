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
      setAdmin({ username: 'admin' })
    }
    setLoading(false)
  }

  const loginAdmin = (username, password) => {
    // Simple hardcoded authentication
    if (username === 'admin' && password === 'admin123') {
      setAdmin({ username: 'admin' })
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
