import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// GET - Track order by Order ID and Phone Number
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const phone = searchParams.get('phone')

    // Validate inputs
    if (!orderId || !phone) {
      return NextResponse.json(
        { error: 'Order ID and Phone Number are required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // Find order by ID and phone number (security check)
    const order = await db.collection('orders').findOne({
      _id: orderId,
      customerPhone: phone
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found. Please check your Order ID and Phone Number.' },
        { status: 404 }
      )
    }

    // Return order with limited information for tracking
    const trackingData = {
      orderId: order._id,
      customerName: order.customerName,
      status: order.status || 'pending',
      total: order.total,
      createdAt: order.createdAt,
      deliveryDate: order.deliveryDate,
      deliveryTime: order.deliveryTime,
      items: order.items?.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        productImage: item.productImage
      })) || [],
      address: order.address,
      city: order.city,
      pincode: order.pincode
    }

    return NextResponse.json({ success: true, order: trackingData })
  } catch (error) {
    console.error('Error tracking order:', error)
    return NextResponse.json(
      { error: 'Failed to track order. Please try again later.' },
      { status: 500 }
    )
  }
}
