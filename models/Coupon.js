// MongoDB Coupon Schema
export const CouponSchema = {
  _id: 'string', // UUID
  code: 'string', // Unique coupon code
  description: 'string',
  discountType: 'string', // 'percentage' or 'fixed'
  discountValue: 'number',
  minOrderValue: 'number',
  maxDiscount: 'number', // For percentage type
  usageLimit: 'number', // Total usage limit
  usedCount: 'number',
  validFrom: 'Date',
  validTo: 'Date',
  isActive: 'boolean',
  applicableCategories: ['string'], // Empty for all categories
  createdAt: 'Date',
  updatedAt: 'Date'
}
