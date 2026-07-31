import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { sendContactNotification, sendCustomerAutoReply } from '@/lib/emailService'

export async function POST(request) {
  try {
    const { name, email, phone, subject, message } = await request.json()
    
    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json({ 
        success: false,
        error: 'All fields are required' 
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid email format' 
      }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    
    // Create contact inquiry object
    const contactInquiry = {
      _id: crypto.randomUUID(),
      name,
      email,
      phone,
      subject,
      message,
      status: 'new', // new, in-progress, resolved
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Save to database
    await db.collection('contact_inquiries').insertOne(contactInquiry)

    // Send email notifications (non-blocking - don't wait for completion)
    // Send notification to business
    sendContactNotification(contactInquiry).catch(err => 
      console.error('Failed to send business notification:', err)
    )
    
    // Send auto-reply to customer
    sendCustomerAutoReply(contactInquiry).catch(err => 
      console.error('Failed to send customer auto-reply:', err)
    )

    return NextResponse.json({ 
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      inquiryId: contactInquiry._id
    })
  } catch (error) {
    console.error('Error saving contact inquiry:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to submit contact form. Please try again or call us directly.' 
    }, { status: 500 })
  }
}

// GET - Fetch all contact inquiries (for admin)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const { db } = await connectToDatabase()
    
    let query = {}
    if (status && status !== 'all') {
      query.status = status
    }
    
    const inquiries = await db.collection('contact_inquiries')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json({ 
      success: true,
      inquiries,
      count: inquiries.length
    })
  } catch (error) {
    console.error('Error fetching contact inquiries:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch contact inquiries' 
    }, { status: 500 })
  }
}
