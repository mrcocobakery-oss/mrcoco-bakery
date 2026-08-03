import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// GET - Search products by name, tags, keywords
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.length < 2) {
      return NextResponse.json({ 
        success: false,
        error: 'Search query must be at least 2 characters',
        products: [] 
      })
    }

    const { db } = await connectToDatabase()

    // Search across multiple fields including tags
    const searchQuery = {
      $and: [
        { inStock: true }, // Only show in-stock products
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } },
            { tags: { $regex: query, $options: 'i' } },
            { flavour: { $regex: query, $options: 'i' } },
            { occasion: { $regex: query, $options: 'i' } },
            { specialDay: { $regex: query, $options: 'i' } },
            { cakeType: { $regex: query, $options: 'i' } },
            { theme: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    }

    const products = await db.collection('products')
      .find(searchQuery)
      .limit(limit)
      .sort({ rating: -1, createdAt: -1 }) // Sort by rating and newest
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
      image: product.images && product.images.length > 0 
        ? product.images[0] 
        : 'https://images.pexels.com/photos/35583855/pexels-photo-35583855.jpeg',
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      inStock: product.inStock,
      slug: product.slug
    }))

    return NextResponse.json({ 
      success: true,
      products: mappedProducts,
      count: mappedProducts.length,
      query 
    })
  } catch (error) {
    console.error('Error searching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search products', products: [] },
      { status: 500 }
    )
  }
}
