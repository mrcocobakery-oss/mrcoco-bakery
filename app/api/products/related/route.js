import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// GET - Fetch related products for a specific product
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const limit = parseInt(searchParams.get('limit') || '5')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // First, get the current product details
    const currentProduct = await db.collection('products').findOne({ _id: productId })

    if (!currentProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Build query for related products
    const relatedQuery = {
      _id: { $ne: productId }, // Exclude current product
      inStock: true,
      category: currentProduct.category // Same category
    }

    // For cakes, also match occasion or theme if available
    if (currentProduct.category === 'cakes') {
      if (currentProduct.occasion || currentProduct.theme) {
        relatedQuery.$or = []
        if (currentProduct.occasion) {
          relatedQuery.$or.push({ occasion: currentProduct.occasion })
        }
        if (currentProduct.theme) {
          relatedQuery.$or.push({ theme: currentProduct.theme })
        }
      }
    }

    // Price range: ±30% of current product price
    const minPrice = currentProduct.price * 0.7
    const maxPrice = currentProduct.price * 1.3

    // First try: Same category + similar attributes + price range
    let relatedProducts = await db.collection('products')
      .find({
        ...relatedQuery,
        price: { $gte: minPrice, $lte: maxPrice }
      })
      .sort({ rating: -1, reviews: -1 }) // Sort by best rated
      .limit(limit)
      .toArray()

    // If not enough products, try without price constraint
    if (relatedProducts.length < limit) {
      const additionalProducts = await db.collection('products')
        .find(relatedQuery)
        .sort({ rating: -1, reviews: -1 })
        .limit(limit - relatedProducts.length)
        .toArray()
      
      relatedProducts = [...relatedProducts, ...additionalProducts]
    }

    // If still not enough, get best sellers from same category
    if (relatedProducts.length < limit) {
      const bestSellers = await db.collection('products')
        .find({
          _id: { $ne: productId },
          category: currentProduct.category,
          inStock: true
        })
        .sort({ reviews: -1, rating: -1 })
        .limit(limit - relatedProducts.length)
        .toArray()
      
      relatedProducts = [...relatedProducts, ...bestSellers]
    }

    // Remove duplicates and limit to requested amount
    const uniqueProducts = Array.from(
      new Map(relatedProducts.map(p => [p._id, p])).values()
    ).slice(0, limit)

    // Map to frontend format
    const mappedProducts = uniqueProducts.map(product => ({
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
      count: mappedProducts.length
    })
  } catch (error) {
    console.error('Error fetching related products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch related products' },
      { status: 500 }
    )
  }
}
