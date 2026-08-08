import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function PUT(request, { params }) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    const { addressId } = await params
    const { name, phone, addressLine, city, state, pincode, addressType, isDefault } = await request.json()

    // Validation
    if (!name || !phone || !addressLine || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { error: 'PIN code must be 6 digits' },
        { status: 400 }
      )
    }

    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Phone must be 10 digits' },
        { status: 400 }
      )
    }

    const { db } = await connectDB()

    // If this is set as default, unset all other defaults first
    if (isDefault) {
      await db.collection('users').updateOne(
        { _id: userId },
        { $set: { 'addresses.$[].isDefault': false } }
      )
    }

    // Update address
    const result = await db.collection('users').updateOne(
      { _id: userId, 'addresses._id': addressId },
      { 
        $set: { 
          'addresses.$.name': name,
          'addresses.$.phone': phone,
          'addresses.$.addressLine': addressLine,
          'addresses.$.city': city,
          'addresses.$.state': state,
          'addresses.$.pincode': pincode,
          'addresses.$.addressType': addressType || 'home',
          'addresses.$.isDefault': Boolean(isDefault),
          'addresses.$.updatedAt': new Date(),
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully'
    })
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    const { addressId } = await params

    const { db } = await connectDB()

    // Remove address
    const result = await db.collection('users').updateOne(
      { _id: userId },
      { 
        $pull: { addresses: { _id: addressId } },
        $set: { updatedAt: new Date() }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    )
  }
}
