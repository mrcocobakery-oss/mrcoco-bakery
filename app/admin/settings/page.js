'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, User, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useAdmin } from '@/contexts/AdminContext'

export default function AdminSettingsPage() {
  const { admin } = useAdmin()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    setMounted(true)
    if (!admin) {
      router.push('/admin/login')
    } else {
      setFormData(prev => ({ ...prev, newUsername: admin.username }))
    }
  }, [admin, router])

  if (!mounted || !admin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  // Don't render anything while checking auth
  if (!admin) {
    return null
  }

  const handleSave = async (e) => {
    e.preventDefault()
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match!')
      return
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    
    try {
      // In a real app, this would call an API to update credentials
      // For now, we'll update the .env file
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newUsername: formData.newUsername,
          newPassword: formData.newPassword
        })
      })

      if (response.ok) {
        toast.success('Settings updated successfully! Please login again.')
        setTimeout(() => {
          router.push('/admin/login')
        }, 2000)
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update settings')
      }
    } catch (error) {
      toast.error('Error updating settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Settings</h1>
            <p className="text-gray-600">Manage your admin account</p>
          </div>
        </div>

        {/* Current Credentials Info */}
        <Card className="mb-6 border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Current Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold">Username:</span>
                <span className="text-gray-700">{admin.username}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold">Password:</span>
                <span className="text-gray-700">••••••••••••</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Update Settings Form */}
        <Card className="border-2 border-pink-200">
          <CardHeader className="bg-pink-50">
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Update Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <Label htmlFor="currentPassword">Current Password *</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  required
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  placeholder="Enter current password to verify"
                />
                <p className="text-xs text-gray-500 mt-1">Required for security verification</p>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold mb-4">Change Username</h3>
                <div>
                  <Label htmlFor="newUsername">New Username</Label>
                  <Input
                    id="newUsername"
                    value={formData.newUsername}
                    onChange={(e) => setFormData({ ...formData, newUsername: e.target.value })}
                    placeholder="Enter new username"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder="Enter new password (min 6 characters)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Link href="/admin/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Note */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> After changing credentials, you will be logged out and need to login again with your new credentials.
          </p>
        </div>
      </div>
    </div>
  )
}
