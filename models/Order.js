// MongoDB Order Schema
export const OrderSchema = {
  _id: 'string', // UUID
  userId: 'string', // UUID reference to User
  
  // Customer Info
  customerName: 'string',
  customerEmail: 'string',
  customerPhone: 'string',
  
  // Delivery Address
  address: 'string',
  city: 'string',
  state: 'string',
  pincode: 'string',
  
  // Order Items
  items: [{
    productId: 'string',
    productName: 'string',
    productImage: 'string',
    price: 'number',
    quantity: 'number',
    category: 'string',
    weight: 'string'
  }],
  
  // Pricing
  subtotal: 'number',
  deliveryFee: 'number',
  expressDeliveryFee: 'number', // 200 Rs for express delivery
  total: 'number',
  
  // Delivery Details
  deliveryDate: 'string', // YYYY-MM-DD
  deliveryTime: 'string', // Specific time slot
  expressDelivery: 'boolean', // Within 2 hours
  giftMessage: 'string',
  specialInstructions: 'string',
  
  // Payment
  paymentMethod: 'string', // 'online', 'cod'
  paymentStatus: 'string', // 'pending', 'paid', 'failed', 'refunded'
  razorpayOrderId: 'string',
  razorpayPaymentId: 'string',
  
  // Order Status
  status: 'string', // 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  
  // Timestamps
  createdAt: 'Date',
  updatedAt: 'Date'
}

// Indexes:
// db.orders.createIndex({ userId: 1 })
// db.orders.createIndex({ status: 1 })
// db.orders.createIndex({ createdAt: -1 })
// db.orders.createIndex({ pincode: 1 })
