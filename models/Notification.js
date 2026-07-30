// MongoDB Notification Schema
export const NotificationSchema = {
  _id: 'string', // UUID
  type: 'string', // 'order_status', 'welcome', 'order_confirmation', 'bulk_order', 'low_stock'
  recipientEmail: 'string',
  recipientPhone: 'string',
  subject: 'string',
  message: 'string',
  status: 'string', // 'pending', 'sent', 'failed'
  sentAt: 'Date',
  metadata: 'object', // Additional data (orderId, productId, etc.)
  createdAt: 'Date'
}
