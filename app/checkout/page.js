'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CreditCard, Truck, Calendar, MapPin, Plus, Check, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { RazorpayCheckout } from '@/components/razorpay/RazorpayCheckout'
import { useAuth } from '@/contexts/AuthContext'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [step, setStep] = useState(1)
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [pointsToRedeem, setPointsToRedeem] = useState('')
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0)
  const [applyingPoints, setApplyingPoints] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [loadingAddresses, setLoadingAddresses] = useState(false)
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
    expressDelivery: false,
    giftMessage: '',
    specialInstructions: '',
    // Payment
    paymentMethod: 'partial' // Default to partial payment (25% advance)
  })
  
  const [showUpiQr, setShowUpiQr] = useState(false)
  const [showBankDetails, setShowBankDetails] = useState(false)
  const [paymentProofFile, setPaymentProofFile] = useState(null)

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
    
    // Fetch saved addresses if user is logged in
    if (user) {
      fetchSavedAddresses()
      // Pre-fill user information
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }))
    }
  }, [user])
  
  const fetchSavedAddresses = async () => {
    try {
      setLoadingAddresses(true)
      const response = await fetch('/api/addresses')
      const data = await response.json()
      
      if (data.success) {
        setSavedAddresses(data.addresses || [])
        
        // Auto-select default address if exists
        const defaultAddr = data.addresses?.find(addr => addr.isDefault)
        if (defaultAddr && !selectedAddressId) {
          setSelectedAddressId(defaultAddr._id)
          populateAddressFields(defaultAddr)
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setLoadingAddresses(false)
    }
  }
  
  const populateAddressFields = (address) => {
    setFormData(prev => ({
      ...prev,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode
    }))
  }
  
  const handleAddressSelection = (addressId) => {
    setSelectedAddressId(addressId)
    setUseNewAddress(false)
    const selected = savedAddresses.find(addr => addr._id === addressId)
    if (selected) {
      populateAddressFields(selected)
    }
  }
  
  const handleUseNewAddress = () => {
    setUseNewAddress(true)
    setSelectedAddressId('')
    setFormData(prev => ({
      ...prev,
      address: '',
      city: '',
      state: '',
      pincode: ''
    }))
  }

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
    
    // Check if cart contains cakes and validate PIN code
    const hasCakes = cart.some(item => 
      item.category === 'cakes' || 
      item.name.toLowerCase().includes('cake')
    )
    
    if (hasCakes && formData.pincode !== '263139') {
      toast.error('Cake delivery not available in this area!', {
        description: 'Cake delivery is only available in Haldwani (PIN: 263139). Please update your PIN code or remove cakes from cart.',
        duration: 6000
      })
      return false
    }
    
    // Validate delivery date for cakes
    if (hasCakes) {
      if (!formData.deliveryDate) {
        toast.error('Please select a delivery date for cake orders')
        return false
      }
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const selectedDate = new Date(formData.deliveryDate)
      selectedDate.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        toast.error('Delivery date cannot be in the past')
        return false
      }
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
  const expressDeliveryFee = formData.expressDelivery ? 200 : 0
  const total = Math.max(0, subtotal + deliveryCharge + expressDeliveryFee - loyaltyDiscount)

  const applyLoyaltyPoints = async () => {
    const points = parseInt(pointsToRedeem)
    if (!points || points <= 0) {
      toast.error('Please enter valid points')
      return
    }

    if (points > loyaltyPoints) {
      toast.error('Insufficient loyalty points')
      return
    }

    setApplyingPoints(true)
    try {
      const response = await fetch('/api/loyalty/apply-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user-id', // Replace with actual user ID from context
          pointsToRedeem: points,
          orderTotal: subtotal + deliveryCharge + expressDeliveryFee
        })
      })

      const data = await response.json()
      if (response.ok) {
        setLoyaltyDiscount(data.discount)
        toast.success(`${points} points applied! You saved ₹${data.discount}`)
      } else {
        toast.error(data.error || 'Failed to apply points')
      }
    } catch (error) {
      toast.error('Failed to apply points')
    } finally {
      setApplyingPoints(false)
    }
  }

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
                  
                  {/* Saved Addresses Section (only for logged-in users) */}
                  {user && savedAddresses.length > 0 && !useNewAddress && (
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Select Saved Address</Label>
                      <div className="grid gap-3">
                        {savedAddresses.map((addr) => (
                          <div
                            key={addr._id}
                            onClick={() => handleAddressSelection(addr._id)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                              selectedAddressId === addr._id
                                ? 'border-pink-600 bg-pink-50'
                                : 'border-gray-200 hover:border-pink-300'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-pink-600 mt-1 flex-shrink-0" />
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-semibold text-gray-900">{addr.name}</p>
                                    {addr.isDefault && (
                                      <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded">Default</span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">{addr.phone}</p>
                                  <p className="text-sm text-gray-700 mt-1">{addr.address}</p>
                                  <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                                </div>
                              </div>
                              {selectedAddressId === addr._id && (
                                <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleUseNewAddress}
                        className="w-full border-pink-300 text-pink-700 hover:bg-pink-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Use Different Address
                      </Button>
                      
                      <Separator className="my-4" />
                    </div>
                  )}
                  
                  {/* New Address Form - Always show if no saved addresses or user clicks "Use Different Address" */}
                  {(useNewAddress || !user || savedAddresses.length === 0) && (
                    <>
                      {user && savedAddresses.length > 0 && (
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-base font-semibold">Enter New Address</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setUseNewAddress(false)
                              if (savedAddresses.length > 0) {
                                handleAddressSelection(savedAddresses[0]._id)
                              }
                            }}
                            className="text-pink-600 hover:text-pink-700"
                          >
                            Choose from saved
                          </Button>
                        </div>
                      )}
                      
                      <div>
                        <Label htmlFor="address">Delivery Address *</Label>
                        <Textarea 
                          id="address" 
                          name="address" 
                          value={formData.address} 
                          onChange={handleInputChange} 
                          placeholder="House/Flat No., Street, Area" 
                          rows={3} 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input 
                            id="city" 
                            name="city" 
                            value={formData.city} 
                            onChange={handleInputChange} 
                            placeholder="City" 
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State *</Label>
                          <Input 
                            id="state" 
                            name="state" 
                            value={formData.state} 
                            onChange={handleInputChange} 
                            placeholder="State" 
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="pincode">PIN Code *</Label>
                        <Input 
                          id="pincode" 
                          name="pincode" 
                          value={formData.pincode} 
                          onChange={handleInputChange} 
                          maxLength={6} 
                          placeholder="6-digit PIN code" 
                        />
                      </div>
                      
                      <Separator className="my-6" />
                    </>
                  )}
                  
                  {/* Delivery Date and Time - ONLY for Cakes */}
                  {cart.some(item => item.category === 'cakes') && (
                    <>
                      <div>
                        <Label htmlFor="deliveryDate">Preferred Delivery Date *</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input 
                            id="deliveryDate" 
                            name="deliveryDate" 
                            type="date" 
                            value={formData.deliveryDate} 
                            onChange={handleInputChange} 
                            min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                            className="pl-10" 
                            required
                          />
                        </div>
                        <p className="text-xs text-pink-600 mt-1">* Cakes require minimum 24 hours advance order</p>
                      </div>
                      
                      <div>
                        <Label>Preferred Delivery Time *</Label>
                        <p className="text-xs text-gray-500 mb-2">Available: 10:00 AM - 8:00 PM</p>
                        <RadioGroup value={formData.deliveryTime} onValueChange={(value) => setFormData({...formData, deliveryTime: value})} required>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="10am-12pm" id="morning" />
                            <Label htmlFor="morning" className="font-normal cursor-pointer">Morning (10 AM - 12 PM)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="12pm-4pm" id="afternoon" />
                            <Label htmlFor="afternoon" className="font-normal cursor-pointer">Afternoon (12 PM - 4 PM)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="4pm-8pm" id="evening" />
                            <Label htmlFor="evening" className="font-normal cursor-pointer">Evening (4 PM - 8 PM)</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </>
                  )}
                  
                  {/* Express Delivery Option */}
                  <Card className="border-2 border-pink-200 bg-pink-50">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="expressDelivery"
                          checked={formData.expressDelivery}
                          onChange={(e) => setFormData({...formData, expressDelivery: e.target.checked})}
                          className="mt-1 rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                        />
                        <div className="flex-1">
                          <Label htmlFor="expressDelivery" className="font-semibold cursor-pointer text-pink-900">
                            Express Delivery (Within 2 Hours)
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">Get your order delivered within 2 hours</p>
                          <p className="text-sm font-semibold text-pink-600 mt-1">+ ₹200</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
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
                  <RadioGroup value={formData.paymentMethod} onValueChange={(value) => {
                    setFormData({...formData, paymentMethod: value})
                    setShowUpiQr(false)
                    setShowBankDetails(false)
                  }}>
                    {/* Partial Payment (25% Advance) */}
                    <Card className={`border-2 cursor-pointer transition ${formData.paymentMethod === 'partial' ? 'border-pink-600 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="partial" id="partial" />
                          <Label htmlFor="partial" className="flex-1 font-normal cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">💰 Partial Payment (25% Advance)</p>
                                <p className="text-sm text-gray-600">Pay ₹{Math.ceil(total * 0.25)} now + ₹{Math.ceil(total * 0.75)} on delivery</p>
                              </div>
                              <Truck className="w-6 h-6 text-orange-600" />
                            </div>
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* UPI Payment */}
                    <Card className="border-2 hover:border-pink-400 transition cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="upi" id="upi" />
                          <Label htmlFor="upi" className="flex-1 font-normal cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">📱 UPI Payment (PhonePe/GPay/Paytm)</p>
                                <p className="text-sm text-gray-600">Instant payment via UPI</p>
                              </div>
                              <div className="text-2xl">📲</div>
                            </div>
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Bank Transfer */}
                    <Card className="border-2 hover:border-pink-400 transition cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="bank" id="bank" />
                          <Label htmlFor="bank" className="flex-1 font-normal cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">🏦 Bank Transfer / NEFT / IMPS</p>
                                <p className="text-sm text-gray-600">Direct bank account transfer</p>
                              </div>
                              <div className="text-2xl">💳</div>
                            </div>
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* WhatsApp Order */}
                    <Card className="border-2 hover:border-pink-400 transition cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="whatsapp" id="whatsapp" />
                          <Label htmlFor="whatsapp" className="flex-1 font-normal cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">💬 Order via WhatsApp</p>
                                <p className="text-sm text-gray-600">Coordinate payment with our team</p>
                              </div>
                              <div className="text-2xl">📞</div>
                            </div>
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Online Payment (Razorpay) */}
                    <Card className={`border-2 cursor-pointer transition ${formData.paymentMethod === 'online' ? 'border-pink-600 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="online" id="online" />
                          <Label htmlFor="online" className="flex-1 font-normal cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold">Online Payment (Card/UPI/Net Banking)</p>
                                  <Badge className="bg-green-500">Secure</Badge>
                                </div>
                                <p className="text-sm text-gray-500">Powered by Razorpay - Safe & Secure</p>
                              </div>
                              <CreditCard className="w-6 h-6 text-pink-600" />
                            </div>
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  </RadioGroup>
                  
                  {/* Payment Instructions & Actions based on selected method */}
                  {formData.paymentMethod === 'partial' && (
                    <div className="space-y-4">
                      <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                        <p className="font-semibold text-orange-900 mb-3">💰 Partial Payment (25% Advance)</p>
                        <div className="bg-white rounded-lg p-4 border border-orange-300 mb-3">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">Total Order Amount:</span>
                              <span className="font-bold text-lg">₹{total}</span>
                            </div>
                            <div className="h-px bg-orange-200"></div>
                            <div className="flex justify-between items-center text-orange-700">
                              <span className="text-sm font-semibold">Advance Payment (25%):</span>
                              <span className="font-bold text-xl">₹{Math.ceil(total * 0.25)}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-600">
                              <span className="text-sm">Pay on Delivery (75%):</span>
                              <span className="font-semibold">₹{Math.ceil(total * 0.75)}</span>
                            </div>
                          </div>
                        </div>
                        <ul className="text-sm text-orange-800 space-y-1 list-disc pl-5">
                          <li>Pay 25% advance now via Razorpay (secure online payment)</li>
                          <li>Remaining 75% to be paid in cash on delivery</li>
                          <li>Available for PIN code 263139 only</li>
                        </ul>
                      </div>
                      
                      <RazorpayCheckout
                        amount={Math.ceil(total * 0.25)}
                        customerInfo={{
                          name: formData.name,
                          email: formData.email,
                          phone: formData.phone,
                          address: formData.address,
                          deliveryDetails: {
                            deliveryDate: formData.deliveryDate,
                            deliveryTime: formData.deliveryTime,
                            pinCode: formData.pinCode
                          }
                        }}
                        cartItems={cart}
                        onSuccess={(data) => {
                          toast.success('Advance payment successful! Your order is confirmed.')
                          // Clear cart
                          localStorage.removeItem('cart')
                          // Redirect to order confirmation
                          router.push(`/order-confirmation?orderId=${data.orderId}&type=partial`)
                        }}
                        onFailure={(error) => {
                          toast.error('Payment failed. Please try again.')
                          console.error('Payment error:', error)
                        }}
                      />
                      
                      <Button onClick={() => setStep(2)} variant="outline" className="w-full">
                        Back
                      </Button>
                    </div>
                  )}
                  
                  {formData.paymentMethod === 'online' && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                        <p className="font-semibold text-blue-900 mb-2">💳 Online Payment</p>
                        <p className="text-sm text-blue-800 mb-3">
                          Pay securely using Credit/Debit Card, UPI, Net Banking, or Wallets via Razorpay
                        </p>
                        <div className="flex items-center gap-2 text-xs text-blue-700">
                          <Shield className="w-4 h-4" />
                          <span>256-bit SSL Encryption • 100% Secure</span>
                        </div>
                      </div>
                      
                      <RazorpayCheckout
                        amount={total}
                        customerInfo={{
                          name: formData.name,
                          email: formData.email,
                          phone: formData.phone,
                          address: formData.address,
                          deliveryDetails: {
                            deliveryDate: formData.deliveryDate,
                            deliveryTime: formData.deliveryTime,
                            pinCode: formData.pinCode
                          }
                        }}
                        cartItems={cart}
                        onSuccess={(data) => {
                          toast.success('Payment successful! Your order is being processed.')
                          // Clear cart
                          localStorage.removeItem('cart')
                          // Redirect to order confirmation
                          router.push(`/order-confirmation?orderId=${data.orderId}`)
                        }}
                        onFailure={(error) => {
                          toast.error('Payment failed. Please try again.')
                          console.error('Payment error:', error)
                        }}
                      />
                      
                      <Button onClick={() => setStep(2)} variant="outline" className="w-full">
                        Back
                      </Button>
                    </div>
                  )}
                  
                  {formData.paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                        <p className="font-semibold text-blue-900 mb-3">📱 UPI Payment Instructions</p>
                        <div className="bg-white rounded-lg p-4 border-2 border-blue-300 mb-3">
                          <p className="text-center font-bold text-xl mb-2">UPI ID</p>
                          <p className="text-center text-2xl font-mono bg-gray-100 p-3 rounded select-all">
                            krishnabaskheti-5@oksbi
                          </p>
                          <p className="text-center text-sm text-gray-600 mt-2">
                            Tap to copy • Pay via any UPI app
                          </p>
                        </div>
                        <div className="text-sm text-blue-800 space-y-2">
                          <p className="font-semibold">Steps to Pay:</p>
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>Open PhonePe/GPay/Paytm</li>
                            <li>Enter UPI ID: <strong>mrcocobakery@paytm</strong></li>
                            <li>Pay <strong>₹{total}</strong></li>
                            <li>Take screenshot of payment success</li>
                            <li>Click "Place Order" below</li>
                          </ol>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                          Back
                        </Button>
                        <Button onClick={placeOrderCOD} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                          I've Paid via UPI - Place Order
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {formData.paymentMethod === 'bank' && (
                    <div className="space-y-4">
                      <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                        <p className="font-semibold text-purple-900 mb-3">🏦 Bank Transfer Details</p>
                        <div className="bg-white rounded-lg p-4 border-2 border-purple-300 space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="font-semibold">Account Name:</p>
                            <p className="text-right">Mr. COCO Bakery</p>
                            
                            <p className="font-semibold">Account Number:</p>
                            <p className="text-right font-mono">47040200000462</p>
                            
                            <p className="font-semibold">IFSC Code:</p>
                            <p className="text-right font-mono">BARB0RAMHAL</p>
                            
                            <p className="font-semibold">Bank Name:</p>
                            <p className="text-right">Bank Of Baroda</p>
                            
                            <p className="font-semibold">Branch:</p>
                            <p className="text-right">Rampur Road Haldwani</p>
                            
                            <p className="font-semibold text-lg mt-2">Amount to Pay:</p>
                            <p className="text-right text-lg font-bold text-purple-900">₹{total}</p>
                          </div>
                        </div>
                        <div className="text-sm text-purple-800 mt-3 space-y-1">
                          <p className="font-semibold">After transferring:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Take screenshot of transaction</li>
                            <li>Note the transaction reference number</li>
                            <li>Click "Place Order" below</li>
                            <li>We'll confirm your order once payment is verified</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                          Back
                        </Button>
                        <Button onClick={placeOrderCOD} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                          I've Transferred - Place Order
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {formData.paymentMethod === 'whatsapp' && (
                    <div className="space-y-4">
                      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                        <p className="font-semibold text-green-900 mb-3">💬 Order via WhatsApp</p>
                        <p className="text-sm text-green-800 mb-3">
                          Your order details will be sent to our WhatsApp. Our team will contact you to coordinate payment and delivery.
                        </p>
                        <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                          <p className="text-center font-semibold mb-2">Contact Numbers</p>
                          <div className="space-y-2">
                            <a href="https://wa.me/918447655399" target="_blank" className="flex items-center justify-center gap-2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition">
                              <span className="text-xl">📱</span>
                              <span className="font-semibold">+91 8447655399</span>
                            </a>
                            <a href="https://wa.me/918979751914" target="_blank" className="flex items-center justify-center gap-2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition">
                              <span className="text-xl">📱</span>
                              <span className="font-semibold">+91 8979751914</span>
                            </a>
                            <a href="https://wa.me/917455065399" target="_blank" className="flex items-center justify-center gap-2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition">
                              <span className="text-xl">📱</span>
                              <span className="font-semibold">+91 7455065399</span>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                          Back
                        </Button>
                        <Button onClick={placeOrderCOD} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                          Confirm Order (WhatsApp)
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
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
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
                  {formData.expressDelivery && (
                    <div className="flex justify-between text-pink-600 font-medium">
                      <span>Express Delivery (2 hrs)</span>
                      <span>₹{expressDeliveryFee}</span>
                    </div>
                  )}
                  {loyaltyDiscount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Loyalty Discount</span>
                      <span>-₹{loyaltyDiscount}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between text-xl font-bold text-pink-900">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
                
                {/* Loyalty Points Redemption */}
                {step === 3 && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Loyalty Points</span>
                        <Badge variant="outline" className="text-yellow-900">{loyaltyPoints} pts available</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Points to redeem"
                          value={pointsToRedeem}
                          onChange={(e) => setPointsToRedeem(e.target.value)}
                          max={loyaltyPoints}
                          disabled={applyingPoints}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={applyLoyaltyPoints}
                          disabled={applyingPoints || !pointsToRedeem}
                        >
                          Apply
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">1 point = ₹1 discount</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
