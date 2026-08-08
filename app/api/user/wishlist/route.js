import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    const { db } = await connectDB()
    
    // Get user's wishlist
    const user = await db.collection('users').findOne(
      { _id: userId },
      { projection: { wishlist: 1 } }
    )

    if (!user || !user.wishlist || user.wishlist.length === 0) {
      return NextResponse.json({
        success: true,
        wishlist: []
      })
    }

    // Get product details for wishlist items
    const products = await db.collection('products')
      .find({ _id: { $in: user.wishlist } })
      .toArray()

    return NextResponse.json({
      success: true,
      wishlist: products
    })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    const { productId } = await request.json()

    const { db } = await connectDB()

    // Remove from wishlist
    await db.collection('users').updateOne(
      { _id: userId },
      { 
        $pull: { wishlist: productId },
        $set: { updatedAt: new Date() }
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Removed from wishlist'
    })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}
