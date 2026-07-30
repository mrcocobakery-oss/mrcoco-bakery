'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Wallet as WalletIcon, Plus, TrendingUp, TrendingDown, ArrowLeft, Calendar } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import Script from 'next/script'

export default function WalletPage() {
  const { user } = useAuth()
  const [showAddMoney, setShowAddMoney] = useState(false)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    if (user?._id) {
      fetchTransactions()
    }
  }, [user])

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/wallet/transactions?userId=${user._id}`)
      const data = await response.json()
      if (response.ok) {
        setTransactions(data.transactions || [])
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  const handleAddMoney = async () => {
    if (!amount || parseFloat(amount) < 100) {
      toast.error('Minimum amount is ₹100')
      return
    }

    setLoading(true)

    try {
      // Create Razorpay order
      const orderResponse = await fetch('/api/wallet/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          userId: user._id
        })
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        toast.error(orderData.error || 'Failed to create order')
        setLoading(false)
        return
      }

      // Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Mr. COCO Bakery',
        description: 'Add Money to Wallet',
        order_id: orderData.orderId,
        handler: async function (response) {
          // Verify payment
          const verifyResponse = await fetch('/api/wallet/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user._id,
              amount: parseFloat(amount)
            })
          })

          if (verifyResponse.ok) {
            toast.success('Money added to wallet successfully!')
            setAmount('')
            setShowAddMoney(false)
            fetchTransactions()
            window.location.reload()
          } else {
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || ''
        },
        theme: {
          color: '#DB2777'
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

      rzp.on('payment.failed', function (response) {
        toast.error('Payment failed. Please try again.')
      })

    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to process payment')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
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
          <h1 className="text-3xl font-bold font-serif text-pink-900">My Wallet</h1>
          <p className="text-gray-600 mt-1">Manage your wallet balance and transactions</p>
        </div>

        <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">Available Balance</p>
                <h2 className="text-5xl font-bold text-pink-900">₹{user?.walletBalance || 0}</h2>
              </div>
              <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center">
                <WalletIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="mt-6">
              <Button 
                className="bg-pink-600 hover:bg-pink-700" 
                onClick={() => setShowAddMoney(!showAddMoney)}
                disabled={loading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Money
              </Button>
            </div>
          </CardContent>
        </Card>

        {showAddMoney && (
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle>Add Money to Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Input
                    type="number"
                    placeholder="Enter amount (min ₹100)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div className="flex gap-2">
                  {[100, 500, 1000, 2000].map((amt) => (
                    <Button
                      key={amt}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(amt.toString())}
                    >
                      ₹{amt}
                    </Button>
                  ))}
                </div>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleAddMoney}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No transactions yet
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
