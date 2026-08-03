'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, Image as ImageIcon, MoveUp, MoveDown } from 'lucide-react'
import { toast } from 'sonner'

export default function HomepageSliderManagement() {
  const [sliders, setSliders] = useState([])
  const [loading, setLoading] = useState(true)
  const [newSlider, setNewSlider] = useState({
    imageUrl: '',
    altText: '',
    order: 0
  })

  useEffect(() => {
    fetchSliders()
  }, [])

  const fetchSliders = async () => {
    try {
      const response = await fetch('/api/admin/homepage-slider')
      const data = await response.json()
      if (data.success) {
        setSliders(data.sliders)
      }
    } catch (error) {
      toast.error('Failed to fetch sliders')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSlider = async (e) => {
    e.preventDefault()
    
    if (!newSlider.imageUrl) {
      toast.error('Please enter an image URL')
      return
    }

    try {
      const response = await fetch('/api/admin/homepage-slider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSlider)
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Slider image added successfully')
        setNewSlider({ imageUrl: '', altText: '', order: 0 })
        fetchSliders()
      } else {
        toast.error(data.error || 'Failed to add slider')
      }
    } catch (error) {
      toast.error('Failed to add slider')
    }
  }

  const handleDeleteSlider = async (id) => {
    if (!confirm('Are you sure you want to delete this slider image?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/homepage-slider?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Slider deleted successfully')
        fetchSliders()
      } else {
        toast.error(data.error || 'Failed to delete slider')
      }
    } catch (error) {
      toast.error('Failed to delete slider')
    }
  }

  const handleUpdateOrder = async (id, newOrder) => {
    try {
      const response = await fetch('/api/admin/homepage-slider', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, order: newOrder })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Order updated')
        fetchSliders()
      } else {
        toast.error(data.error || 'Failed to update order')
      }
    } catch (error) {
      toast.error('Failed to update order')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sliders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Homepage Slider Management</h1>
          <p className="text-gray-600 mt-1">Manage hero slider images on the homepage</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {sliders.length} Slider{sliders.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Add New Slider */}
      <Card className="border-2 border-pink-200">
        <CardHeader className="bg-pink-50">
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Slider Image
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleAddSlider} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="imageUrl">Image URL *</Label>
                <Input
                  id="imageUrl"
                  required
                  value={newSlider.imageUrl}
                  onChange={(e) => setNewSlider({ ...newSlider, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended size: 1920x400px for best results
                </p>
              </div>
              <div>
                <Label htmlFor="altText">Alt Text</Label>
                <Input
                  id="altText"
                  value={newSlider.altText}
                  onChange={(e) => setNewSlider({ ...newSlider, altText: e.target.value })}
                  placeholder="Image description"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={newSlider.order}
                onChange={(e) => setNewSlider({ ...newSlider, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Slider Image
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Current Sliders */}
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle>Current Slider Images</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {sliders.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No slider images added yet</p>
              <p className="text-sm text-gray-400 mt-1">Add your first slider image above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sliders.map((slider, index) => (
                <div
                  key={slider._id}
                  className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-pink-300 transition-all"
                >
                  {/* Order Badge */}
                  <div className="flex flex-col gap-1">
                    <Badge className="bg-pink-600 text-white w-12 text-center">
                      #{slider.order}
                    </Badge>
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateOrder(slider._id, slider.order - 1)}
                        disabled={index === 0}
                        className="h-6 w-12 p-0"
                      >
                        <MoveUp className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateOrder(slider._id, slider.order + 1)}
                        disabled={index === sliders.length - 1}
                        className="h-6 w-12 p-0"
                      >
                        <MoveDown className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Image Preview */}
                  <div className="w-48 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={slider.imageUrl}
                      alt={slider.altText || 'Slider image'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found'
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold">Alt Text:</span> {slider.altText || 'No alt text'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      <span className="font-semibold">URL:</span> {slider.imageUrl}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Added: {new Date(slider.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteSlider(slider._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-2">📝 Tips for Best Results:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Recommended image size: 1920x400px (Full width, 400px height)</li>
            <li>• Use high-quality images in JPG or PNG format</li>
            <li>• Slider auto-plays every 3 seconds</li>
            <li>• Lower order numbers display first</li>
            <li>• Keep important content centered (mobile responsiveness)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
