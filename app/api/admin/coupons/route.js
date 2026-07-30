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

// GET - Fetch all coupons
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
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    const coupons = await db.collection('coupons').find(query).sort({ createdAt: -1 }).toArray()
    
    return NextResponse.json({ coupons })
  } catch (error) {
    console.error('Error fetching coupons:', error)
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 })
  }
}

// POST - Create coupon
export async function POST(request) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { db } = await connectToDatabase()
    
    // Check if code already exists
    const existing = await db.collection('coupons').findOne({ code: body.code.toUpperCase() })
    if (existing) {
      return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 })
    }
    
    const coupon = {
      _id: uuidv4(),
      code: body.code.toUpperCase(),
      description: body.description,
      discountType: body.discountType || 'percentage',
      discountValue: parseFloat(body.discountValue),
      minOrderValue: parseFloat(body.minOrderValue || 0),
      maxDiscount: parseFloat(body.maxDiscount || 0),
      usageLimit: parseInt(body.usageLimit || 0),
      usedCount: 0,
      validFrom: new Date(body.validFrom),
      validTo: new Date(body.validTo),
      isActive: body.isActive !== false,
      applicableCategories: body.applicableCategories || [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await db.collection('coupons').insertOne(coupon)
    
    return NextResponse.json({ success: true, coupon })
  } catch (error) {
    console.error('Error creating coupon:', error)
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 })
  }
}

// PUT - Update coupon
export async function PUT(request) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { _id, ...updateData } = body
    
    if (!_id) {
      return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 })
    }
    
    const { db } = await connectToDatabase()
    
    updateData.updatedAt = new Date()
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase()
    }
    
    const result = await db.collection('coupons').updateOne(
      { _id },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating coupon:', error)
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 })
  }
}

// DELETE - Delete coupon
export async function DELETE(request) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const couponId = searchParams.get('id')
    
    if (!couponId) {
      return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 })
    }
    
    const { db } = await connectToDatabase()
    
    const result = await db.collection('coupons').deleteOne({ _id: couponId })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting coupon:', error)
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 })
  }
}
