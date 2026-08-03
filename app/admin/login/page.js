'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Lock, User, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const { loginAdmin, admin } = useAdmin()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  // Redirect if already logged in
  useEffect(() => {
    setMounted(true)
    if (admin) {
      router.push('/admin/dashboard')
    }
  }, [admin, router])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const result = loginAdmin(formData.username, formData.password)
    
    setLoading(false)
    
    if (result.success) {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="absolute top-6 left-6">
        <Link href="/">
          <img src="/images/mrcoco-logo.png" alt="Mr. COCO Bakery" className="h-16" />
        </Link>
      </div>

      <Card className="w-full max-w-md border-2 border-pink-300 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-serif text-pink-900">Admin Panel</CardTitle>
          <CardDescription>Mr. COCO Bakery Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter admin username"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter admin password"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white text-lg py-6"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Login to Admin Panel
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-pink-600 hover:text-pink-700 font-medium">
              ← Back to Website
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
