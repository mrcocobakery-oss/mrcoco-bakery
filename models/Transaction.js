// MongoDB Transaction Schema
export const TransactionSchema = {
  _id: 'string', // UUID
  userId: 'string', // UUID reference to User
  
  // Transaction Details
  type: 'string', // 'credit', 'debit'
  amount: 'number',
  description: 'string',
  
  // Related Order (if any)
  orderId: 'string', // Optional
  
  // Payment Gateway Details
  razorpayOrderId: 'string',
  razorpayPaymentId: 'string',
  
  // Transaction Status
  status: 'string', // 'pending', 'completed', 'failed'
  
  // Metadata
  category: 'string', // 'wallet_recharge', 'order_payment', 'refund', 'referral_bonus', 'loyalty_redemption'
  
  // Timestamps
  createdAt: 'Date',
  updatedAt: 'Date'
}

// Indexes:
// db.transactions.createIndex({ userId: 1, createdAt: -1 })
// db.transactions.createIndex({ orderId: 1 })
// db.transactions.createIndex({ status: 1 })
