'use client'

import { useState } from 'react'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Package, CheckCircle, Clock, Truck, Box, PackageCheck } from 'lucide-react'
import { toast } from 'sonner'

export default function TrackOrderPage() {
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchData, setSearchData] = useState({
    orderId: '',
    phone: ''
  })

  const orderStatuses = [
    { key: 'pending', label: 'Pending Acceptance', icon: Clock },
    { key: 'accepted', label: 'Order Accepted', icon: CheckCircle },
    { key: 'preparing', label: 'Preparing', icon: Package },
    { key: 'finished', label: 'Finished Preparing', icon: PackageCheck },
    { key: 'packing', label: 'Packing', icon: Box },
    { key: 'dispatched', label: 'Dispatched', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle }
  ]

  const handleTrack = async (e) => {
    e.preventDefault()
    
    if (!searchData.orderId || !searchData.phone) {
      toast.error('Please enter Order ID and Phone Number')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch(`/api/track-order?orderId=${searchData.orderId}&phone=${searchData.phone}`)
      const data = await response.json()
      
      if (response.ok && data.order) {
        setOrderDetails(data.order)
      } else {
        toast.error(data.error || 'Order not found')
        setOrderDetails(null)
      }
    } catch (error) {
      toast.error('Error tracking order. Please try again.')
      setOrderDetails(null)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIndex = (status) => {
    return orderStatuses.findIndex(s => s.key === status)
  }

  const currentStatusIndex = orderDetails ? getStatusIndex(orderDetails.status) : -1

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Track Your Order</h1>
            <p className="text-gray-600">Enter your order details to track your delivery</p>
          </div>

          {/* Search Form */}
          <Card className="mb-8 border-2 border-pink-200">
            <CardContent className="p-6">
              <form onSubmit={handleTrack} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="orderId">Order ID *</Label>
                    <Input
                      id="orderId"
                      required
                      value={searchData.orderId}
                      onChange={(e) => setSearchData({ ...searchData, orderId: e.target.value })}
                      placeholder="e.g., ORD123456"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={searchData.phone}
                      onChange={(e) => setSearchData({ ...searchData, phone: e.target.value })}
                      placeholder="Enter registered phone"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-lg py-6"
                >
                  {loading ? 'Tracking...' : 'Track Order'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Details */}
          {orderDetails && (
            <>
              {/* Order Info */}
              <Card className="mb-6 border-2 border-gray-200">
                <CardHeader className="bg-gray-50">
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-semibold">{orderDetails.orderId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-semibold">{new Date(orderDetails.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-semibold">₹{orderDetails.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Status Timeline */}
              <Card className="border-2 border-pink-200">
                <CardHeader className="bg-pink-50">
                  <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {orderStatuses.map((status, index) => {
                      const StatusIcon = status.icon
                      const isCompleted = index <= currentStatusIndex
                      const isCurrent = index === currentStatusIndex
                      
                      return (
                        <div key={status.key} className="relative">
                          {index !== orderStatuses.length - 1 && (
                            <div
                              className={`absolute left-6 top-12 w-0.5 h-12 ${
                                isCompleted ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                            />
                          )}
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isCompleted
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 text-gray-500'
                              } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}
                            >
                              <StatusIcon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 pt-2">
                              <h3
                                className={`font-semibold ${
                                  isCompleted ? 'text-gray-800' : 'text-gray-400'
                                }`}
                              >
                                {status.label}
                              </h3>
                              {isCurrent && (
                                <p className="text-sm text-green-600 font-medium mt-1">
                                  Current Status
                                </p>
                              )}
                            </div>
                            {isCompleted && (
                              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-2" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Help Section */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Need Help?</h3>
            <p className="text-gray-700 mb-3">
              If you have any questions about your order, please contact us:
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => window.open('tel:+918447655399')}>
                📞 Call Us
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    'https://wa.me/918447655399?text=Hi, I need help tracking my order',
                    '_blank'
                  )
                }
              >
                💬 WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
