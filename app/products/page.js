'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ShoppingCart, Heart, Star, Search, ArrowLeft, SlidersHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { Header } from '@/components/navigation/Header'
import { WhatsAppChatButton } from '@/components/WhatsAppChatButton'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [selectedCakeType, setSelectedCakeType] = useState(searchParams.get('type') || 'all')
  const [selectedOccasion, setSelectedOccasion] = useState(searchParams.get('occasion') || 'all')
  const [selectedSpecialDay, setSelectedSpecialDay] = useState(searchParams.get('special') || 'all')
  const [sortBy, setSortBy] = useState('popular')
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  // Fetch products from API
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      
      if (response.ok) {
        setProducts(data.products || [])
      } else {
        toast.error('Failed to load products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  // Load cart and wishlist from localStorage
  useEffect(() => {
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

    // Filter by cake type (if cakes selected)
    if (selectedCategory === 'cakes' && selectedCakeType !== 'all') {
      filtered = filtered.filter(p => p.cakeType === selectedCakeType)
    }

    // Filter by occasion (if cakes selected)
    if (selectedCategory === 'cakes' && selectedOccasion !== 'all') {
      filtered = filtered.filter(p => p.occasion === selectedOccasion)
    }

    // Filter by special day (if cakes selected)
    if (selectedCategory === 'cakes' && selectedSpecialDay !== 'all') {
      filtered = filtered.filter(p => p.specialDay === selectedSpecialDay)
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
  }, [searchQuery, selectedCategory, selectedCakeType, selectedOccasion, selectedSpecialDay, sortBy, products])

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
      <Header cart={cart} wishlist={wishlist} />

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

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
            <Card className="border-2 border-pink-200 sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-pink-900">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory('all')
                      setSelectedCakeType('all')
                      setSelectedOccasion('all')
                      setSelectedSpecialDay('all')
                      setSearchQuery('')
                    }}
                  >
                    Clear All
                  </Button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <Label className="mb-2 block">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <Label className="mb-2 block font-bold">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="cakes">Cakes</SelectItem>
                      <SelectItem value="cookies">Cookies</SelectItem>
                      <SelectItem value="namkeen">Namkeen</SelectItem>
                      <SelectItem value="gifts">Gift Packs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Cake Filters */}
                {selectedCategory === 'cakes' && (
                  <>
                    <div className="mb-6">
                      <Label className="mb-2 block font-bold">Cake Type</Label>
                      <Select value={selectedCakeType} onValueChange={setSelectedCakeType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="eggless">Eggless</SelectItem>
                          <SelectItem value="designer">Designer</SelectItem>
                          <SelectItem value="photo">Photo</SelectItem>
                          <SelectItem value="fondant">Fondant</SelectItem>
                          <SelectItem value="chocolate">Chocolate</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="cheesecake">Cheesecake</SelectItem>
                          <SelectItem value="bento">Bento</SelectItem>
                          <SelectItem value="mini">Mini</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="mb-6">
                      <Label className="mb-2 block font-bold">Occasion</Label>
                      <Select value={selectedOccasion} onValueChange={setSelectedOccasion}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Occasions</SelectItem>
                          <SelectItem value="birthday">Birthday</SelectItem>
                          <SelectItem value="anniversary">Anniversary</SelectItem>
                          <SelectItem value="wedding">Wedding</SelectItem>
                          <SelectItem value="engagement">Engagement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="mb-6">
                      <Label className="mb-2 block font-bold">Special Day</Label>
                      <Select value={selectedSpecialDay} onValueChange={setSelectedSpecialDay}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Days</SelectItem>
                          <SelectItem value="mothers day">Mother's Day</SelectItem>
                          <SelectItem value="fathers day">Father's Day</SelectItem>
                          <SelectItem value="valentine">Valentine</SelectItem>
                          <SelectItem value="christmas">Christmas</SelectItem>
                          <SelectItem value="diwali">Diwali</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <p className="text-gray-600">{filteredProducts.length} products found</p>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600 mb-4">No products found</p>
                <Button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setSelectedCakeType('all')
                    setSelectedOccasion('all')
                    setSelectedSpecialDay('all')
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group overflow-hidden border-2 border-pink-100 hover:border-pink-400 hover:shadow-xl transition-all">
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
                        <h3 className="font-semibold text-pink-900 mb-2 hover:text-pink-600 transition line-clamp-2">{product.name}</h3>
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
                      
                      {/* WhatsApp Button for Cakes */}
                      {product.category === 'cakes' && (
                        <WhatsAppChatButton 
                          product={product} 
                          className="w-full mb-2"
                        />
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add
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
      </div>
    </div>
  )
}
