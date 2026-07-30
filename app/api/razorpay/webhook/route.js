export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-razorpay-signature')
    const eventId = request.headers.get('x-razorpay-event-id')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex')

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }

    // Parse event
    const event = JSON.parse(rawBody)
    const { db } = await connectToDatabase()

    // Check for duplicate webhook events
    if (eventId) {
      const existingEvent = await db.collection('webhook_events').findOne({ eventId })
      if (existingEvent) {
        return NextResponse.json({ success: true, message: 'Duplicate event ignored' })
      }
      // Store event ID to prevent duplicates
      await db.collection('webhook_events').insertOne({
        eventId,
        event: event.event,
        createdAt: new Date()
      })
    }

    // Handle different event types
    const eventType = event.event
    const payment = event.payload?.payment?.entity
    const orderId = payment?.order_id

    if (orderId) {
      let status = 'pending'
      
      switch (eventType) {
        case 'payment.authorized':
          status = 'authorized'
          break
        case 'payment.captured':
        case 'order.paid':
          status = 'paid'
          break
        case 'payment.failed':
          status = 'failed'
          break
      }

      // Update order status
      await db.collection('orders').updateOne(
        { orderId: orderId },
        {
          $set: {
            status: status,
            webhookEvent: eventType,
            webhookData: event,
            updatedAt: new Date()
          }
        }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed: ' + error.message },
      { status: 500 }
    )
  }
}
