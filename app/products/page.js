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

  // Enhanced mock products with subcategories
  const mockProducts = [
    // Cakes - Eggless
    { id: 1, name: 'Chocolate Truffle Eggless Cake', price: 899, originalPrice: 1099, category: 'cakes', cakeType: 'eggless', occasion: 'birthday', specialDay: '', size: '1kg', flavour: 'Chocolate', image: 'https://images.pexels.com/photos/35583855/pexels-photo-35583855.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', rating: 4.8, reviews: 245, discount: 18, inStock: true },
    { id: 2, name: 'Red Velvet Eggless Cake', price: 799, originalPrice: 999, category: 'cakes', cakeType: 'eggless', occasion: 'anniversary', specialDay: '', size: '500g', flavour: 'Red Velvet', image: 'https://images.unsplash.com/photo-1780586377241-41b03171419b', rating: 4.9, reviews: 312, discount: 20, inStock: true },
    
    // Cakes - Designer
    { id: 3, name: 'White & Gold Designer Cake', price: 1299, originalPrice: 1599, category: 'cakes', cakeType: 'designer', occasion: 'wedding', specialDay: '', size: '2kg', flavour: 'Vanilla', image: 'https://images.unsplash.com/photo-1633062781822-e32867fe7d4a', rating: 5.0, reviews: 156, discount: 19, inStock: true },
    { id: 4, name: 'Floral Designer Cake', price: 1499, originalPrice: 1799, category: 'cakes', cakeType: 'designer', occasion: 'engagement', specialDay: '', size: '1.5kg', flavour: 'Strawberry', image: 'https://images.pexels.com/photos/35583855/pexels-photo-35583855.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', rating: 4.9, reviews: 178, discount: 17, inStock: true },
    
    // Cakes - Photo
    { id: 5, name: 'Personalized Photo Cake', price: 999, originalPrice: 1199, category: 'cakes', cakeType: 'photo', occasion: 'birthday', specialDay: '', size: '1kg', flavour: 'Vanilla', image: 'https://images.unsplash.com/photo-1780586377241-41b03171419b', rating: 4.8, reviews: 267, discount: 17, inStock: true },
    
    // Cakes - Chocolate
    { id: 6, name: 'Black Forest Cake', price: 749, originalPrice: 899, category: 'cakes', cakeType: 'chocolate', occasion: 'birthday', specialDay: '', size: '1kg', flavour: 'Chocolate', image: 'https://images.pexels.com/photos/35583855/pexels-photo-35583855.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', rating: 4.6, reviews: 198, discount: 17, inStock: true },
    { id: 7, name: 'Death By Chocolate Cake', price: 999, originalPrice: 1199, category: 'cakes', cakeType: 'chocolate', occasion: 'birthday', specialDay: '', size: '1kg', flavour: 'Rich Chocolate', image: 'https://images.unsplash.com/photo-1633062781822-e32867fe7d4a', rating: 4.9, reviews: 289, discount: 17, inStock: true },
    
    // Cakes - Special Days
    { id: 8, name: "Mother's Day Special Cake", price: 1099, originalPrice: 1299, category: 'cakes', cakeType: 'premium', occasion: '', specialDay: 'mothers day', image: 'https://images.pexels.com/photos/35583855/pexels-photo-35583855.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', rating: 5.0, reviews: 145, discount: 15, inStock: true },
    { id: 9, name: 'Valentine Heart Cake', price: 899, originalPrice: 1099, category: 'cakes', cakeType: 'designer', occasion: '', specialDay: 'valentine', image: 'https://images.unsplash.com/photo-1780586377241-41b03171419b', rating: 4.8, reviews: 321, discount: 18, inStock: true },
    { id: 10, name: 'Diwali Special Cake', price: 1199, originalPrice: 1499, category: 'cakes', cakeType: 'premium', occasion: '', specialDay: 'diwali', image: 'https://images.unsplash.com/photo-1633062781822-e32867fe7d4a', rating: 4.9, reviews: 234, discount: 20, inStock: true },
    
    // Cakes - Bento & Mini
    { id: 11, name: 'Bento Cake Collection', price: 399, originalPrice: 499, category: 'cakes', cakeType: 'bento', occasion: 'birthday', specialDay: '', image: 'https://images.pexels.com/photos/35583855/pexels-photo-35583855.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', rating: 4.9, reviews: 298, discount: 20, inStock: true },
    { id: 12, name: 'Mini Cake Set of 6', price: 599, originalPrice: 749, category: 'cakes', cakeType: 'mini', occasion: '', specialDay: '', image: 'https://images.unsplash.com/photo-1780586377241-41b03171419b', rating: 4.7, reviews: 187, discount: 20, inStock: true },
    
    // Cookies
    { id: 13, name: 'Premium Butter Cookies', price: 399, originalPrice: 499, category: 'cookies', cookieType: 'premium', image: 'https://images.pexels.com/photos/27304325/pexels-photo-27304325.jpeg', rating: 4.7, reviews: 189, discount: 20, inStock: true },
    { id: 14, name: 'Healthy Oat Cookies', price: 299, originalPrice: 399, category: 'cookies', cookieType: 'healthy', image: 'https://images.pexels.com/photos/27304325/pexels-photo-27304325.jpeg', rating: 4.4, reviews: 87, discount: 25, inStock: true },
    { id: 15, name: 'Tea Time Cookie Mix', price: 349, originalPrice: 449, category: 'cookies', cookieType: 'tea', image: 'https://images.pexels.com/photos/27304325/pexels-photo-27304325.jpeg', rating: 4.6, reviews: 142, discount: 22, inStock: true },
    
    // Namkeen
    { id: 16, name: 'Traditional Namkeen Mix', price: 249, originalPrice: 299, category: 'namkeen', namkeenType: 'traditional', image: 'https://images.pexels.com/photos/27304325/pexels-photo-27304325.jpeg', rating: 4.7, reviews: 203, discount: 17, inStock: true },
    { id: 17, name: 'Baked Snacks Combo', price: 299, originalPrice: 399, category: 'namkeen', namkeenType: 'baked', image: 'https://images.pexels.com/photos/27304325/pexels-photo-27304325.jpeg', rating: 4.5, reviews: 156, discount: 25, inStock: true },
    
    // Gifts
    { id: 18, name: 'Premium Gift Hamper', price: 1499, originalPrice: 1899, category: 'gifts', giftType: 'festival hamper', image: 'https://images.unsplash.com/photo-1633062781822-e32867fe7d4a', rating: 4.9, reviews: 176, discount: 21, inStock: true },
    { id: 19, name: 'Corporate Gift Box', price: 999, originalPrice: 1199, category: 'gifts', giftType: 'corporate', image: 'https://images.unsplash.com/photo-1633062781822-e32867fe7d4a', rating: 4.8, reviews: 134, discount: 17, inStock: true },
    { id: 20, name: 'Wedding Gift Pack', price: 1799, originalPrice: 2199, category: 'gifts', giftType: 'wedding', image: 'https://images.unsplash.com/photo-1633062781822-e32867fe7d4a', rating: 5.0, reviews: 98, discount: 18, inStock: true },
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
