import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// POST - Submit inquiry
export async function POST(request) {
  try {
    const body = await request.json()
    const { type, name, email, phone, message, ...otherFields } = body

    // Validate required fields
    if (!type || !name || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    const inquiry = {
      type, // 'decoration', 'baking-course', 'partnership'
      name,
      email: email || '',
      phone,
      message: message || '',
      ...otherFields,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = await db.collection('inquiries').insertOne(inquiry)

    return NextResponse.json({
      success: true,
      inquiryId: result.insertedId.toString()
    })
  } catch (error) {
    console.error('Error submitting inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    )
  }
}

// GET - Fetch inquiries (for admin - will add auth later)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    const { db } = await connectToDatabase()

    let query = {}
    if (type && type !== 'all') {
      query.type = type
    }

    const inquiries = await db.collection('inquiries')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray()

    return NextResponse.json({
      inquiries: inquiries.map(inq => ({
        ...inq,
        _id: inq._id.toString()
      }))
    })
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}
