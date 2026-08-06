import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { exchangeGoogleCode } from '@/lib/auth/google'
import Cookies from 'js-cookie'

export async function GET(request) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const returnedState = searchParams.get('state')
  const savedState = request.cookies.get('google_oauth_state')?.value

  if (!code || !returnedState || !savedState || returnedState !== savedState) {
    return NextResponse.redirect(new URL('/login?error=oauth_state', request.url))
  }

  try {
    const google = await exchangeGoogleCode(code)
    const { db } = await connectToDatabase()
    const users = db.collection('users')

    // Find by Google Sub first
    let user = await users.findOne({ googleSub: google.googleSub })

    if (!user) {
      // Check if email already exists
      const existing = await users.findOne({ email: google.email })

      if (existing) {
        // Link Google account to existing user
        await users.updateOne(
          { _id: existing._id },
          {
            $set: {
              googleSub: google.googleSub,
              profilePicture: existing.profilePicture || google.profilePicture,
              emailVerified: true, // Google email is verified
              updatedAt: new Date(),
            },
            $addToSet: { authProviders: 'google' },
          }
        )
        user = await users.findOne({ _id: existing._id })
      } else {
        // Create new user
        const newUser = {
          email: google.email,
          name: google.name,
          profilePicture: google.profilePicture,
          googleSub: google.googleSub,
          authProviders: ['google'],
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        const result = await users.insertOne(newUser)
        user = { ...newUser, _id: result.insertedId }
      }
    } else {
      // Update last login
      await users.updateOne(
        { _id: user._id },
        { $set: { updatedAt: new Date() }, $addToSet: { authProviders: 'google' } }
      )
    }

    if (!user) throw new Error('Unable to create or locate user')

    // Create JWT session token
    const jwt = require('jsonwebtoken')
    const JWT_SECRET = process.env.JWT_SECRET || 'mrcoco-bakery-secret-key-change-in-production'
    
    const sessionToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    // Redirect to homepage after successful login
    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.set('token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })
    response.cookies.delete('google_oauth_state')
    
    return response
  } catch (error) {
    console.error('Google OAuth failed', error instanceof Error ? error.message : error)
    return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url))
  }
}
