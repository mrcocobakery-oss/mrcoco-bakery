'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Phone, Mail, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function DecorationServicesPage() {
  const [loading, setLoading] = useState(false)
  const [gallery, setGallery] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    message: ''
  })

  // Fetch gallery images
  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/admin/decoration-gallery')
      const data = await response.json()
      if (data.gallery) {
        setGallery(data.gallery)
      }
    } catch (error) {
      console.error('Failed to fetch gallery:', error)
    }
  }

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
          type: 'decoration'
        })
      })

      if (response.ok) {
        toast.success('Inquiry submitted successfully! We will contact you soon.')
        setFormData({ name: '', email: '', phone: '', eventType: '', eventDate: '', message: '' })
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
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Decoration Services</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Transform Your Events with Our Creative Decoration Services
            </p>
          </div>
        </div>

        {/* Photo Gallery Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Work Gallery</h2>
            
            {gallery.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {gallery.map((item) => (
                  <Card key={item._id} className="overflow-hidden hover:shadow-xl transition group">
                    <div className="relative h-64">
                      <img
                        src={item.imageUrl}
                        alt={item.title || 'Decoration'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      {item.title && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <h3 className="text-white font-semibold">{item.title}</h3>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Gallery images will appear here soon!</p>
                <p className="text-sm text-gray-400">Add images from admin panel → Decoration Gallery</p>
              </div>
            )}
          </div>
        </section>

        {/* About Our Work */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Experience & Expertise</h2>
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 mb-4">
                At Mr. COCO Bakery, we bring your events to life with our exceptional decoration services. 
                With years of experience in creating memorable celebrations, we specialize in transforming 
                ordinary spaces into extraordinary experiences.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Our team of creative designers understands that every event is unique. Whether it's a birthday 
                party, wedding, anniversary, corporate event, or any special occasion, we work closely with you 
                to understand your vision and bring it to reality.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <Card className="text-center p-6 border-2 border-pink-200">
                  <CheckCircle className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                  <h3 className="font-bold text-xl mb-2">500+ Events</h3>
                  <p className="text-gray-600">Successfully decorated</p>
                </Card>
                <Card className="text-center p-6 border-2 border-pink-200">
                  <CheckCircle className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                  <h3 className="font-bold text-xl mb-2">5+ Years</h3>
                  <p className="text-gray-600">Industry experience</p>
                </Card>
                <Card className="text-center p-6 border-2 border-pink-200">
                  <CheckCircle className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                  <h3 className="font-bold text-xl mb-2">100% Custom</h3>
                  <p className="text-gray-600">Personalized designs</p>
                </Card>
              </div>
              <p className="text-lg text-gray-700">
                We offer a complete range of decoration services including balloon decorations, floral arrangements, 
                theme-based setups, stage decorations, entrance decor, and much more. Using premium quality materials 
                and creative designs, we ensure that your event looks stunning from every angle.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-pink-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Get in Touch</h2>
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {contactNumbers.map((contact, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <a
                      href={`tel:${contact.number}`}
                      className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 px-4 py-3 rounded-lg border-2 border-pink-200 transition"
                    >
                      <Phone className="w-4 h-4 text-pink-600" />
                      <span className="font-semibold text-sm">{contact.display}</span>
                    </a>
                    <a
                      href={`https://wa.me/${contact.number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi, I need decoration services for my event')}`}
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

        {/* Inquiry Form */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="border-2 border-pink-200">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Send Us Your Inquiry</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
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
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventType">Event Type *</Label>
                    <Input
                      id="eventType"
                      required
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      placeholder="Birthday, Wedding, Anniversary, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventDate">Event Date</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Your Requirements</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your decoration requirements..."
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-lg py-6"
                  >
                    {loading ? 'Submitting...' : 'Submit Inquiry'}
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
