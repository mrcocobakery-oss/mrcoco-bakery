import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { razorpay } from '@/lib/razorpay'
import crypto from 'crypto'

export async function POST(request) {
  try {
    const { amount, currency = 'INR', cartItems, customerInfo } = await request.json()

    // Validate amount
    const amountInPaise = Math.round(Number(amount) * 100)
    if (!amountInPaise || amountInPaise < 100) {
      return NextResponse.json({ error: 'Invalid amount. Minimum ₹1' }, { status: 400 })
    }

    // Generate unique receipt ID
    const receiptId = `order_${crypto.randomUUID().substring(0, 8)}_${Date.now()}`

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: currency,
      receipt: receiptId,
      notes: {
        customer_name: customerInfo?.name || 'Guest',
        customer_email: customerInfo?.email || '',
        customer_phone: customerInfo?.phone || '',
        items_count: cartItems?.length || 0
      }
    })

    // Save order to database
    const { db } = await connectToDatabase()
    await db.collection('orders').insertOne({
      orderId: razorpayOrder.id,
      receiptId: receiptId,
      amount: amountInPaise,
      currency: currency,
      status: 'created',
      customerInfo: customerInfo || {},
      cartItems: cartItems || [],
      razorpayOrderData: razorpayOrder,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    })
  } catch (error) {
    console.error('Razorpay order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order: ' + error.message },
      { status: 500 }
    )
  }
}
