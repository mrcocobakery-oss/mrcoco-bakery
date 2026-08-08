import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

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
      { projection: { password: 0 } }
    )

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    const { name, phone, avatar } = await request.json()

    // Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Phone must be 10 digits' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // Update user profile
    const updateData = {
      name: name.trim(),
      updatedAt: new Date()
    }

    if (phone) updateData.phone = phone
    if (avatar) updateData.avatar = avatar

    await db.collection('users').updateOne(
      { _id: userId },
      { $set: updateData }
    )

    // Get updated user
    const updatedUser = await db.collection('users').findOne(
      { _id: userId },
      { projection: { password: 0 } }
    )

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
