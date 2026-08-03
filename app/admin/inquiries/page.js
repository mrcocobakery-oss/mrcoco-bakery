'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, Package, MessageCircle, GraduationCap, 
  Handshake, Mail, Phone, Calendar, User 
} from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { useRouter } from 'next/navigation'

export default function InquiriesPage() {
  const { admin } = useAdmin()
  const router = useRouter()
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (!admin) {
      router.push('/admin/login')
      return
    }
    fetchInquiries()
  }, [admin, router])

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/inquiries')
      const data = await response.json()
      setInquiries(data.inquiries || [])
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'decoration':
        return <Package className="w-5 h-5" />
      case 'baking-course':
        return <GraduationCap className="w-5 h-5" />
      case 'partnership':
        return <Handshake className="w-5 h-5" />
      default:
        return <MessageCircle className="w-5 h-5" />
    }
  }

  const getTypeBadge = (type) => {
    const badges = {
      'decoration': { label: 'Decoration', color: 'bg-pink-100 text-pink-800' },
      'baking-course': { label: 'Baking Course', color: 'bg-orange-100 text-orange-800' },
      'partnership': { label: 'Partnership', color: 'bg-blue-100 text-blue-800' }
    }
    const badge = badges[type] || { label: type, color: 'bg-gray-100 text-gray-800' }
    return <Badge className={badge.color}>{badge.label}</Badge>
  }

  const filterInquiries = (type) => {
    if (type === 'all') return inquiries
    return inquiries.filter(inq => inq.type === type)
  }

  const getInquiryCounts = () => {
    return {
      all: inquiries.length,
      decoration: inquiries.filter(i => i.type === 'decoration').length,
      bakingCourse: inquiries.filter(i => i.type === 'baking-course').length,
      partnership: inquiries.filter(i => i.type === 'partnership').length
    }
  }

  const counts = getInquiryCounts()
  const filteredInquiries = filterInquiries(activeTab)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Inquiry Management</h1>
              <p className="text-gray-600">Manage all customer inquiries</p>
            </div>
          </div>
          <Button onClick={fetchInquiries} variant="outline">
            Refresh
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              All ({counts.all})
            </TabsTrigger>
            <TabsTrigger value="decoration" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Decoration ({counts.decoration})
            </TabsTrigger>
            <TabsTrigger value="baking-course" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Baking ({counts.bakingCourse})
            </TabsTrigger>
            <TabsTrigger value="partnership" className="flex items-center gap-2">
              <Handshake className="w-4 h-4" />
              Partnership ({counts.partnership})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredInquiries.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No inquiries yet</h3>
                  <p className="text-gray-500">New inquiries will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredInquiries.map((inquiry) => (
                  <Card key={inquiry._id} className="border-2 border-gray-200 hover:border-pink-300 transition">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-pink-50 rounded-lg">
                            {getTypeIcon(inquiry.type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{inquiry.name}</CardTitle>
                            {getTypeBadge(inquiry.type)}
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </div>
                          <div>{new Date(inquiry.createdAt).toLocaleTimeString()}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-pink-600" />
                          <a href={`tel:${inquiry.phone}`} className="text-blue-600 hover:underline">
                            {inquiry.phone}
                          </a>
                        </div>
                        {inquiry.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-pink-600" />
                            <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:underline">
                              {inquiry.email}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Type-specific fields */}
                      {inquiry.type === 'decoration' && (
                        <div className="bg-pink-50 p-3 rounded-lg space-y-1 text-sm">
                          {inquiry.eventType && <p><span className="font-semibold">Event:</span> {inquiry.eventType}</p>}
                          {inquiry.eventDate && <p><span className="font-semibold">Date:</span> {new Date(inquiry.eventDate).toLocaleDateString()}</p>}
                        </div>
                      )}

                      {inquiry.type === 'baking-course' && inquiry.courseInterest && (
                        <div className="bg-orange-50 p-3 rounded-lg text-sm">
                          <p><span className="font-semibold">Course Interest:</span> {inquiry.courseInterest}</p>
                        </div>
                      )}

                      {inquiry.type === 'partnership' && (
                        <div className="bg-blue-50 p-3 rounded-lg space-y-1 text-sm">
                          {inquiry.businessName && <p><span className="font-semibold">Business:</span> {inquiry.businessName}</p>}
                          {inquiry.city && <p><span className="font-semibold">City:</span> {inquiry.city}</p>}
                          {inquiry.businessType && <p><span className="font-semibold">Type:</span> {inquiry.businessType}</p>}
                        </div>
                      )}

                      {inquiry.message && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">{inquiry.message}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm"
                          onClick={() => window.open(`tel:${inquiry.phone}`)}
                          className="bg-pink-600 hover:bg-pink-700"
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          WhatsApp
                        </Button>
                        {inquiry.email && (
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`mailto:${inquiry.email}`)}
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
