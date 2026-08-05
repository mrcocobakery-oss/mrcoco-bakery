'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Image as ImageIcon, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { CloudinaryUploadWidget } from '@/components/CloudinaryUploadWidget'
import Cookies from 'js-cookie'
import Image from 'next/image'

export default function AdminMenuPage() {
  const [menuImage, setMenuImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchMenuImage()
  }, [])

  const fetchMenuImage = async () => {
    try {
      const response = await fetch('/api/menu')
      const data = await response.json()
      
      if (response.ok && data.menu) {
        setMenuImage(data.menu)
      }
    } catch (error) {
      console.error('Error fetching menu:', error)
      toast.error('Failed to load menu')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (imageUrl) => {
    try {
      setUploading(true)
      const adminToken = Cookies.get('admin_token')
      
      const response = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ imageUrl })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Menu image uploaded successfully!')
        setMenuImage(data.menu)
      } else {
        toast.error(data.error || 'Failed to upload menu')
      }
    } catch (error) {
      console.error('Error uploading menu:', error)
      toast.error('Failed to upload menu')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteMenu = async () => {
    if (!confirm('Are you sure you want to delete the menu image?')) return

    try {
      const adminToken = Cookies.get('admin_token')
      
      const response = await fetch('/api/admin/menu', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })

      if (response.ok) {
        toast.success('Menu deleted successfully!')
        setMenuImage(null)
      } else {
        toast.error('Failed to delete menu')
      }
    } catch (error) {
      console.error('Error deleting menu:', error)
      toast.error('Failed to delete menu')
    }
  }

  const handleViewMenu = () => {
    window.open('/our-menu', '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-500 mt-1">Upload and manage your restaurant menu</p>
        </div>
        {menuImage && (
          <Button
            onClick={handleViewMenu}
            variant="outline"
            className="border-pink-600 text-pink-600 hover:bg-pink-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Live Menu
          </Button>
        )}
      </div>

      {/* Upload Section */}
      <Card className="border-2 border-pink-200">
        <CardHeader>
          <CardTitle>Menu Image Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current Menu Preview */}
            {menuImage ? (
              <div>
                <h3 className="font-semibold mb-3 text-gray-700">Current Menu</h3>
                <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={menuImage.imageUrl}
                    alt="Current Menu"
                    width={800}
                    height={1000}
                    className="w-full h-auto object-contain max-h-[600px]"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={handleDeleteMenu}
                    variant="destructive"
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Menu
                  </Button>
                  <Button
                    onClick={handleViewMenu}
                    variant="outline"
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview on Website
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No menu uploaded yet</p>
                <p className="text-sm text-gray-500">Upload a menu image to display on your website</p>
              </div>
            )}

            {/* Upload Widget */}
            <div>
              <h3 className="font-semibold mb-3 text-gray-700">
                {menuImage ? 'Replace Menu Image' : 'Upload Menu Image'}
              </h3>
              <CloudinaryUploadWidget
                onUploadSuccess={handleImageUpload}
                folder="menu"
                buttonText={menuImage ? 'Upload New Menu' : 'Upload Menu Image'}
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: For best results, upload a high-quality PNG or JPG image of your menu
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">📝 Instructions</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Upload a clear, high-resolution image of your menu (PNG or JPG format)</li>
            <li>Ensure the text is readable when viewed on both desktop and mobile devices</li>
            <li>The menu will be displayed on the "Our Menu" page accessible from the footer</li>
            <li>You can replace the menu anytime by uploading a new image</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
