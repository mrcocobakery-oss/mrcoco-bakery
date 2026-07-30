import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { sendOrderStatusNotification } from '@/lib/notifications'

// Admin authentication check
function checkAdminAuth(request) {
  const authHeader = request.headers.get('authorization')
  const adminToken = request.cookies.get('admin_token')?.value
  
  if (adminToken !== 'admin_logged_in' && authHeader !== 'Bearer admin_logged_in') {
    return false
  }
  return true
}

// PUT - Update order status and send notification
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
    
    // Get order before updating
    const order = await db.collection('orders').findOne({ _id: orderId })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    // Update order status
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
    
    // Send notification to customer
    await sendOrderStatusNotification(order, status)
    
    return NextResponse.json({ success: true, notificationSent: true })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
