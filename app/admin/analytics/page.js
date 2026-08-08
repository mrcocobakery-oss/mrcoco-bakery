'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Award, Users, TrendingUp, IndianRupee, Gift, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalPointsDistributed: 0,
    totalPointsRedeemed: 0,
    netPoints: 0,
    totalReferralEarnings: 0,
    totalReferrals: 0,
    topCustomersByPoints: [],
    topReferrers: [],
    recentLoyaltyTransactions: [],
    recentReferrals: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/analytics/loyalty-referrals', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      } else {
        toast.error('Failed to fetch analytics')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Award className="w-12 h-12 text-pink-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-pink-900 mb-2">Loyalty & Referral Analytics</h1>
        <p className="text-gray-600">Track loyalty points and referral program performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Points Distributed */}
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Points Distributed</p>
                <p className="text-3xl font-bold text-green-600">
                  {analytics.totalPointsDistributed.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Points Redeemed */}
        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <ArrowDownRight className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Points Redeemed</p>
                <p className="text-3xl font-bold text-red-600">
                  {analytics.totalPointsRedeemed.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Referrals */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Referrals</p>
                <p className="text-3xl font-bold text-blue-600">
                  {analytics.totalReferrals}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral Earnings */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <IndianRupee className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Referral Earnings</p>
                <p className="text-3xl font-bold text-purple-600">
                  ₹{analytics.totalReferralEarnings.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers & Referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers by Points */}
        <Card className="border-2 border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-pink-600" />
              Top Customers by Loyalty Points
            </CardTitle>
            <CardDescription>Customers with highest loyalty points balance</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topCustomersByPoints.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No data available</p>
            ) : (
              <div className="space-y-3">
                {analytics.topCustomersByPoints.map((customer, index) => (
                  <div key={customer._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-pink-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-yellow-600">{customer.loyaltyPoints} pts</p>
                      <p className="text-xs text-gray-500">= ₹{customer.loyaltyPoints}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card className="border-2 border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-pink-600" />
              Top Referrers
            </CardTitle>
            <CardDescription>Users who referred the most friends</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topReferrers.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No data available</p>
            ) : (
              <div className="space-y-3">
                {analytics.topReferrers.map((referrer, index) => (
                  <div key={referrer._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-pink-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{referrer.name}</p>
                        <p className="text-xs text-gray-500">{referrer.referralCode}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{referrer.referralCount} friends</p>
                      <p className="text-xs text-gray-500">₹{referrer.totalEarnings} earned</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-2 border-pink-200">
        <CardHeader>
          <CardTitle>Recent Loyalty Transactions</CardTitle>
          <CardDescription>Latest loyalty points activities</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.recentLoyaltyTransactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No transactions yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.recentLoyaltyTransactions.map((txn) => (
                    <TableRow key={txn._id}>
                      <TableCell className="font-medium">{txn.userName}</TableCell>
                      <TableCell>
                        <Badge className={txn.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {txn.type === 'credit' ? 'Earned' : 'Redeemed'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{txn.description}</TableCell>
                      <TableCell className={`font-semibold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {txn.type === 'credit' ? '+' : '-'}{Math.abs(txn.loyaltyPoints || 0)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      <Card className="border-2 border-pink-200">
        <CardHeader>
          <CardTitle>Recent Referrals</CardTitle>
          <CardDescription>Latest referral signups</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.recentReferrals.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No referrals yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>New User</TableHead>
                    <TableHead>Referred By</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.recentReferrals.map((referral) => (
                    <TableRow key={referral._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{referral.newUserName}</p>
                          <p className="text-xs text-gray-500">{referral.newUserEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{referral.referrerName}</p>
                          <p className="text-xs text-gray-500">{referral.referralCode}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          +₹50
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
