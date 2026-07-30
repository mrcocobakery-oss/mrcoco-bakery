'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, CreditCard, Truck, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { RazorpayCheckout } from '@/components/razorpay/RazorpayCheckout'

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState([])
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    phone: '',
    // Address
    address: '',
    city: '',
    state: '',
    pincode: '',
    // Delivery
    deliveryDate: '',
    deliveryTime: 'morning',
    giftMessage: '',
    specialInstructions: '',
    // Payment
    paymentMethod: 'online'
  })

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill all personal details')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill all address details')
      return false
    }
    if (formData.pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit PIN code')
      return false
    }
    return true
  }

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handlePaymentSuccess = (paymentData) => {
    // Clear cart
    localStorage.removeItem('cart')
    
    toast.success(`Order placed successfully! Order ID: ${paymentData.orderId}`)
    
    setTimeout(() => {
      router.push(`/?payment=success&orderId=${paymentData.orderId}`)
    }, 2000)
  }

  const handlePaymentFailure = (error) => {
    toast.error('Payment failed. Please try again.')
    console.error('Payment error:', error)
  }

  const placeOrderCOD = () => {
    // For COD orders
    const orderId = 'MRC' + Math.random().toString(36).substr(2, 9).toUpperCase()
    
    // Clear cart
    localStorage.removeItem('cart')
    
    toast.success(`Order placed successfully! Order ID: ${orderId}`)
    
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryCharge = subtotal > 500 ? 0 : 50
  const total = subtotal + deliveryCharge

  const customerInfo = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
    deliveryDate: formData.deliveryDate,
    deliveryTime: formData.deliveryTime,
    giftMessage: formData.giftMessage,
    specialInstructions: formData.specialInstructions
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
          <Link href="/products">
            <Button className="bg-pink-600 hover:bg-pink-700 text-white">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/images/mrcoco-logo.png" alt="Mr. COCO Bakery" className="h-16 w-auto" />
            </Link>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-800 py-12">
        <div className="container mx-auto px-4">
          <Link href="/cart">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">Checkout</h1>
          <div className="flex items-center gap-4 text-white">
            <div className={`flex items-center ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-white text-pink-900' : 'bg-pink-700'} font-bold`}>1</div>
              <span className="ml-2 hidden sm:inline">Personal Info</span>
            </div>
            <div className="h-0.5 w-8 bg-white/30" />
            <div className={`flex items-center ${step >= 2 ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-white text-pink-900' : 'bg-pink-700'} font-bold`}>2</div>
              <span className="ml-2 hidden sm:inline">Delivery</span>
            </div>
            <div className="h-0.5 w-8 bg-white/30" />
            <div className={`flex items-center ${step >= 3 ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-white text-pink-900' : 'bg-pink-700'} font-bold`}>3</div>
              <span className="ml-2 hidden sm:inline">Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <Card className="border-2 border-pink-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-pink-900">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" />
                  </div>
                  <Button onClick={nextStep} className="w-full bg-pink-600 hover:bg-pink-700 text-white mt-6">
                    Continue to Delivery Details
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Delivery Details */}
            {step === 2 && (
              <Card className="border-2 border-pink-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-pink-900">Delivery Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="House/Flat No., Street, Area" rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input id="state" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="pincode">PIN Code *</Label>
                    <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} maxLength={6} placeholder="6-digit PIN code" />
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <Label htmlFor="deliveryDate">Preferred Delivery Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input id="deliveryDate" name="deliveryDate" type="date" value={formData.deliveryDate} onChange={handleInputChange} className="pl-10" />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Preferred Delivery Time</Label>
                    <RadioGroup value={formData.deliveryTime} onValueChange={(value) => setFormData({...formData, deliveryTime: value})}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="morning" id="morning" />
                        <Label htmlFor="morning" className="font-normal cursor-pointer">Morning (9 AM - 12 PM)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="afternoon" id="afternoon" />
                        <Label htmlFor="afternoon" className="font-normal cursor-pointer">Afternoon (12 PM - 4 PM)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="evening" id="evening" />
                        <Label htmlFor="evening" className="font-normal cursor-pointer">Evening (4 PM - 8 PM)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label htmlFor="giftMessage">Gift Message (Optional)</Label>
                    <Textarea id="giftMessage" name="giftMessage" value={formData.giftMessage} onChange={handleInputChange} placeholder="Add a personal message..." rows={2} />
                  </div>
                  
                  <div>
                    <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                    <Textarea id="specialInstructions" name="specialInstructions" value={formData.specialInstructions} onChange={handleInputChange} placeholder="Any special requests?" rows={2} />
                  </div>
                  
                  <div className="flex gap-4">
                    <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                      Back
                    </Button>
                    <Button onClick={nextStep} className="flex-1 bg-pink-600 hover:bg-pink-700 text-white">
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <Card className="border-2 border-pink-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-pink-900">Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
                    <Card className="border-2 hover:border-pink-400 transition cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="online" id="online" />
                          <Label htmlFor="online" className="flex-1 font-normal cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">Online Payment</p>
                                <p className="text-sm text-gray-600">Razorpay, UPI, Cards, Net Banking</p>
                              </div>
                              <CreditCard className="w-6 h-6 text-pink-600" />
                            </div>
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-2 hover:border-pink-400 transition cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod" className="flex-1 font-normal cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">Cash on Delivery</p>
                                <p className="text-sm text-gray-600">Pay when you receive</p>
                              </div>
                              <Truck className="w-6 h-6 text-pink-600" />
                            </div>
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  </RadioGroup>
                  
                  <Separator className="my-6" />
                  
                  {/* Payment Button based on method */}
                  {formData.paymentMethod === 'online' ? (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-900">
                          <strong>Secure Payment:</strong> Your payment is processed through Razorpay with industry-standard encryption.
                        </p>
                      </div>
                      <RazorpayCheckout
                        amount={total}
                        customerInfo={customerInfo}
                        cartItems={cart}
                        onSuccess={handlePaymentSuccess}
                        onFailure={handlePaymentFailure}
                      />
                      <Button onClick={() => setStep(2)} variant="outline" className="w-full">
                        Back to Delivery Details
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                        <p className="text-sm text-pink-900">
                          <strong>Cash on Delivery:</strong> Pay when your order is delivered to your doorstep.
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                          Back
                        </Button>
                        <Button onClick={placeOrderCOD} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                          Place Order (COD)
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-2 border-pink-200">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-pink-900">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-pink-900">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery</span>
                    <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-xl font-bold text-pink-900">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
