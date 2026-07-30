'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Wallet as WalletIcon, Plus, TrendingUp, TrendingDown, ArrowLeft, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function WalletPage() {
  const { user } = useAuth()
  const [showAddMoney, setShowAddMoney] = useState(false)
  const [amount, setAmount] = useState('')

  // Mock transaction history
  const transactions = [
    { id: 1, type: 'credit', amount: 500, description: 'Added to wallet', date: '2025-01-25', balance: 500 },
    { id: 2, type: 'debit', amount: 150, description: 'Order payment', date: '2025-01-26', balance: 350 },
    { id: 3, type: 'credit', amount: 200, description: 'Refund for order #abc123', date: '2025-01-27', balance: 550 },
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
        <h1 className="text-3xl font-bold font-serif text-pink-900">My Wallet</h1>
        <p className="text-gray-600 mt-1">Manage your wallet balance and transactions</p>
      </div>

      {/* Wallet Balance Card */}
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
            <Button className="bg-pink-600 hover:bg-pink-700" onClick={() => setShowAddMoney(!showAddMoney)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Money
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Money Section */}
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
                  placeholder="Enter amount"
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
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Proceed to Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
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
                  key={transaction.id}
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
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                    </p>
                    <p className="text-xs text-gray-500">Balance: ₹{transaction.balance}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
