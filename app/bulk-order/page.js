'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Cake, Upload, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function BulkOrderPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    whatsapp: '',
    email: '',
    city: '',
    state: '',
    businessType: '',
    products: '',
    quantity: '',
    budget: '',
    deliveryDate: '',
    message: ''
  })

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.companyName || !formData.contactPerson || !formData.phone || !formData.email) {
      toast.error('Please fill all required fields')
      return
    }
    
    try {
      // Send bulk order request to API
      const response = await fetch('/api/bulk-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdAt: new Date()
        })
      })
      
      if (response.ok) {
        toast.success('Your bulk order inquiry has been submitted! We\'ll contact you within 24 hours.')
        setSubmitted(true)
      } else {
        toast.error('Failed to submit. Please try again or contact us directly.')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to submit. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 flex items-center justify-center">
        <Card className="max-w-md mx-4 border-2 border-green-200">
          <CardContent className="text-center p-8">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold font-serif text-pink-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">Your bulk order inquiry has been submitted successfully. Our team will contact you within 24 hours.</p>
            <Link href="/">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
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
      <div className="bg-gradient-to-r from-pink-600 to-pink-800 py-16">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold font-serif text-white mb-4">Bulk Orders</h1>
          <p className="text-pink-100 text-lg max-w-3xl">Perfect for corporate events, weddings, parties, hotels, cafes, and retail shops. Get special pricing for large orders.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-pink-200">
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-pink-900">Submit Your Bulk Order Inquiry</CardTitle>
                <p className="text-gray-600">Fill out the form below and our team will get back to you with a customized quote.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-pink-900 mb-4">Company Details</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="companyName">Company/Organization Name *</Label>
                        <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="ABC Company Pvt Ltd" required />
                      </div>
                      <div>
                        <Label htmlFor="businessType">Business Type *</Label>
                        <Select value={formData.businessType} onValueChange={(value) => setFormData({...formData, businessType: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="corporate">Corporate</SelectItem>
                            <SelectItem value="wedding">Wedding Planner</SelectItem>
                            <SelectItem value="event">Event Management</SelectItem>
                            <SelectItem value="hotel">Hotel/Restaurant</SelectItem>
                            <SelectItem value="cafe">Cafe/Coffee Shop</SelectItem>
                            <SelectItem value="retail">Retail Shop</SelectItem>
                            <SelectItem value="distributor">Distributor</SelectItem>
                            <SelectItem value="reseller">Reseller</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-pink-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactPerson">Contact Person *</Label>
                        <Input id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} placeholder="John Doe" required />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+918447655399" required />
                      </div>
                      <div>
                        <Label htmlFor="whatsapp">WhatsApp Number</Label>
                        <Input id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder="+918447655399" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" required />
                      </div>
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="Mumbai" required />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input id="state" name="state" value={formData.state} onChange={handleInputChange} placeholder="Maharashtra" required />
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-pink-900 mb-4">Order Requirements</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="products">Required Products *</Label>
                        <Input id="products" name="products" value={formData.products} onChange={handleInputChange} placeholder="e.g., Cakes, Cookies, Namkeen" required />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="quantity">Approximate Quantity *</Label>
                          <Input id="quantity" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="e.g., 100 pieces, 50 kg" required />
                        </div>
                        <div>
                          <Label htmlFor="budget">Expected Budget</Label>
                          <Input id="budget" name="budget" value={formData.budget} onChange={handleInputChange} placeholder="₹ 50,000" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="deliveryDate">Expected Delivery Date</Label>
                        <Input id="deliveryDate" name="deliveryDate" type="date" value={formData.deliveryDate} onChange={handleInputChange} />
                      </div>
                      <div>
                        <Label htmlFor="message">Additional Requirements</Label>
                        <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Please share any specific requirements, customization needs, or questions..." rows={5} />
                      </div>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <Label htmlFor="file">Attach Documents (Optional)</Label>
                    <div className="mt-2 flex items-center justify-center w-full">
                      <label htmlFor="file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-pink-300 border-dashed rounded-lg cursor-pointer bg-pink-50 hover:bg-pink-100 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 text-pink-600 mb-2" />
                          <p className="text-sm text-gray-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500">PDF, DOC, DOCX, XLS, XLSX (MAX. 10MB)</p>
                        </div>
                        <input id="file" type="file" className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx" />
                      </label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white text-lg py-6">
                    Submit Inquiry
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-pink-200">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-pink-900">Why Choose Us?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Competitive bulk pricing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Customization available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Consistent quality & taste</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Timely delivery guaranteed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Dedicated support team</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Flexible payment terms</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white">
              <CardContent className="p-6">
                <h3 className="font-bold text-pink-900 mb-2">Need Immediate Assistance?</h3>
                <p className="text-sm text-gray-600 mb-4">Call our bulk order specialist</p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  📞 Call: +918447655399
                </Button>
                <Button className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white">
                  💬 WhatsApp Us
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-pink-200">
              <CardHeader>
                <CardTitle className="text-lg font-serif text-pink-900">Our Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Trusted by 500+ businesses including:</p>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  <li>• Corporate offices</li>
                  <li>• Wedding planners</li>
                  <li>• 5-star hotels</li>
                  <li>• Premium cafes</li>
                  <li>• Retail chains</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
