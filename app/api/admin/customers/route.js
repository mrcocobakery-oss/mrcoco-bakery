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

// GET - Fetch all customers
export async function GET(request) {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    const { db } = await connectToDatabase()
    
    const customers = await db.collection('users')
      .find({ role: { $ne: 'admin' } })
      .sort({ createdAt: -1 })
      .toArray()
    
    return Response.json({
      success: true,
      customers: customers
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return Response.json({ success: false, error: 'Failed to fetch customers' }, { status: 500 })
  }
}

// POST - Add new customer manually
export async function POST(request) {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { name, email, phone, address, birthdays } = body
    
    if (!name || !phone) {
      return Response.json({ success: false, error: 'Name and phone are required' }, { status: 400 })
    }
    
    const client = await connectToDatabase()
    const db = client.db('bakery')
    
    // Check if customer already exists
    const existing = await db.collection('users').findOne({ phone })
    if (existing) {
      return Response.json({ success: false, error: 'Customer with this phone number already exists' }, { status: 400 })
    }
    
    const newCustomer = {
      name,
      email: email || '',
      phone,
      address: address || '',
      birthdays: birthdays || [], // Array of { name, date }
      walletBalance: 0,
      loyaltyPoints: 0,
      status: 'active',
      emailVerified: false,
      phoneVerified: false,
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('users').insertOne(newCustomer)
    
    return Response.json({
      success: true,
      message: 'Customer added successfully',
      customerId: result.insertedId
    })
  } catch (error) {
    console.error('Error adding customer:', error)
    return Response.json({ success: false, error: 'Failed to add customer' }, { status: 500 })
  }
}

// PUT - Update customer
export async function PUT(request) {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { customerId, name, email, phone, address, birthdays, status } = body
    
    if (!customerId) {
      return Response.json({ success: false, error: 'Customer ID is required' }, { status: 400 })
    }
    
    const client = await connectToDatabase()
    const db = client.db('bakery')
    
    const updateData = {
      updatedAt: new Date()
    }
    
    if (name) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (phone) updateData.phone = phone
    if (address !== undefined) updateData.address = address
    if (birthdays) updateData.birthdays = birthdays
    if (status) updateData.status = status
    
    const result = await db.collection('users').updateOne(
      { _id: customerId },
      { $set: updateData }
    )
    
    if (result.modifiedCount === 0) {
      return Response.json({ success: false, error: 'Customer not found' }, { status: 404 })
    }
    
    return Response.json({
      success: true,
      message: 'Customer updated successfully'
    })
  } catch (error) {
    console.error('Error updating customer:', error)
    return Response.json({ success: false, error: 'Failed to update customer' }, { status: 500 })
  }
}
