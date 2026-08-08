import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(request) {
  try {
    const { orderId, userId, loyaltyPointsUsed } = await request.json()

    if (!orderId || !userId) {
      return NextResponse.json(
        { error: 'Order ID and User ID are required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // Get order details
    const order = await db.collection('orders').findOne({ _id: orderId })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Calculate loyalty points to earn (100 points per ₹100 spent)
    // Use the amount after loyalty discount
    const pointsToAdd = Math.floor(order.total / 100) * 100

    // Deduct used points and add earned points
    const pointsUsed = loyaltyPointsUsed || 0
    const netPointsChange = pointsToAdd - pointsUsed

    if (netPointsChange !== 0) {
      // Update user's loyalty points
      await db.collection('users').updateOne(
        { _id: userId },
        {
          $inc: { loyaltyPoints: netPointsChange },
          $set: { updatedAt: new Date() }
        }
      )
    }

    // Create transaction record for points deducted (if any)
    if (pointsUsed > 0) {
      const deductionTxnId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      await db.collection('transactions').insertOne({
        _id: deductionTxnId,
        userId,
        type: 'debit',
        amount: 0,
        description: `Used ${pointsUsed} loyalty points for order ${orderId}`,
        orderId,
        status: 'completed',
        category: 'loyalty_redemption',
        loyaltyPoints: -pointsUsed,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    // Create transaction record for points earned
    if (pointsToAdd > 0) {
      const earningTxnId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      await db.collection('transactions').insertOne({
        _id: earningTxnId,
        userId,
        type: 'credit',
        amount: 0,
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
      pointsUsed,
      pointsEarned: pointsToAdd,
      netPointsChange,
      message: pointsToAdd > 0 ? `Order completed! You earned ${pointsToAdd} loyalty points!` : 'Order completed!'
    })
  } catch (error) {
    console.error('Error processing order completion:', error)
    return NextResponse.json(
      { error: 'Failed to process order completion' },
      { status: 500 }
    )
  }
}
