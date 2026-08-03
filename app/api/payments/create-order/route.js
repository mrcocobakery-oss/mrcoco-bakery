import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { connectToDatabase } from '@/lib/mongodb'
import { razorpay } from '@/lib/razorpay'

export const runtime = 'nodejs'

// POST - Create Razorpay order
export async function POST(request) {
  try {
    const body = await request.json()
    const { cart, customer, deliveryDetails, couponCode } = body

    if (!cart || cart.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    if (!customer || !customer.name || !customer.email || !customer.phone) {
      return NextResponse.json(
        { error: 'Customer details are required' },
        { status: 400 }
      )
    }

    // Calculate total amount from cart
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    let discount = 0
    let deliveryCharge = 0

    // Apply delivery charges (free for orders above ₹500)
    if (subtotal < 500) {
      deliveryCharge = 50
    }

    // Apply coupon discount if provided
    // In production, validate coupon from database
    if (couponCode) {
      // This is a placeholder - implement real coupon validation
      discount = subtotal * 0.1 // Example: 10% discount
    }

    const total = subtotal + deliveryCharge - discount
    const amountInPaise = Math.round(total * 100) // Convert to paise

    // Generate internal order ID
    const internalOrderId = `MRCOCO${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: internalOrderId,
      notes: {
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        store: 'Mr. COCO Bakery'
      }
    })

    // Save order to database
    const { db } = await connectToDatabase()
    await db.collection('orders').insertOne({
      _id: internalOrderId,
      razorpayOrderId: razorpayOrder.id,
      status: 'created',
      paymentStatus: 'pending',
      items: cart.map(item => ({
        productId: item.id,
        productName: item.name,
        productImage: item.image,
        quantity: item.quantity,
        price: item.price,
        category: item.category
      })),
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      address: deliveryDetails?.address || customer.address,
      city: deliveryDetails?.city || customer.city,
      pincode: deliveryDetails?.pincode || customer.pincode,
      deliveryDate: deliveryDetails?.deliveryDate,
      deliveryTime: deliveryDetails?.deliveryTime,
      subtotal,
      deliveryCharge,
      discount,
      couponCode: couponCode || null,
      total,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      internalOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    )
  }
}
