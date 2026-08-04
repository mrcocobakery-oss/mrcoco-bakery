import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { verifyEmailToken } from '@/lib/auth/email-verification'

export async function POST(request) {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }

    const { userId, email } = verifyEmailToken(token)
    const { db } = await connectToDatabase()

    const user = await db.collection('users').findOne({ _id: userId })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.email !== email) {
      return NextResponse.json({ error: 'Email mismatch' }, { status: 400 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ 
        success: true, 
        message: 'Email already verified',
        alreadyVerified: true 
      })
    }

    await db.collection('users').updateOne(
      { _id: userId },
      { $set: { emailVerified: true, updatedAt: new Date() } }
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Email verified successfully' 
    })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Invalid or expired verification token' },
      { status: 400 }
    )
  }
}
