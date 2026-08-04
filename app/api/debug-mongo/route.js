import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    env_check: {
      mongo_url_exists: !!process.env.MONGO_URL,
      mongo_url_starts_with: process.env.MONGO_URL ? process.env.MONGO_URL.substring(0, 20) : 'NOT SET',
      db_name: process.env.DB_NAME || 'NOT SET'
    },
    connection_test: null,
    error: null
  }

  try {
    const { db } = await connectToDatabase()
    debugInfo.connection_test = 'SUCCESS'
    
    // Try to list collections
    const collections = await db.listCollections().toArray()
    debugInfo.collections = collections.map(c => c.name)
    
    // Try to count documents in homepage_sliders
    const sliderCount = await db.collection('homepage_sliders').countDocuments()
    debugInfo.slider_count = sliderCount
    
    return NextResponse.json(debugInfo)
  } catch (error) {
    debugInfo.connection_test = 'FAILED'
    debugInfo.error = {
      message: error.message,
      name: error.name,
      code: error.code
    }
    return NextResponse.json(debugInfo, { status: 500 })
  }
}
