import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { hashPassword } from '@/lib/auth/password'
import { generateToken } from '@/lib/auth/jwt'

export async function POST(request) {
  try {
    const { name, email, password, phone, referralCode: inputReferralCode } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    // Validate referral code if provided
    let referrer = null
    if (inputReferralCode && inputReferralCode.trim()) {
      referrer = await db.collection('users').findOne({ 
        referralCode: inputReferralCode.trim().toUpperCase() 
      })
      
      if (!referrer) {
        return NextResponse.json({ 
          error: 'Invalid referral code' 
        }, { status: 400 })
      }
    }

    // Generate unique referral code
    const referralCode = 'MRC' + Math.random().toString(36).substring(2, 8).toUpperCase()

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user with initial wallet balance if referred
    const user = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      avatar: '',
      walletBalance: 0,
      loyaltyPoints: 0,
      referralCode,
      referredBy: referrer ? referrer.referralCode : '',
      wishlist: [],
      addresses: [],
      emailVerified: false,
      phoneVerified: false,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('users').insertOne(user)
    const userId = result.insertedId.toString()

    // If referred by someone, credit ₹50 to referrer's wallet
    if (referrer) {
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Credit referrer's wallet
      await db.collection('users').updateOne(
        { _id: referrer._id },
        { 
          $inc: { walletBalance: 50 },
          $set: { updatedAt: new Date() }
        }
      )

      // Create transaction record for referrer
      await db.collection('transactions').insertOne({
        _id: transactionId,
        userId: referrer._id,
        type: 'credit',
        amount: 50,
        description: `Referral bonus - ${name} joined using your code`,
        status: 'completed',
        category: 'referral_bonus',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    // Generate JWT token
    const token = generateToken({
      userId,
      email: user.email
    })

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    const response = NextResponse.json({
      success: true,
      user: { ...userWithoutPassword, _id: userId },
      token,
      ...(referrer && { message: 'Account created! Your referrer earned ₹50!' })
    })

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Signup failed: ' + error.message }, { status: 500 })
  }
}
