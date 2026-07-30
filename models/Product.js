// MongoDB Product Schema with Categories and Subcategories
// Collection: products

export const ProductSchema = {
  _id: 'ObjectId',
  name: 'string',
  description: 'string',
  price: 'number',
  originalPrice: 'number',
  discount: 'number', // Percentage
  
  // Main category
  category: 'string', // 'cakes', 'cookies', 'namkeen', 'gifts'
  
  // Cake-specific fields
  cakeType: 'string', // 'eggless', 'designer', 'photo', 'fondant', 'fruit', 'chocolate', 'premium', 'cheesecake', 'bento', 'jar', 'mini'
  occasion: 'string', // 'birthday', 'anniversary', 'wedding', 'engagement', 'baby shower', 'retirement', 'house warming', 'graduation', 'congratulations', 'corporate'
  specialDay: 'string', // 'mothers day', 'fathers day', 'valentine', 'christmas', 'new year', 'raksha bandhan', 'bhai dooj', 'diwali', 'holi', 'eid', 'teachers day', 'womens day', 'childrens day'
  
  // Cookie-specific fields
  cookieType: 'string', // 'premium', 'butter', 'tea', 'healthy', 'millet', 'dry fruit'
  
  // Namkeen-specific fields
  namkeenType: 'string', // 'traditional', 'baked'
  
  // Gift-specific fields
  giftType: 'string', // 'festival hamper', 'corporate', 'wedding', 'custom'
  
  // Common fields
  images: ['string'], // Array of image URLs
  rating: 'number',
  reviews: 'number',
  inStock: 'boolean',
  stock: 'number',
  weight: 'string', // '500g', '1kg', etc.
  
  // Delivery
  localDeliveryOnly: 'boolean', // true for cakes in non-263139 areas
  
  // SEO
  slug: 'string',
  tags: ['string'],
  
  createdAt: 'Date',
  updatedAt: 'Date'
}

// Indexes:
// db.products.createIndex({ category: 1 })
// db.products.createIndex({ cakeType: 1 })
// db.products.createIndex({ occasion: 1 })
// db.products.createIndex({ specialDay: 1 })
// db.products.createIndex({ slug: 1 }, { unique: true })
// db.products.createIndex({ name: 'text', description: 'text' })
