import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') // 'all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    const search = searchParams.get('search') // Search by order ID or product name
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const { db } = await connectToDatabase()
    
    // Build query
    const query = { userId }
    
    if (status && status !== 'all') {
      query.status = status
    }
    
    if (search) {
      query.$or = [
        { _id: { $regex: search, $options: 'i' } },
        { 'items.productName': { $regex: search, $options: 'i' } }
      ]
    }
    
    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) query.createdAt.$lte = new Date(endDate)
    }

    // Get total count
    const total = await db.collection('orders').countDocuments(query)

    // Get orders with pagination
    const orders = await db.collection('orders')
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
