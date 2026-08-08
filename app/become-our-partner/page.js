'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Download, Store, TrendingUp, Users, Award, Phone, Mail, MapPin } from 'lucide-react'
import { toast } from 'sonner'

export default function BecomeOurPartnerPage() {
  const [catalogue, setCatalogue] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    address: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCatalogue()
  }, [])

  const fetchCatalogue = async () => {
    try {
      const response = await fetch('/api/catalogue')
      const data = await response.json()
      if (data.success && data.catalogue) {
        setCatalogue(data.catalogue)
      }
    } catch (error) {
      console.error('Error fetching catalogue:', error)
    }
  }

  const handleDownloadCatalogue = () => {
    if (catalogue?.fileUrl) {
      // Create a temporary link and trigger download
      const link = document.createElement('a')
      link.href = catalogue.fileUrl
      link.download = catalogue.fileName || 'Mr-COCO-Bakery-Catalogue.pdf'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Catalogue download started!')
    } else {
      toast.error('Catalogue not available')
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          type: 'partnership',
          subject: `Partnership Inquiry - ${formData.businessName}`
        })
      })

      if (response.ok) {
        toast.success('Your inquiry has been submitted! We will contact you soon.')
        setFormData({
          name: '',
          businessName: '',
          email: '',
          phone: '',
          address: '',
          message: ''
        })
      } else {
        toast.error('Failed to submit inquiry. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error)
      toast.error('Failed to submit inquiry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      <Header />

      {/* Hero Section with Download Catalogue */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">
              Become Our Partner
            </h1>
            <p className="text-pink-100 text-lg mb-6">
              Join hands with Mr. COCO Bakery and grow your business with us
            </p>
            
            {/* Download Catalogue Button */}
            {catalogue && (
              <Button
                onClick={handleDownloadCatalogue}
                className="bg-white text-pink-600 hover:bg-pink-50 font-semibold text-lg px-8 py-6 h-auto"
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Catalogue
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-serif text-center text-pink-900 mb-12">
            Why Partner With Us?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 border-pink-200 hover:shadow-xl transition">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Premium Products</h3>
                <p className="text-gray-600 text-sm">
                  100% Pure Veg & Eggless products of highest quality
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-pink-200 hover:shadow-xl transition">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Growing Business</h3>
                <p className="text-gray-600 text-sm">
                  Be part of a rapidly expanding bakery brand
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-pink-200 hover:shadow-xl transition">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Full Support</h3>
                <p className="text-gray-600 text-sm">
                  Complete training and operational support
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-pink-200 hover:shadow-xl transition">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Proven Model</h3>
                <p className="text-gray-600 text-sm">
                  Tested business model with guaranteed success
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partnership Inquiry Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-serif text-center text-pink-900 mb-4">
              Partnership Inquiry Form
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Fill out the form below and our team will get back to you within 24-48 hours
            </p>

            <Card className="border-2 border-pink-200">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your business name"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Location/Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="City, State"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message / Requirements</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Tell us about your requirements, location preferences, investment capacity, etc."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-lg py-6 h-auto"
                  >
                    {submitting ? 'Submitting...' : 'Submit Partnership Inquiry'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold font-serif text-center text-pink-900 mb-8">
              Get In Touch
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-pink-200">
                <CardContent className="p-6 text-center">
                  <Phone className="w-8 h-8 text-pink-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="text-sm text-gray-600">+91 8447655399</p>
                  <p className="text-sm text-gray-600">+91 8979751914</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-pink-200">
                <CardContent className="p-6 text-center">
                  <Mail className="w-8 h-8 text-pink-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-sm text-gray-600">mrcocobakery@gmail.com</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-pink-200">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-8 h-8 text-pink-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Visit Us</h3>
                  <p className="text-sm text-gray-600">Teenpani & Rampur Road</p>
                  <p className="text-sm text-gray-600">Haldwani</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
