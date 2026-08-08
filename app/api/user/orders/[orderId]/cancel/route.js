import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function PUT(request, { params }) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    const { orderId } = await params
    const { reason } = await request.json()

    const { db } = await connectToDatabase()
    
    // Get the order
    const order = await db.collection('orders').findOne({
      _id: orderId,
      userId
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if order can be cancelled
    if (order.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Order is already cancelled' },
        { status: 400 }
      )
    }

    if (order.status === 'delivered') {
      return NextResponse.json(
        { error: 'Delivered orders cannot be cancelled' },
        { status: 400 }
      )
    }

    // Check cancellation rules based on product category
    const orderCreatedAt = new Date(order.createdAt)
    const now = new Date()
    const hoursSinceOrder = (now - orderCreatedAt) / (1000 * 60 * 60)

    // Check if order contains cakes
    const hasCakes = order.items.some(item => 
      item.category.toLowerCase() === 'cakes' || 
      item.category.toLowerCase() === 'cake'
    )

    if (hasCakes) {
      return NextResponse.json(
        { error: 'Cake orders cannot be cancelled. Please contact customer support.' },
        { status: 400 }
      )
    }

    // For other products (cookies, namkeen, gifts) - 12 hours limit
    if (hoursSinceOrder > 12) {
      return NextResponse.json(
        { error: 'Order can only be cancelled within 12 hours of placement' },
        { status: 400 }
      )
    }

    // Update order status
    await db.collection('orders').updateOne(
      { _id: orderId },
      { 
        $set: { 
          status: 'cancelled',
          cancelledAt: new Date(),
          cancellationReason: reason,
          updatedAt: new Date()
        }
      }
    )

    // If payment was made, create refund transaction
    if (order.paymentStatus === 'paid') {
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      await db.collection('transactions').insertOne({
        _id: transactionId,
        userId,
        type: 'credit',
        amount: order.total,
        description: `Refund for cancelled order ${orderId}`,
        orderId,
        status: 'completed',
        category: 'refund',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // Update user wallet balance
      await db.collection('users').updateOne(
        { _id: userId },
        { 
          $inc: { walletBalance: order.total },
          $set: { updatedAt: new Date() }
        }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
      refundAmount: order.paymentStatus === 'paid' ? order.total : 0
    })
  } catch (error) {
    console.error('Error cancelling order:', error)
    return NextResponse.json(
      { error: 'Failed to cancel order' },
      { status: 500 }
    )
  }
}
