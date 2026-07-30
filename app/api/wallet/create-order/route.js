import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// POST - Create Razorpay order for wallet
export async function POST(request) {
  try {
    const body = await request.json()
    const { amount, userId } = body

    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Minimum amount is ₹100' }, { status: 400 })
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `wallet_${userId}_${Date.now()}`,
      notes: {
        type: 'wallet_recharge',
        userId: userId
      }
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    })
  } catch (error) {
    console.error('Error creating wallet order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
