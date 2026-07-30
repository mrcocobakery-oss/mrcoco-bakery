'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Search, Eye, Package, Calendar, Phone, MapPin, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import Cookies from 'js-cookie'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchQuery, statusFilter])

  const fetchOrders = async () => {
    try {
      const adminToken = Cookies.get('admin_token')
      const response = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })
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
    
    if (searchQuery) {
      filtered = filtered.filter(o => 
        o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerPhone?.includes(searchQuery) ||
        o._id?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter)
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

  const getPaymentStatusBadge = (status) => {
    if (status === 'paid') {
      return <Badge className="bg-green-100 text-green-800">Paid</Badge>
    } else if (status === 'failed') {
      return <Badge className="bg-red-100 text-red-800">Failed</Badge>
    }
    return <Badge variant="outline">Pending</Badge>
  }

  const openOrderDetails = (order) => {
    setSelectedOrder(order)
    setShowDetailsDialog(true)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(true)
    try {
      const adminToken = Cookies.get('admin_token')
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ orderId, status: newStatus })
      })

      if (response.ok) {
        toast.success('Order status updated successfully!')
        fetchOrders()
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus })
        }
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update order status')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to update order status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    )
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-500 mt-1">View and manage customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500 mt-1">Total Orders</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-500 mt-1">Pending</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.processing}</div>
              <div className="text-sm text-gray-500 mt-1">Processing</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.delivered}</div>
              <div className="text-sm text-gray-500 mt-1">Delivered</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, phone, or order ID..."
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
                <SelectItem value="all">All Statuses</SelectItem>
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

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-gray-600">
                          #{order._id?.substring(0, 8)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{order.items?.length || 0} item(s)</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">₹{order.total}</div>
                        {order.expressDelivery && (
                          <Badge variant="secondary" className="text-xs mt-1">Express</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{order.deliveryDate || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{order.city}, {order.pincode}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getPaymentStatusBadge(order.paymentStatus)}
                        <div className="text-xs text-gray-500 mt-1 capitalize">{order.paymentMethod}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openOrderDetails(order)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-xs text-gray-500">Order ID</div>
                  <div className="font-mono text-sm">#{selectedOrder._id}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Order Date</div>
                  <div className="text-sm">{formatDate(selectedOrder.createdAt)}</div>
                </div>
              </div>

              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><span className="font-medium">Name:</span> {selectedOrder.customerName}</div>
                  <div><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</div>
                  <div><span className="font-medium">Phone:</span> {selectedOrder.customerPhone}</div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>{selectedOrder.address}</div>
                  <div>{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</div>
                  {selectedOrder.deliveryDate && (
                    <div className="mt-3 p-3 bg-blue-50 rounded">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">Delivery Date:</span> {selectedOrder.deliveryDate}
                      </div>
                      {selectedOrder.deliveryTime && (
                        <div className="text-sm ml-6">Time: {selectedOrder.deliveryTime}</div>
                      )}
                      {selectedOrder.expressDelivery && (
                        <Badge className="mt-2 bg-pink-600">Express Delivery (2 hours)</Badge>
                      )}
                    </div>
                  )}
                  {selectedOrder.giftMessage && (
                    <div className="mt-3 p-3 bg-pink-50 rounded">
                      <div className="text-sm font-medium">Gift Message:</div>
                      <div className="text-sm text-gray-600">{selectedOrder.giftMessage}</div>
                    </div>
                  )}
                  {selectedOrder.specialInstructions && (
                    <div className="mt-2 p-3 bg-gray-50 rounded">
                      <div className="text-sm font-medium">Special Instructions:</div>
                      <div className="text-sm text-gray-600">{selectedOrder.specialInstructions}</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                        {item.productImage && (
                          <img src={item.productImage} alt={item.productName} className="w-16 h-16 rounded object-cover" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium">{item.productName}</div>
                          {item.weight && <div className="text-xs text-gray-500">{item.weight}</div>}
                          <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₹{item.price}</div>
                          <div className="text-xs text-gray-500">₹{item.price * item.quantity} total</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>₹{selectedOrder.deliveryFee || 0}</span>
                  </div>
                  {selectedOrder.expressDeliveryFee > 0 && (
                    <div className="flex justify-between text-pink-600">
                      <span>Express Delivery Fee:</span>
                      <span>₹{selectedOrder.expressDeliveryFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <span className="font-medium">Payment Status:</span>
                    {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Payment Method:</span>
                    <span className="capitalize">{selectedOrder.paymentMethod}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Update Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Update Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Select
                        value={selectedOrder.status}
                        onValueChange={(newStatus) => updateOrderStatus(selectedOrder._id, newStatus)}
                        disabled={updatingStatus}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-sm text-gray-500">
                      {updatingStatus && 'Updating...'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
