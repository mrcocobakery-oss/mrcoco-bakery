import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import Razorpay from 'razorpay'
import { v4 as uuidv4 } from 'uuid'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

export async function POST(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    const { amount } = await request.json()

    // Validation
    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Minimum recharge amount is ₹100' },
        { status: 400 }
      )
    }

    if (amount > 50000) {
      return NextResponse.json(
        { error: 'Maximum recharge amount is ₹50,000' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // Get user details
    const user = await db.collection('users').findOne({ _id: userId })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `wallet_${Date.now()}_${userId}`,
      notes: {
        userId,
        type: 'wallet_recharge',
        customerName: user.name,
        customerEmail: user.email
      }
    })

    // Create pending transaction in database
    const transactionId = uuidv4()
    await db.collection('transactions').insertOne({
      _id: transactionId,
      userId,
      type: 'credit',
      amount,
      description: 'Wallet Recharge',
      razorpayOrderId: razorpayOrder.id,
      status: 'pending',
      category: 'wallet_recharge',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      transactionId
    })
  } catch (error) {
    console.error('Error creating wallet recharge order:', error)
    return NextResponse.json(
      { error: 'Failed to create recharge order' },
      { status: 500 }
    )
  }
}
