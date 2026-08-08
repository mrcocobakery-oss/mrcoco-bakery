import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    const { db } = await connectToDatabase()
    
    const user = await db.collection('users').findOne(
      { _id: userId },
      { projection: { addresses: 1 } }
    )

    return NextResponse.json({
      success: true,
      addresses: user?.addresses || []
    })
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

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

    const { db } = await connectToDatabase()
    
    const newAddress = {
      _id: uuidv4(),
      name,
      phone,
      addressLine,
      city,
      state,
      pincode,
      addressType: addressType || 'home',
      isDefault: Boolean(isDefault),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // If this is set as default, unset all other defaults
    if (newAddress.isDefault) {
      await db.collection('users').updateOne(
        { _id: userId },
        { $set: { 'addresses.$[].isDefault': false } }
      )
    }

    // Add new address
    await db.collection('users').updateOne(
      { _id: userId },
      { 
        $push: { addresses: newAddress },
        $set: { updatedAt: new Date() }
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Address added successfully',
      address: newAddress
    })
  } catch (error) {
    console.error('Error adding address:', error)
    return NextResponse.json(
      { error: 'Failed to add address' },
      { status: 500 }
    )
  }
}
