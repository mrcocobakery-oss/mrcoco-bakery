import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { sendEmail } from '../emailService'

const SECRET = process.env.EMAIL_VERIFICATION_SECRET || 'your-email-verification-secret-change-this'

export function generateVerificationToken(userId, email) {
  return jwt.sign(
    { userId, email, type: 'email_verification' },
    SECRET,
    { expiresIn: '24h' }
  )
}

export function verifyEmailToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET)
    if (decoded.type !== 'email_verification') {
      throw new Error('Invalid token type')
    }
    return { userId: decoded.userId, email: decoded.email }
  } catch (error) {
    throw new Error('Invalid or expired verification token')
  }
}

export async function sendVerificationEmail(user) {
  const token = generateVerificationToken(user._id.toString(), user.email)
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 15px 30px; background: #ec4899; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎂 Mr. COCO Bakery</h1>
        </div>
        <div class="content">
          <h2>Welcome, ${user.name}!</h2>
          <p>Thank you for signing up with Mr. COCO Bakery. To complete your registration and verify your email address, please click the button below:</p>
          <center>
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </center>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p><strong>This link will expire in 24 hours.</strong></p>
          <p>If you didn't create an account with us, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Mr. COCO Bakery. All rights reserved.</p>
          <p>Teenpani & Rampur Road, Haldwani</p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: user.email,
    subject: '✉️ Verify Your Email - Mr. COCO Bakery',
    html
  })
}
