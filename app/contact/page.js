'use client'

import { useState } from 'react'
import { Header } from '@/components/navigation/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Mail, Clock, Send, Factory, Store } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      toast.success('Thank you! We will get back to you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      setIsSubmitting(false)
    }, 1000)
  }

  const locations = [
    {
      name: 'Factory Outlet - Teenpani',
      address: 'Teenpani, Haldwani, Uttarakhand',
      mapLink: 'https://maps.app.goo.gl/wnpt6HV19GTgh9KD9?g_st=ac',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3467.123456789012!2d79.52345678901234!3d29.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDA3JzI0LjQiTiA3OcKwMzEnMjQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin',
      icon: Factory,
      type: 'Factory Outlet',
      hours: 'Mon - Sun: 9:00 AM - 9:00 PM'
    },
    {
      name: 'Bakery & Restaurant - Rampur Road',
      address: 'Rampur Road, Haldwani, Uttarakhand',
      mapLink: 'https://maps.app.goo.gl/6rPSjJmcPVx183D49?g_st=ac',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3467.234567890123!2d79.53456789012345!3d29.23456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDE0JzA0LjQiTiA3OcKwMzInMDQuNCJF!5e0!3m2!1sen!2sin!4v1234567890124!5m2!1sen!2sin',
      icon: Store,
      type: 'Bakery & Restaurant',
      hours: 'Mon - Sun: 8:00 AM - 10:00 PM'
    }
  ]

  const contactInfo = [
    {
      icon: Phone,
      label: 'Phone Numbers',
      values: ['+91 8447655399', '+91 8979751914', '+91 7455065399'],
      href: 'tel:+918447655399'
    },
    {
      icon: Mail,
      label: 'Email Address',
      values: ['mrcocobakery@gmail.com'],
      href: 'mailto:mrcocobakery@gmail.com'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Get In Touch</h1>
          <p className="text-xl text-pink-100 max-w-2xl mx-auto">
            Visit our locations or reach out to us. We're here to make your celebrations sweeter!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <Card key={index} className="border-2 border-pink-100 hover:border-pink-300 transition">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-pink-100 p-3 rounded-lg">
                    <info.icon className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{info.label}</h3>
                    {info.values.map((value, idx) => (
                      <a
                        key={idx}
                        href={idx === 0 ? info.href : info.href.replace(info.values[0], value)}
                        className="block text-pink-600 hover:text-pink-700 font-medium"
                      >
                        {value}
                      </a>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Our Locations */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-serif text-pink-900 mb-2">Our Locations</h2>
            <p className="text-gray-600">Visit us at any of our two convenient locations</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {locations.map((location, index) => (
              <Card key={index} className="border-2 border-pink-100 overflow-hidden hover:shadow-xl transition">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-pink-600 p-2 rounded-lg">
                      <location.icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge className="bg-pink-600">{location.type}</Badge>
                  </div>
                  <CardTitle className="text-xl text-pink-900">{location.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Google Map Embed */}
                  <div className="w-full h-64 bg-gray-100">
                    <iframe
                      src={location.embedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={location.name}
                    />
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-gray-700">{location.address}</p>
                        <a
                          href={location.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-700 font-medium text-sm inline-flex items-center gap-1 mt-1"
                        >
                          Open in Google Maps →
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-pink-600" />
                      <p className="text-gray-700">{location.hours}</p>
                    </div>

                    <Button
                      asChild
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                    >
                      <a href={location.mapLink} target="_blank" rel="noopener noreferrer">
                        Get Directions
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-pink-100">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-serif text-pink-900">Send Us a Message</CardTitle>
              <p className="text-gray-600">Have a question or special request? We'd love to hear from you!</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="border-pink-200 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 XXXXX XXXXX"
                      className="border-pink-200 focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="border-pink-200 focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Custom Cake Order"
                    className="border-pink-200 focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    className="border-pink-200 focus:border-pink-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-pink-50 to-white border-2 border-pink-100 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-pink-900 mb-3">Need Immediate Assistance?</h3>
              <p className="text-gray-600 mb-4">
                For urgent inquiries or same-day orders, please call us directly or reach out via WhatsApp
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild className="bg-pink-600 hover:bg-pink-700">
                  <a href="tel:+918447655399">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
                  <a href="https://wa.me/918447655399" target="_blank" rel="noopener noreferrer">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
                  <Link href="/bulk-order">
                    Bulk Orders
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
