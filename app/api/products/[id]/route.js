import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// GET single product by ID
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json({ 
        success: false,
        error: 'Product ID is required' 
      }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    
    // Find product by _id (UUID string)
    const product = await db.collection('products').findOne({ _id: id })
    
    if (!product) {
      return NextResponse.json({ 
        success: false,
        error: 'Product not found' 
      }, { status: 404 })
    }
    
    // Map database fields to frontend format
    const mappedProduct = {
      id: product._id,
      _id: product._id,
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
      
      // Image handling - use first image as main image
      image: product.images && product.images.length > 0 
        ? product.images[0] 
        : 'https://images.pexels.com/photos/35583855/pexels-photo-35583855.jpeg',
      images: product.images || [],
      
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
    }
    
    return NextResponse.json({ 
      success: true,
      product: mappedProduct 
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch product' 
    }, { status: 500 })
  }
}
