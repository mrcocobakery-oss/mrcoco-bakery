'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ShoppingBag, Wallet, Award, Gift, Heart, Package, TrendingUp, ArrowRight, MapPin } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    { icon: ShoppingBag, label: 'Total Orders', value: '0', color: 'pink', href: '/dashboard/orders' },
    { icon: Wallet, label: 'Wallet Balance', value: `₹${user?.walletBalance || 0}`, color: 'green', href: '/dashboard/wallet' },
    { icon: Award, label: 'Loyalty Points', value: user?.loyaltyPoints || 0, color: 'yellow', href: '/dashboard/loyalty' },
    { icon: Heart, label: 'Wishlist Items', value: '0', color: 'red', href: '/dashboard/wishlist' },
  ]

  const quickActions = [
    { icon: ShoppingBag, label: 'Browse Products', href: '/products', color: 'pink' },
    { icon: Package, label: 'Track Order', href: '/dashboard/orders', color: 'blue' },
    { icon: MapPin, label: 'Manage Addresses', href: '/dashboard/addresses', color: 'green' },
    { icon: Gift, label: 'Refer & Earn', href: '/dashboard/referrals', color: 'purple' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-800 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold font-serif mb-2">Welcome back, {user?.name}! 🎂</h1>
        <p className="text-pink-100">Manage your orders, track deliveries, and earn rewards</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="border-2 border-pink-100 hover:border-pink-400 hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-2 border-pink-200">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-pink-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.label} href={action.href}>
                  <Button variant="outline" className="w-full h-auto p-4 justify-between hover:bg-pink-50 hover:border-pink-400">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-${action.color}-600`} />
                      </div>
                      <span className="font-medium">{action.label}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </Button>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Referral Card */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Gift className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-green-900 mb-1">Your Referral Code</h3>
              <p className="text-2xl font-bold text-green-700 tracking-wider">{user?.referralCode}</p>
              <p className="text-sm text-green-600 mt-1">Share with friends and earn rewards!</p>
            </div>
            <Link href="/dashboard/referrals">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Learn More
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders - Placeholder */}
      <Card className="border-2 border-pink-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-serif text-pink-900">Recent Orders</CardTitle>
            <Link href="/dashboard/orders">
              <Button variant="ghost" className="text-pink-600 hover:text-pink-700">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No orders yet</p>
            <Link href="/products">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                Start Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
