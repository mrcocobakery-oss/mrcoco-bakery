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
  addresses: 'array', // Array of saved delivery addresses
  createdAt: 'Date',
  updatedAt: 'Date'
}

// Address Schema (nested in User)
export const AddressSchema = {
  _id: 'string',
  name: 'string',
  phone: 'string',
  address: 'string',
  city: 'string',
  state: 'string',
  pincode: 'string',
  isDefault: 'boolean',
  createdAt: 'Date',
  updatedAt: 'Date'
}
