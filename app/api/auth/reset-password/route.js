import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { token, password } = await request.json()
    
    if (!token || !password) {
      return NextResponse.json({ 
        success: false,
        error: 'Token and password are required' 
      }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ 
        success: false,
        error: 'Password must be at least 6 characters' 
      }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    
    // Find user with valid reset token
    const user = await db.collection('users').findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    })

    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid or expired reset token' 
      }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update password and clear reset token
    await db.collection('users').updateOne(
      { _id: user._id },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        },
        $unset: {
          resetToken: '',
          resetTokenExpiry: ''
        }
      }
    )

    return NextResponse.json({ 
      success: true,
      message: 'Password reset successful' 
    })
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to reset password' 
    }, { status: 500 })
  }
}
