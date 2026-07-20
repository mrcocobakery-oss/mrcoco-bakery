'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight, Cake } from 'lucide-react'
import { toast } from 'sonner'

export default function CartPage() {
  const [cart, setCart] = useState([])
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      // Group items by id and add quantity
      const grouped = parsedCart.reduce((acc, item) => {
        const existing = acc.find(i => i.id === item.id)
        if (existing) {
          existing.quantity += 1
        } else {
          acc.push({ ...item, quantity: 1 })
        }
        return acc
      }, [])
      setCart(grouped)
    }
  }, [])

  const updateCart = (newCart) => {
    setCart(newCart)
    // Flatten cart for localStorage
    const flattened = newCart.flatMap(item => 
      Array(item.quantity).fill(item)
    )
    localStorage.setItem('cart', JSON.stringify(flattened))
  }

  const updateQuantity = (productId, change) => {
    const newCart = cart.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQuantity }
      }
      return item
    })
    updateCart(newCart)
  }

  const removeItem = (productId) => {
    const newCart = cart.filter(item => item.id !== productId)
    updateCart(newCart)
    toast.success('Item removed from cart')
  }

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setDiscount(10)
      toast.success('Coupon applied! 10% discount')
    } else if (couponCode.toUpperCase() === 'SAVE20') {
      setDiscount(20)
      toast.success('Coupon applied! 20% discount')
    } else {
      toast.error('Invalid coupon code')
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discountAmount = (subtotal * discount) / 100
  const deliveryCharge = subtotal > 500 ? 0 : 50
  const total = subtotal - discountAmount + deliveryCharge

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-lg">
                <Cake className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-serif text-amber-900">Mr. COCO</h1>
                <p className="text-xs text-amber-700">Bakery</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 py-12">
        <div className="container mx-auto px-4">
          <Link href="/products">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">Shopping Cart</h1>
          <p className="text-amber-100 text-lg">{cart.length} items in your cart</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some delicious treats to get started!</p>
            <Link href="/products">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="overflow-hidden border-2 border-amber-100">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-amber-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">Category: {item.category}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-amber-900">₹{item.price * item.quantity}</p>
                            <p className="text-sm text-gray-500">₹{item.price} each</p>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-2 border-amber-200">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold font-serif text-amber-900 mb-6">Order Summary</h2>
                  
                  {/* Coupon */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-2 block">Have a coupon?</label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Enter code" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button onClick={applyCoupon} variant="outline" className="whitespace-nowrap">
                        Apply
                      </Button>
                    </div>
                    {discount > 0 && (
                      <p className="text-sm text-green-600 mt-2">✓ {discount}% discount applied</p>
                    )}
                  </div>

                  <Separator className="my-4" />

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({discount}%)</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-700">
                      <span>Delivery Charge</span>
                      <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                    </div>
                    {deliveryCharge > 0 && (
                      <p className="text-xs text-gray-500">Free delivery on orders above ₹500</p>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-xl font-bold text-amber-900 mb-6">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>

                  <Link href="/checkout">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg py-6">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Try coupon codes:</p>
                    <div className="flex gap-2 justify-center mt-2">
                      <Badge variant="outline" className="cursor-pointer" onClick={() => setCouponCode('WELCOME10')}>WELCOME10</Badge>
                      <Badge variant="outline" className="cursor-pointer" onClick={() => setCouponCode('SAVE20')}>SAVE20</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
