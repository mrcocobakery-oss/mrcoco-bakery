'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

export function ProductRecommendations({ limit = 6 }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      // Get recently viewed product IDs from localStorage
      const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
      
      if (viewedIds.length === 0) {
        setLoading(false)
        return
      }

      // Fetch personalized recommendations
      const response = await fetch(`/api/products/recommendations?recentlyViewed=${viewedIds.join(',')}&limit=${limit}`)
      const data = await response.json()
      
      if (data.success && data.products) {
        setRecommendations(data.products)
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    savedCart.push(product)
    localStorage.setItem('cart', JSON.stringify(savedCart))
    window.dispatchEvent(new Event('storage'))
    toast.success('Added to cart!')
  }

  const scroll = (direction) => {
    const container = document.getElementById('recommendations-scroll')
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (loading || recommendations.length === 0) {
    return null
  }

  return (
    <div className="py-12 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-3xl font-bold font-serif text-pink-900">Recommended For You</h2>
              <p className="text-gray-600 text-sm">Based on your browsing history</p>
            </div>
          </div>
          {recommendations.length > 4 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('left')}
                className="rounded-full"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('right')}
                className="rounded-full"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div 
          id="recommendations-scroll"
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {recommendations.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-72 snap-start">
              <Card className="group overflow-hidden border-2 border-purple-100 hover:border-purple-400 hover:shadow-xl transition-all h-full">
                <Link href={`/products/${product.id}`}>
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    {product.discount > 0 && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0">
                        {product.discount}% OFF
                      </Badge>
                    )}
                    <Badge className="absolute top-2 right-2 bg-purple-600 text-white border-0">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                </Link>
                <CardContent className="p-4">
                  {/* Category Badge */}
                  <div className="mb-2">
                    <Badge className="bg-purple-100 text-purple-700 text-xs capitalize">
                      {product.category}
                    </Badge>
                  </div>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-pink-900 mb-2 hover:text-pink-600 transition line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-lg font-bold text-pink-900">₹{product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
