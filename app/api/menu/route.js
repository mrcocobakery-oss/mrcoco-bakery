import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

// GET - Fetch menu image
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('mrcoco_bakery')
    
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
