import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { v4 as uuidv4 } from 'uuid'

// POST - Create bulk order inquiry
export async function POST(request) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()
    
    const bulkOrder = {
      _id: uuidv4(),
      companyName: body.companyName,
      contactPerson: body.contactPerson,
      phone: body.phone,
      whatsapp: body.whatsapp || body.phone,
      email: body.email,
      city: body.city,
      state: body.state,
      businessType: body.businessType,
      products: body.products,
      quantity: body.quantity,
      budget: body.budget,
      deliveryDate: body.deliveryDate,
      message: body.message,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await db.collection('bulk_orders').insertOne(bulkOrder)
    
    // TODO: Send notification to admin
    // await sendNotification('admin@mrcoco.com', 'New Bulk Order Inquiry', bulkOrder)
    
    return NextResponse.json({ success: true, orderId: bulkOrder._id })
  } catch (error) {
    console.error('Error creating bulk order:', error)
    return NextResponse.json({ error: 'Failed to create bulk order' }, { status: 500 })
  }
}

// GET - Fetch bulk orders (admin only)
export async function GET(request) {
  try {
    const { db } = await connectToDatabase()
    const orders = await db.collection('bulk_orders').find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching bulk orders:', error)
    return NextResponse.json({ error: 'Failed to fetch bulk orders' }, { status: 500 })
  }
}
