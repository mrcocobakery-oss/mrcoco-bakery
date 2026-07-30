import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// GET - Fetch wallet transactions
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const transactions = await db.collection('wallet_transactions')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}
