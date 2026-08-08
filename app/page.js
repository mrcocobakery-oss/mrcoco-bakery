'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Star, Phone, Mail, MapPin, Instagram, Facebook, Twitter, ChevronRight, Award, Clock, Shield, ShoppingCart, Cake, Cookie, Gift, Heart, ChevronLeft, Sparkles } from 'lucide-react'
import { RecentlyViewed } from '@/components/RecentlyViewed'
import { ProductRecommendations } from '@/components/ProductRecommendations'
import { toast } from 'sonner'
import { Header } from '@/components/navigation/Header'

export default function Home() {
  const [pinCode, setPinCode] = useState('')
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [sliders, setSliders] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [decorationGallery, setDecorationGallery] = useState([])
  const [bestSellers, setBestSellers] = useState([])

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
    
    // Fetch homepage sliders
    fetchSliders()
    // Fetch decoration gallery
    fetchDecorationGallery()
    // Fetch best sellers
    fetchBestSellers()
  }, [])

  // Auto-play slider every 5 seconds
  useEffect(() => {
    if (sliders.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliders.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [sliders])

  const fetchSliders = async () => {
    try {
      const response = await fetch('/api/admin/homepage-slider')
      const data = await response.json()
      if (data.success && data.sliders.length > 0) {
        setSliders(data.sliders)
      }
    } catch (error) {
      console.error('Error fetching sliders:', error)
    }
  }

  const fetchDecorationGallery = async () => {
    try {
      const response = await fetch('/api/admin/decoration-gallery')
      const data = await response.json()
      // API returns { gallery: [...] }, not { success, gallery }
      if (data.gallery) {
        setDecorationGallery(data.gallery)
      }
    } catch (error) {
      console.error('Error fetching decoration gallery:', error)
    }
  }

  const fetchBestSellers = async () => {
    try {
      const response = await fetch('/api/products?featured=true&limit=4')
      const data = await response.json()
      if (data.success && data.products) {
        // Map products to match the expected format
        const formattedProducts = data.products.map(product => ({
          id: product._id || product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images?.[0] || product.image,
          rating: product.rating || 4.8,
          reviews: product.reviewCount || 0,
          category: product.category,
          size: product.size
        }))
        setBestSellers(formattedProducts)
      }
    } catch (error) {
      console.error('Error fetching best sellers:', error)
    }
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length)
  }

  const checkPinCode = () => {
    if (pinCode.length !== 6) {
      toast.error('Please enter a valid 6-digit PIN code')
      return
    }
    
    // Only allow 263139 for cake delivery (Haldwani area)
    if (pinCode === '263139') {
      toast.success('🎂 Great! Cake delivery available in your area!', {
        description: 'We deliver fresh cakes to Haldwani - 263139',
        duration: 4000
      })
    } else {
      toast.error('Sorry! Cake delivery not available in this area', {
        description: 'Cake delivery is only available in Haldwani (PIN: 263139). However, cookies, namkeen & gift packs can be delivered across India!',
        duration: 5000
      })
    }
  }

  const featuredCategories = [
    { name: 'Cakes', icon: Cake, image: 'https://images.unsplash.com/photo-1780586377241-41b03171419b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwzfHxwcmVtaXVtJTIwY2FrZXN8ZW58MHx8fHwxNzg0NTQ1OTUyfDA&ixlib=rb-4.1.0&q=85', count: '50+' },
    { name: 'Cookies', icon: Cookie, image: 'https://images.pexels.com/photos/35583855/pexels-photo-35583855.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', count: '30+' },
    { name: 'Namkeen', icon: Sparkles, image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500', count: '25+' },
    { name: 'Gift Packs', icon: Gift, image: 'https://images.unsplash.com/photo-1633062781822-e32867fe7d4a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHw0fHxwcmVtaXVtJTIwY2FrZXN8ZW58MHx8fHwxNzg0NTQ1OTUyfDA&ixlib=rb-4.1.0&q=85', count: '20+' }
  ]

  const reviews = [
    { name: 'Priya Sharma', rating: 5, text: 'Absolutely divine! The chocolate truffle cake was a hit at my daughter\'s birthday party.', date: '2 days ago' },
    { name: 'Rajesh Kumar', rating: 5, text: 'Premium quality and taste. Best bakery in town!', date: '1 week ago' },
    { name: 'Anita Desai', rating: 4, text: 'Great variety and fresh products. Delivery was on time.', date: '2 weeks ago' }
  ]

  const whyChooseUs = [
    { icon: Award, title: 'Premium Quality', desc: 'Only the finest ingredients in every bite' },
    { icon: Clock, title: 'Fresh Daily', desc: 'Baked fresh every morning' },
    { icon: Shield, title: '100% Hygienic', desc: 'Certified kitchen & safe packaging' },
    { icon: ShoppingCart, title: 'Easy Ordering', desc: 'Seamless online shopping experience' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      {/* Header */}
      <Header cart={cart} wishlist={wishlist} />

      {/* Hero Image Slider - Mobile Optimized */}
      {sliders.length > 0 ? (
        <section className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden bg-gray-900">
          {/* Slider Images */}
          <div className="relative h-full">
            {sliders.map((slider, index) => (
              <div
                key={slider._id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={slider.imageUrl}
                  alt={slider.altText || `Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            ))}
          </div>

          {/* Navigation Arrows - Hidden on mobile, visible on tablet+ */}
          {sliders.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="hidden md:block absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
              </button>
              <button
                onClick={nextSlide}
                className="hidden md:block absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all z-10"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
              </button>
            </>
          )}

          {/* Dots Indicator - Smaller on mobile */}
          {sliders.length > 1 && (
            <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-10">
              {sliders.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-white w-6 md:w-8'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        // Fallback banner if no sliders
        <section className="relative h-[400px] bg-gradient-to-r from-pink-900 via-pink-800 to-pink-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img src="https://images.pexels.com/photos/27304325/pexels-photo-27304325.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="Bakery" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-5xl md:text-6xl font-bold font-serif mb-4">Mr. COCO Bakery</h1>
              <p className="text-xl text-pink-100">Premium Cakes, Cookies & More</p>
            </div>
          </div>
        </section>
      )}

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-serif text-pink-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Explore our premium selection of freshly baked delights</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCategories.map((category, index) => (
              <Link key={index} href={`/products?category=${category.name.toLowerCase()}`}>
                <Card className="group cursor-pointer overflow-hidden border-2 border-pink-100 hover:border-pink-400 transition-all duration-300 hover:shadow-2xl">
                  <div className="relative h-64 overflow-hidden">
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute top-4 right-4 bg-pink-600 text-white border-0">{category.count} Items</Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold font-serif text-pink-900 mb-1">{category.name}</h3>
                        <p className="text-sm text-gray-600">Fresh & Premium</p>
                      </div>
                      <ChevronRight className="w-6 h-6 text-pink-600 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Decoration Service Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              Premium Service
            </Badge>
            <h2 className="text-4xl font-bold font-serif text-pink-900 mb-4">
              Transform Your Events with Premium Decoration Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From intimate gatherings to grand celebrations, we create magical moments with stunning decorations
            </p>
            <Link href="/decoration-services">
              <Button className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                Explore Decoration Services <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Decoration Gallery Slider */}
          {decorationGallery.length > 0 && (
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {decorationGallery.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex-shrink-0 w-80 snap-start"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl shadow-lg group">
                      <img
                        src={item.imageUrl}
                        alt={item.title || `Decoration ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white font-semibold text-lg">
                            {item.title || 'Decoration Setup'}
                          </h3>
                          {item.description && (
                            <p className="text-white/90 text-sm mt-1">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scroll Hint */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Scroll to explore more
                  <ChevronRight className="w-4 h-4" />
                </p>
              </div>
            </div>
          )}

          {/* Message when no images uploaded yet */}
          {decorationGallery.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white rounded-xl p-8 max-w-md mx-auto border-2 border-dashed border-pink-300">
                <Sparkles className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-pink-900 mb-2">Decoration Gallery Coming Soon!</h3>
                <p className="text-gray-600 mb-4">
                  Upload stunning decoration images from your admin panel to showcase your work here.
                </p>
                <Link href="/admin/decoration-gallery">
                  <Button className="bg-pink-600 hover:bg-pink-700">
                    Go to Admin Panel
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-pink-600 text-white border-0">Trending Now</Badge>
            <h2 className="text-4xl font-bold font-serif text-pink-900 mb-4">Best Sellers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our most loved products by customers</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-2 border-pink-100 hover:border-pink-400 hover:shadow-xl transition-all">
                <Link href={`/products/${product.id}`}>
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    {product.discount && (
                      <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0">{product.discount}% OFF</Badge>
                    )}
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="absolute top-3 right-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-pink-900 mb-2 hover:text-pink-600 transition">{product.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-pink-900">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-white">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/products">
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white">
                View All Products <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-serif text-pink-900 mb-4">Why Choose Mr. COCO?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Premium quality and exceptional service, every time</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="text-center p-6 border-2 border-pink-100 hover:border-pink-400 hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-pink-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-serif text-pink-900 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Loved by thousands of happy customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card key={index} className="p-6 border-2 border-pink-100 hover:shadow-lg transition-all">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-pink-900">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-pink-600 text-white border-0">Our Story</Badge>
              <h2 className="text-4xl font-bold font-serif text-pink-900 mb-6">Crafting Happiness Since 2018</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Mr. COCO Bakery was born from a passion for creating extraordinary baked goods that bring joy to every celebration. We believe in keeping things simple while delivering exceptional taste.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Using only the finest ingredients and traditional baking techniques combined with modern innovation, we craft each product with love and attention to detail. From our family to yours, we&apos;re committed to making your special moments even more memorable.
              </p>
              <Link href="/about">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                  Learn More About Us <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1654703109300-e924e52b091a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYWtlcnl8ZW58MHx8fHwxNzg0NTQ1OTUyfDA&ixlib=rb-4.1.0&q=85" 
                alt="Our Bakery" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Instagram className="w-8 h-8 text-pink-600" />
              <h2 className="text-4xl font-bold font-serif text-pink-900">Follow Us on Instagram</h2>
            </div>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join our sweet community! See our latest creations, customer celebrations, and behind-the-scenes moments
            </p>
            <a 
              href="https://www.instagram.com/mrcocobakery" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-pink-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition"
            >
              <Instagram className="w-5 h-5" />
              @mrcocobakery
            </a>
          </div>
          
          {/* Instagram Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              'https://images.unsplash.com/photo-1780586377241-41b03171419b?w=400',
              'https://images.pexels.com/photos/35583855/pexels-photo-35583855.jpeg?w=400',
              'https://images.unsplash.com/photo-1633062781822-e32867fe7d4a?w=400',
              'https://images.unsplash.com/photo-1654703109300-e924e52b091a?w=400',
              'https://images.pexels.com/photos/27304325/pexels-photo-27304325.jpeg?w=400',
              'https://images.unsplash.com/photo-1780586377241-41b03171419b?w=400'
            ].map((img, idx) => (
              <a
                key={idx}
                href="https://www.instagram.com/mrcocobakery"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
              >
                <img 
                  src={img} 
                  alt={`Instagram post ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 text-sm">
              Tag us <span className="text-pink-600 font-semibold">#MrCOCOBakery</span> to be featured! 🎂✨
            </p>
          </div>
        </div>
      </section>

      {/* Product Recommendations */}
      <ProductRecommendations limit={6} />

      {/* Recently Viewed */}
      <div className="container mx-auto px-4">
        <RecentlyViewed currentProductId={null} />
      </div>

      {/* Footer */}
      <footer className="bg-pink-950 text-pink-100 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <div className="mb-4">
                <img src="/images/mrcoco-logo.png" alt="Mr. COCO Bakery" className="h-20 w-auto" />
              </div>
              <p className="text-sm mb-4">Keep It Simple, Keep It Tasty</p>
              <div className="flex gap-3">
                <Button size="icon" variant="ghost" className="hover:bg-pink-900">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="hover:bg-pink-900">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="hover:bg-pink-900">
                  <Twitter className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products" className="hover:text-pink-400 transition">All Products</Link></li>
                <li><Link href="/products?category=cakes" className="hover:text-pink-400 transition">Cakes</Link></li>
                <li><Link href="/products?category=cookies" className="hover:text-pink-400 transition">Cookies</Link></li>
                <li><Link href="/our-menu" className="hover:text-pink-400 transition">Our Menu</Link></li>
                <li><Link href="/bulk-order" className="hover:text-pink-400 transition">Bulk Orders</Link></li>
                <li><Link href="/about" className="hover:text-pink-400 transition">About Us</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-bold text-white mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact" className="hover:text-pink-400 transition">Contact Us</Link></li>
                <li><Link href="/terms" className="hover:text-pink-400 transition">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="hover:text-pink-400 transition">Privacy Policy</Link></li>
                <li><Link href="/shipping" className="hover:text-pink-400 transition">Shipping & Delivery</Link></li>
                <li><Link href="/returns" className="hover:text-pink-400 transition">Returns</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white mb-4">Get In Touch</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>+918447655399</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>mrcocobakery@gmail.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>Mr. Coco Bakery, Opposite Hotel Blue Saphire Country Side, Rampur Road, Haldwani, Nainital, U.K - 263139</span>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="bg-pink-900 mb-8" />

          <div className="text-center text-sm">
            <p>&copy; 2025 Mr. COCO Bakery. All rights reserved. | Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
