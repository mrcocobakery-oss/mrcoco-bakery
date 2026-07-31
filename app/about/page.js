'use client'

import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Users, Award, Target, MapPin, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">About Mr. COCO Bakery</h1>
          <p className="text-xl text-pink-100 max-w-2xl mx-auto">
            Keep It Simple, Keep It Tasty - Crafting Happiness Since Day One
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Company Story */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-2 border-pink-100">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold font-serif text-pink-900 mb-6 text-center">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Mr. COCO Bakery started with a simple dream - to bring joy to every celebration through delicious, handcrafted baked goods. What began as a small bakery in Haldwani has grown into a beloved destination for cakes, pastries, cookies, and more.
                </p>
                <p>
                  Our name "Mr. COCO" reflects our commitment to quality and creativity. Each product is made with premium ingredients, baked fresh daily, and crafted with love. From traditional favorites to innovative creations, we ensure every bite is a moment of happiness.
                </p>
                <p>
                  Today, we operate two locations in Haldwani - our Factory Outlet in Teenpani and our Bakery & Restaurant on Rampur Road. Whether you're celebrating a birthday, anniversary, or just treating yourself, we're here to make it special.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-serif text-pink-900 mb-8 text-center">Our Values & Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 border-pink-100 text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="font-bold text-lg text-pink-900 mb-2">Quality First</h3>
                <p className="text-gray-600 text-sm">
                  We use only the finest ingredients and maintain the highest standards in every product we create.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-pink-100 text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-pink-900 mb-2">Customer Focus</h3>
                <p className="text-gray-600 text-sm">
                  Your satisfaction is our priority. We listen, adapt, and go the extra mile to exceed expectations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-pink-100 text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg text-pink-900 mb-2">Excellence</h3>
                <p className="text-gray-600 text-sm">
                  From baking to service, we strive for excellence in everything we do, every single day.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-pink-100 text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-lg text-pink-900 mb-2">Innovation</h3>
                <p className="text-gray-600 text-sm">
                  We constantly innovate with new flavors, designs, and products to delight our customers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Our Locations */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-serif text-pink-900 mb-8 text-center">Visit Our Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-pink-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-pink-600" />
                  <h3 className="font-bold text-xl text-pink-900">Factory Outlet - Teenpani</h3>
                </div>
                <p className="text-gray-700 mb-3">Teenpani, Haldwani, Uttarakhand</p>
                <p className="text-gray-600 text-sm mb-4">Mon - Sun: 9:00 AM - 9:00 PM</p>
                <a href="https://maps.app.goo.gl/zqXRYavsKb4Ak4qk9" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    Get Directions
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card className="border-2 border-pink-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-pink-600" />
                  <h3 className="font-bold text-xl text-pink-900">Bakery & Restaurant</h3>
                </div>
                <p className="text-gray-700 mb-3">Rampur Road, Haldwani, Uttarakhand</p>
                <p className="text-gray-600 text-sm mb-4">Mon - Sun: 8:00 AM - 10:00 PM</p>
                <a href="https://maps.app.goo.gl/uMMgCgzYdX7CcBHf9" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    Get Directions
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact CTA */}
        <Card className="bg-gradient-to-r from-pink-50 to-white border-2 border-pink-100 max-w-3xl mx-auto">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-pink-900 mb-4">Have Questions?</h3>
            <p className="text-gray-700 mb-6">
              We'd love to hear from you! Get in touch for custom orders, bulk inquiries, or just to say hello.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-pink-600 hover:bg-pink-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </Link>
              <a href="tel:+918447655399">
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}
