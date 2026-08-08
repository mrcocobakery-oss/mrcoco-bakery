import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request) {
  try {
    const { fileName } = await request.json()

    const timestamp = Math.round(new Date().getTime() / 1000)
    const folder = 'catalogues'
    
    // Create signature
    const stringToSign = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`
    const signature = crypto
      .createHash('sha1')
      .update(stringToSign)
      .digest('hex')

    return NextResponse.json({
      success: true,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    })
  } catch (error) {
    console.error('Error generating upload signature:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    )
  }
}
