import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

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

    const { pointsToRedeem } = await request.json()

    if (!pointsToRedeem || pointsToRedeem <= 0) {
      return NextResponse.json(
        { error: 'Invalid points amount' },
        { status: 400 }
      )
    }

    // Points are in multiples of 100
    if (pointsToRedeem % 100 !== 0) {
      return NextResponse.json(
        { error: 'Points must be in multiples of 100' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // Get user's loyalty points
    const user = await db.collection('users').findOne(
      { _id: userId },
      { projection: { loyaltyPoints: 1 } }
    )

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.loyaltyPoints < pointsToRedeem) {
      return NextResponse.json(
        { error: 'Insufficient loyalty points' },
        { status: 400 }
      )
    }

    // Calculate discount (100 points = ₹100)
    const discount = pointsToRedeem

    // Note: Points will be deducted only after successful order completion
    // This endpoint just validates and returns the discount amount

    return NextResponse.json({
      success: true,
      discount,
      pointsToRedeem
    })
  } catch (error) {
    console.error('Error applying loyalty points:', error)
    return NextResponse.json(
      { error: 'Failed to apply loyalty points' },
      { status: 500 }
    )
  }
}
