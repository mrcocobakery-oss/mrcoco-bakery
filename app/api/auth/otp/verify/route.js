import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { generateToken } from '@/lib/auth/jwt'

export async function POST(request) {
  try {
    const { phone, otp, name } = await request.json()

    if (!phone || !otp) {
      return NextResponse.json({ error: 'Phone and OTP required' }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Find OTP
    const otpDoc = await db.collection('otps').findOne({
      phone,
      otp,
      verified: false,
      expiresAt: { $gt: new Date() }
    })

    if (!otpDoc) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
    }

    // Mark OTP as verified
    await db.collection('otps').updateOne(
      { _id: otpDoc._id },
      { $set: { verified: true } }
    )

    // Check if user exists
    let user = await db.collection('users').findOne({ phone })

    if (!user) {
      // Create new user
      const referralCode = 'MRC' + Math.random().toString(36).substring(2, 8).toUpperCase()
      user = {
        name: name || 'User',
        email: '',
        password: '',
        phone,
        avatar: '',
        walletBalance: 0,
        loyaltyPoints: 0,
        referralCode,
        referredBy: '',
        emailVerified: false,
        phoneVerified: true,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const result = await db.collection('users').insertOne(user)
      user._id = result.insertedId
    } else {
      // Update phone verification
      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { phoneVerified: true, updatedAt: new Date() } }
      )
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      phone: user.phone
    })

    const { password: _, ...userWithoutPassword } = user

    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60
    })

    return response
  } catch (error) {
    console.error('OTP verify error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
