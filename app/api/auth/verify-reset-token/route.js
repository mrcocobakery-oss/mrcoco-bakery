import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.json({ valid: false })
    }

    const { db } = await connectToDatabase()
    
    // Check if token exists and is not expired
    const user = await db.collection('users').findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    })

    return NextResponse.json({ valid: !!user })
  } catch (error) {
    console.error('Error verifying reset token:', error)
    return NextResponse.json({ valid: false })
  }
}
