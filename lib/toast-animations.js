import { toast } from 'sonner'
import { CheckCircle2, Heart, ShoppingCart, Trash2, AlertCircle } from 'lucide-react'

export const successToast = {
  addToCart: (productName) => {
    toast.success(
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <ShoppingCart className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <div className="font-semibold text-gray-900">Added to Cart!</div>
          <div className="text-sm text-gray-600">{productName}</div>
        </div>
      </div>,
      {
        duration: 3000,
        className: 'border-2 border-green-200',
      }
    )
  },

  addToWishlist: (productName) => {
    toast.success(
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
          <Heart className="w-5 h-5 text-pink-600 fill-pink-600" />
        </div>
        <div>
          <div className="font-semibold text-gray-900">Added to Wishlist!</div>
          <div className="text-sm text-gray-600">{productName}</div>
        </div>
      </div>,
      {
        duration: 3000,
        className: 'border-2 border-pink-200',
      }
    )
  },

  removeFromWishlist: (productName) => {
    toast.info(
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Heart className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <div className="font-semibold text-gray-900">Removed from Wishlist</div>
          <div className="text-sm text-gray-600">{productName}</div>
        </div>
      </div>,
      {
        duration: 2000,
      }
    )
  },

  removeFromCart: (productName) => {
    toast.info(
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Trash2 className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <div className="font-semibold text-gray-900">Removed from Cart</div>
          <div className="text-sm text-gray-600">{productName}</div>
        </div>
      </div>,
      {
        duration: 2000,
      }
    )
  },

  outOfStock: (productName) => {
    toast.error(
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <div className="font-semibold text-gray-900">Out of Stock</div>
          <div className="text-sm text-gray-600">{productName} is currently unavailable</div>
        </div>
      </div>,
      {
        duration: 3000,
        className: 'border-2 border-red-200',
      }
    )
  },

  orderPlaced: (orderId) => {
    toast.success(
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <div className="font-semibold text-gray-900">Order Placed Successfully!</div>
          <div className="text-sm text-gray-600">Order ID: #{orderId}</div>
        </div>
      </div>,
      {
        duration: 5000,
        className: 'border-2 border-green-200',
      }
    )
  },
}
