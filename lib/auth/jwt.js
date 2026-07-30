import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'mrcoco-bakery-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  const cookies = request.headers.get('cookie')
  if (cookies) {
    const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('token='))
    if (tokenCookie) {
      return tokenCookie.split('=')[1]
    }
  }
  
  return null
}

export function getUserFromRequest(request) {
  const token = getTokenFromRequest(request)
  if (!token) return null
  
  return verifyToken(token)
}
