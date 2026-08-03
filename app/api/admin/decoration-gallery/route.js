import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// GET - Fetch decoration gallery
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    const gallery = await db.collection('decoration_gallery')
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray()

    return NextResponse.json({
      gallery: gallery.map(item => ({
        ...item,
        _id: item._id.toString()
      }))
    })
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery' },
      { status: 500 }
    )
  }
}

// POST - Add new gallery item
export async function POST(request) {
  try {
    const body = await request.json()
    const { imageUrl, title, description, order } = body

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    const galleryItem = {
      imageUrl,
      title: title || '',
      description: description || '',
      order: order || 0,
      createdAt: new Date().toISOString()
    }

    const result = await db.collection('decoration_gallery').insertOne(galleryItem)

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString()
    })
  } catch (error) {
    console.error('Error adding gallery item:', error)
    return NextResponse.json(
      { error: 'Failed to add gallery item' },
      { status: 500 }
    )
  }
}

// DELETE - Remove gallery item
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const { ObjectId } = require('mongodb')

    await db.collection('decoration_gallery').deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting gallery item:', error)
    return NextResponse.json(
      { error: 'Failed to delete gallery item' },
      { status: 500 }
    )
  }
}
