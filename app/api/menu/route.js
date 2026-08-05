import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// GET - Fetch menu image
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    const menu = await db.collection('menu').findOne({})
    
    return NextResponse.json({
      success: true,
      menu: menu || null
    })
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    )
  }
}
