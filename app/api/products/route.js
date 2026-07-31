import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// Public GET endpoint - No authentication required
export async function GET(request) {
  try {
    const { db } = await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    let query = { inStock: true } // Only show in-stock products to public
    
    if (category && category !== 'all') {
      query.category = category
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    const products = await db.collection('products')
      .find(query)
      .sort({ createdAt: -1 })
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
