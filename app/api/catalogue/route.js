import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// GET - Fetch current catalogue
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    const catalogue = await db.collection('catalogue').findOne({}, { sort: { uploadedAt: -1 } })
    
    return NextResponse.json({
      success: true,
      catalogue: catalogue || null
    })
  } catch (error) {
    console.error('Error fetching catalogue:', error)
    return NextResponse.json(
      { error: 'Failed to fetch catalogue' },
      { status: 500 }
    )
  }
}
