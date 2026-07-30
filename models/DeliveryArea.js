// MongoDB Delivery Area Schema
export const DeliveryAreaSchema = {
  _id: 'string', // UUID
  pincode: 'string',
  area: 'string',
  city: 'string',
  state: 'string',
  deliveryFee: 'number',
  cakeDeliveryAvailable: 'boolean',
  isActive: 'boolean',
  createdAt: 'Date',
  updatedAt: 'Date'
}
