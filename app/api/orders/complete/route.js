import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'

export async function POST(request) {
  try {
    const { orderId, userId } = await request.json()

    if (!orderId || !userId) {
      return NextResponse.json(
        { error: 'Order ID and User ID are required' },
        { status: 400 }
      )
    }

    const { db } = await connectDB()

    // Get order details
    const order = await db.collection('orders').findOne({ _id: orderId })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Calculate loyalty points (100 points per ₹100 spent)
    const pointsToAdd = Math.floor(order.total / 100) * 100

    if (pointsToAdd > 0) {
      // Update user's loyalty points
      await db.collection('users').updateOne(
        { _id: userId },
        {
          $inc: { loyaltyPoints: pointsToAdd },
          $set: { updatedAt: new Date() }
        }
      )

      // Create transaction record for loyalty points
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      await db.collection('transactions').insertOne({
        _id: transactionId,
        userId,
        type: 'credit',
        amount: 0, // Points, not money
        description: `Earned ${pointsToAdd} loyalty points from order ${orderId}`,
        orderId,
        status: 'completed',
        category: 'loyalty_points',
        loyaltyPoints: pointsToAdd,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    return NextResponse.json({
      success: true,
      pointsAdded: pointsToAdd,
      message: `Order completed! You earned ${pointsToAdd} loyalty points!`
    })
  } catch (error) {
    console.error('Error processing order completion:', error)
    return NextResponse.json(
      { error: 'Failed to process order completion' },
      { status: 500 }
    )
  }
}
