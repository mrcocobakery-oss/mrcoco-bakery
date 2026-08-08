'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, Filter, Download, ChevronLeft, ChevronRight, IndianRupee } from 'lucide-react'
import { toast } from 'sonner'

export default function WalletPage() {
  const { user } = useAuth()
  const [walletBalance, setWalletBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [rechargeDialogOpen, setRechargeDialogOpen] = useState(false)
  const [rechargeAmount, setRechargeAmount] = useState('')
  const [recharging, setRecharging] = useState(false)

  // Filters
  const [typeFilter, setTypeFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 0 })

  useEffect(() => {
    if (user) {
      fetchWalletData()
    }
  }, [user, page, typeFilter])

  const fetchWalletData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        type: typeFilter
      })

      const response = await fetch(`/api/user/wallet?${params}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setWalletBalance(data.walletBalance)
        setTransactions(data.transactions)
        setPagination(data.pagination)
      } else {
        toast.error('Failed to fetch wallet data')
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleAddMoney = async () => {
    const amount = parseFloat(rechargeAmount)

    if (!amount || amount < 100) {
      toast.error('Minimum recharge amount is ₹100')
      return
    }

    if (amount > 50000) {
      toast.error('Maximum recharge amount is ₹50,000')
      return
    }

    try {
      setRecharging(true)

      // Create Razorpay order
      const response = await fetch('/api/user/wallet/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount })
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to create recharge order')
        return
      }

      // Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'Mr. COCO Bakery',
        description: 'Wallet Recharge',
        image: '/images/mrcoco-logo.png',
        handler: async function (response) {
          // Verify payment
          try {
            const verifyResponse = await fetch('/api/user/wallet/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                transactionId: data.transactionId
              })
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok) {
              toast.success(`₹${verifyData.amount} added to wallet!`)
              setRechargeDialogOpen(false)
              setRechargeAmount('')
              fetchWalletData()
            } else {
              toast.error(verifyData.error || 'Payment verification failed')
            }
          } catch (error) {
            console.error('Error verifying payment:', error)
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone || ''
        },
        theme: {
          color: '#db2777'
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

      rzp.on('payment.failed', function (response) {
        toast.error('Payment failed. Please try again.')
      })
    } catch (error) {
      console.error('Error adding money:', error)
      toast.error('Something went wrong')
    } finally {
      setRecharging(false)
    }
  }

  const getTransactionIcon = (type) => {
    return type === 'credit' ? (
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
        <ArrowDownRight className="w-5 h-5 text-green-600" />
      </div>
    ) : (
      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
        <ArrowUpRight className="w-5 h-5 text-red-600" />
      </div>
    )
  }

  const getStatusBadge = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
    }
    return (
      <Badge className={`${colors[status] || colors.pending} border`}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Wallet className="w-12 h-12 text-pink-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading wallet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-pink-900 mb-2">My Wallet</h1>
        <p className="text-gray-600">Manage your wallet balance and transactions</p>
      </div>

      {/* Wallet Balance Card */}
      <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                <Wallet className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                <h2 className="text-4xl font-bold text-pink-900">
                  ₹{walletBalance.toFixed(2)}
                </h2>
              </div>
            </div>
            <Button
              onClick={() => setRechargeDialogOpen(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Money
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="border-2 border-pink-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-serif text-pink-900">Transaction History</CardTitle>
              <CardDescription>View all your wallet transactions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="credit">Credits</SelectItem>
                  <SelectItem value="debit">Debits</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions yet</h3>
              <p className="text-gray-600 mb-6">Add money to your wallet to get started</p>
              <Button
                onClick={() => setRechargeDialogOpen(true)}
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Money
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction._id}>
                        <TableCell>
                          {getTransactionIcon(transaction.type)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            {transaction.orderId && (
                              <p className="text-xs text-gray-500">Order: {transaction.orderId}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                            <br />
                            <span className="text-xs text-gray-500">
                              {new Date(transaction.createdAt).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <span className="text-sm text-gray-600">
                    Page {page} of {pagination.pages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Money Dialog */}
      <Dialog open={rechargeDialogOpen} onOpenChange={setRechargeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Money to Wallet</DialogTitle>
            <DialogDescription>
              Enter amount to recharge (Minimum: ₹100, Maximum: ₹50,000)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  min={100}
                  max={50000}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[100, 500, 1000, 2000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setRechargeAmount(amount.toString())}
                  className="border-pink-300 hover:bg-pink-50"
                >
                  ₹{amount}
                </Button>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Money will be credited instantly to your wallet after successful payment.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRechargeDialogOpen(false)
                setRechargeAmount('')
              }}
              disabled={recharging}
            >
              Cancel
            </Button>
            <Button
              className="bg-pink-600 hover:bg-pink-700 text-white"
              onClick={handleAddMoney}
              disabled={recharging || !rechargeAmount}
            >
              {recharging ? 'Processing...' : 'Proceed to Pay'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
