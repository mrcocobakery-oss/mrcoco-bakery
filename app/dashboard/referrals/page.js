'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Gift, Copy, Share2, Users, IndianRupee, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function ReferralsPage() {
  const { user } = useAuth()
  const [referralData, setReferralData] = useState({
    referralCode: '',
    referredUsers: [],
    totalEarnings: 0,
    referralCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (user) {
      fetchReferralData()
    }
  }, [user])

  const fetchReferralData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/referrals', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setReferralData(data)
      } else {
        toast.error('Failed to fetch referral data')
      }
    } catch (error) {
      console.error('Error fetching referral data:', error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralData.referralCode)
    setCopied(true)
    toast.success('Referral code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareWhatsApp = () => {
    const message = `Hey! Join Mr. COCO Bakery using my referral code ${referralData.referralCode} and get special offers! 🎂✨`
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Gift className="w-12 h-12 text-pink-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading referral data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-pink-900 mb-2">Refer & Earn</h1>
        <p className="text-gray-600">Invite friends and earn ₹50 for each successful referral</p>
      </div>

      {/* Referral Code Card */}
      <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Referral Code</h3>
            <div className="bg-white border-2 border-pink-300 rounded-lg p-4 mb-4 max-w-md mx-auto">
              <p className="text-3xl font-bold text-pink-600 font-mono">
                {referralData.referralCode || 'LOADING...'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={handleCopyCode}
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
              <Button
                onClick={handleShareWhatsApp}
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share on WhatsApp
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Earnings */}
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <IndianRupee className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{referralData.totalEarnings}
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
                <p className="text-sm text-gray-600 mb-1">Friends Referred</p>
                <p className="text-3xl font-bold text-blue-600">
                  {referralData.referralCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="border-2 border-pink-200">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-pink-900">How Referral Works</CardTitle>
          <CardDescription>Simple steps to earn rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-pink-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Share Your Code</h4>
                <p className="text-sm text-gray-600">
                  Share your unique referral code with friends and family
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-pink-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Friend Signs Up</h4>
                <p className="text-sm text-gray-600">
                  Your friend creates an account using your referral code
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-pink-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Earn Rewards</h4>
                <p className="text-sm text-gray-600">
                  Get ₹50 credited to your wallet instantly!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referred Friends List */}
      {referralData.referredUsers.length > 0 && (
        <Card className="border-2 border-pink-200">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-pink-900">Your Referrals</CardTitle>
            <CardDescription>{referralData.referralCount} friends joined</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {referralData.referredUsers.map((friend) => (
                <div key={friend._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-pink-600">
                        {friend.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{friend.name}</p>
                      <p className="text-xs text-gray-500">
                        Joined {new Date(friend.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">₹50</p>
                    <p className="text-xs text-gray-500">Earned</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
