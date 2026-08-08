import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') // 'all', 'credit', 'debit'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const { db } = await connectDB()
    
    // Get user wallet balance
    const user = await db.collection('users').findOne(
      { _id: userId },
      { projection: { walletBalance: 1 } }
    )

    // Build query for transactions
    const query = { userId }
    
    if (type && type !== 'all') {
      query.type = type
    }
    
    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) query.createdAt.$lte = new Date(endDate)
    }

    // Get total count
    const total = await db.collection('transactions').countDocuments(query)

    // Get transactions with pagination
    const transactions = await db.collection('transactions')
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      success: true,
      walletBalance: user?.walletBalance || 0,
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching wallet data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wallet data' },
      { status: 500 }
    )
  }
}
