'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Trash2, Download, Upload } from 'lucide-react'
import { toast } from 'sonner'
import Cookies from 'js-cookie'

export default function AdminCataloguePage() {
  const [catalogue, setCatalogue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchCatalogue()
  }, [])

  const fetchCatalogue = async () => {
    try {
      const response = await fetch('/api/catalogue')
      const data = await response.json()
      
      if (data.success && data.catalogue) {
        setCatalogue(data.catalogue)
      }
    } catch (error) {
      console.error('Error fetching catalogue:', error)
      toast.error('Failed to load catalogue')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    try {
      setUploading(true)

      // Upload to Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'ml_default') // Use your Cloudinary upload preset
      formData.append('folder', 'catalogues')

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: 'POST',
          body: formData
        }
      )

      const cloudinaryData = await cloudinaryResponse.json()

      if (!cloudinaryResponse.ok) {
        throw new Error('Failed to upload to Cloudinary')
      }

      // Save to database
      const adminToken = Cookies.get('admin_token')
      const response = await fetch('/api/admin/catalogue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          fileUrl: cloudinaryData.secure_url,
          fileName: file.name,
          fileSize: file.size
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Catalogue uploaded successfully!')
        setCatalogue(data.catalogue)
      } else {
        toast.error(data.error || 'Failed to upload catalogue')
      }
    } catch (error) {
      console.error('Error uploading catalogue:', error)
      toast.error('Failed to upload catalogue')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete the catalogue?')) return

    try {
      const adminToken = Cookies.get('admin_token')
      
      const response = await fetch('/api/admin/catalogue', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })

      if (response.ok) {
        toast.success('Catalogue deleted successfully!')
        setCatalogue(null)
      } else {
        toast.error('Failed to delete catalogue')
      }
    } catch (error) {
      console.error('Error deleting catalogue:', error)
      toast.error('Failed to delete catalogue')
    }
  }

  const handleDownload = () => {
    if (catalogue?.fileUrl) {
      window.open(catalogue.fileUrl, '_blank')
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Catalogue Management</h1>
        <p className="text-gray-500 mt-1">Manage your downloadable product catalogue</p>
      </div>

      {/* Current Catalogue */}
      <Card className="border-2 border-pink-200">
        <CardHeader>
          <CardTitle>Current Catalogue</CardTitle>
        </CardHeader>
        <CardContent>
          {catalogue ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-pink-50 rounded-lg border-2 border-pink-200">
                <div className="p-3 bg-pink-600 rounded-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{catalogue.fileName}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Uploaded: {new Date(catalogue.uploadedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {catalogue.fileSize > 0 && (
                    <p className="text-sm text-gray-600">Size: {formatFileSize(catalogue.fileSize)}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleDownload}
                  className="flex-1 bg-pink-600 hover:bg-pink-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Preview
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Catalogue
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No catalogue uploaded yet</p>
              <p className="text-sm text-gray-500">Upload a PDF catalogue to make it available for download</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Upload New Catalogue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="catalogue-upload" className="block">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-100 transition cursor-pointer">
                  <Upload className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <p className="text-blue-900 font-semibold mb-1">
                    {uploading ? 'Uploading...' : 'Click to upload PDF catalogue'}
                  </p>
                  <p className="text-sm text-blue-700">
                    Maximum file size: 10MB
                  </p>
                </div>
              </label>
              <input
                id="catalogue-upload"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">📋 Upload Instructions</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Only PDF files are accepted</li>
                <li>Maximum file size is 10MB</li>
                <li>Uploading a new catalogue will replace the existing one</li>
                <li>Catalogue will be available on "Become Our Partner" page</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
