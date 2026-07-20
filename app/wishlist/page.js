'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingCart, Trash2, ArrowLeft, Star, Cake } from 'lucide-react'
import { toast } from 'sonner'

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([])
  const [cart, setCart] = useState([])

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    const savedCart = localStorage.getItem('cart')
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
    if (savedCart) setCart(JSON.parse(savedCart))
  }, [])

  const removeFromWishlist = (productId) => {
    const newWishlist = wishlist.filter(item => item.id !== productId)
    setWishlist(newWishlist)
    localStorage.setItem('wishlist', JSON.stringify(newWishlist))
    toast.success('Removed from wishlist')
  }

  const moveToCart = (product) => {
    const newCart = [...cart, product]
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    removeFromWishlist(product.id)
    toast.success('Moved to cart!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-lg">
                <Cake className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-serif text-amber-900">Mr. COCO</h1>
                <p className="text-xs text-amber-700">Bakery</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5 text-amber-900" />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-amber-600 text-white text-xs">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 py-12">
        <div className="container mx-auto px-4">
          <Link href="/products">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">My Wishlist</h1>
          <p className="text-amber-100 text-lg">{wishlist.length} items saved for later</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Save your favorite products for later!</p>
            <Link href="/products">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-2 border-amber-100 hover:border-amber-400 hover:shadow-xl transition-all">
                <Link href={`/products/${product.id}`}>
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {product.discount && (
                      <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0">{product.discount}% OFF</Badge>
                    )}
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-amber-900 mb-2 hover:text-amber-600 transition line-clamp-1">{product.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xl font-bold text-amber-900">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => moveToCart(product)} 
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button 
                      onClick={() => removeFromWishlist(product.id)}
                      variant="outline"
                      size="icon"
                      className="text-red-500 border-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
