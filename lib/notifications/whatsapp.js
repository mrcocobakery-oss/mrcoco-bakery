import twilio from 'twilio'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { connectToDatabase } from '../mongodb'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID || 'your-account-sid',
  process.env.TWILIO_AUTH_TOKEN || 'your-auth-token'
)

function indianE164(raw) {
  const p = parsePhoneNumberFromString(raw, 'IN')
  if (!p?.isValid() || p.country !== 'IN') {
    throw new Error('Invalid Indian phone number')
  }
  return p.number // +91XXXXXXXXXX
}

export async function createNotification(input) {
  const { db } = await connectToDatabase()
  const now = new Date()
  
  const result = await db.collection('whatsapp_notifications').findOneAndUpdate(
    { orderId: input.orderId, type: input.type },
    { 
      $setOnInsert: { 
        ...input, 
        status: 'queued', 
        attempts: 0, 
        createdAt: now, 
        updatedAt: now 
      } 
    },
    { upsert: true, returnDocument: 'after' }
  )
  
  return result
}

export async function sendWhatsApp(notification) {
  const { db } = await connectToDatabase()
  
  // Update status to sending
  await db.collection('whatsapp_notifications').updateOne(
    { _id: notification._id },
    { $set: { status: 'sending', updatedAt: new Date() }, $inc: { attempts: 1 } }
  )

  try {
    // For Sandbox: Use simple text message
    // For Production: Use content templates with contentSid
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886',
      to: `whatsapp:${notification.to}`,
      body: notification.message,
      statusCallback: process.env.TWILIO_STATUS_CALLBACK_URL,
    })
    
    await db.collection('whatsapp_notifications').updateOne(
      { _id: notification._id },
      { $set: { status: 'accepted', twilioSid: message.sid, updatedAt: new Date() } }
    )
    
    return message.sid
  } catch (error) {
    await db.collection('whatsapp_notifications').updateOne(
      { _id: notification._id },
      { $set: { status: 'failed', lastError: String(error?.message), updatedAt: new Date() } }
    )
    throw error
  }
}

export async function queueOrderWhatsApp(args) {
  try {
    const to = indianE164(args.phone)
    
    let message = ''
    
    if (args.type === 'order_confirmed') {
      message = `Hi ${args.customerName},\n\nYour order ${args.orderId} has been placed successfully!\n\nTotal: ₹${args.total}\nItems: ${args.items}\n\nWe'll notify you when it's being prepared.\n\n- Mr. COCO Bakery`
    } else if (args.type === 'payment_confirmed') {
      message = `Hi ${args.customerName},\n\nPayment of ₹${args.total} for order ${args.orderId} was successful!\n\nTransaction ID: ${args.transactionId}\n\n- Mr. COCO Bakery`
    } else if (args.type === 'order_status') {
      message = `Hi ${args.customerName},\n\nOrder ${args.orderId} status update:\n\nStatus: ${args.status}\nTracking: ${args.tracking || 'Not available yet'}\n\nTrack here: ${args.trackingUrl || process.env.NEXT_PUBLIC_BASE_URL + '/track-order'}\n\n- Mr. COCO Bakery`
    } else if (args.type === 'order_cancelled') {
      message = `Hi ${args.customerName},\n\nOrder ${args.orderId} has been cancelled.\n\nRefund amount: ₹${args.total}\nReference: ${args.refundRef}\n\n- Mr. COCO Bakery`
    }
    
    const notification = await createNotification({
      orderId: args.orderId,
      type: args.type,
      to,
      message,
      variables: args,
    })
    
    // Send immediately (in production, use a queue like BullMQ)
    await sendWhatsApp(notification)
    
    return notification
  } catch (error) {
    console.error('WhatsApp notification error:', error)
    // Don't throw - let the order succeed even if notification fails
    return null
  }
}
