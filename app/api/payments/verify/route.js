import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { connectToDatabase } from '@/lib/mongodb'
import { sendOrderConfirmationEmail } from '@/lib/emailService'

export const runtime = 'nodejs'

// POST - Verify Razorpay payment
export async function POST(request) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, internalOrderId } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification parameters' },
        { status: 400 }
      )
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex')

    const isValid = expectedSignature === razorpay_signature

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Update order in database
    const { db } = await connectToDatabase()
    const order = await db.collection('orders').findOneAndUpdate(
      {
        $or: [
          { _id: internalOrderId },
          { razorpayOrderId: razorpay_order_id }
        ]
      },
      {
        $set: {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paymentStatus: 'paid',
          status: 'confirmed',
          paidAt: new Date(),
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(order)
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
      // Don't fail the payment verification if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: order._id,
      message: 'Payment verified successfully'
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Payment verification failed', details: error.message },
      { status: 500 }
    )
  }
}
