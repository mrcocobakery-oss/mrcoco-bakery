import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { cookies } from 'next/headers'

// Check if user is authenticated
async function getUserFromCookies() {
  try {
    const cookieStore = await cookies()
    const userEmail = cookieStore.get('user_email')?.value
    return userEmail || null
  } catch (error) {
    return null
  }
}

// GET - Fetch user's wishlist
export async function GET(request) {
  try {
    const userEmail = await getUserFromCookies()
    
    if (!userEmail) {
      return NextResponse.json({ 
        success: false,
        error: 'Not authenticated' 
      }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    
    // Find user's wishlist
    const wishlist = await db.collection('wishlists').findOne({ userEmail })
    
    if (!wishlist) {
      return NextResponse.json({ 
        success: true,
        products: [] 
      })
    }

    // Fetch full product details for each wishlist item
    const productIds = wishlist.productIds || []
    const products = await db.collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()

    // Map to frontend format
    const mappedProducts = products.map(product => ({
      id: product._id,
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      category: product.category,
      image: product.images && product.images.length > 0 ? product.images[0] : '',
      images: product.images,
      inStock: product.inStock,
      cakeType: product.cakeType,
      flavour: product.flavour,
      size: product.size
    }))

    return NextResponse.json({ 
      success: true,
      products: mappedProducts 
    })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch wishlist' 
    }, { status: 500 })
  }
}

// POST - Add product to wishlist
export async function POST(request) {
  try {
    const userEmail = await getUserFromCookies()
    
    if (!userEmail) {
      return NextResponse.json({ 
        success: false,
        error: 'Not authenticated' 
      }, { status: 401 })
    }

    const { productId } = await request.json()
    
    if (!productId) {
      return NextResponse.json({ 
        success: false,
        error: 'Product ID required' 
      }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    
    // Add product to wishlist (using $addToSet to avoid duplicates)
    await db.collection('wishlists').updateOne(
      { userEmail },
      { 
        $addToSet: { productIds: productId },
        $setOnInsert: { createdAt: new Date() },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    )

    return NextResponse.json({ 
      success: true,
      message: 'Product added to wishlist' 
    })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to add to wishlist' 
    }, { status: 500 })
  }
}

// DELETE - Remove product from wishlist
export async function DELETE(request) {
  try {
    const userEmail = await getUserFromCookies()
    
    if (!userEmail) {
      return NextResponse.json({ 
        success: false,
        error: 'Not authenticated' 
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    
    if (!productId) {
      return NextResponse.json({ 
        success: false,
        error: 'Product ID required' 
      }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    
    // Remove product from wishlist
    await db.collection('wishlists').updateOne(
      { userEmail },
      { 
        $pull: { productIds: productId },
        $set: { updatedAt: new Date() }
      }
    )

    return NextResponse.json({ 
      success: true,
      message: 'Product removed from wishlist' 
    })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to remove from wishlist' 
    }, { status: 500 })
  }
}
