import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request) {
  const debugLog = []
  
  try {
    debugLog.push('1. Starting test slider save')
    
    const body = await request.json()
    debugLog.push('2. Request body parsed: ' + JSON.stringify(body))
    
    const { imageUrl, altText, order } = body
    
    if (!imageUrl) {
      return NextResponse.json({
        success: false,
        error: 'Image URL is required',
        debugLog
      }, { status: 400 })
    }
    
    debugLog.push('3. Connecting to database...')
    const { db } = await connectToDatabase()
    debugLog.push('4. Database connected successfully')
    
    const slider = {
      _id: uuidv4(),
      imageUrl,
      altText: altText || 'Homepage Slider',
      order: order || 0,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    debugLog.push('5. Slider object created: ' + JSON.stringify(slider))
    
    debugLog.push('6. Inserting into homepage_sliders collection...')
    const result = await db.collection('homepage_sliders').insertOne(slider)
    debugLog.push('7. Insert result: ' + JSON.stringify(result))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test slider added successfully',
      slider,
      debugLog
    })
  } catch (error) {
    debugLog.push('ERROR: ' + error.message)
    return NextResponse.json({
      success: false,
      error: error.message,
      errorName: error.name,
      errorCode: error.code,
      debugLog
    }, { status: 500 })
  }
}
