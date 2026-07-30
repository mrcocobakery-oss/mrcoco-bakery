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

// GET - Fetch all notifications
export async function GET(request) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const notifications = await db.collection('notifications').find({}).sort({ createdAt: -1 }).limit(100).toArray()
    
    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}
