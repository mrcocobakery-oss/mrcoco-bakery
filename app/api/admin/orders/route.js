import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// Admin authentication check
function checkAdminAuth(request) {
  const authHeader = request.headers.get('authorization')
  const adminToken = request.cookies.get('admin_token')?.value
  
  if (adminToken !== 'admin_logged_in' && authHeader !== 'Bearer admin_logged_in') {
    return false
  }
  return true
}

// GET - Fetch all orders
export async function GET(request) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    
    let query = {}
    if (status && status !== 'all') {
      query.status = status
    }
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
        { _id: { $regex: search, $options: 'i' } }
      ]
    }
    
    const orders = await db.collection('orders').find(query).sort({ createdAt: -1 }).toArray()
    
    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// PUT - Update order status
export async function PUT(request) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, status } = body
    
    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 })
    }
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    
    const { db } = await connectToDatabase()
    
    const result = await db.collection('orders').updateOne(
      { _id: orderId },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        }
      }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
