import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { cookies } from 'next/headers'

// Helper to verify admin
function verifyAdmin(request) {
  const cookieStore = cookies()
  const adminToken = cookieStore.get('admin_token')?.value
  const authHeader = request.headers.get('Authorization')
  
  if (!adminToken && !authHeader?.startsWith('Bearer ')) {
    return false
  }
  
  const token = adminToken || authHeader?.replace('Bearer ', '')
  return token === 'admin_logged_in'
}

// POST - Upload/Update menu image
export async function POST(request) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { imageUrl } = body

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    const menuData = {
      imageUrl,
      updatedAt: new Date()
    }

    // Use updateOne with upsert to ensure only one menu document exists
    await db.collection('menu').updateOne(
      {},
      { $set: menuData },
      { upsert: true }
    )

    const updatedMenu = await db.collection('menu').findOne({})

    return NextResponse.json({
      success: true,
      message: 'Menu uploaded successfully',
      menu: updatedMenu
    })
  } catch (error) {
    console.error('Error uploading menu:', error)
    return NextResponse.json(
      { error: 'Failed to upload menu' },
      { status: 500 }
    )
  }
}

// DELETE - Delete menu image
export async function DELETE(request) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { db } = await connectToDatabase()
    
    await db.collection('menu').deleteMany({})

    return NextResponse.json({
      success: true,
      message: 'Menu deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting menu:', error)
    return NextResponse.json(
      { error: 'Failed to delete menu' },
      { status: 500 }
    )
  }
}
