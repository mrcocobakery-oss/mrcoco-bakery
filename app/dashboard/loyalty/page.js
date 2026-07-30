'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Award, Gift, Star, TrendingUp, ArrowLeft, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function LoyaltyPage() {
  const { user } = useAuth()
  const currentPoints = user?.loyaltyPoints || 0
  const nextTierPoints = 1000
  const progress = (currentPoints / nextTierPoints) * 100

  // Mock points history
  const pointsHistory = [
    { id: 1, type: 'earned', points: 50, description: 'Order #abc123', date: '2025-01-25' },
    { id: 2, type: 'earned', points: 100, description: 'Birthday bonus', date: '2025-01-20' },
    { id: 3, type: 'redeemed', points: 200, description: 'Discount on order', date: '2025-01-15' },
  ]

  // Redemption options
  const rewards = [
    { id: 1, name: '₹50 Off', points: 500, description: 'On orders above ₹500' },
    { id: 2, name: '₹100 Off', points: 1000, description: 'On orders above ₹1000' },
    { id: 3, name: 'Free Delivery', points: 300, description: 'On your next order' },
    { id: 4, name: '₹200 Off', points: 2000, description: 'On orders above ₹2000' },
  ]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
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
        <h1 className="text-3xl font-bold font-serif text-pink-900">Loyalty Points</h1>
        <p className="text-gray-600 mt-1">Earn points on every order and redeem rewards</p>
      </div>

      {/* Points Balance Card */}
      <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600 mb-2">Your Points</p>
              <h2 className="text-5xl font-bold text-yellow-900">{currentPoints}</h2>
            </div>
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center">
              <Award className="w-10 h-10 text-white" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress to Gold Tier</span>
              <span>{currentPoints} / {nextTierPoints} points</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* How to Earn */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            How to Earn Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Shop & Earn</h3>
              <p className="text-sm text-gray-600">Earn 1 point for every ₹10 spent</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Refer Friends</h3>
              <p className="text-sm text-gray-600">Get 500 points for each referral</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Special Days</h3>
              <p className="text-sm text-gray-600">Birthday & anniversary bonuses</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Redeem Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-600" />
            Redeem Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((reward) => (
              <div key={reward.id} className="p-4 border-2 rounded-lg hover:border-pink-300 transition">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">{reward.name}</h3>
                  <Badge variant="outline" className="text-yellow-900">{reward.points} pts</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                <Button
                  className="w-full"
                  variant={currentPoints >= reward.points ? 'default' : 'outline'}
                  disabled={currentPoints < reward.points}
                >
                  {currentPoints >= reward.points ? 'Redeem Now' : `Need ${reward.points - currentPoints} more points`}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Points History */}
      <Card>
        <CardHeader>
          <CardTitle>Points History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pointsHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No points history yet
              </div>
            ) : (
              pointsHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      entry.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {entry.type === 'earned' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <Gift className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{entry.description}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(entry.date)}
                      </p>
                    </div>
                  </div>
                  <p className={`font-bold text-lg ${
                    entry.type === 'earned' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {entry.type === 'earned' ? '+' : '-'}{entry.points} pts
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
