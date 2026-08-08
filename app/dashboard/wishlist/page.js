'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Trash2, IndianRupee } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState(null)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/wishlist', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setWishlist(data.wishlist)
      } else {
        toast.error('Failed to fetch wishlist')
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (productId) => {
    try {
      setRemoving(productId)
      const response = await fetch('/api/user/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId })
      })

      if (response.ok) {
        toast.success('Removed from wishlist')
        setWishlist(wishlist.filter(item => item._id !== productId))
      } else {
        toast.error('Failed to remove from wishlist')
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Something went wrong')
    } finally {
      setRemoving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Heart className="w-12 h-12 text-pink-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-pink-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist</p>
      </div>

      {/* Wishlist Grid */}
      {wishlist.length === 0 ? (
        <Card className="border-2 border-pink-200">
          <CardContent className="p-12">
            <div className="text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">Start adding products you love</p>
              <Link href="/products">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <Card key={product._id} className="border-2 border-pink-100 hover:border-pink-300 transition-all group">
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden rounded-t-lg">
                  <img
                    src={product.images?.[0] || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.isVeg !== undefined && (
                    <div className="absolute top-3 left-3">
                      <div className={`w-6 h-6 border-2 flex items-center justify-center rounded ${
                        product.isVeg ? 'border-green-600' : 'border-red-600'
                      }`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          product.isVeg ? 'bg-green-600' : 'bg-red-600'
                        }`} />
                      </div>
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    disabled={removing === product._id}
                    className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-pink-600">
                        ₹{product.price}
                      </p>
                      {product.size && (
                        <p className="text-sm text-gray-500">{product.size}</p>
                      )}
                    </div>
                    {product.stock > 0 ? (
                      <span className="text-xs text-green-600 font-medium">In Stock</span>
                    ) : (
                      <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/products/${product._id}`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-pink-300 text-pink-600 hover:bg-pink-50"
                      >
                        View Details
                      </Button>
                    </Link>
                    <Button
                      className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
                      disabled={product.stock === 0}
                      onClick={() => {
                        // Add to cart logic here
                        toast.success('Added to cart!')
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
