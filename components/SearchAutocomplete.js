'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

const TRENDING_SEARCHES = [
  'Birthday Cake',
  'Chocolate Cake',
  'Black Forest',
  'Butter Cookies',
  'Namkeen Mix',
  'Anniversary Cake'
]

export function SearchAutocomplete() {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const [showDefaultView, setShowDefaultView] = useState(false)
  const searchRef = useRef(null)

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading recent searches:', e)
      }
    }
  }, [])

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
        setShowDefaultView(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setLoading(true)
      setShowDefaultView(false)
      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        
        if (data.success) {
          setSuggestions(data.products.slice(0, 6)) // Show max 6 suggestions
          setShowSuggestions(true)
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleClear = () => {
    setSearchQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    setShowDefaultView(false)
  }

  const handleFocus = () => {
    if (searchQuery.trim().length === 0) {
      setShowDefaultView(true)
    }
  }

  const saveRecentSearch = (term) => {
    if (!term.trim()) return
    
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const handleSelectProduct = () => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim())
    }
    setShowSuggestions(false)
    setShowDefaultView(false)
    setSearchQuery('')
  }

  const handleSearchClick = (term) => {
    setSearchQuery(term)
    saveRecentSearch(term)
    setShowDefaultView(false)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search for cakes, cookies, namkeen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleFocus}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Default View - Trending & Recent Searches */}
      {showDefaultView && !showSuggestions && (
        <Card className="absolute top-full mt-2 w-full z-50 border-2 border-pink-200">
          <div className="py-2">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Clock className="w-4 h-4" />
                    Recent Searches
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-pink-600 hover:text-pink-700"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.map((term, idx) => (
                  <Link
                    key={idx}
                    href={`/products?search=${encodeURIComponent(term)}`}
                    onClick={() => handleSearchClick(term)}
                    className="flex items-center justify-between px-4 py-2 hover:bg-pink-50 transition group"
                  >
                    <span className="text-gray-700">{term}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-pink-600" />
                  </Link>
                ))}
              </div>
            )}

            {/* Trending Searches */}
            <div>
              <div className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700">
                <TrendingUp className="w-4 h-4" />
                Trending Searches
              </div>
              {TRENDING_SEARCHES.map((term, idx) => (
                <Link
                  key={idx}
                  href={`/products?search=${encodeURIComponent(term)}`}
                  onClick={() => handleSearchClick(term)}
                  className="flex items-center justify-between px-4 py-2 hover:bg-pink-50 transition group"
                >
                  <span className="text-gray-700">{term}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-pink-600" />
                </Link>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Product Suggestions */}
      {showSuggestions && searchQuery.trim().length >= 2 && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto border-2 border-pink-200">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : suggestions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No products found</div>
          ) : (
            <div className="py-2">
              {suggestions.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={handleSelectProduct}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition"
                >
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="48px"
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-pink-600 font-semibold">₹{product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              <Link
                href={`/products?search=${encodeURIComponent(searchQuery)}`}
                onClick={handleSelectProduct}
                className="block px-4 py-2 text-center text-pink-600 hover:bg-pink-50 border-t font-medium"
              >
                View all results for "{searchQuery}"
              </Link>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
