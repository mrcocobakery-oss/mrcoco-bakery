'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useAdmin } from '@/contexts/AdminContext'
import { useRouter } from 'next/navigation'

export default function DecorationGalleryAdmin() {
  const { admin } = useAdmin()
  const router = useRouter()
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)
  const [newImage, setNewImage] = useState({ imageUrl: '', title: '', description: '' })

  useEffect(() => {
    if (!admin) {
      router.push('/admin/login')
      return
    }
    fetchGallery()
  }, [admin, router])

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/admin/decoration-gallery')
      const data = await response.json()
      setGallery(data.gallery || [])
    } catch (error) {
      console.error('Error fetching gallery:', error)
      toast.error('Failed to fetch gallery')
    } finally {
      setLoading(false)
    }
  }

  const handleAddImage = async (e) => {
    e.preventDefault()
    if (!newImage.imageUrl) {
      toast.error('Image URL is required')
      return
    }

    try {
      const response = await fetch('/api/admin/decoration-gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newImage)
      })

      if (response.ok) {
        toast.success('Image added successfully!')
        setNewImage({ imageUrl: '', title: '', description: '' })
        fetchGallery()
      } else {
        toast.error('Failed to add image')
      }
    } catch (error) {
      toast.error('Error adding image')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const response = await fetch(`/api/admin/decoration-gallery?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Image deleted successfully!')
        fetchGallery()
      } else {
        toast.error('Failed to delete image')
      }
    } catch (error) {
      toast.error('Error deleting image')
    }
  }

  if (loading) {
    return (
      <div className=\"flex items-center justify-center min-h-screen\">
        <div className=\"animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600\"></div>
      </div>
    )
  }

  return (
    <div className=\"min-h-screen bg-gray-50 p-6\">
      <div className=\"max-w-7xl mx-auto\">
        {/* Header */}
        <div className=\"flex items-center gap-4 mb-6\">
          <Link href=\"/admin/dashboard\">
            <Button variant=\"outline\" size=\"icon\">
              <ArrowLeft className=\"w-4 h-4\" />
            </Button>
          </Link>
          <div>
            <h1 className=\"text-3xl font-bold text-gray-800\">Decoration Services Gallery</h1>
            <p className=\"text-gray-600\">Manage photos displayed on decoration services page</p>
          </div>
        </div>

        {/* Add New Image Form */}
        <Card className=\"mb-8 border-2 border-pink-200\">
          <CardHeader>
            <CardTitle className=\"flex items-center gap-2\">
              <Plus className=\"w-5 h-5\" />
              Add New Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddImage} className=\"space-y-4\">
              <div>
                <Label htmlFor=\"imageUrl\">Image URL *</Label>
                <Input
                  id=\"imageUrl\"
                  required
                  value={newImage.imageUrl}
                  onChange={(e) => setNewImage({ ...newImage, imageUrl: e.target.value })}
                  placeholder=\"https://example.com/image.jpg or upload to a service\"
                />
                <p className=\"text-xs text-gray-500 mt-1\">
                  Upload image to Imgur, Cloudinary, or any image hosting service and paste URL here
                </p>
              </div>
              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                <div>
                  <Label htmlFor=\"title\">Title (Optional)</Label>
                  <Input
                    id=\"title\"
                    value={newImage.title}
                    onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                    placeholder=\"e.g., Birthday Decoration\"
                  />
                </div>
                <div>
                  <Label htmlFor=\"description\">Description (Optional)</Label>
                  <Input
                    id=\"description\"
                    value={newImage.description}
                    onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                    placeholder=\"Brief description\"
                  />
                </div>
              </div>
              <Button type=\"submit\" className=\"bg-pink-600 hover:bg-pink-700\">
                <Plus className=\"w-4 h-4 mr-2\" />
                Add Image
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Gallery Grid */}
        <div>
          <h2 className=\"text-2xl font-bold mb-4\">Current Gallery ({gallery.length} images)</h2>
          {gallery.length === 0 ? (
            <Card>
              <CardContent className=\"p-12 text-center\">
                <ImageIcon className=\"w-16 h-16 text-gray-400 mx-auto mb-4\" />
                <h3 className=\"text-xl font-semibold text-gray-700 mb-2\">No images yet</h3>
                <p className=\"text-gray-500\">Add your first image using the form above</p>
              </CardContent>
            </Card>
          ) : (
            <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
              {gallery.map((item) => (
                <Card key={item._id} className=\"overflow-hidden border-2 border-gray-200 hover:border-pink-300 transition\">
                  <div className=\"aspect-square relative bg-gray-100\">
                    <img
                      src={item.imageUrl}
                      alt={item.title || 'Decoration'}
                      className=\"w-full h-full object-cover\"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"400\"%3E%3Crect fill=\"%23ddd\" width=\"400\" height=\"400\"/%3E%3Ctext fill=\"%23999\" x=\"50%25\" y=\"50%25\" text-anchor=\"middle\" dy=\".3em\"%3EImage not found%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  </div>
                  <CardContent className=\"p-4\">
                    {item.title && <h3 className=\"font-semibold mb-1\">{item.title}</h3>}
                    {item.description && <p className=\"text-sm text-gray-600 mb-3\">{item.description}</p>}
                    <Button
                      onClick={() => handleDelete(item._id)}
                      variant=\"destructive\"
                      size=\"sm\"
                      className=\"w-full\"
                    >
                      <Trash2 className=\"w-3 h-3 mr-1\" />
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
