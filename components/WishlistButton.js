'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export default function WishlistButton({ productId, className = '', size = 'default' }) {
  const { user } = useAuth()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.wishlist) {
      setIsInWishlist(user.wishlist.includes(productId))
    }
  }, [user, productId])

  const toggleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error('Please login to add to wishlist')
      return
    }

    setLoading(true)

    try {
      const method = isInWishlist ? 'DELETE' : 'POST'
      const response = await fetch('/api/user/wishlist', {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId })
      })

      const data = await response.json()

      if (response.ok) {
        setIsInWishlist(!isInWishlist)
        toast.success(data.message)
      } else {
        toast.error(data.error || 'Failed to update wishlist')
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-10 h-10',
    large: 'w-12 h-12'
  }

  const iconSizes = {
    small: 'w-4 h-4',
    default: 'w-5 h-5',
    large: 'w-6 h-6'
  }

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`${sizeClasses[size]} rounded-full bg-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center group ${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`${iconSizes[size]} transition-all ${
          isInWishlist
            ? 'fill-pink-600 text-pink-600'
            : 'text-gray-400 group-hover:text-pink-600 group-hover:scale-110'
        }`}
      />
    </button>
  )
}
