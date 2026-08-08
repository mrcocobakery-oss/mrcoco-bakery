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

// POST - Upload new catalogue
export async function POST(request) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { fileUrl, fileName, fileSize } = body

    if (!fileUrl || !fileName) {
      return NextResponse.json(
        { error: 'File URL and name are required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // Delete old catalogue
    await db.collection('catalogue').deleteMany({})
    
    // Add new catalogue
    const catalogueData = {
      fileUrl,
      fileName,
      fileSize: fileSize || 0,
      uploadedAt: new Date()
    }

    await db.collection('catalogue').insertOne(catalogueData)

    return NextResponse.json({
      success: true,
      message: 'Catalogue uploaded successfully',
      catalogue: catalogueData
    })
  } catch (error) {
    console.error('Error uploading catalogue:', error)
    return NextResponse.json(
      { error: 'Failed to upload catalogue' },
      { status: 500 }
    )
  }
}

// DELETE - Delete catalogue
export async function DELETE(request) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { db } = await connectToDatabase()
    
    await db.collection('catalogue').deleteMany({})

    return NextResponse.json({
      success: true,
      message: 'Catalogue deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting catalogue:', error)
    return NextResponse.json(
      { error: 'Failed to delete catalogue' },
      { status: 500 }
    )
  }
}
