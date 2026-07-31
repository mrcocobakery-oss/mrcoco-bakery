'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Mail, Phone, Calendar, MessageSquare, Search, RefreshCw, Eye } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactInquiriesPage() {
  const [inquiries, setInquiries] = useState([])
  const [filteredInquiries, setFilteredInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    fetchInquiries()
  }, [])

  useEffect(() => {
    filterInquiries()
  }, [inquiries, statusFilter, searchQuery])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/contact')
      const data = await response.json()
      
      if (data.success) {
        setInquiries(data.inquiries || [])
      } else {
        toast.error('Failed to load inquiries')
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error)
      toast.error('Failed to load inquiries')
    } finally {
      setLoading(false)
    }
  }

  const filterInquiries = () => {
    let filtered = inquiries

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(inq => inq.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(inq => 
        inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredInquiries(filtered)
  }

  const updateStatus = async (inquiryId, newStatus) => {
    try {
      const response = await fetch('/api/contact/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiryId, status: newStatus })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Status updated successfully')
        fetchInquiries()
        setShowDetailModal(false)
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'resolved': 'bg-green-100 text-green-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-pink-900">Contact Inquiries</h1>
          <p className="text-gray-600 mt-1">Manage customer contact form submissions</p>
        </div>
        <Button onClick={fetchInquiries} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="border-2 border-pink-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-pink-900">{inquiries.length}</p>
              </div>
              <MessageSquare className="w-10 h-10 text-pink-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New</p>
                <p className="text-2xl font-bold text-blue-900">
                  {inquiries.filter(i => i.status === 'new').length}
                </p>
              </div>
              <Mail className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {inquiries.filter(i => i.status === 'in-progress').length}
                </p>
              </div>
              <RefreshCw className="w-10 h-10 text-yellow-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-900">
                  {inquiries.filter(i => i.status === 'resolved').length}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-2 border-pink-100">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Filter by Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inquiries Table */}
      <Card className="border-2 border-pink-100">
        <CardHeader>
          <CardTitle>Inquiries ({filteredInquiries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-pink-600" />
              <p className="text-gray-600 mt-2">Loading inquiries...</p>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No inquiries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Contact</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Subject</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(inquiry.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{inquiry.name}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-col gap-1">
                          <a href={`mailto:${inquiry.email}`} className="text-pink-600 hover:underline flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {inquiry.email}
                          </a>
                          <a href={`tel:${inquiry.phone}`} className="text-pink-600 hover:underline flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {inquiry.phone}
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <p className="line-clamp-2">{inquiry.subject}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={getStatusBadge(inquiry.status)}>
                          {inquiry.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedInquiry(inquiry)
                            setShowDetailModal(true)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-base font-semibold">{selectedInquiry.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusBadge(selectedInquiry.status)}>
                      {selectedInquiry.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-base">
                  <a href={`mailto:${selectedInquiry.email}`} className="text-pink-600 hover:underline">
                    {selectedInquiry.email}
                  </a>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-base">
                  <a href={`tel:${selectedInquiry.phone}`} className="text-pink-600 hover:underline">
                    {selectedInquiry.phone}
                  </a>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Subject</label>
                <p className="text-base font-semibold">{selectedInquiry.subject}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Message</label>
                <p className="text-base bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                  {selectedInquiry.message}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Received On</label>
                <p className="text-base">{formatDate(selectedInquiry.createdAt)}</p>
              </div>

              <div className="border-t pt-4">
                <label className="text-sm font-medium text-gray-600 block mb-2">Update Status</label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={selectedInquiry.status === 'new' ? 'default' : 'outline'}
                    onClick={() => updateStatus(selectedInquiry._id, 'new')}
                    className="flex-1"
                  >
                    New
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedInquiry.status === 'in-progress' ? 'default' : 'outline'}
                    onClick={() => updateStatus(selectedInquiry._id, 'in-progress')}
                    className="flex-1"
                  >
                    In Progress
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedInquiry.status === 'resolved' ? 'default' : 'outline'}
                    onClick={() => updateStatus(selectedInquiry._id, 'resolved')}
                    className="flex-1"
                  >
                    Resolved
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
