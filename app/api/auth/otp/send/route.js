import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(request) {
  try {
    const { phone } = await request.json()

    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: 'Valid 10-digit phone number required' }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP (expires in 10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    
    await db.collection('otps').insertOne({
      phone,
      otp,
      expiresAt,
      verified: false,
      createdAt: new Date()
    })

    // In mock system, return OTP in response (in production, send via SMS)
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      otp: otp, // MOCK: Remove in production
      expiresIn: 600 // seconds
    })
  } catch (error) {
    console.error('OTP send error:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
