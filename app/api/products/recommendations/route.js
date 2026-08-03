import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// GET - Get personalized product recommendations based on browsing history
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const recentlyViewedParam = searchParams.get('recentlyViewed') // Comma-separated product IDs
    const limit = parseInt(searchParams.get('limit') || '6')

    if (!recentlyViewedParam) {
      return NextResponse.json(
        { error: 'Recently viewed products required' },
        { status: 400 }
      )
    }

    const recentlyViewedIds = recentlyViewedParam.split(',').filter(id => id)

    if (recentlyViewedIds.length === 0) {
      return NextResponse.json({ success: true, products: [], count: 0 })
    }

    const { db } = await connectToDatabase()

    // Fetch recently viewed products to analyze patterns
    const recentProducts = await db.collection('products')
      .find({ _id: { $in: recentlyViewedIds } })
      .toArray()

    if (recentProducts.length === 0) {
      return NextResponse.json({ success: true, products: [], count: 0 })
    }

    // Extract categories, occasions, themes from browsing history
    const categories = [...new Set(recentProducts.map(p => p.category).filter(Boolean))]
    const occasions = [...new Set(recentProducts.flatMap(p => p.occasion ? [p.occasion] : []))]
    const themes = [...new Set(recentProducts.flatMap(p => p.theme ? [p.theme] : []))]
    
    // Calculate average price range from browsing history
    const prices = recentProducts.map(p => p.price)
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
    const minPrice = avgPrice * 0.5  // 50% below average
    const maxPrice = avgPrice * 1.5  // 50% above average

    // Build smart recommendation query
    const recommendationQuery = {
      _id: { $nin: recentlyViewedIds }, // Exclude already viewed products
      inStock: true,
      $or: []
    }

    // Priority 1: Same category + (same occasion OR theme)
    if (categories.length > 0) {
      if (occasions.length > 0) {
        recommendationQuery.$or.push({
          category: { $in: categories },
          occasion: { $in: occasions }
        })
      }
      if (themes.length > 0) {
        recommendationQuery.$or.push({
          category: { $in: categories },
          theme: { $in: themes }
        })
      }
    }

    // Priority 2: Same category + similar price range
    if (categories.length > 0) {
      recommendationQuery.$or.push({
        category: { $in: categories },
        price: { $gte: minPrice, $lte: maxPrice }
      })
    }

    // Priority 3: Just same category
    if (categories.length > 0) {
      recommendationQuery.$or.push({
        category: { $in: categories }
      })
    }

    // If no specific criteria, get best sellers
    if (recommendationQuery.$or.length === 0) {
      delete recommendationQuery.$or
    }

    // Fetch recommendations
    let recommendations = await db.collection('products')
      .find(recommendationQuery)
      .sort({ reviews: -1, rating: -1 }) // Sort by popularity
      .limit(limit)
      .toArray()

    // If still not enough, get general best sellers
    if (recommendations.length < limit) {
      const additionalProducts = await db.collection('products')
        .find({
          _id: { $nin: [...recentlyViewedIds, ...recommendations.map(p => p._id)] },
          inStock: true
        })
        .sort({ reviews: -1, rating: -1 })
        .limit(limit - recommendations.length)
        .toArray()
      
      recommendations = [...recommendations, ...additionalProducts]
    }

    // Map to frontend format
    const mappedProducts = recommendations.map(product => ({
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
      basedOn: {
        categories,
        occasions,
        themes,
        priceRange: { min: Math.round(minPrice), max: Math.round(maxPrice) }
      }
    })
  } catch (error) {
    console.error('Error getting recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    )
  }
}
