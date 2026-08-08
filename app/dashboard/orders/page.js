'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Package, Search, Filter, ChevronLeft, ChevronRight, X, Calendar, ShoppingBag, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import Image from 'next/image'

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancellationReason, setCancellationReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 0 })

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user, page, statusFilter, search])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        status: statusFilter,
        ...(search && { search })
      })

      const response = await fetch(`/api/user/orders?${params}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
        setPagination(data.pagination)
      } else {
        toast.error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!cancellationReason.trim()) {
      toast.error('Please provide a reason for cancellation')
      return
    }

    try {
      setCancelling(true)
      const response = await fetch(`/api/user/orders/${selectedOrder._id}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason: cancellationReason })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        if (data.refundAmount > 0) {
          toast.success(`₹${data.refundAmount} has been credited to your wallet`)
        }
        setCancelDialogOpen(false)
        setCancellationReason('')
        fetchOrders()
      } else {
        toast.error(data.error || 'Failed to cancel order')
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
      toast.error('Something went wrong')
    } finally {
      setCancelling(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const canCancelOrder = (order) => {
    if (order.status === 'cancelled' || order.status === 'delivered') {
      return false
    }

    const hasCakes = order.items.some(item => 
      item.category?.toLowerCase() === 'cakes' || 
      item.category?.toLowerCase() === 'cake'
    )

    if (hasCakes) {
      return false
    }

    const orderCreatedAt = new Date(order.createdAt)
    const now = new Date()
    const hoursSinceOrder = (now - orderCreatedAt) / (1000 * 60 * 60)

    return hoursSinceOrder <= 12
  }

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Package className="w-12 h-12 text-pink-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-pink-900 mb-2">My Orders</h1>
        <p className="text-gray-600">View and manage your order history</p>
      </div>

      {/* Filters */}
      <Card className="border-2 border-pink-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by Order ID or Product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
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

            {/* Clear Filters */}
            {(search || statusFilter !== 'all') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('')
                  setStatusFilter('all')
                  setPage(1)
                }}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card className="border-2 border-pink-200">
          <CardContent className="p-12">
            <div className="text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">
                {search || statusFilter !== 'all' 
                  ? 'Try adjusting your filters'
                  : 'Start shopping to see your orders here'}
              </p>
              <Link href="/products">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="border-2 border-pink-100 hover:border-pink-300 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-gray-900">Order #{order._id}</h3>
                      <Badge className={`${getStatusColor(order.status)} border`}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div>
                        <strong className="text-gray-900">₹{order.total}</strong>
                      </div>
                      <div className="col-span-2">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Product Images */}
                    <div className="flex gap-2 mt-3">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border-2 border-pink-100">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-16 h-16 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 font-semibold text-sm border-2 border-pink-200">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    <Link href={`/track-order?id=${order._id}`}>
                      <Button variant="outline" className="w-full border-pink-300 hover:bg-pink-50">
                        Track Order
                      </Button>
                    </Link>
                    
                    {canCancelOrder(order) && (
                      <Button
                        variant="outline"
                        className="w-full border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setSelectedOrder(order)
                          setCancelDialogOpen(true)
                        }}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {page} of {pagination.pages}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Cancel Order Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Cancel Order
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedOrder && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Order ID: <strong>{selectedOrder._id}</strong></p>
                <p className="text-sm text-gray-600">Total Amount: <strong>₹{selectedOrder.total}</strong></p>
                {selectedOrder.paymentStatus === 'paid' && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ Refund will be credited to your wallet
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Reason for Cancellation *
              </label>
              <Textarea
                placeholder="Please tell us why you're cancelling this order..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false)
                setCancellationReason('')
              }}
              disabled={cancelling}
            >
              Keep Order
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleCancelOrder}
              disabled={cancelling || !cancellationReason.trim()}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
