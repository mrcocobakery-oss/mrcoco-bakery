'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Download, ZoomIn } from 'lucide-react'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { toast } from 'sonner'

export default function OurMenuPage() {
  const [menuImage, setMenuImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showZoomedImage, setShowZoomedImage] = useState(false)

  useEffect(() => {
    fetchMenuImage()
  }, [])

  const fetchMenuImage = async () => {
    try {
      const response = await fetch('/api/menu')
      const data = await response.json()
      
      if (response.ok && data.menu) {
        setMenuImage(data.menu.imageUrl)
      }
    } catch (error) {
      console.error('Error fetching menu:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (menuImage) {
      window.open(menuImage, '_blank')
      toast.success('Menu opened in new tab!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      <Header />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-800 py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">Our Menu</h1>
          <p className="text-pink-100 text-lg">Explore our delicious offerings</p>
        </div>
      </div>

      {/* Menu Content */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading menu...</p>
            </div>
          </div>
        ) : menuImage ? (
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-pink-200 shadow-xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-pink-900">Menu Card</h2>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowZoomedImage(true)}
                      variant="outline"
                      size="sm"
                      className="border-pink-600 text-pink-600 hover:bg-pink-50"
                    >
                      <ZoomIn className="w-4 h-4 mr-2" />
                      View Full Size
                    </Button>
                    <Button
                      onClick={handleDownload}
                      size="sm"
                      className="bg-pink-600 hover:bg-pink-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition"
                     onClick={() => setShowZoomedImage(true)}>
                  <Image
                    src={menuImage}
                    alt="Mr. COCO Bakery Menu"
                    width={1200}
                    height={1600}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>

                <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <p className="text-sm text-pink-800 text-center">
                    📱 For orders and inquiries, call us at <a href="tel:+918447655399" className="font-semibold underline">+91 8447655399</a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Menu Not Available</h2>
            <p className="text-gray-600 mb-6">Our menu is being updated. Please check back soon!</p>
            <Link href="/products">
              <Button className="bg-pink-600 hover:bg-pink-700">
                Browse Our Products
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Zoomed Image Modal */}
      {showZoomedImage && menuImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowZoomedImage(false)}
        >
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
            <Button
              onClick={() => setShowZoomedImage(false)}
              className="absolute top-4 right-4 bg-white text-black hover:bg-gray-200 z-10"
              size="sm"
            >
              Close
            </Button>
            <div className="w-full h-full overflow-auto">
              <Image
                src={menuImage}
                alt="Mr. COCO Bakery Menu - Full Size"
                width={2000}
                height={3000}
                className="w-auto h-auto max-w-full max-h-full mx-auto"
                priority
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
