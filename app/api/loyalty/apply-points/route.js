import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { v4 as uuidv4 } from 'uuid'

// POST - Apply loyalty points at checkout
export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, pointsToRedeem, orderTotal } = body

    if (!userId || !pointsToRedeem) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Get user's current points
    const user = await db.collection('users').findOne({ _id: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const currentPoints = user.loyaltyPoints || 0
    if (currentPoints < pointsToRedeem) {
      return NextResponse.json({ error: 'Insufficient points' }, { status: 400 })
    }

    // Calculate discount (1 point = ₹1)
    const discount = pointsToRedeem

    // Ensure discount doesn't exceed order total
    const finalDiscount = Math.min(discount, orderTotal)

    return NextResponse.json({
      success: true,
      pointsToRedeem,
      discount: finalDiscount,
      remainingPoints: currentPoints - pointsToRedeem
    })
  } catch (error) {
    console.error('Error applying loyalty points:', error)
    return NextResponse.json({ error: 'Failed to apply points' }, { status: 500 })
  }
}
