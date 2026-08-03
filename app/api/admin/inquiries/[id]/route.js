import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// PATCH - Update inquiry status
export async function PATCH(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { status, notes } = body

    const { db } = await connectToDatabase()
    const { ObjectId } = require('mongodb')

    const updateData = {
      status: status || 'new',
      updatedAt: new Date().toISOString()
    }

    if (notes !== undefined) {
      updateData.notes = notes
    }

    await db.collection('inquiries').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to update inquiry' },
      { status: 500 }
    )
  }
}

// DELETE - Delete inquiry
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const { db } = await connectToDatabase()
    const { ObjectId } = require('mongodb')

    await db.collection('inquiries').deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to delete inquiry' },
      { status: 500 }
    )
  }
}
