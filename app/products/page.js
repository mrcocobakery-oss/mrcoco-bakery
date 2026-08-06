'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ShoppingCart, Heart, Search, ArrowLeft, SlidersHorizontal, Eye, Plus, Minus, Calendar, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { successToast } from '@/lib/toast-animations'
import { Header } from '@/components/navigation/Header'
import { WhatsAppChatButton } from '@/components/WhatsAppChatButton'
import { QuickViewModal } from '@/components/QuickViewModal'
import { useAuth } from '@/contexts/AuthContext'
import { RecentlyViewed } from '@/components/RecentlyViewed'
import { ProductRecommendations } from '@/components/ProductRecommendations'

function ProductsPageContent() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [selectedCakeType, setSelectedCakeType] = useState(searchParams.get('type') || 'all')
  const [selectedOccasion, setSelectedOccasion] = useState(searchParams.get('occasion') || 'all')
  const [selectedSpecialDay, setSelectedSpecialDay] = useState(searchParams.get('special') || 'all')
  const [selectedTheme, setSelectedTheme] = useState(searchParams.get('theme') || 'all')
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedPriceFilter, setSelectedPriceFilter] = useState('all')
  const [showInStockOnly, setShowInStockOnly] = useState(true)
  const [sortBy, setSortBy] = useState('popular')
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [showQuickView, setShowQuickView] = useState(false)

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

    // Filter by theme (if cakes selected)
    if (selectedCategory === 'cakes' && selectedTheme !== 'all') {
      filtered = filtered.filter(p => p.theme === selectedTheme)
    }

    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Filter by availability
    if (showInStockOnly) {
      filtered = filtered.filter(p => p.inStock)
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategory, selectedCakeType, selectedOccasion, selectedSpecialDay, selectedTheme, priceRange, showInStockOnly, sortBy, products])

  const addToCart = (product) => {
    // Check stock
    if (!product.inStock) {
      successToast.outOfStock(product.name)
      return
    }
    
    // Simply add product to cart (delivery date/time will be asked in checkout for cakes)
    const newCart = [...cart, product]
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    successToast.addToCart(product.name)
  }

  const toggleWishlist = async (product) => {
    const exists = wishlist.find(item => item.id === product.id)
    let newWishlist
    
    if (exists) {
      newWishlist = wishlist.filter(item => item.id !== product.id)
      successToast.removeFromWishlist(product.name)
    } else {
      newWishlist = [...wishlist, product]
      successToast.addToWishlist(product.name)
    }
    
    setWishlist(newWishlist)
    
    // Save to localStorage for non-logged-in users
    localStorage.setItem('wishlist', JSON.stringify(newWishlist))
    
    // Save to database for logged-in users
    if (user) {
      try {
        if (exists) {
          await fetch(`/api/wishlist?productId=${product.id}`, { method: 'DELETE' })
        } else {
          await fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: product.id })
          })
        }
      } catch (error) {
        console.error('Error syncing wishlist:', error)
      }
    }
  }

  const handleQuickView = (product) => {
    setQuickViewProduct(product)
    setShowQuickView(true)
  }

  const handleQuickViewAddToCart = (product, quantity) => {
    const newCart = [...cart]
    for (let i = 0; i < quantity; i++) {
      newCart.push(product)
    }
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId)
  }

  const handlePriceFilterSelect = (filter) => {
    setSelectedPriceFilter(filter)
    switch(filter) {
      case 'under500':
        setPriceRange([0, 500])
        break
      case '500-1000':
        setPriceRange([500, 1000])
        break
      case '1000-2000':
        setPriceRange([1000, 2000])
        break
      case 'above2000':
        setPriceRange([2000, 5000])
        break
      default:
        setPriceRange([0, 5000])
    }
  }

  const clearAllFilters = () => {
    setSelectedCategory('all')
    setSelectedCakeType('all')
    setSelectedOccasion('all')
    setSelectedSpecialDay('all')
    setSelectedTheme('all')
    setSearchQuery('')
    setPriceRange([0, 5000])
    setSelectedPriceFilter('all')
    setShowInStockOnly(true)
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
                    onClick={clearAllFilters}
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
                          <SelectItem value="regular cakes">Regular Cakes</SelectItem>
                          <SelectItem value="mini cakes">Mini Cakes</SelectItem>
                          <SelectItem value="photo cakes">Photo Cakes</SelectItem>
                          <SelectItem value="jar cake">Jar Cake</SelectItem>
                          <SelectItem value="pinata cake">Pinata Cake</SelectItem>
                          <SelectItem value="number cake">Number Cake</SelectItem>
                          <SelectItem value="alphabet cake">Alphabet cake</SelectItem>
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
                          <SelectItem value="birthday cake">Birthday Cake</SelectItem>
                          <SelectItem value="anniversary cake">Anniversary Cake</SelectItem>
                          <SelectItem value="engagement & wedding cake">Engagement & Wedding Cake</SelectItem>
                          <SelectItem value="bride to be cake">Bride To Be cake</SelectItem>
                          <SelectItem value="kids birthday cake for girls">Kids Birthday Cake For Girls</SelectItem>
                          <SelectItem value="kids birthday cake for boys">Kids Birthday Cake For Boys</SelectItem>
                          <SelectItem value="husband birthday cake">Husband Birthday Cake</SelectItem>
                          <SelectItem value="wife birthday cake">Wife Birthday cake</SelectItem>
                          <SelectItem value="retirement cake">Retirement Cake</SelectItem>
                          <SelectItem value="farewell cake">Farewell Cake</SelectItem>
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
                          <SelectItem value="mother's day">Mother's Day</SelectItem>
                          <SelectItem value="father's day">Father's Day</SelectItem>
                          <SelectItem value="friendship day">Friendship Day</SelectItem>
                          <SelectItem value="valentine's day">Valentine's Day</SelectItem>
                          <SelectItem value="daughter's day">Daughter's day</SelectItem>
                          <SelectItem value="brother's day">Brother's Day</SelectItem>
                          <SelectItem value="teacher's day">Teacher's Day</SelectItem>
                          <SelectItem value="christmas day">Christmas Day</SelectItem>
                          <SelectItem value="new year">New Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="mb-6">
                      <Label className="mb-2 block font-bold">Theme</Label>
                      <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Themes</SelectItem>
                          <SelectItem value="6 month birthday cake">6 month Birthday Cake</SelectItem>
                          <SelectItem value="6 month anniversary cake">6 Month Anniversary Cake</SelectItem>
                          <SelectItem value="hidden message cake">Hidden Message Cake</SelectItem>
                          <SelectItem value="prank cake">Prank Cake</SelectItem>
                          <SelectItem value="annaprashan (rice feeding ceremony) cake">Annaprashan (Rice feeding ceremony) Cake</SelectItem>
                          <SelectItem value="18th birthday cake">18th Birthday Cake</SelectItem>
                          <SelectItem value="sorry cake">Sorry Cake</SelectItem>
                          <SelectItem value="good luck cake">Good Luck Cake</SelectItem>
                          <SelectItem value="divorce cake">Divorce Cake</SelectItem>
                          <SelectItem value="bachelor party cakes">Bachelor Party Cakes</SelectItem>
                          <SelectItem value="naming ceremony cake">Naming Ceremony Cake</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Price Range Filter */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <Label className="mb-3 block font-bold">Price Range</Label>
                  <div className="space-y-2">
                    <Button
                      variant={selectedPriceFilter === 'under500' ? 'default' : 'outline'}
                      size="sm"
                      className={`w-full justify-start ${selectedPriceFilter === 'under500' ? 'bg-pink-600' : ''}`}
                      onClick={() => handlePriceFilterSelect('under500')}
                    >
                      Under ₹500
                    </Button>
                    <Button
                      variant={selectedPriceFilter === '500-1000' ? 'default' : 'outline'}
                      size="sm"
                      className={`w-full justify-start ${selectedPriceFilter === '500-1000' ? 'bg-pink-600' : ''}`}
                      onClick={() => handlePriceFilterSelect('500-1000')}
                    >
                      ₹500 - ₹1,000
                    </Button>
                    <Button
                      variant={selectedPriceFilter === '1000-2000' ? 'default' : 'outline'}
                      size="sm"
                      className={`w-full justify-start ${selectedPriceFilter === '1000-2000' ? 'bg-pink-600' : ''}`}
                      onClick={() => handlePriceFilterSelect('1000-2000')}
                    >
                      ₹1,000 - ₹2,000
                    </Button>
                    <Button
                      variant={selectedPriceFilter === 'above2000' ? 'default' : 'outline'}
                      size="sm"
                      className={`w-full justify-start ${selectedPriceFilter === 'above2000' ? 'bg-pink-600' : ''}`}
                      onClick={() => handlePriceFilterSelect('above2000')}
                    >
                      Above ₹2,000
                    </Button>
                  </div>
                  <div className="mt-4 text-sm text-gray-600 text-center">
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                  </div>
                </div>

                {/* Availability Filter */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <Label className="font-bold">Availability</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="instock"
                        checked={showInStockOnly}
                        onCheckedChange={setShowInStockOnly}
                      />
                      <Label htmlFor="instock" className="text-sm cursor-pointer">
                        In Stock Only
                      </Label>
                    </div>
                  </div>
                </div>
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
                    <div className="relative">
                      <Link href={`/products/${product.id}`}>
                        <div className="relative h-64 overflow-hidden bg-gray-100">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            priority={false}
                          />
                          {product.discount && (
                            <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0 z-10">{product.discount}% OFF</Badge>
                          )}
                          {!product.inStock && (
                            <Badge className="absolute top-3 right-3 bg-gray-900 text-white border-0 z-10">Out of Stock</Badge>
                          )}
                        </div>
                      </Link>
                      {/* Quick View Button */}
                      <Button
                        onClick={() => handleQuickView(product)}
                        size="sm"
                        variant="secondary"
                        className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Quick View
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      {/* Category Badges - Clickable for Quick Filtering */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {/* Main Category Badge */}
                        <Badge
                          onClick={(e) => {
                            e.preventDefault()
                            setSelectedCategory(product.category)
                            setSelectedCakeType('all')
                            setSelectedOccasion('all')
                            setSelectedSpecialDay('all')
                          }}
                          className="cursor-pointer bg-pink-100 text-pink-700 hover:bg-pink-200 text-xs"
                        >
                          {product.category}
                        </Badge>

                        {/* Cake-specific badges */}
                        {product.category === 'cakes' && (
                          <>
                            {product.cakeType && (
                              <Badge
                                onClick={(e) => {
                                  e.preventDefault()
                                  setSelectedCategory('cakes')
                                  setSelectedCakeType(product.cakeType)
                                }}
                                className="cursor-pointer bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs"
                              >
                                {product.cakeType}
                              </Badge>
                            )}
                            {product.occasion && (
                              <Badge
                                onClick={(e) => {
                                  e.preventDefault()
                                  setSelectedCategory('cakes')
                                  setSelectedOccasion(product.occasion)
                                }}
                                className="cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs"
                              >
                                {product.occasion}
                              </Badge>
                            )}
                            {product.specialDay && (
                              <Badge
                                onClick={(e) => {
                                  e.preventDefault()
                                  setSelectedCategory('cakes')
                                  setSelectedSpecialDay(product.specialDay)
                                }}
                                className="cursor-pointer bg-amber-100 text-amber-700 hover:bg-amber-200 text-xs"
                              >
                                {product.specialDay}
                              </Badge>
                            )}
                          </>
                        )}

                        {/* Cookie-specific badge */}
                        {product.category === 'cookies' && product.cookieType && (
                          <Badge
                            className="bg-orange-100 text-orange-700 text-xs"
                          >
                            {product.cookieType}
                          </Badge>
                        )}

                        {/* Namkeen-specific badge */}
                        {product.category === 'namkeen' && product.namkeenType && (
                          <Badge
                            className="bg-yellow-100 text-yellow-700 text-xs"
                          >
                            {product.namkeenType}
                          </Badge>
                        )}

                        {/* Gift-specific badge */}
                        {product.category === 'gifts' && product.giftType && (
                          <Badge
                            className="bg-green-100 text-green-700 text-xs"
                          >
                            {product.giftType}
                          </Badge>
                        )}
                      </div>

                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-pink-900 mb-3 hover:text-pink-600 transition line-clamp-2">{product.name}</h3>
                      </Link>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-xl font-bold text-pink-900">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
                          )}
                          {product.size && (
                            <span className="text-sm text-gray-600 ml-2">• {product.size}</span>
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
                        {/* Check if product is already in cart */}
                        {cart.filter(item => item.id === product.id).length > 0 ? (
                          <div className="flex-1 flex items-center gap-2 bg-pink-50 border-2 border-pink-600 rounded-md px-3 py-2">
                            <Button
                              onClick={(e) => {
                                e.preventDefault()
                                const existingCount = cart.filter(item => item.id === product.id).length
                                if (existingCount > 1) {
                                  const updatedCart = [...cart]
                                  const indexToRemove = updatedCart.findIndex(item => item.id === product.id)
                                  updatedCart.splice(indexToRemove, 1)
                                  setCart(updatedCart)
                                  localStorage.setItem('cart', JSON.stringify(updatedCart))
                                } else {
                                  const updatedCart = cart.filter(item => item.id !== product.id)
                                  setCart(updatedCart)
                                  localStorage.setItem('cart', JSON.stringify(updatedCart))
                                }
                              }}
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-pink-600 hover:bg-pink-100"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="font-bold text-pink-900 min-w-[20px] text-center">
                              {cart.filter(item => item.id === product.id).length}
                            </span>
                            <Button
                              onClick={(e) => {
                                e.preventDefault()
                                addToCart(product)
                              }}
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-pink-600 hover:bg-pink-100"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={(e) => {
                              e.preventDefault()
                              addToCart(product)
                            }}
                            disabled={!product.inStock}
                            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        )}
                        <Button
                          onClick={(e) => {
                            e.preventDefault()
                            toggleWishlist(product)
                          }}
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

      {/* Product Recommendations */}
      <ProductRecommendations limit={6} />

      {/* Recently Viewed */}
      <div className="container mx-auto px-4 py-12">
        <RecentlyViewed currentProductId={null} />
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
        onAddToCart={handleQuickViewAddToCart}
        onToggleWishlist={toggleWishlist}
        isInWishlist={quickViewProduct ? isInWishlist(quickViewProduct.id) : false}
      />

      {/* Delivery Time Picker Dialog */}
      {/* Quick View Dialog removed - delivery picker removed */}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div></div>}>
      <ProductsPageContent />
    </Suspense>
  )
}
