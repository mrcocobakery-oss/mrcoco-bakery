'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

export function RecentlyViewed({ currentProductId }) {
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    fetchRecentlyViewed()
  }, [currentProductId])

  const fetchRecentlyViewed = async () => {
    try {
      // Get recently viewed product IDs from localStorage
      const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
      
      // Filter out current product
      const idsToFetch = viewedIds.filter(id => id !== currentProductId).slice(0, 8)
      
      if (idsToFetch.length === 0) {
        setLoading(false)
        return
      }

      // Fetch all products
      const response = await fetch('/api/products')
      const data = await response.json()
      
      if (data.success) {
        // Filter to only recently viewed products
        const recent = data.products.filter(p => idsToFetch.includes(p.id))
        setRecentProducts(recent)
      }
    } catch (error) {
      console.error('Error fetching recently viewed:', error)
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
    const container = document.getElementById('recently-viewed-scroll')
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (loading || recentProducts.length === 0) {
    return null
  }

  return (
    <div className="mt-12 relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-pink-600" />
          <h2 className="text-2xl font-bold font-serif text-pink-900">Recently Viewed</h2>
        </div>
        {recentProducts.length > 4 && (
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
        id="recently-viewed-scroll"
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {recentProducts.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-64 snap-start">
            <Card className="group overflow-hidden border-2 border-pink-100 hover:border-pink-400 hover:shadow-xl transition-all h-full">
              <Link href={`/products/${product.id}`}>
                <div className="relative h-48 overflow-hidden bg-gray-100">
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
                </div>
              </Link>
              <CardContent className="p-4">
                {/* Category Badge */}
                <div className="mb-2">
                  <Badge className="bg-pink-100 text-pink-700 text-xs">
                    {product.category}
                  </Badge>
                </div>
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-pink-900 mb-2 hover:text-pink-600 transition line-clamp-2 text-sm">
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
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white"
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
  )
}
