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

// Get user from token
async function getUserFromToken() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    
    if (!token) {
      return null
    }
    
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (error) {
    return null
  }
}

// GET - Fetch all addresses for logged-in user
export async function GET(request) {
  try {
    const user = await getUserFromToken()
    
    if (!user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    const client = await connectToDatabase()
    const db = client.db('bakery')
    
    const userDoc = await db.collection('users').findOne(
      { email: user.email },
      { projection: { addresses: 1 } }
    )
    
    return Response.json({
      success: true,
      addresses: userDoc?.addresses || []
    })
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return Response.json({ success: false, error: 'Failed to fetch addresses' }, { status: 500 })
  }
}

// POST - Add new address
export async function POST(request) {
  try {
    const user = await getUserFromToken()
    
    if (!user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { name, phone, address, city, state, pincode, isDefault } = body
    
    // Validation
    if (!name || !phone || !address || !city || !state || !pincode) {
      return Response.json({ success: false, error: 'All fields are required' }, { status: 400 })
    }
    
    if (pincode.length !== 6) {
      return Response.json({ success: false, error: 'Invalid PIN code' }, { status: 400 })
    }
    
    const client = await connectToDatabase()
    const db = client.db('bakery')
    
    const newAddress = {
      _id: new ObjectId().toString(),
      name,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault: isDefault || false,
      createdAt: new Date()
    }
    
    // If this is set as default, unset all other defaults
    if (isDefault) {
      await db.collection('users').updateOne(
        { email: user.email },
        { $set: { 'addresses.$[].isDefault': false } }
      )
    }
    
    // Add address to user's addresses array
    await db.collection('users').updateOne(
      { email: user.email },
      { $push: { addresses: newAddress } }
    )
    
    return Response.json({
      success: true,
      message: 'Address added successfully',
      address: newAddress
    })
  } catch (error) {
    console.error('Error adding address:', error)
    return Response.json({ success: false, error: 'Failed to add address' }, { status: 500 })
  }
}

// PUT - Update existing address
export async function PUT(request) {
  try {
    const user = await getUserFromToken()
    
    if (!user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { addressId, name, phone, address, city, state, pincode, isDefault } = body
    
    if (!addressId) {
      return Response.json({ success: false, error: 'Address ID is required' }, { status: 400 })
    }
    
    const client = await connectToDatabase()
    const db = client.db('bakery')
    
    // If setting as default, unset all other defaults first
    if (isDefault) {
      await db.collection('users').updateOne(
        { email: user.email },
        { $set: { 'addresses.$[].isDefault': false } }
      )
    }
    
    // Update the specific address
    const result = await db.collection('users').updateOne(
      { email: user.email, 'addresses._id': addressId },
      {
        $set: {
          'addresses.$.name': name,
          'addresses.$.phone': phone,
          'addresses.$.address': address,
          'addresses.$.city': city,
          'addresses.$.state': state,
          'addresses.$.pincode': pincode,
          'addresses.$.isDefault': isDefault || false,
          'addresses.$.updatedAt': new Date()
        }
      }
    )
    
    if (result.modifiedCount === 0) {
      return Response.json({ success: false, error: 'Address not found' }, { status: 404 })
    }
    
    return Response.json({
      success: true,
      message: 'Address updated successfully'
    })
  } catch (error) {
    console.error('Error updating address:', error)
    return Response.json({ success: false, error: 'Failed to update address' }, { status: 500 })
  }
}

// DELETE - Delete address
export async function DELETE(request) {
  try {
    const user = await getUserFromToken()
    
    if (!user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const addressId = searchParams.get('addressId')
    
    if (!addressId) {
      return Response.json({ success: false, error: 'Address ID is required' }, { status: 400 })
    }
    
    const client = await connectToDatabase()
    const db = client.db('bakery')
    
    // Remove address from user's addresses array
    const result = await db.collection('users').updateOne(
      { email: user.email },
      { $pull: { addresses: { _id: addressId } } }
    )
    
    if (result.modifiedCount === 0) {
      return Response.json({ success: false, error: 'Address not found' }, { status: 404 })
    }
    
    return Response.json({
      success: true,
      message: 'Address deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting address:', error)
    return Response.json({ success: false, error: 'Failed to delete address' }, { status: 500 })
  }
}
