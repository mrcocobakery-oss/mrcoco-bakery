'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, Eye, Ticket } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0
  })

  const [recentOrders, setRecentOrders] = useState([])
  const [topProducts, setTopProducts] = useState([])

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      todayRevenue: 12450,
      weekRevenue: 78900,
      monthRevenue: 342100,
      totalOrders: 156,
      totalCustomers: 89,
      totalProducts: 45
    })

    setRecentOrders([
      { id: 'MRC001', customer: 'Priya Sharma', amount: 1299, status: 'Pending', date: '2025-06-20' },
      { id: 'MRC002', customer: 'Rajesh Kumar', amount: 899, status: 'Processing', date: '2025-06-20' },
      { id: 'MRC003', customer: 'Anita Desai', amount: 1599, status: 'Delivered', date: '2025-06-19' },
    ])

    setTopProducts([
      { name: 'Chocolate Truffle Cake', sales: 45, revenue: 40455 },
      { name: 'Red Velvet Cake', sales: 38, revenue: 30362 },
      { name: 'Premium Butter Cookies', sales: 67, revenue: 26733 },
    ])
  }, [])

  const statCards = [
    { title: "Today's Revenue", value: `₹${stats.todayRevenue.toLocaleString()}`, icon: DollarSign, color: 'green', change: '+12%' },
    { title: "Week's Revenue", value: `₹${stats.weekRevenue.toLocaleString()}`, icon: TrendingUp, color: 'blue', change: '+8%' },
    { title: "Month's Revenue", value: `₹${stats.monthRevenue.toLocaleString()}`, icon: DollarSign, color: 'purple', change: '+15%' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'pink', change: '+23' },
    { title: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'orange', change: '+12' },
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'indigo', change: '+5' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Selling Products</CardTitle>
            <Link href="/admin/products">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-pink-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} sales</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">₹{product.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/products/add">
              <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                <Package className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Orders
              </Button>
            </Link>
            <Link href="/admin/coupons">
              <Button variant="outline" className="w-full">
                <Ticket className="w-4 h-4 mr-2" />
                Add Coupon
              </Button>
            </Link>
            <Link href="/admin/customers">
              <Button variant="outline" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                View Customers
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
