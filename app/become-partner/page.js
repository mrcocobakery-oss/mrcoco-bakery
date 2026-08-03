'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Phone, TrendingUp, Users, Award, Target } from 'lucide-react'
import { toast } from 'sonner'

export default function BecomePartnerPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    businessName: '',
    name: '',
    email: '',
    phone: '',
    city: '',
    businessType: '',
    message: ''
  })

  const contactNumbers = [
    { number: '+91 8447655399', display: '84476 55399' },
    { number: '+91 8979751914', display: '89797 51914' },
    { number: '+91 7455065399', display: '74550 65399' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'partnership'
        })
      })

      if (response.ok) {
        toast.success('Partnership inquiry submitted! We will contact you soon.')
        setFormData({ businessName: '', name: '', email: '', phone: '', city: '', businessType: '', message: '' })
      } else {
        toast.error('Failed to submit inquiry. Please try again.')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Banner */}
        <div className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">Become Our Partner</h1>
              <p className="text-2xl">Grow Your Business with Mr. COCO Bakery</p>
              <p className="text-sm mt-4 opacity-90">Banner image can be managed from admin panel</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Partner With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center p-6 border-2 border-blue-200 hover:shadow-xl transition">
                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Proven Business Model</h3>
                <p className="text-gray-600 text-sm">Join a successful and growing bakery brand with 5+ years of experience</p>
              </Card>
              <Card className="text-center p-6 border-2 border-blue-200 hover:shadow-xl transition">
                <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Brand Recognition</h3>
                <p className="text-gray-600 text-sm">Benefit from our established brand name and customer loyalty</p>
              </Card>
              <Card className="text-center p-6 border-2 border-blue-200 hover:shadow-xl transition">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Complete Support</h3>
                <p className="text-gray-600 text-sm">Get training, marketing support, and operational guidance</p>
              </Card>
              <Card className="text-center p-6 border-2 border-blue-200 hover:shadow-xl transition">
                <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">High ROI</h3>
                <p className="text-gray-600 text-sm">Attractive profit margins with proven revenue models</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Partnership Benefits */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Partnership Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Franchise Opportunities</h3>
                    <p className="text-gray-600">Open your own Mr. COCO Bakery outlet in your city</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Bulk Supply Partnership</h3>
                    <p className="text-gray-600">Become our distributor for corporate and event orders</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Ingredient Sourcing</h3>
                    <p className="text-gray-600">Supply quality baking ingredients and materials</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Decoration Partnership</h3>
                    <p className="text-gray-600">Collaborate on event decoration services</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Technology Integration</h3>
                    <p className="text-gray-600">Provide tech solutions for our operations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Marketing Collaboration</h3>
                    <p className="text-gray-600">Joint marketing and promotional activities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Get in Touch</h2>
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {contactNumbers.map((contact, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <a
                      href={`tel:${contact.number}`}
                      className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 px-4 py-3 rounded-lg border-2 border-blue-200 transition"
                    >
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-sm">{contact.display}</span>
                    </a>
                    <a
                      href={`https://wa.me/${contact.number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi, I am interested in partnering with Mr. COCO Bakery')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-semibold text-sm">WhatsApp</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Inquiry Form */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="border-2 border-blue-200">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Partnership Inquiry Form</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      required
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="Enter your business name"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Contact Person *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Contact number"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Business email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Your city"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="businessType">Partnership Interest *</Label>
                    <select
                      id="businessType"
                      required
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select partnership type</option>
                      <option value="franchise">Franchise Opportunity</option>
                      <option value="bulk-supply">Bulk Supply Partnership</option>
                      <option value="ingredient-supplier">Ingredient Supplier</option>
                      <option value="decoration">Decoration Partnership</option>
                      <option value="technology">Technology Integration</option>
                      <option value="marketing">Marketing Collaboration</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="message">Tell Us More</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your business and partnership proposal..."
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                  >
                    {loading ? 'Submitting...' : 'Submit Partnership Inquiry'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
