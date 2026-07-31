import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(request) {
  try {
    const { inquiryId, status } = await request.json()
    
    if (!inquiryId || !status) {
      return NextResponse.json({ 
        success: false,
        error: 'Inquiry ID and status are required' 
      }, { status: 400 })
    }

    // Validate status
    const validStatuses = ['new', 'in-progress', 'resolved']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid status' 
      }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    
    // Update inquiry status
    const result = await db.collection('contact_inquiries').updateOne(
      { _id: inquiryId },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'Inquiry not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Status updated successfully'
    })
  } catch (error) {
    console.error('Error updating inquiry status:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to update status' 
    }, { status: 500 })
  }
}
