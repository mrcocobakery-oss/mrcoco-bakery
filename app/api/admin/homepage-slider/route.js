import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { v4 as uuidv4 } from 'uuid'

// GET - Fetch all homepage slider images
export async function GET(request) {
  try {
    const { db } = await connectToDatabase()
    
    const sliders = await db.collection('homepage_sliders')
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray()
    
    return NextResponse.json({ success: true, sliders })
  } catch (error) {
    console.error('Error fetching homepage sliders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sliders' },
      { status: 500 }
    )
  }
}

// POST - Add new slider image
export async function POST(request) {
  try {
    const body = await request.json()
    const { imageUrl, altText, order } = body

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    const slider = {
      _id: uuidv4(),
      imageUrl,
      altText: altText || 'Homepage Slider',
      order: order || 0,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await db.collection('homepage_sliders').insertOne(slider)

    return NextResponse.json({ 
      success: true, 
      message: 'Slider image added successfully',
      slider 
    })
  } catch (error) {
    console.error('Error adding slider:', error)
    return NextResponse.json(
      { 
        error: 'Failed to add slider image',
        details: error.message,
        errorName: error.name,
        mongoUrl: process.env.MONGO_URL ? 'SET' : 'NOT SET',
        dbName: process.env.DB_NAME || 'NOT SET'
      },
      { status: 500 }
    )
  }
}

// DELETE - Remove slider image
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Slider ID is required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    const result = await db.collection('homepage_sliders').deleteOne({ _id: id })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Slider not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Slider image deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting slider:', error)
    return NextResponse.json(
      { error: 'Failed to delete slider image' },
      { status: 500 }
    )
  }
}

// PATCH - Update slider order
export async function PATCH(request) {
  try {
    const body = await request.json()
    const { id, order } = body

    if (!id || order === undefined) {
      return NextResponse.json(
        { error: 'Slider ID and order are required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    const result = await db.collection('homepage_sliders').updateOne(
      { _id: id },
      { 
        $set: { 
          order,
          updatedAt: new Date()
        } 
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Slider not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Slider order updated successfully' 
    })
  } catch (error) {
    console.error('Error updating slider:', error)
    return NextResponse.json(
      { error: 'Failed to update slider' },
      { status: 500 }
    )
  }
}
