'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, DollarSign, ShoppingCart, Users, Package, MessageSquare, Mail, RefreshCw, CheckCircle, Clock } from 'lucide-react'
import Cookies from 'js-cookie'
import { toast } from 'sonner'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inquiriesStats, setInquiriesStats] = useState(null)

  useEffect(() => {
    fetchAnalytics()
    fetchInquiriesStats()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const adminToken = Cookies.get('admin_token')
      const response = await fetch('/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      })
      const data = await response.json()
      if (response.ok) {
        setAnalytics(data)
      } else {
        toast.error('Failed to fetch analytics')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  const fetchInquiriesStats = async () => {
    try {
      const response = await fetch('/api/contact')
      const data = await response.json()
      if (data.success) {
        const inquiries = data.inquiries || []
        setInquiriesStats({
          total: inquiries.length,
          new: inquiries.filter(i => i.status === 'new').length,
          inProgress: inquiries.filter(i => i.status === 'in-progress').length,
          resolved: inquiries.filter(i => i.status === 'resolved').length
        })
      }
    } catch (error) {
      console.error('Error fetching inquiries stats:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 p-8">
        <div className="text-center space-y-4">
          <Package className="w-20 h-20 text-pink-600 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Welcome to Mr. COCO Bakery Admin!</h2>
          <p className="text-gray-600 max-w-md">
            Your dashboard is ready! Start by adding products to your store.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full">
          <Card className="border-pink-200 hover:border-pink-400 transition">
            <CardContent className="pt-6 text-center">
              <Package className="w-10 h-10 text-pink-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Add Products</h3>
              <p className="text-sm text-gray-600 mb-4">Start by adding cakes, cookies, and other products</p>
              <Link href="/admin/products">
                <Button className="bg-pink-600 hover:bg-pink-700">Go to Products</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-pink-200 hover:border-pink-400 transition">
            <CardContent className="pt-6 text-center">
              <ShoppingCart className="w-10 h-10 text-pink-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">View Orders</h3>
              <p className="text-sm text-gray-600 mb-4">Manage customer orders when they start coming in</p>
              <Link href="/admin/orders">
                <Button variant="outline" className="border-pink-600 text-pink-600">View Orders</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-pink-200 hover:border-pink-400 transition">
            <CardContent className="pt-6 text-center">
              <Users className="w-10 h-10 text-pink-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Manage Customers</h3>
              <p className="text-sm text-gray-600 mb-4">Track customer information and orders</p>
              <Link href="/admin/customers">
                <Button variant="outline" className="border-pink-600 text-pink-600">View Customers</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <Button variant="ghost" onClick={fetchAnalytics} className="text-pink-600">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const { stats, ordersByStatus, revenueTrend, topProducts } = analytics

  // Prepare data for pie chart
  const statusData = [
    { name: 'Pending', value: ordersByStatus.pending, color: '#fbbf24' },
    { name: 'Processing', value: ordersByStatus.processing, color: '#3b82f6' },
    { name: 'Shipped', value: ordersByStatus.shipped, color: '#a855f7' },
    { name: 'Delivered', value: ordersByStatus.delivered, color: '#10b981' },
    { name: 'Cancelled', value: ordersByStatus.cancelled, color: '#ef4444' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your business performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-pink-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <h3 className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</h3>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.totalOrders}</h3>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +8% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</h3>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +15% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <h3 className="text-3xl font-bold text-gray-900">₹{stats.avgOrderValue}</h3>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +5% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Inquiries Widget */}
      {inquiriesStats && (
        <Card className="border-2 border-pink-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-pink-600" />
                Contact Inquiries
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">Customer inquiries overview</p>
            </div>
            <Link href="/admin/contact-inquiries">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-lg border border-pink-100">
                <div className="flex items-center justify-between mb-2">
                  <MessageSquare className="w-8 h-8 text-pink-600 opacity-80" />
                  <span className="text-xs text-gray-500">Total</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{inquiriesStats.total}</p>
                <p className="text-xs text-gray-600 mt-1">All inquiries</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <Mail className="w-8 h-8 text-blue-600 opacity-80" />
                  <span className="text-xs text-gray-500">New</span>
                </div>
                <p className="text-3xl font-bold text-blue-900">{inquiriesStats.new}</p>
                <p className="text-xs text-gray-600 mt-1">Needs attention</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-white p-4 rounded-lg border border-yellow-100">
                <div className="flex items-center justify-between mb-2">
                  <RefreshCw className="w-8 h-8 text-yellow-600 opacity-80" />
                  <span className="text-xs text-gray-500">Processing</span>
                </div>
                <p className="text-3xl font-bold text-yellow-900">{inquiriesStats.inProgress}</p>
                <p className="text-xs text-gray-600 mt-1">In progress</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-8 h-8 text-green-600 opacity-80" />
                  <span className="text-xs text-gray-500">Done</span>
                </div>
                <p className="text-3xl font-bold text-green-900">{inquiriesStats.resolved}</p>
                <p className="text-xs text-gray-600 mt-1">Resolved</p>
              </div>
            </div>
            
            {inquiriesStats.new > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <p className="text-sm text-blue-900">
                    You have <strong>{inquiriesStats.new}</strong> new {inquiriesStats.new === 1 ? 'inquiry' : 'inquiries'} waiting for response
                  </p>
                </div>
                <Link href="/admin/contact-inquiries">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Respond Now
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#DB2777" strokeWidth={2} name="Revenue (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#3b82f6" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Products by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#DB2777" name="Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-900">{ordersByStatus.pending}</div>
              <div className="text-sm text-yellow-700">Pending Orders</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">{ordersByStatus.processing}</div>
              <div className="text-sm text-blue-700">Processing</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">{ordersByStatus.shipped}</div>
              <div className="text-sm text-purple-700">Shipped</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">{ordersByStatus.delivered}</div>
              <div className="text-sm text-green-700">Delivered</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-900">{ordersByStatus.cancelled}</div>
              <div className="text-sm text-red-700">Cancelled</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
