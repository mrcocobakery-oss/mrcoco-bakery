import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { sendVerificationEmail } from '@/lib/auth/email-verification'

export async function POST(request) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const user = await db.collection('users').findOne({ _id: userId })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 })
    }

    await sendVerificationEmail(user)

    return NextResponse.json({ 
      success: true, 
      message: 'Verification email sent successfully' 
    })
  } catch (error) {
    console.error('Send verification error:', error)
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    )
  }
}
