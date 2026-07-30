// MongoDB User Schema
export const UserSchema = {
  _id: 'ObjectId',
  email: 'string',
  password: 'string',
  phone: 'string',
  name: 'string',
  avatar: 'string',
  walletBalance: 'number',
  loyaltyPoints: 'number',
  referralCode: 'string',
  referredBy: 'string',
  emailVerified: 'boolean',
  phoneVerified: 'boolean',
  status: 'string',
  createdAt: 'Date',
  updatedAt: 'Date'
}
