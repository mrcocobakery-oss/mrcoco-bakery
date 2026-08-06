import { NextResponse } from 'next/server'
import { sendVerificationEmail } from '@/lib/auth/email-verification'

export async function GET() {
  try {
    // Create a test user object
    const testUser = {
      _id: 'test-user-' + Date.now(),
      name: 'Test Customer',
      email: 'mrcocobakery@gmail.com',
    }
    
    console.log('📧 Sending test verification email to:', testUser.email)
    
    // Send verification email
    await sendVerificationEmail(testUser)
    
    return NextResponse.json({
      success: true,
      message: 'Test verification email sent successfully!',
      sentTo: testUser.email,
      instructions: 'Please check your inbox and spam folder'
    })
  } catch (error) {
    console.error('Error sending test email:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        details: 'Check server logs for more information'
      },
      { status: 500 }
    )
  }
}
