import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// Public GET endpoint - No authentication required
export async function GET(request) {
  try {
    const { db } = await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999')
    const minRating = parseFloat(searchParams.get('minRating') || '0')
    const availability = searchParams.get('availability') // 'instock' or 'all'
    const sortBy = searchParams.get('sortBy') || 'newest' // 'price-asc', 'price-desc', 'rating', 'newest'
    
    let query = {}
    
    // Availability filter
    if (availability === 'instock' || !availability) {
      query.inStock = true
    }
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    // Price range filter
    if (minPrice > 0 || maxPrice < 999999) {
      query.price = { $gte: minPrice, $lte: maxPrice }
    }
    
    // Rating filter
    if (minRating > 0) {
      query.rating = { $gte: minRating }
    }
    
    // Determine sort order
    let sortOptions = { createdAt: -1 } // Default: newest first
    switch (sortBy) {
      case 'price-asc':
        sortOptions = { price: 1 }
        break
      case 'price-desc':
        sortOptions = { price: -1 }
        break
      case 'rating':
        sortOptions = { rating: -1 }
        break
      case 'newest':
        sortOptions = { createdAt: -1 }
        break
    }
    
    const products = await db.collection('products')
      .find(query)
      .sort(sortOptions)
      .toArray()
    
    // Map database fields to frontend format
    const mappedProducts = products.map(product => ({
      id: product._id, // Map _id to id
      _id: product._id, // Keep _id too for compatibility
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      category: product.category,
      
      // Cake-specific fields
      cakeType: product.cakeType,
      occasion: product.occasion,
      specialDay: product.specialDay,
      flavour: product.flavour,
      size: product.size,
      
      // Cookie-specific fields
      cookieType: product.cookieType,
      
      // Namkeen-specific fields
      namkeenType: product.namkeenType,
      
      // Gift-specific fields
      giftType: product.giftType,
      
      // Map images array to single image string (use first image)
      image: product.images && product.images.length > 0 
        ? product.images[0] 
        : 'https://images.pexels.com/photos/35583855/pexels-photo-35583855.jpeg',
      images: product.images,
      
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      inStock: product.inStock,
      stock: product.stock,
      weight: product.weight,
      localDeliveryOnly: product.localDeliveryOnly,
      slug: product.slug,
      tags: product.tags,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }))
    
    return NextResponse.json({ 
      success: true,
      products: mappedProducts,
      count: mappedProducts.length 
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch products',
      products: [] 
    }, { status: 500 })
  }
}
