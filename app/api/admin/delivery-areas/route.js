import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { v4 as uuidv4 } from 'uuid'

// Admin authentication check
function checkAdminAuth(request) {
  const authHeader = request.headers.get('authorization')
  const adminToken = request.cookies.get('admin_token')?.value
  
  if (adminToken !== 'admin_logged_in' && authHeader !== 'Bearer admin_logged_in') {
    return false
  }
  return true
}

// GET - Fetch all delivery areas
export async function GET(request) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    
    let query = {}
    if (search) {
      query.$or = [
        { pincode: { $regex: search, $options: 'i' } },
        { area: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ]
    }
    
    const areas = await db.collection('delivery_areas').find(query).sort({ createdAt: -1 }).toArray()
    
    return NextResponse.json({ areas })
  } catch (error) {
    console.error('Error fetching delivery areas:', error)
    return NextResponse.json({ error: 'Failed to fetch delivery areas' }, { status: 500 })
  }
}

// POST - Create delivery area
export async function POST(request) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { db } = await connectToDatabase()
    
    const area = {
      _id: uuidv4(),
      pincode: body.pincode,
      area: body.area,
      city: body.city,
      state: body.state,
      deliveryFee: parseFloat(body.deliveryFee || 0),
      cakeDeliveryAvailable: body.cakeDeliveryAvailable !== false,
      isActive: body.isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await db.collection('delivery_areas').insertOne(area)
    
    return NextResponse.json({ success: true, area })
  } catch (error) {
    console.error('Error creating delivery area:', error)
    return NextResponse.json({ error: 'Failed to create delivery area' }, { status: 500 })
  }
}

// PUT - Update delivery area
export async function PUT(request) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { _id, ...updateData } = body
    
    if (!_id) {
      return NextResponse.json({ error: 'Area ID is required' }, { status: 400 })
    }
    
    const { db } = await connectToDatabase()
    
    updateData.updatedAt = new Date()
    
    const result = await db.collection('delivery_areas').updateOne(
      { _id },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Area not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating delivery area:', error)
    return NextResponse.json({ error: 'Failed to update delivery area' }, { status: 500 })
  }
}

// DELETE - Delete delivery area
export async function DELETE(request) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const areaId = searchParams.get('id')
    
    if (!areaId) {
      return NextResponse.json({ error: 'Area ID is required' }, { status: 400 })
    }
    
    const { db } = await connectToDatabase()
    
    const result = await db.collection('delivery_areas').deleteOne({ _id: areaId })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Area not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting delivery area:', error)
    return NextResponse.json({ error: 'Failed to delete delivery area' }, { status: 500 })
  }
}
