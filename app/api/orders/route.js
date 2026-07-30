import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { v4 as uuidv4 } from 'uuid'

// POST - Create new order
export async function POST(request) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()
    
    const order = {
      _id: uuidv4(),
      userId: body.userId || null,
      
      // Customer Info
      customerName: body.name,
      customerEmail: body.email,
      customerPhone: body.phone,
      
      // Delivery Address
      address: body.address,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      
      // Order Items
      items: body.items,
      
      // Pricing
      subtotal: body.subtotal,
      deliveryFee: body.deliveryFee || 0,
      expressDeliveryFee: body.expressDelivery ? 200 : 0,
      total: body.total,
      
      // Delivery Details
      deliveryDate: body.deliveryDate,
      deliveryTime: body.deliveryTime,
      expressDelivery: body.expressDelivery || false,
      giftMessage: body.giftMessage || '',
      specialInstructions: body.specialInstructions || '',
      
      // Payment
      paymentMethod: body.paymentMethod,
      paymentStatus: body.paymentStatus || 'pending',
      razorpayOrderId: body.razorpayOrderId || null,
      razorpayPaymentId: body.razorpayPaymentId || null,
      
      // Order Status
      status: 'pending',
      
      // Timestamps
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await db.collection('orders').insertOne(order)
    
    return NextResponse.json({ success: true, orderId: order._id })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

// GET - Fetch user's orders
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    const { db } = await connectToDatabase()
    
    let query = {}
    if (userId) {
      query.userId = userId
    }
    
    const orders = await db.collection('orders').find(query).sort({ createdAt: -1 }).toArray()
    
    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
