// Enhanced Notification Service with Database Logging
import { connectToDatabase } from './mongodb'
import { v4 as uuidv4 } from 'uuid'

/**
 * Save notification to database
 */
async function saveNotification(notificationData) {
  try {
    const { db } = await connectToDatabase()
    const notification = {
      _id: uuidv4(),
      ...notificationData,
      status: 'sent', // In mock mode, mark as sent immediately
      sentAt: new Date(),
      createdAt: new Date()
    }
    
    await db.collection('notifications').insertOne(notification)
    return notification
  } catch (error) {
    console.error('Error saving notification:', error)
    return null
  }
}

/**
 * Send order status update notification
 */
export async function sendOrderStatusNotification(order, newStatus) {
  const statusMessages = {
    pending: 'Your order has been received and is being processed.',
    processing: 'Your order is being prepared with love! 🎂',
    shipped: 'Your order has been shipped and is on its way! 🚚',
    delivered: 'Your order has been delivered. Enjoy your treats! 🎉',
    cancelled: 'Your order has been cancelled.'
  }

  const message = `Mr. COCO Bakery - Order #${order._id?.substring(0, 8)}: ${statusMessages[newStatus] || 'Order status updated.'}`

  const notification = await saveNotification({
    type: 'order_status',
    recipientEmail: order.customerEmail,
    recipientPhone: order.customerPhone,
    subject: 'Order Status Update',
    message,
    metadata: {
      orderId: order._id,
      status: newStatus
    }
  })

  console.log('📧 Order Status Notification Logged:', notification?._id)
  return { success: true, notificationId: notification?._id }
}

/**
 * Send welcome notification to new user
 */
export async function sendWelcomeNotification(user) {
  const message = `Welcome to Mr. COCO Bakery, ${user.name}! 🎂 Enjoy 100 loyalty points as a welcome gift!`

  const notification = await saveNotification({
    type: 'welcome',
    recipientEmail: user.email,
    recipientPhone: user.phone,
    subject: 'Welcome to Mr. COCO Bakery',
    message,
    metadata: {
      userId: user._id
    }
  })

  console.log('📧 Welcome Notification Logged:', notification?._id)
  return { success: true, notificationId: notification?._id }
}

/**
 * Send order confirmation notification
 */
export async function sendOrderConfirmation(order) {
  const message = `Thank you for your order! Order #${order._id?.substring(0, 8)} for ₹${order.total} has been confirmed. ${order.deliveryDate ? `Delivery scheduled for ${order.deliveryDate}.` : ''}`

  const notification = await saveNotification({
    type: 'order_confirmation',
    recipientEmail: order.customerEmail,
    recipientPhone: order.customerPhone,
    subject: 'Order Confirmed - Mr. COCO Bakery',
    message,
    metadata: {
      orderId: order._id,
      amount: order.total
    }
  })

  console.log('📧 Order Confirmation Logged:', notification?._id)
  return { success: true, notificationId: notification?._id }
}

/**
 * Send bulk order notification to admin
 */
export async function sendBulkOrderNotification(bulkOrder) {
  const message = `New bulk order inquiry from ${bulkOrder.companyName}. Contact: ${bulkOrder.contactPerson} (${bulkOrder.phone}). Products: ${bulkOrder.products}, Quantity: ${bulkOrder.quantity}, Budget: ₹${bulkOrder.budget}`

  const notification = await saveNotification({
    type: 'bulk_order',
    recipientEmail: 'admin@mrcoco.com',
    recipientPhone: '+918447655399',
    subject: 'New Bulk Order Inquiry',
    message,
    metadata: {
      bulkOrderId: bulkOrder._id,
      companyName: bulkOrder.companyName,
      budget: bulkOrder.budget
    }
  })

  console.log('🚨 Bulk Order Alert Logged:', notification?._id)
  return { success: true, notificationId: notification?._id }
}

/**
 * Send low stock alert to admin
 */
export async function sendLowStockAlert(product) {
  const message = `⚠️ Low Stock Alert: ${product.name} has only ${product.stock} units remaining.`

  const notification = await saveNotification({
    type: 'low_stock',
    recipientEmail: 'admin@mrcoco.com',
    recipientPhone: '+918447655399',
    subject: 'Low Stock Alert',
    message,
    metadata: {
      productId: product._id,
      productName: product.name,
      stock: product.stock
    }
  })

  console.log('🚨 Low Stock Alert Logged:', notification?._id)
  return { success: true, notificationId: notification?._id }
}
