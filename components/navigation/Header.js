'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ShoppingCart, Heart, Menu, X, ChevronDown, User, 
  MapPin, Search, Phone, MessageCircle 
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export function Header({ cart = [], wishlist = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showCakesMenu, setShowCakesMenu] = useState(false)
  const [deliveryLocation, setDeliveryLocation] = useState('263139')
  const { user } = useAuth()

  const cakesByType = [
    'Regular Cakes', 'Mini Cakes', 'Photo Cakes', 'Jar Cake',
    'Pinata Cake', 'Number Cake', 'Alphabet cake'
  ]

  const cakesByOccasion = [
    'Birthday Cake', 'Anniversary Cake', 'Engagement & Wedding Cake',
    'Bride To Be cake', 'Kids Birthday Cake For Girls', 'Kids Birthday Cake For Boys',
    'Husband Birthday Cake', 'Wife Birthday cake', 'Retirement Cake', 'Farewell Cake'
  ]

  const cakesBySpecialDays = [
    "Mother's Day", "Father's Day", 'Friendship Day', "Valentine's Day",
    "Daughter's day", "Brother's Day", "Teacher's Day", 'Christmas Day', 'New Year'
  ]

  const cakesByTheme = [
    '6 month Birthday Cake', '6 Month Anniversary Cake', 'Hidden Message Cake',
    'Prank Cake', 'Annaprashan (Rice feeding ceremony) Cake', '18th Birthday Cake',
    'Sorry Cake', 'Good Luck Cake', 'Divorce Cake', 'Bachelor Party Cakes', 'Naming Ceremony Cake'
  ]

  const whatsappNumber = '+918447655399'
  const whatsappMessage = 'Hi, I want to order from Mr. COCO Bakery'

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Row: Logo, Search, Location, Icons */}
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 relative">
                <Image
                  src="/images/mrcoco-logo.png"
                  alt="Mr. COCO Bakery"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search 5000+ flowers, cakes, gifts etc"
                className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* PIN Code Delivery Checker */}
          <div className="hidden lg:flex flex-col">
            <div className="bg-purple-800 text-white px-4 py-1 rounded-t-lg text-xs font-semibold">
              Check cake delivery availability
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-b-lg border border-gray-200 px-3 py-2">
              <Input
                type="text"
                placeholder="Enter PIN Code"
                maxLength="6"
                className="w-32 h-8 text-sm"
              />
              <Button size="sm" className="bg-pink-600 hover:bg-pink-700 h-8 px-4">
                Check
              </Button>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              <div>🎂 Cake delivery: Haldwani (263139) only</div>
              <div>🍪 Cookies, Namkeen & Gifts: All India</div>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* User */}
            {user ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <User className="w-5 h-5 text-gray-700" />
                </Button>
              </Link>
            ) : (
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5 text-gray-700" />
                </Button>
              </Link>
            )}

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                <Heart className="w-5 h-5 text-gray-700" />
                {wishlist.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {wishlist.length}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-pink-600 text-white text-xs">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Navigation Row */}
        <div className="hidden lg:flex items-center justify-between py-3 border-t border-gray-100">
          {/* Main Navigation */}
          <nav className="flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition">
              Home
            </Link>

            {/* Cakes Mega Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setShowCakesMenu(true)}
              onMouseLeave={() => setShowCakesMenu(false)}
            >
              <button className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition flex items-center gap-1">
                Cakes
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Mega Menu Dropdown */}
              {showCakesMenu && (
                <div className="absolute top-full left-0 mt-2 w-[1000px] max-w-[90vw] bg-white rounded-xl shadow-2xl border-2 border-pink-200 p-6 z-50">
                  <div className="grid grid-cols-4 gap-6">
                    {/* Column 1 */}
                    <div>
                      <h3 className="font-bold text-pink-900 mb-3 text-sm border-b border-pink-200 pb-2">Cake By Type</h3>
                      <ul className="space-y-1">
                        {cakesByType.map((cake) => (
                          <li key={cake}>
                            <Link 
                              href={`/products?category=cakes&type=${encodeURIComponent(cake.toLowerCase())}`}
                              className="text-gray-700 hover:text-pink-600 transition text-xs block py-1"
                            >
                              {cake}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 2 */}
                    <div>
                      <h3 className="font-bold text-pink-900 mb-3 text-sm border-b border-pink-200 pb-2">Cake By Occasion</h3>
                      <ul className="space-y-1">
                        {cakesByOccasion.map((occasion) => (
                          <li key={occasion}>
                            <Link 
                              href={`/products?category=cakes&occasion=${encodeURIComponent(occasion.toLowerCase())}`}
                              className="text-gray-700 hover:text-pink-600 transition text-xs block py-1"
                            >
                              {occasion}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 3 */}
                    <div>
                      <h3 className="font-bold text-pink-900 mb-3 text-sm border-b border-pink-200 pb-2">Cake By Special Days</h3>
                      <ul className="space-y-1">
                        {cakesBySpecialDays.map((day) => (
                          <li key={day}>
                            <Link 
                              href={`/products?category=cakes&special=${encodeURIComponent(day.toLowerCase())}`}
                              className="text-gray-700 hover:text-pink-600 transition text-xs block py-1"
                            >
                              {day}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 4 */}
                    <div>
                      <h3 className="font-bold text-pink-900 mb-3 text-sm border-b border-pink-200 pb-2">Cake By Theme</h3>
                      <ul className="space-y-1">
                        {cakesByTheme.map((theme) => (
                          <li key={theme}>
                            <Link 
                              href={`/products?category=cakes&theme=${encodeURIComponent(theme.toLowerCase())}`}
                              className="text-gray-700 hover:text-pink-600 transition text-xs block py-1"
                            >
                              {theme}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/products?category=cookies" className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition">
              Cookies
            </Link>
            <Link href="/products?category=namkeen" className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition">
              Namkeen
            </Link>
            <Link href="/products?category=gifts" className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition">
              Gift Packs
            </Link>
            <Link href="/decoration-services" className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition">
              Decoration Services
            </Link>
            <Link href="/baking-course" className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition">
              Baking Course
            </Link>
            <Link href="/become-partner" className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition">
              Become Our Partner
            </Link>
          </nav>

          {/* Help & WhatsApp */}
          <div className="flex items-center gap-4">
            <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-pink-600 transition">
              Help
            </Link>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition font-medium text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Order On WhatsApp
            </a>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-200">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-700 font-medium hover:text-pink-600 transition" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              
              {/* Mobile Cakes Accordion */}
              <div>
                <button 
                  onClick={() => setShowCakesMenu(!showCakesMenu)}
                  className="text-gray-700 font-medium hover:text-pink-600 transition flex items-center justify-between w-full"
                >
                  Cakes
                  <ChevronDown className={`w-4 h-4 transition-transform ${showCakesMenu ? 'rotate-180' : ''}`} />
                </button>
                {showCakesMenu && (
                  <div className="mt-2 ml-4 space-y-2 pb-2 max-h-60 overflow-y-auto">
                    <Link href="/products?category=cakes" className="block text-sm font-semibold text-pink-800" onClick={() => setIsMenuOpen(false)}>
                      View All Cakes →
                    </Link>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-pink-700 mb-1">By Type</p>
                      {cakesByType.slice(0, 3).map((cake) => (
                        <Link 
                          key={cake} 
                          href={`/products?category=cakes&type=${encodeURIComponent(cake.toLowerCase())}`} 
                          className="block text-xs text-gray-600 hover:text-pink-600 pl-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {cake}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/products?category=cookies" className="text-gray-700 font-medium hover:text-pink-600 transition" onClick={() => setIsMenuOpen(false)}>
                Cookies
              </Link>
              <Link href="/products?category=namkeen" className="text-gray-700 font-medium hover:text-pink-600 transition" onClick={() => setIsMenuOpen(false)}>
                Namkeen
              </Link>
              <Link href="/products?category=gifts" className="text-gray-700 font-medium hover:text-pink-600 transition" onClick={() => setIsMenuOpen(false)}>
                Gift Packs
              </Link>
              <Link href="/decoration-services" className="text-gray-700 font-medium hover:text-pink-600 transition" onClick={() => setIsMenuOpen(false)}>
                Decoration Services
              </Link>
              <Link href="/baking-course" className="text-gray-700 font-medium hover:text-pink-600 transition" onClick={() => setIsMenuOpen(false)}>
                Baking Course
              </Link>
              <Link href="/become-partner" className="text-gray-700 font-medium hover:text-pink-600 transition" onClick={() => setIsMenuOpen(false)}>
                Become Our Partner
              </Link>
              
              <div className="pt-3 border-t border-gray-200">
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition font-medium w-full"
                >
                  <MessageCircle className="w-5 h-5" />
                  Order On WhatsApp
                </a>
              </div>

              {!user && (
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
