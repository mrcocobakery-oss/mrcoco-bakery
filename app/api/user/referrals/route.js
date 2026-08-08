import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    const { db } = await connectDB()
    
    // Get user's referral info
    const user = await db.collection('users').findOne(
      { _id: userId },
      { projection: { referralCode: 1, referredBy: 1 } }
    )

    // Get referred users
    const referredUsers = await db.collection('users')
      .find(
        { referredBy: user.referralCode },
        { projection: { name: 1, email: 1, createdAt: 1 } }
      )
      .toArray()

    // Calculate total referral earnings (₹50 per referral)
    const totalEarnings = referredUsers.length * 50

    return NextResponse.json({
      success: true,
      referralCode: user.referralCode,
      referredUsers,
      totalEarnings,
      referralCount: referredUsers.length
    })
  } catch (error) {
    console.error('Error fetching referral data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch referral data' },
      { status: 500 }
    )
  }
}
