import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('images')

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const uploadedUrls = []

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'products')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    for (const file of files) {
      if (file instanceof File) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(7)
        const extension = file.name.split('.').pop()
        const filename = `${timestamp}-${randomString}.${extension}`

        const filepath = join(uploadsDir, filename)
        await writeFile(filepath, buffer)

        // Return the public URL
        const publicUrl = `/uploads/products/${filename}`
        uploadedUrls.push(publicUrl)
      }
    }

    return NextResponse.json({ 
      success: true, 
      urls: uploadedUrls 
    })
  } catch (error) {
    console.error('Error uploading files:', error)
    return NextResponse.json({ 
      error: 'Failed to upload files', 
      details: error.message 
    }, { status: 500 })
  }
}
