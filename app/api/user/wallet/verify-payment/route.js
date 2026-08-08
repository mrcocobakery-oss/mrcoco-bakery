import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId } = await request.json()

    // Verify Razorpay signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex')

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    const { db } = await connectDB()

    // Get the pending transaction
    const transaction = await db.collection('transactions').findOne({
      _id: transactionId,
      userId,
      status: 'pending'
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Update transaction status
    await db.collection('transactions').updateOne(
      { _id: transactionId },
      {
        $set: {
          status: 'completed',
          razorpayPaymentId: razorpay_payment_id,
          updatedAt: new Date()
        }
      }
    )

    // Credit wallet balance
    const result = await db.collection('users').updateOne(
      { _id: userId },
      {
        $inc: { walletBalance: transaction.amount },
        $set: { updatedAt: new Date() }
      }
    )

    // Get updated wallet balance
    const user = await db.collection('users').findOne(
      { _id: userId },
      { projection: { walletBalance: 1 } }
    )

    return NextResponse.json({
      success: true,
      message: 'Wallet recharged successfully',
      amount: transaction.amount,
      newBalance: user.walletBalance
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
