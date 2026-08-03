'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Phone, Clock, Calendar, BookOpen, Award } from 'lucide-react'
import { toast } from 'sonner'

export default function BakingCoursePage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    courseInterest: '',
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
          type: 'baking-course'
        })
      })

      if (response.ok) {
        toast.success('Query submitted successfully! We will contact you soon.')
        setFormData({ name: '', email: '', phone: '', courseInterest: '', message: '' })
      } else {
        toast.error('Failed to submit query. Please try again.')
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
        <div className="relative h-96 bg-gradient-to-r from-orange-400 to-pink-500">
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">Professional Baking Courses</h1>
              <p className="text-2xl">Learn from Expert Bakers at Mr. COCO Bakery</p>
              <p className="text-sm mt-4 opacity-90">Banner image can be managed from admin panel</p>
            </div>
          </div>
        </div>

        {/* Course Highlights */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Our Courses?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center p-6 border-2 border-pink-200 hover:shadow-lg transition">
                <Award className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Expert Instructors</h3>
                <p className="text-gray-600 text-sm">Learn from experienced professional bakers</p>
              </Card>
              <Card className="text-center p-6 border-2 border-pink-200 hover:shadow-lg transition">
                <BookOpen className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Hands-on Training</h3>
                <p className="text-gray-600 text-sm">Practical sessions with real equipment</p>
              </Card>
              <Card className="text-center p-6 border-2 border-pink-200 hover:shadow-lg transition">
                <Calendar className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Flexible Batches</h3>
                <p className="text-gray-600 text-sm">Weekend and weekday batches available</p>
              </Card>
              <Card className="text-center p-6 border-2 border-pink-200 hover:shadow-lg transition">
                <Clock className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Certificate</h3>
                <p className="text-gray-600 text-sm">Get certified upon course completion</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Available Courses */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Beginner Course */}
              <Card className="border-2 border-pink-200">
                <CardHeader className="bg-pink-50">
                  <CardTitle className="text-2xl text-pink-900">Beginner Baking Course</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Duration</p>
                      <p className="text-gray-600">4 Weeks (12 Sessions)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Next Batch</p>
                      <p className="text-gray-600">Starting March 15, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Course Content</p>
                      <ul className="text-gray-600 text-sm space-y-1 mt-2">
                        <li>• Basic Baking Techniques</li>
                        <li>• Simple Cakes & Cupcakes</li>
                        <li>• Cookies & Biscuits</li>
                        <li>• Basic Frosting & Decoration</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Course */}
              <Card className="border-2 border-purple-200">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="text-2xl text-purple-900">Advanced Baking Course</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Duration</p>
                      <p className="text-gray-600">6 Weeks (18 Sessions)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Next Batch</p>
                      <p className="text-gray-600">Starting April 1, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Course Content</p>
                      <ul className="text-gray-600 text-sm space-y-1 mt-2">
                        <li>• Advanced Cake Techniques</li>
                        <li>• Fondant Work & Sugar Art</li>
                        <li>• French Pastries</li>
                        <li>• Wedding Cake Design</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <p className="text-center text-gray-500 mt-8 text-sm">
              All course details are manageable from admin panel
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Contact Us</h2>
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
                      href={`https://wa.me/${contact.number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi, I want to know about baking courses')}`}
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

        {/* Query Form */}
        <section className="py-16 bg-pink-50">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="border-2 border-pink-200">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Inquire About Our Courses</h2>
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
                    <Label htmlFor="courseInterest">Course Interest *</Label>
                    <select
                      id="courseInterest"
                      required
                      value={formData.courseInterest}
                      onChange={(e) => setFormData({ ...formData, courseInterest: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select a course</option>
                      <option value="beginner">Beginner Baking Course</option>
                      <option value="advanced">Advanced Baking Course</option>
                      <option value="both">Both Courses</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="message">Your Query</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Any questions or special requirements..."
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-lg py-6"
                  >
                    {loading ? 'Submitting...' : 'Submit Query'}
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
