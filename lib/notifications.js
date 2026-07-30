// Notification Service
// This module handles sending SMS and Email notifications

/**
 * Send order status update notification
 * @param {Object} order - Order object
 * @param {string} newStatus - New order status
 */
export async function sendOrderStatusNotification(order, newStatus) {
  const statusMessages = {
    pending: 'Your order has been received and is being processed.',
    processing: 'Your order is being prepared with love!',
    shipped: 'Your order has been shipped and is on its way!',
    delivered: 'Your order has been delivered. Enjoy your treats!',
    cancelled: 'Your order has been cancelled.'
  }

  const message = `Mr. COCO Bakery - Order #${order._id?.substring(0, 8)}: ${statusMessages[newStatus] || 'Order status updated.'}`

  // Log notification (replace with actual SMS/Email service)
  console.log('📧 Notification:', {
    to: order.customerEmail,
    phone: order.customerPhone,
    subject: 'Order Status Update',
    message
  })

  // TODO: Integrate with actual SMS/Email service
  // Example with Twilio:
  // await twilioClient.messages.create({
  //   body: message,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: order.customerPhone
  // })

  // Example with SendGrid:
  // await sendGridClient.send({
  //   to: order.customerEmail,
  //   from: 'noreply@mrcoco.com',
  //   subject: 'Order Status Update',
  //   text: message
  // })

  return { success: true, message: 'Notification logged (integration pending)' }
}

/**
 * Send welcome notification to new user
 * @param {Object} user - User object
 */
export async function sendWelcomeNotification(user) {
  const message = `Welcome to Mr. COCO Bakery, ${user.name}! 🎂 Enjoy 100 loyalty points as a welcome gift!`

  console.log('📧 Welcome Notification:', {
    to: user.email,
    phone: user.phone,
    subject: 'Welcome to Mr. COCO Bakery',
    message
  })

  return { success: true }
}

/**
 * Send order confirmation notification
 * @param {Object} order - Order object
 */
export async function sendOrderConfirmation(order) {
  const message = `Thank you for your order! Order #${order._id?.substring(0, 8)} for ₹${order.total} has been confirmed. ${order.deliveryDate ? `Delivery scheduled for ${order.deliveryDate}.` : ''}`

  console.log('📧 Order Confirmation:', {
    to: order.customerEmail,
    phone: order.customerPhone,
    subject: 'Order Confirmed',
    message
  })

  return { success: true }
}

/**
 * Send low stock alert to admin
 * @param {Object} product - Product object
 */
export async function sendLowStockAlert(product) {
  const message = `Low Stock Alert: ${product.name} has only ${product.stock} units remaining.`

  console.log('🚨 Low Stock Alert:', {
    to: 'admin@mrcoco.com',
    subject: 'Low Stock Alert',
    message,
    product
  })

  return { success: true }
}
