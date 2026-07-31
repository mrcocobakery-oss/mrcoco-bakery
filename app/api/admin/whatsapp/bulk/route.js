import { MongoClient } from 'mongodb'
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

// POST - Generate WhatsApp links for bulk messaging
export async function POST(request) {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { message, customerIds } = body // If customerIds empty, send to all
    
    if (!message) {
      return Response.json({ success: false, error: 'Message is required' }, { status: 400 })
    }
    
    const client = await connectToDatabase()
    const db = client.db('bakery')
    
    let query = { role: { $ne: 'admin' }, phone: { $exists: true, $ne: '' } }
    
    if (customerIds && customerIds.length > 0) {
      query._id = { $in: customerIds }
    }
    
    const customers = await db.collection('users').find(query).toArray()
    
    // Generate WhatsApp links for each customer
    const whatsappLinks = customers.map(customer => ({
      customerId: customer._id,
      customerName: customer.name,
      phone: customer.phone,
      whatsappLink: `https://wa.me/91${customer.phone}?text=${encodeURIComponent(message)}`
    }))
    
    return Response.json({
      success: true,
      customers: whatsappLinks,
      count: whatsappLinks.length,
      message: 'WhatsApp links generated successfully'
    })
  } catch (error) {
    console.error('Error generating WhatsApp links:', error)
    return Response.json({ success: false, error: 'Failed to generate links' }, { status: 500 })
  }
}
