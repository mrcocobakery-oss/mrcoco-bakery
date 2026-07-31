import { MongoClient } from 'mongodb'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const uri = process.env.MONGO_URL
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

let cachedClient = null

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient
  }
  const client = await MongoClient.connect(uri)
  cachedClient = client
  return client
}

// Get user from token
async function getUserFromToken() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    
    if (!token) {
      return null
    }
    
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (error) {
    return null
  }
}

// POST - Verify Razorpay payment and credit wallet
export async function POST(request) {
  try {
    const user = await getUserFromToken()
    
    if (!user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json({ success: false, error: 'Missing payment details' }, { status: 400 })
    }
    
    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex')
    
    if (razorpay_signature !== expectedSign) {
      return Response.json({ success: false, error: 'Invalid payment signature' }, { status: 400 })
    }
    
    const client = await connectToDatabase()
    const db = client.db('bakery')
    
    // Get transaction details
    const transaction = await db.collection('wallet_transactions').findOne({
      orderId: razorpay_order_id,
      userEmail: user.email,
      status: 'pending'
    })
    
    if (!transaction) {
      return Response.json({ success: false, error: 'Transaction not found' }, { status: 404 })
    }
    
    // Update transaction status
    await db.collection('wallet_transactions').updateOne(
      { orderId: razorpay_order_id },
      {
        $set: {
          status: 'completed',
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          completedAt: new Date()
        }
      }
    )
    
    // Credit wallet balance
    const result = await db.collection('users').updateOne(
      { email: user.email },
      { 
        $inc: { walletBalance: transaction.amount },
        $set: { updatedAt: new Date() }
      }
    )
    
    if (result.modifiedCount === 0) {
      return Response.json({ success: false, error: 'Failed to update wallet' }, { status: 500 })
    }
    
    // Get updated wallet balance
    const updatedUser = await db.collection('users').findOne(
      { email: user.email },
      { projection: { walletBalance: 1 } }
    )
    
    return Response.json({
      success: true,
      message: 'Wallet recharged successfully',
      walletBalance: updatedUser.walletBalance,
      amount: transaction.amount
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return Response.json({ success: false, error: 'Failed to verify payment' }, { status: 500 })
  }
}
