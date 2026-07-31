'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart, X } from 'lucide-react'
import { toast } from 'sonner'
import { WhatsAppChatButton } from '@/components/WhatsAppChatButton'
import Link from 'next/link'

export function QuickViewModal({ product, isOpen, onClose, onAddToCart, onToggleWishlist, isInWishlist }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  if (!product) return null

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image]

  const handleAddToCart = () => {
    onAddToCart(product, quantity)
    toast.success(`${quantity} item(s) added to cart!`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Product Images */}
          <div>
            <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discount > 0 && (
                <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0">
                  {product.discount}% OFF
                </Badge>
              )}
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`border-2 rounded-lg overflow-hidden h-20 ${
                      selectedImage === idx ? 'border-pink-600' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h2 className="text-2xl font-bold font-serif text-pink-900 mb-3">{product.name}</h2>

            <Badge
              variant={product.inStock ? 'default' : 'secondary'}
              className={product.inStock ? 'bg-green-100 text-green-800 mb-4' : 'mb-4'}
            >
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Badge>

            {/* Price */}
            <div className="mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-pink-900">₹{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                )}
                {product.discount > 0 && (
                  <Badge className="bg-green-100 text-green-700">Save {product.discount}%</Badge>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-4">
                <p className="text-gray-600 text-sm">{product.description}</p>
              </div>
            )}

            {/* Cake Details */}
            {product.category === 'cakes' && (
              <div className="space-y-2 mb-4 text-sm">
                {product.size && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Size:</span>
                    <Badge variant="outline">{product.size}</Badge>
                  </div>
                )}
                {product.flavour && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Flavour:</span>
                    <Badge variant="outline">{product.flavour}</Badge>
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="mb-4">
              <label className="font-semibold text-gray-700 block mb-2 text-sm">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-pink-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-pink-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 font-semibold border-x-2 border-pink-200">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 hover:bg-pink-50">
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* WhatsApp for Cakes */}
            {product.category === 'cakes' && (
              <div className="mb-3">
                <WhatsAppChatButton product={product} className="w-full" />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mb-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={() => onToggleWishlist(product)}
                variant="outline"
                className={`px-4 ${isInWishlist ? 'border-red-500 text-red-500' : ''}`}
              >
                <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-red-500' : ''}`} />
              </Button>
            </div>

            {/* View Full Details Link */}
            <Link href={`/products/${product.id}`} onClick={onClose}>
              <Button variant="link" className="w-full text-pink-600">
                View Full Details →
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
