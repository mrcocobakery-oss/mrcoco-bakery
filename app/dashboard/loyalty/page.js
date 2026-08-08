'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Award, TrendingUp, Gift, Info } from 'lucide-react'
import { toast } from 'sonner'

export default function LoyaltyPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const loyaltyPoints = user?.loyaltyPoints || 0
  const pointsValue = loyaltyPoints // 100 points = ₹100

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Award className="w-12 h-12 text-pink-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading loyalty points...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-pink-900 mb-2">Loyalty Points</h1>
        <p className="text-gray-600">Earn points on every purchase and redeem for rewards</p>
      </div>

      {/* Points Balance */}
      <Card className="border-2 border-pink-200 bg-gradient-to-br from-yellow-50 to-white">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <Award className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Loyalty Points</p>
              <h2 className="text-4xl font-bold text-yellow-900">
                {loyaltyPoints.toLocaleString()} Points
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Worth ₹{pointsValue} in rewards
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="border-2 border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-serif text-pink-900">
            <Info className="w-6 h-6 text-pink-600" />
            How Loyalty Points Work
          </CardTitle>
          <CardDescription>Earn and redeem points with every order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Earning Points */}
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Earning Points
              </h3>
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">For every ₹100 spent</span>
                  <span className="font-bold text-green-600 text-lg">+10 Points</span>
                </div>
                <p className="text-sm text-gray-600">
                  Earn 10 loyalty points for every ₹100 spent on orders
                </p>
              </div>
            </div>

            {/* Redeeming Points */}
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-600" />
                Redeeming Points
              </h3>
              <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">100 Points</span>
                  <span className="font-bold text-pink-600 text-lg">= ₹100 Discount</span>
                </div>
                <p className="text-sm text-gray-600">
                  Use your points at checkout for discounts on any product
                </p>
              </div>
            </div>

            {/* Additional Benefits */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Additional Benefits</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Points never expire - save them for special occasions!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Earn bonus points during festive seasons and special promotions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Combine points with other offers and coupons</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Earning CTA */}
      {loyaltyPoints === 0 && (
        <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white">
          <CardContent className="p-6 text-center">
            <Award className="w-12 h-12 text-pink-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Start Earning Loyalty Points Today!
            </h3>
            <p className="text-gray-600 mb-4">
              Place your first order and start earning rewards
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
