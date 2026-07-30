'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Heart, Search, Menu, X, Star, Phone, Mail, MapPin, Instagram, Facebook, Twitter, ChevronRight, Award, Clock, Shield, Cake, Cookie, Gift } from 'lucide-react'
import { toast } from 'sonner'

export default function Home() {
  const [pinCode, setPinCode] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
  }, [])

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
    { name: 'Gift Packs', icon: Gift, image: 'https://images.unsplash.com/photo-1633062781822-e32867fe7d4a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHw0fHxwcmVtaXVtJTIwY2FrZXN8ZW58MHx8fHwxNzg0NTQ1OTUyfDA&ixlib=rb-4.1.0&q=85', count: '20+' }
  ]

  const bestSellers = [
    { id: 1, name: 'Chocolate Truffle Cake', price: 899, originalPrice: 1099, image: 'https://images.pexels.com/photos/35583855/pexels-photo-35583855.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', rating: 4.8, reviews: 245, discount: 18 },
    { id: 2, name: 'Red Velvet Cake', price: 799, originalPrice: 999, image: 'https://images.unsplash.com/photo-1780586377241-41b03171419b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwzfHxwcmVtaXVtJTIwY2FrZXN8ZW58MHx8fHwxNzg0NTQ1OTUyfDA&ixlib=rb-4.1.0&q=85', rating: 4.9, reviews: 312, discount: 20 },
    { id: 3, name: 'Premium Butter Cookies', price: 399, originalPrice: 499, image: 'https://images.pexels.com/photos/27304325/pexels-photo-27304325.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', rating: 4.7, reviews: 189, discount: 20 },
    { id: 4, name: 'White & Gold Cake', price: 1299, originalPrice: 1599, image: 'https://images.unsplash.com/photo-1633062781822-e32867fe7d4a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHw0fHxwcmVtaXVtJTIwY2FrZXN8ZW58MHx8fHwxNzg0NTQ1OTUyfDA&ixlib=rb-4.1.0&q=85', rating: 5.0, reviews: 156, discount: 19 }
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
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <img src="/images/mrcoco-logo.png" alt="Mr. COCO Bakery" className="h-16 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-pink-900 font-medium hover:text-pink-600 transition">Home</Link>
              <Link href="/products?category=cakes" className="text-pink-900 font-medium hover:text-pink-600 transition">Cakes</Link>
              <Link href="/products?category=cookies" className="text-pink-900 font-medium hover:text-pink-600 transition">Cookies</Link>
              <Link href="/products?category=namkeen" className="text-pink-900 font-medium hover:text-pink-600 transition">Namkeen</Link>
              <Link href="/products?category=gifts" className="text-pink-900 font-medium hover:text-pink-600 transition">Gift Packs</Link>
              <Link href="/bulk-order" className="text-pink-900 font-medium hover:text-pink-600 transition">Bulk Orders</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                <Search className="w-5 h-5 text-pink-900" />
              </Button>
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
              <Button onClick={() => setIsMenuOpen(!isMenuOpen)} variant="ghost" size="icon" className="lg:hidden">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="lg:hidden py-4 border-t border-pink-200">
              <div className="flex flex-col space-y-3">
                <Link href="/" className="text-pink-900 font-medium hover:text-pink-600 transition">Home</Link>
                <Link href="/products?category=cakes" className="text-pink-900 font-medium hover:text-pink-600 transition">Cakes</Link>
                <Link href="/products?category=cookies" className="text-pink-900 font-medium hover:text-pink-600 transition">Cookies</Link>
                <Link href="/products?category=namkeen" className="text-pink-900 font-medium hover:text-pink-600 transition">Namkeen</Link>
                <Link href="/products?category=gifts" className="text-pink-900 font-medium hover:text-pink-600 transition">Gift Packs</Link>
                <Link href="/bulk-order" className="text-pink-900 font-medium hover:text-pink-600 transition">Bulk Orders</Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-pink-900 via-pink-800 to-pink-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.pexels.com/photos/27304325/pexels-photo-27304325.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="Bakery" className="w-full h-full object-cover" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <Badge className="mb-4 bg-pink-600 hover:bg-pink-700 text-white border-0">Premium Bakery</Badge>
            <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 leading-tight">Keep It Simple,<br />Keep It Tasty</h1>
            <p className="text-xl mb-8 text-pink-100">Indulge in premium cakes, cookies, and pastries crafted with love and the finest ingredients.</p>
            
            {/* PIN Code Check */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 max-w-md">
              <p className="text-sm mb-3 text-pink-100">Check cake delivery availability</p>
              <div className="flex gap-2 mb-3">
                <Input 
                  placeholder="Enter PIN Code" 
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  maxLength={6}
                  className="bg-white text-gray-900 border-0"
                />
                <Button onClick={checkPinCode} className="bg-pink-600 hover:bg-pink-700 text-white">
                  Check
                </Button>
              </div>
              <p className="text-xs text-pink-200">
                🎂 Cake delivery: Haldwani (263139) only<br />
                📦 Cookies, Namkeen & Gifts: All India delivery
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-white text-pink-900 hover:bg-pink-50 shadow-lg">
                  Shop Now <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/products?category=cakes">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-pink-900">
                  Browse Cakes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-serif text-pink-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Explore our premium selection of freshly baked delights</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCategories.map((category, index) => (
              <Link key={index} href={`/products?category=${category.name.toLowerCase()}`}>
                <Card className="group cursor-pointer overflow-hidden border-2 border-pink-100 hover:border-pink-400 transition-all duration-300 hover:shadow-2xl">
                  <div className="relative h-64 overflow-hidden">
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
              <h2 className="text-4xl font-bold font-serif text-pink-900 mb-6">Crafting Happiness Since 2015</h2>
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
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-pink-600 via-pink-700 to-pink-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold font-serif text-white mb-4">Join Our Sweet Community</h2>
          <p className="text-pink-100 mb-8 max-w-2xl mx-auto">Subscribe to get exclusive offers, new product launches, and delicious recipes</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Enter your email" className="bg-white border-0" />
            <Button className="bg-white text-pink-900 hover:bg-pink-50 whitespace-nowrap">
              Subscribe Now
            </Button>
          </div>
        </div>
      </section>

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
                <li><Link href="/bulk-order" className="hover:text-pink-400 transition">Bulk Orders</Link></li>
                <li><Link href="/about" className="hover:text-pink-400 transition">About Us</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-bold text-white mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact" className="hover:text-pink-400 transition">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-pink-400 transition">FAQ</Link></li>
                <li><Link href="/shipping" className="hover:text-pink-400 transition">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-pink-400 transition">Returns</Link></li>
                <li><Link href="/privacy" className="hover:text-pink-400 transition">Privacy Policy</Link></li>
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
