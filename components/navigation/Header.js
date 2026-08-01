'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart, Menu, X, ChevronDown, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { SearchAutocomplete } from '@/components/SearchAutocomplete'

export function Header({ cart = [], wishlist = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showCakesMenu, setShowCakesMenu] = useState(false)
  const { user } = useAuth()

  const cakesByType = [
    'Regular Cakes',
    'Mini Cakes',
    'Photo Cakes',
    'Jar Cake',
    'Pinata Cake',
    'Number Cake',
    'Alphabet cake'
  ]

  const cakesByOccasion = [
    'Birthday Cake',
    'Anniversary Cake',
    'Engagement & Wedding Cake',
    'Bride To Be cake',
    'Kids Birthday Cake For Girls',
    'Kids Birthday Cake For Boys',
    'Husband Birthday Cake',
    'Wife Birthday cake',
    'Retirement Cake',
    'Farewell Cake'
  ]

  const cakesBySpecialDays = [
    "Mother's Day",
    "Father's Day",
    'Friendship Day',
    "Valentine's Day",
    "Daughter's day",
    "Brother's Day",
    "Teacher's Day",
    'Christmas Day',
    'New Year'
  ]

  const cakesByTheme = [
    '6 month Birthday Cake',
    '6 Month Anniversary Cake',
    'Hidden Message Cake',
    'Prank Cake',
    'Annaprashan (Rice feeding ceremony) Cake',
    '18th Birthday Cake',
    'Sorry Cake',
    'Good Luck Cake',
    'Divorce Cake',
    'Bachelor Party Cakes',
    'Naming Ceremony Cake'
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <img src="/images/mrcoco-logo.png" alt="Mr. COCO Bakery" className="h-16 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-pink-900 font-medium hover:text-pink-600 transition">
              Home
            </Link>
            
            {/* Cakes Mega Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setShowCakesMenu(true)}
              onMouseLeave={() => setShowCakesMenu(false)}
            >
              <button className="text-pink-900 font-medium hover:text-pink-600 transition flex items-center gap-1">
                Cakes
                <ChevronDown className={`w-4 h-4 transition-transform ${showCakesMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Mega Menu Dropdown */}
              {showCakesMenu && (
                <div className="absolute top-full left-0 mt-2 w-[1000px] max-w-[90vw] bg-white rounded-xl shadow-2xl border-2 border-pink-200 p-6 z-50">
                  <div className="grid grid-cols-4 gap-6">
                    {/* Cake By Type */}
                    <div>
                      <h3 className="font-bold text-pink-900 mb-3 text-lg border-b border-pink-200 pb-2">Cake By Type</h3>
                      <ul className="space-y-2">
                        {cakesByType.map((cake) => (
                          <li key={cake}>
                            <Link 
                              href={`/products?category=cakes&type=${encodeURIComponent(cake.toLowerCase())}`}
                              className="text-gray-700 hover:text-pink-600 transition text-sm block py-1"
                            >
                              {cake}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cake By Occasion */}
                    <div>
                      <h3 className="font-bold text-pink-900 mb-3 text-lg border-b border-pink-200 pb-2">Cake By Occasion</h3>
                      <ul className="space-y-2">
                        {cakesByOccasion.map((occasion) => (
                          <li key={occasion}>
                            <Link 
                              href={`/products?category=cakes&occasion=${encodeURIComponent(occasion.toLowerCase())}`}
                              className="text-gray-700 hover:text-pink-600 transition text-sm block py-1"
                            >
                              {occasion}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cake By Special Days */}
                    <div>
                      <h3 className="font-bold text-pink-900 mb-3 text-lg border-b border-pink-200 pb-2">Cake By Special Days</h3>
                      <ul className="space-y-2">
                        {cakesBySpecialDays.map((day) => (
                          <li key={day}>
                            <Link 
                              href={`/products?category=cakes&special=${encodeURIComponent(day.toLowerCase())}`}
                              className="text-gray-700 hover:text-pink-600 transition text-sm block py-1"
                            >
                              {day}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cake By Theme */}
                    <div>
                      <h3 className="font-bold text-pink-900 mb-3 text-lg border-b border-pink-200 pb-2">Cake By Theme</h3>
                      <ul className="space-y-2">
                        {cakesByTheme.map((theme) => (
                          <li key={theme}>
                            <Link 
                              href={`/products?category=cakes&theme=${encodeURIComponent(theme.toLowerCase())}`}
                              className="text-gray-700 hover:text-pink-600 transition text-sm block py-1"
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

            <Link href="/products?category=cookies" className="text-pink-900 font-medium hover:text-pink-600 transition">
              Cookies
            </Link>
            <Link href="/products?category=namkeen" className="text-pink-900 font-medium hover:text-pink-600 transition">
              Namkeen
            </Link>
            <Link href="/products?category=gifts" className="text-pink-900 font-medium hover:text-pink-600 transition">
              Gift Packs
            </Link>
            <Link href="/bulk-order" className="text-pink-900 font-medium hover:text-pink-600 transition">
              Bulk Orders
            </Link>
            <Link href="/about" className="text-pink-900 font-medium hover:text-pink-600 transition">
              About Us
            </Link>
            <Link href="/contact" className="text-pink-900 font-medium hover:text-pink-600 transition">
              Contact Us
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Autocomplete - Desktop */}
            <div className="hidden lg:block">
              <SearchAutocomplete />
            </div>
            
            {user ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="relative">
                  <User className="w-5 h-5 text-pink-900" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="hidden sm:flex border-pink-600 text-pink-600 hover:bg-pink-50">
                  Login
                </Button>
              </Link>
            )}

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
              
              {/* Mobile Cakes Accordion */}
              <div>
                <button 
                  onClick={() => setShowCakesMenu(!showCakesMenu)}
                  className="text-pink-900 font-medium hover:text-pink-600 transition flex items-center justify-between w-full"
                >
                  Cakes
                  <ChevronDown className={`w-4 h-4 transition-transform ${showCakesMenu ? 'rotate-180' : ''}`} />
                </button>
                {showCakesMenu && (
                  <div className="mt-2 ml-4 space-y-3 pb-3">
                    <div>
                      <p className="font-semibold text-sm text-pink-800 mb-2">By Type</p>
                      <div className="space-y-1">
                        {cakesByType.slice(0, 5).map((cake) => (
                          <Link key={cake} href={`/products?category=cakes&type=${encodeURIComponent(cake.toLowerCase().replace(' cakes', ''))}`} className="block text-sm text-gray-700">
                            {cake}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-pink-800 mb-2">By Occasion</p>
                      <div className="space-y-1">
                        {cakesByOccasion.slice(0, 5).map((occasion) => (
                          <Link key={occasion} href={`/products?category=cakes&occasion=${encodeURIComponent(occasion.toLowerCase())}`} className="block text-sm text-gray-700">
                            {occasion}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/products?category=cookies" className="text-pink-900 font-medium hover:text-pink-600 transition">Cookies</Link>
              <Link href="/products?category=namkeen" className="text-pink-900 font-medium hover:text-pink-600 transition">Namkeen</Link>
              <Link href="/products?category=gifts" className="text-pink-900 font-medium hover:text-pink-600 transition">Gift Packs</Link>
              <Link href="/bulk-order" className="text-pink-900 font-medium hover:text-pink-600 transition">Bulk Orders</Link>
              <Link href="/about" className="text-pink-900 font-medium hover:text-pink-600 transition">About Us</Link>
              <Link href="/contact" className="text-pink-900 font-medium hover:text-pink-600 transition">Contact Us</Link>
              
              {!user && (
                <Link href="/login">
                  <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">Login</Button>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
