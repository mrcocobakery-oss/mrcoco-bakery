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

// GET - Fetch all products
export async function GET(request) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    let query = {}
    if (category && category !== 'all') {
      query.category = category
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    const products = await db.collection('products').find(query).sort({ createdAt: -1 }).toArray()
    
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST - Create new product
export async function POST(request) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { db } = await connectToDatabase()
    
    // Generate slug from name
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    
    const product = {
      _id: uuidv4(),
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      originalPrice: parseFloat(body.originalPrice || body.price),
      discount: body.discount || 0,
      category: body.category,
      
      // Cake-specific fields
      cakeType: body.cakeType || null,
      occasion: body.occasion || null,
      specialDay: body.specialDay || null,
      flavour: body.flavour || null,
      size: body.size || null, // e.g., "1kg", "500g"
      
      // Cookie-specific fields
      cookieType: body.cookieType || null,
      
      // Namkeen-specific fields
      namkeenType: body.namkeenType || null,
      
      // Gift-specific fields
      giftType: body.giftType || null,
      
      images: body.images || [],
      rating: 0,
      reviews: 0,
      inStock: body.inStock !== false,
      stock: parseInt(body.stock || 0),
      weight: body.weight || '',
      localDeliveryOnly: body.category === 'cakes',
      slug: slug,
      tags: body.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await db.collection('products').insertOne(product)
    
    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

// PUT - Update product
export async function PUT(request) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { _id, ...updateData } = body
    
    if (!_id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }
    
    const { db } = await connectToDatabase()
    
    // Update slug if name changed
    if (updateData.name) {
      updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }
    
    updateData.updatedAt = new Date()
    
    const result = await db.collection('products').updateOne(
      { _id },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE - Delete product
export async function DELETE(request) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }
    
    const { db } = await connectToDatabase()
    
    const result = await db.collection('products').deleteOne({ _id: productId })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
