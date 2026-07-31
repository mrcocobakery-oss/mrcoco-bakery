import { MongoClient, ObjectId } from 'mongodb'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const uri = process.env.MONGO_URL
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

let cachedClient = null

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient
  }
  const client = await MongoClient.connect(uri)
  cachedClient = client
  return client
}

// Verify admin token
async function verifyAdmin() {
  try {
    const cookieStore = await cookies()
    const adminToken = cookieStore.get('admin_token')?.value
    
    if (!adminToken) {
      return false
    }
    
    const decoded = jwt.verify(adminToken, JWT_SECRET)
    return decoded.role === 'admin'
  } catch (error) {
    return false
  }
}

// GET - Fetch customer orders by email or customer ID
export async function GET(request) {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    const email = searchParams.get('email')
    
    if (!customerId && !email) {
      return Response.json({ success: false, error: 'Customer ID or email is required' }, { status: 400 })
    }
    
    const client = await connectToDatabase()
    const db = client.db('bakery')
    
    // Find customer first to get email if only ID is provided
    let customerEmail = email
    if (customerId && !email) {
      const customer = await db.collection('users').findOne({ _id: new ObjectId(customerId) })
      if (customer) {
        customerEmail = customer.email
      }
    }
    
    if (!customerEmail) {
      return Response.json({ success: false, orders: [] })
    }
    
    // Fetch all orders for this customer
    const orders = await db.collection('orders')
      .find({ 
        $or: [
          { customerEmail: customerEmail },
          { 'customerInfo.email': customerEmail }
        ]
      })
      .sort({ createdAt: -1 })
      .toArray()
    
    // Calculate statistics
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    const completedOrders = orders.filter(o => o.status === 'delivered').length
    
    return Response.json({
      success: true,
      orders: orders,
      statistics: {
        totalOrders: orders.length,
        completedOrders: completedOrders,
        totalSpent: totalSpent,
        averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0
      }
    })
  } catch (error) {
    console.error('Error fetching customer orders:', error)
    return Response.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 })
  }
}
