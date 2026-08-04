import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    const sliders = await db.collection('homepage_sliders').find({}).toArray()
    const count = await db.collection('homepage_sliders').countDocuments()
    
    return NextResponse.json({ 
      success: true,
      count,
      sliders,
      database: process.env.DB_NAME,
      mongoUrl: process.env.MONGO_URL ? 'Connected' : 'Not set'
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
