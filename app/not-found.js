'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Home, ShoppingBag, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-pink-200 mb-4">404</div>
          <div className="relative w-64 h-64 mx-auto mb-6">
            <div className="absolute inset-0 bg-pink-100 rounded-full animate-pulse"></div>
            <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center">
              <div className="text-6xl">🧁</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Looks like this page took a bite and disappeared! The sweet treat you're looking for doesn't exist.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link href="/">
            <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50 px-8 py-6 text-lg">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Browse Products
            </Button>
          </Link>
        </div>

        {/* Popular Links */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-pink-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Search className="w-5 h-5 text-pink-600" />
            Looking for something specific?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/products?category=cakes" className="text-pink-600 hover:text-pink-700 font-medium">
              Cakes
            </Link>
            <Link href="/products?category=pastries" className="text-pink-600 hover:text-pink-700 font-medium">
              Pastries
            </Link>
            <Link href="/products?category=cookies" className="text-pink-600 hover:text-pink-700 font-medium">
              Cookies
            </Link>
            <Link href="/products?category=namkeen" className="text-pink-600 hover:text-pink-700 font-medium">
              Namkeen
            </Link>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link href="/contact" className="text-gray-600 hover:text-pink-600 text-sm">
              Need help? Contact us →
            </Link>
          </div>
        </div>

        {/* Fun Message */}
        <p className="text-sm text-gray-500 mt-8">
          💡 Tip: Check the URL for typos or use the search bar to find what you need
        </p>
      </div>
    </div>
  )
}
