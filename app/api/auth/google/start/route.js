import { NextResponse } from 'next/server'
import { googleAuthorizationUrl } from '@/lib/auth/google'

export async function GET() {
  const { url, state } = googleAuthorizationUrl()
  const response = NextResponse.redirect(url)
  
  response.cookies.set('google_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600, // 10 minutes
  })
  
  return response
}
