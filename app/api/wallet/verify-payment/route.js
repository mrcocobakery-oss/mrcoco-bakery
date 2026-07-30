import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

// POST - Verify payment and credit wallet
export async function POST(request) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, amount } = body

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex')

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Update user wallet balance
    await db.collection('users').updateOne(
      { _id: userId },
      { 
        $inc: { walletBalance: amount },
        $set: { updatedAt: new Date() }
      }
    )

    // Create transaction record
    const transaction = {
      _id: uuidv4(),
      userId,
      type: 'credit',
      amount,
      description: 'Added to wallet',
      paymentMethod: 'razorpay',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: 'completed',
      createdAt: new Date()
    }

    await db.collection('wallet_transactions').insertOne(transaction)

    return NextResponse.json({ success: true, transaction })
  } catch (error) {
    console.error('Error verifying wallet payment:', error)
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 })
  }
}
