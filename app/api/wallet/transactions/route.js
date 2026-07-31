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

// GET - Fetch wallet transactions
export async function GET(request) {
  try {
    const user = await getUserFromToken()
    
    if (!user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    const client = await connectToDatabase()
    const db = client.db('bakery')
    
    const transactions = await db.collection('wallet_transactions')
      .find({ userEmail: user.email })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()
    
    return Response.json({
      success: true,
      transactions: transactions
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return Response.json({ success: false, error: 'Failed to fetch transactions' }, { status: 500 })
  }
}
