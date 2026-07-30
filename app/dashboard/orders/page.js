'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Package, MapPin, Calendar, Eye, Search, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, statusFilter, searchQuery])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?userId=${user?._id || ''}`)
      const data = await response.json()
      if (response.ok) {
        setOrders(data.orders || [])
      } else {
        toast.error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = [...orders]
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter)
    }
    
    if (searchQuery) {
      filtered = filtered.filter(o => 
        o._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.items?.some(item => item.productName.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
    setFilteredOrders(filtered)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Processing', className: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Shipped', className: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' }
    }
    const config = statusConfig[status] || statusConfig.pending
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const openOrderDetails = (order) => {
    setSelectedOrder(order)
    setShowDetailsDialog(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold font-serif text-pink-900">My Orders</h1>
        <p className="text-gray-600 mt-1">Track and manage your orders</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-4">Start shopping to see your orders here</p>
              <Link href="/products">
                <Button className="bg-pink-600 hover:bg-pink-700">Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order._id} className="border-2 border-pink-100 hover:border-pink-300 transition">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-gray-600">#{order._id?.substring(0, 8)}</span>
                      {getStatusBadge(order.status)}
                      {order.expressDelivery && (
                        <Badge variant="secondary" className="bg-pink-100 text-pink-800">Express</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Ordered on {formatDate(order.createdAt)}</p>
                    <p className="text-sm text-gray-600">{order.items?.length || 0} item(s) • Total: ₹{order.total}</p>
                    {order.deliveryDate && (
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        Delivery: {order.deliveryDate}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openOrderDetails(order)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-xs text-gray-500">Order ID</div>
                  <div className="font-mono text-sm">#{selectedOrder._id}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>
              </div>

              <Card>
                <CardHeader><CardTitle className="text-lg">Items</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded">
                      {item.productImage && (
                        <img src={item.productImage} alt={item.productName} className="w-16 h-16 rounded object-cover" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{item.price}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-lg">Delivery Address</CardTitle></CardHeader>
                <CardContent>
                  <p>{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.address}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>
                  <p className="text-sm text-gray-600 mt-2">Phone: {selectedOrder.customerPhone}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Payment Summary</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`/api/orders/invoice?orderId=${selectedOrder._id}`, '_blank')}
                      className="ml-auto"
                    >
                      Download Invoice
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between"><span>Subtotal:</span><span>₹{selectedOrder.subtotal}</span></div>
                  <div className="flex justify-between"><span>Delivery Fee:</span><span>₹{selectedOrder.deliveryFee || 0}</span></div>
                  {selectedOrder.expressDeliveryFee > 0 && (
                    <div className="flex justify-between text-pink-600"><span>Express Delivery:</span><span>₹{selectedOrder.expressDeliveryFee}</span></div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total:</span><span>₹{selectedOrder.total}</span></div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
