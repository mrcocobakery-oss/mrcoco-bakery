'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ShoppingCart, Heart, Star, Search, SlidersHorizontal, Cake, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])

  // Mock products data
  const mockProducts = [
    { id: 1, name: 'Chocolate Truffle Cake', price: 899, originalPrice: 1099, category: 'cakes', type: 'eggless', occasion: 'birthday', image: 'https://images.pexels.com/photos/35583855/pexels-photo-35583855.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', rating: 4.8, reviews: 245, discount: 18, inStock: true },
    { id: 2, name: 'Red Velvet Cake', price: 799, originalPrice: 999, category: 'cakes', type: 'eggless', occasion: 'anniversary', image: 'https://images.unsplash.com/photo-1780586377241-41b03171419b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwzfHxwcmVtaXVtJTIwY2FrZXN8ZW58MHx8fHwxNzg0NTQ1OTUyfDA&ixlib=rb-4.1.0&q=85', rating: 4.9, reviews: 312, discount: 20, inStock: true },
    { id: 3, name: 'Premium Butter Cookies', price: 399, originalPrice: 499, category: 'cookies', type: 'premium', image: 'https://images.pexels.com/photos/27304325/pexels-photo-27304325.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', rating: 4.7, reviews: 189, discount: 20, inStock: true },
    { id: 4, name: 'White & Gold Wedding Cake', price: 1299, originalPrice: 1599, category: 'cakes', type: 'fondant', occasion: 'wedding', image: 'https://images.unsplash.com/photo-1633062781822-e32867fe7d4a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHw0fHxwcmVtaXVtJTIwY2FrZXN8ZW58MHx8fHwxNzg0NTQ1OTUyfDA&ixlib=rb-4.1.0&q=85', rating: 5.0, reviews: 156, discount: 19, inStock: true },
    { id: 5, name: 'Black Forest Cake', price: 749, originalPrice: 899, category: 'cakes', type: 'chocolate', occasion: 'birthday', image: 'https://images.pexels.com/photos/35583855/pexels-photo-35583855.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', rating: 4.6, reviews: 198, discount: 17, inStock: true },
    { id: 6, name: 'Fruit Cake', price: 649, originalPrice: 799, category: 'cakes', type: 'fruit', occasion: 'birthday', image: 'https://images.unsplash.com/photo-1780586377241-41b03171419b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwzfHxwcmVtaXVtJTIwY2FrZXN8ZW58MHx8fHwxNzg0NTQ1OTUyfDA&ixlib=rb-4.1.0&q=85', rating: 4.5, reviews: 134, discount: 19, inStock: true },
    { id: 7, name: 'Healthy Oat Cookies', price: 299, originalPrice: 399, category: 'cookies', type: 'healthy', image: 'https://images.pexels.com/photos/27304325/pexels-photo-27304325.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', rating: 4.4, reviews: 87, discount: 25, inStock: true },
    { id: 8, name: 'Tea Time Cookie Mix', price: 349, originalPrice: 449, category: 'cookies', type: 'tea-cookies', image: 'https://images.pexels.com/photos/27304325/pexels-photo-27304325.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', rating: 4.6, reviews: 142, discount: 22, inStock: true },
    { id: 9, name: 'Traditional Namkeen Mix', price: 249, originalPrice: 299, category: 'namkeen', type: 'traditional', image: 'https://images.pexels.com/photos/27304325/pexels-photo-27304325.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', rating: 4.7, reviews: 203, discount: 17, inStock: true },
    { id: 10, name: 'Premium Gift Hamper', price: 1499, originalPrice: 1899, category: 'gifts', type: 'hamper', image: 'https://images.unsplash.com/photo-1633062781822-e32867fe7d4a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHw0fHxwcmVtaXVtJTIwY2FrZXN8ZW58MHx8fHwxNzg0NTQ1OTUyfDA&ixlib=rb-4.1.0&q=85', rating: 4.9, reviews: 176, discount: 21, inStock: true },
    { id: 11, name: 'Designer Photo Cake', price: 999, originalPrice: 1199, category: 'cakes', type: 'photo', occasion: 'birthday', image: 'https://images.pexels.com/photos/35583855/pexels-photo-35583855.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', rating: 4.8, reviews: 267, discount: 17, inStock: true },
    { id: 12, name: 'Bento Cake Collection', price: 399, originalPrice: 499, category: 'cakes', type: 'bento', occasion: 'birthday', image: 'https://images.unsplash.com/photo-1780586377241-41b03171419b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwzfHxwcmVtaXVtJTIwY2FrZXN8ZW58MHx8fHwxNzg0NTQ1OTUyfDA&ixlib=rb-4.1.0&q=85', rating: 4.9, reviews: 298, discount: 20, inStock: true },
  ]

  useEffect(() => {
    setProducts(mockProducts)
    setFilteredProducts(mockProducts)
    
    const savedCart = localStorage.getItem('cart')
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
  }, [])

  useEffect(() => {
    let filtered = [...products]

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    }

    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategory, sortBy, products])

  const addToCart = (product) => {
    const newCart = [...cart, product]
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    toast.success(`${product.name} added to cart!`)
  }

  const toggleWishlist = (product) => {
    const exists = wishlist.find(item => item.id === product.id)
    let newWishlist
    if (exists) {
      newWishlist = wishlist.filter(item => item.id !== product.id)
      toast.success('Removed from wishlist')
    } else {
      newWishlist = [...wishlist, product]
      toast.success('Added to wishlist!')
    }
    setWishlist(newWishlist)
    localStorage.setItem('wishlist', JSON.stringify(newWishlist))
  }

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/images/mrcoco-logo.png" alt="Mr. COCO Bakery" className="h-16 w-auto" />
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="w-5 h-5 text-pink-900" />
                  {wishlist.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                      {wishlist.length}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5 text-pink-900" />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-pink-600 text-white text-xs">
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
      <div className="bg-gradient-to-r from-pink-600 to-pink-800 py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">Our Products</h1>
          <p className="text-pink-100 text-lg">Discover our premium collection of freshly baked delights</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border-b border-pink-200 sticky top-20 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="cakes">Cakes</SelectItem>
                <SelectItem value="cookies">Cookies</SelectItem>
                <SelectItem value="namkeen">Namkeen</SelectItem>
                <SelectItem value="gifts">Gift Packs</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">{filteredProducts.length} products found</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-4">No products found</p>
            <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="bg-pink-600 hover:bg-pink-700 text-white">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-2 border-pink-100 hover:border-pink-400 hover:shadow-xl transition-all">
                <Link href={`/products/${product.id}`}>
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {product.discount && (
                      <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0">{product.discount}% OFF</Badge>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-pink-900 mb-2 hover:text-pink-600 transition line-clamp-1">{product.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xl font-bold text-pink-900">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => addToCart(product)} 
                      disabled={!product.inStock}
                      className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button 
                      onClick={() => toggleWishlist(product)}
                      variant="outline"
                      size="icon"
                      className={isInWishlist(product.id) ? 'border-red-500 text-red-500' : ''}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500' : ''}`} />
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
