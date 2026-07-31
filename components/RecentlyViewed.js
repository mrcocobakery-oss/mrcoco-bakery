'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'

export function RecentlyViewed({ currentProductId }) {
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentlyViewed()
  }, [currentProductId])

  const fetchRecentlyViewed = async () => {
    try {
      // Get recently viewed product IDs from localStorage
      const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
      
      // Filter out current product
      const idsToFetch = viewedIds.filter(id => id !== currentProductId).slice(0, 4)
      
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

  if (loading || recentProducts.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-pink-600" />
        <h2 className="text-2xl font-bold font-serif text-pink-900">Recently Viewed</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentProducts.map((product) => (
          <Card key={product.id} className="group overflow-hidden border-2 border-pink-100 hover:border-pink-400 hover:shadow-xl transition-all">
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
                <h3 className="font-semibold text-pink-900 mb-2 hover:text-pink-600 transition line-clamp-2">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-pink-900">₹{product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
