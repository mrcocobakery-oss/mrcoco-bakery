import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { connectToDatabase } from '@/lib/mongodb'
import crypto from 'crypto'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx'
}

const KIND_FOLDERS = {
  product_image: 'products',
  customer_photo: 'customers',
  document: 'documents',
  media: 'media'
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const kind = formData.get('kind') || 'media'
    const userId = formData.get('userId') || 'guest'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Max 10MB' }, { status: 400 })
    }

    // Validate kind
    if (!KIND_FOLDERS[kind]) {
      return NextResponse.json({ error: 'Invalid upload kind' }, { status: 400 })
    }

    // Generate unique filename
    const ext = ALLOWED_TYPES[file.type]
    const uniqueId = crypto.randomUUID()
    const storedName = `${uniqueId}.${ext}`
    const folder = KIND_FOLDERS[kind]
    const relativePath = `/uploads/${folder}/${storedName}`
    const publicDir = path.join(process.cwd(), 'public')
    const uploadDir = path.join(publicDir, 'uploads', folder)
    const filePath = path.join(uploadDir, storedName)

    // Ensure upload directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Save metadata to MongoDB
    const { db } = await connectToDatabase()
    const mediaDoc = {
      userId,
      kind,
      filename: file.name,
      storedName,
      path: relativePath,
      url: relativePath, // Relative URL for Next.js Image
      mimeType: file.type,
      size: file.size,
      status: 'uploaded',
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('media').insertOne(mediaDoc)

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      url: relativePath,
      filename: file.name,
      size: file.size,
      mimeType: file.type
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 })
  }
}

// GET endpoint to retrieve uploaded files
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const kind = searchParams.get('kind')
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '50')

    const { db } = await connectToDatabase()
    const query = {}
    if (kind) query.kind = kind
    if (userId) query.userId = userId

    const files = await db.collection('media')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    return NextResponse.json({ success: true, files })
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 })
  }
}

// DELETE endpoint to remove files
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'No file ID provided' }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const { ObjectId } = require('mongodb')
    
    const file = await db.collection('media').findOne({ _id: new ObjectId(id) })
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Delete from filesystem
    const { unlink } = require('fs/promises')
    const filePath = path.join(process.cwd(), 'public', file.path)
    try {
      await unlink(filePath)
    } catch (err) {
      console.error('Error deleting file:', err)
    }

    // Delete from database
    await db.collection('media').deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
