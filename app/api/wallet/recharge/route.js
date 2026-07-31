import { MongoClient } from 'mongodb'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import Razorpay from 'razorpay'
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

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

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

// POST - Create Razorpay order for wallet recharge
export async function POST(request) {
  try {
    const user = await getUserFromToken()
    
    if (!user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { amount } = body
    
    if (!amount || amount < 10) {
      return Response.json({ success: false, error: 'Minimum recharge amount is ₹10' }, { status: 400 })
    }
    
    if (amount > 50000) {
      return Response.json({ success: false, error: 'Maximum recharge amount is ₹50,000' }, { status: 400 })
    }
    
    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `wallet_${user.email}_${Date.now()}`,
      notes: {
        purpose: 'wallet_recharge',
        user_email: user.email,
        user_id: user.userId || user.email
      }
    }
    
    const order = await razorpay.orders.create(options)
    
    // Save pending transaction to database
    const client = await connectToDatabase()
    const db = client.db('bakery')
    
    await db.collection('wallet_transactions').insertOne({
      orderId: order.id,
      userEmail: user.email,
      amount: amount,
      status: 'pending',
      type: 'recharge',
      createdAt: new Date()
    })
    
    return Response.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      }
    })
  } catch (error) {
    console.error('Error creating recharge order:', error)
    return Response.json({ success: false, error: 'Failed to create recharge order' }, { status: 500 })
  }
}
