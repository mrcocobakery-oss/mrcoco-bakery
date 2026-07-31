'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function WalletPage() {
  const { user } = useAuth()
  const [walletBalance, setWalletBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showRechargeDialog, setShowRechargeDialog] = useState(false)
  const [rechargeAmount, setRechargeAmount] = useState('')
  const [processing, setProcessing] = useState(false)

  const quickAmounts = [100, 500, 1000, 2000, 5000]

  useEffect(() => {
    if (user) {
      fetchWalletData()
      fetchTransactions()
    }
  }, [user])

  const fetchWalletData = async () => {
    try {
      // Get wallet balance from user data
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      if (data.success) {
        setWalletBalance(data.user.walletBalance || 0)
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/wallet/transactions')
      const data = await response.json()
      if (data.success) {
        setTransactions(data.transactions || [])
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  const handleRecharge = async () => {
    const amount = parseInt(rechargeAmount)
    
    if (!amount || amount < 10) {
      toast.error('Minimum recharge amount is ₹10')
      return
    }
    
    if (amount > 50000) {
      toast.error('Maximum recharge amount is ₹50,000')
      return
    }
    
    setProcessing(true)
    
    try {
      // Create Razorpay order
      const response = await fetch('/api/wallet/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      })
      
      const data = await response.json()
      
      if (!data.success) {
        toast.error(data.error || 'Failed to create recharge order')
        setProcessing(false)
        return
      }
      
      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)
      
      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: data.order.currency,
          name: 'Mr. COCO Bakery',
          description: 'Wallet Recharge',
          order_id: data.order.id,
          image: '/logo.png',
          handler: async function (response) {
            // Verify payment
            const verifyResponse = await fetch('/api/wallet/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            })
            
            const verifyData = await verifyResponse.json()
            
            if (verifyData.success) {
              toast.success('Wallet Recharged! ₹' + amount + ' added to your wallet', { duration: 5000 })
              setWalletBalance(verifyData.walletBalance)
              setShowRechargeDialog(false)
              setRechargeAmount('')
              fetchTransactions()
            } else {
              toast.error('Payment verification failed')
            }
            setProcessing(false)
          },
          modal: {
            ondismiss: function() {
              setProcessing(false)
              toast.info('Payment cancelled')
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.phone || ''
          },
          theme: {
            color: '#ec4899'
          }
        }
        
        const rzp = new window.Razorpay(options)
        rzp.open()
      }
    } catch (error) {
      console.error('Recharge error:', error)
      toast.error('Failed to initiate recharge')
      setProcessing(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    }
    return styles[status] || styles.pending
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'failed':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
        <p className="text-gray-500 mt-1">Manage your wallet balance and transactions</p>
      </div>

      {/* Wallet Balance Card */}
      <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Wallet Balance</p>
                <p className="text-4xl font-bold text-gray-900">₹{walletBalance.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <Button
              onClick={() => setShowRechargeDialog(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-6 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Money
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Recharged</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{transactions
                    .filter(t => t.type === 'recharge' && t.status === 'completed')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{transactions
                    .filter(t => t.type === 'debit' && t.status === 'completed')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No transactions yet</p>
              <p className="text-sm mt-1">Start by adding money to your wallet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-4 border-2 rounded-lg hover:border-pink-200 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'recharge' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'recharge' ? (
                        <ArrowDownRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {transaction.type === 'recharge' ? 'Wallet Recharge' : 'Order Payment'}
                      </p>
                      <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                      {transaction.orderId && (
                        <p className="text-xs text-gray-400 mt-1">Order ID: {transaction.orderId}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.type === 'recharge' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'recharge' ? '+' : '-'}₹{transaction.amount}
                    </p>
                    <Badge className={getStatusBadge(transaction.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(transaction.status)}
                        {transaction.status}
                      </span>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recharge Dialog */}
      <Dialog open={showRechargeDialog} onOpenChange={setShowRechargeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-pink-900">Add Money to Wallet</DialogTitle>
            <DialogDescription>
              Recharge your wallet to make faster checkouts
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Current Balance */}
            <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Current Balance</p>
              <p className="text-3xl font-bold text-pink-900">₹{walletBalance}</p>
            </div>

            {/* Amount Input */}
            <div>
              <Label htmlFor="amount" className="text-base font-semibold mb-3">
                Enter Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                placeholder="Enter amount (₹10 - ₹50,000)"
                className="text-lg h-12"
                min="10"
                max="50000"
              />
              <p className="text-xs text-gray-500 mt-2">
                Minimum: ₹10 • Maximum: ₹50,000
              </p>
            </div>

            {/* Quick Amount Buttons */}
            <div>
              <Label className="text-sm text-gray-600 mb-2">Quick Select</Label>
              <div className="grid grid-cols-5 gap-2">
                {quickAmounts.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant="outline"
                    onClick={() => setRechargeAmount(amount.toString())}
                    className="border-pink-300 hover:bg-pink-50"
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-900">
                <strong>💳 Secure Payment:</strong> Powered by Razorpay. Your payment information is safe and encrypted.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowRechargeDialog(false)}
              className="flex-1"
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRecharge}
              disabled={processing || !rechargeAmount}
              className="flex-1 bg-pink-600 hover:bg-pink-700"
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Proceed to Pay
                </span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
