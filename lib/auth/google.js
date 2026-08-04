import { OAuth2Client } from 'google-auth-library'
import crypto from 'crypto'

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID || 'your-client-id',
  process.env.GOOGLE_CLIENT_SECRET || 'your-client-secret',
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
)

export function googleAuthorizationUrl() {
  const state = crypto.randomBytes(32).toString('hex')
  const url = client.generateAuthUrl({
    access_type: 'online',
    scope: ['openid', 'email', 'profile'],
    state,
    prompt: 'select_account',
  })
  return { url, state }
}

export async function exchangeGoogleCode(code) {
  const { tokens } = await client.getToken({
    code,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback',
  })

  if (!tokens.id_token) throw new Error('Google did not return an ID token')

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  })
  const p = ticket.getPayload()
  if (!p?.sub || !p.email || p.email_verified !== true) {
    throw new Error('Google account has no verified email')
  }

  return {
    googleSub: p.sub,
    email: p.email.trim().toLowerCase(),
    name: p.name?.trim() || p.email.split('@')[0],
    profilePicture: p.picture || undefined,
  }
}
