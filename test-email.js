// Test email verification sending
import { connectToDatabase } from './lib/mongodb.js'
import { sendVerificationEmail } from './lib/auth/email-verification.js'

async function testEmail() {
  try {
    console.log('🧪 Starting email verification test...\n')
    
    // Create a test user object
    const testUser = {
      _id: 'test-user-' + Date.now(),
      name: 'Test Customer',
      email: 'mrcocobakery@gmail.com',
    }
    
    console.log('📧 Sending verification email to:', testUser.email)
    console.log('👤 User:', testUser.name)
    console.log('')
    
    // Send verification email
    await sendVerificationEmail(testUser)
    
    console.log('\n✅ SUCCESS! Verification email sent successfully!')
    console.log('\n📬 Please check your inbox at: mrcocobakery@gmail.com')
    console.log('📁 Also check your spam/junk folder if you don\'t see it')
    console.log('\nEmail subject: "✉️ Verify Your Email - Mr. COCO Bakery"')
    
  } catch (error) {
    console.error('\n❌ ERROR sending email:', error.message)
    console.error('\nFull error:', error)
  }
  
  process.exit(0)
}

testEmail()
