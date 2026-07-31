import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '@/lib/emailService'

export async function POST(request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ 
        success: false,
        error: 'Email is required' 
      }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    
    // Check if user exists
    const user = await db.collection('users').findOne({ email })
    
    // For security, always return success even if user doesn't exist
    if (!user) {
      return NextResponse.json({ 
        success: true,
        message: 'If an account exists with this email, you will receive a reset link.' 
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to user
    await db.collection('users').updateOne(
      { email },
      { 
        $set: { 
          resetToken,
          resetTokenExpiry,
          updatedAt: new Date()
        }
      }
    )

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${resetToken}`
    await sendPasswordResetEmail(user, resetUrl)

    return NextResponse.json({ 
      success: true,
      message: 'Password reset email sent successfully' 
    })
  } catch (error) {
    console.error('Error in forgot password:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to process request' 
    }, { status: 500 })
  }
}
