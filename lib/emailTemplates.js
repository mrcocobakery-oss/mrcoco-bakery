// Email Templates for Mr. COCO Bakery

/**
 * Base email wrapper with branding
 */
function emailWrapper(content) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #DB2777 0%, #F472B6 100%); padding: 40px 20px; text-align: center; }
    .logo { color: white; font-size: 32px; font-weight: bold; margin: 0; }
    .tagline { color: white; margin: 5px 0 0 0; font-size: 14px; }
    .content { padding: 40px 30px; }
    .button { display: inline-block; background-color: #DB2777; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { background-color: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 12px; }
    .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .order-table th { background-color: #fce7f3; color: #DB2777; padding: 12px; text-align: left; }
    .order-table td { padding: 12px; border-bottom: 1px solid #f3f4f6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">Mr. COCO Bakery 🎂</h1>
      <p class="tagline">Premium Bakery & Cakes</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>Mr. COCO Bakery</strong></p>
      <p>Phone: +91 8447655399 | Email: info@mrcoco.com</p>
      <p>Follow us on social media for daily updates and offers!</p>
      <p style="margin-top: 20px;">This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
  `
}

/**
 * Order Confirmation Email Template
 */
export function orderConfirmationTemplate(order) {
  const content = `
    <h2 style="color: #DB2777; margin-top: 0;">Order Confirmed! 🎉</h2>
    <p>Hi ${order.customerName},</p>
    <p>Thank you for your order! Your order has been confirmed and will be prepared with love.</p>
    
    <div style="background-color: #fce7f3; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order._id.substring(0, 8).toUpperCase()}</p>
      <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
      <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${order.total}</p>
      ${order.deliveryDate ? `<p style="margin: 5px 0;"><strong>Delivery Date:</strong> ${order.deliveryDate}</p>` : ''}
    </div>

    <h3 style="color: #DB2777;">Order Items</h3>
    <table class="order-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(item => `
          <tr>
            <td>${item.productName}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price * item.quantity}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 5px 0;">Subtotal: ₹${order.subtotal}</p>
      <p style="margin: 5px 0;">Delivery: ₹${order.deliveryFee || 0}</p>
      ${order.expressDeliveryFee ? `<p style="margin: 5px 0; color: #DB2777;">Express Delivery: ₹${order.expressDeliveryFee}</p>` : ''}
      <p style="margin: 15px 0 5px 0; font-size: 18px; font-weight: bold; color: #DB2777;">Total: ₹${order.total}</p>
    </div>

    <p>We'll notify you once your order is on its way!</p>
    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders" class="button">Track Your Order</a>
  `
  return emailWrapper(content)
}

/**
 * Order Status Update Email Template
 */
export function orderStatusTemplate(order, newStatus) {
  const statusMessages = {
    pending: { emoji: '⏳', title: 'Order Received', message: 'Your order is being processed.' },
    processing: { emoji: '🎂', title: 'Order Being Prepared', message: 'Your delicious treats are being prepared with love!' },
    shipped: { emoji: '🚚', title: 'Order Shipped', message: 'Your order is on its way to you!' },
    delivered: { emoji: '🎉', title: 'Order Delivered', message: 'Your order has been delivered. Enjoy!' },
    cancelled: { emoji: '❌', title: 'Order Cancelled', message: 'Your order has been cancelled.' }
  }

  const statusInfo = statusMessages[newStatus] || statusMessages.pending

  const content = `
    <h2 style="color: #DB2777; margin-top: 0;">${statusInfo.emoji} ${statusInfo.title}</h2>
    <p>Hi ${order.customerName},</p>
    <p>${statusInfo.message}</p>
    
    <div style="background-color: #fce7f3; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order._id.substring(0, 8).toUpperCase()}</p>
      <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #DB2777; font-weight: bold;">${newStatus.toUpperCase()}</span></p>
      <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${order.total}</p>
    </div>

    ${newStatus === 'shipped' ? `
      <p><strong>Delivery Address:</strong><br>
      ${order.address}<br>
      ${order.city}, ${order.state} - ${order.pincode}</p>
    ` : ''}

    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders" class="button">View Order Details</a>

    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">Need help? Contact us at +91 8447655399</p>
  `
  return emailWrapper(content)
}

/**
 * Welcome Email Template
 */
export function welcomeTemplate(user) {
  const content = `
    <h2 style="color: #DB2777; margin-top: 0;">Welcome to Mr. COCO Bakery! 🎂🎉</h2>
    <p>Hi ${user.name},</p>
    <p>We're thrilled to have you join our sweet family! Thank you for signing up with Mr. COCO Bakery.</p>
    
    <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
      <h3 style="margin-top: 0; color: #92400e;">🎁 Welcome Gift</h3>
      <p style="margin: 5px 0; color: #92400e;"><strong>You've received 100 loyalty points!</strong></p>
      <p style="margin: 5px 0; font-size: 14px; color: #78350f;">Use these points on your next order for instant discounts.</p>
    </div>

    <h3 style="color: #DB2777;">Why You'll Love Us</h3>
    <ul style="line-height: 1.8;">
      <li>🍰 <strong>Fresh Daily:</strong> Baked fresh every day</li>
      <li>🚚 <strong>Fast Delivery:</strong> Same-day delivery available</li>
      <li>💳 <strong>Easy Payments:</strong> Multiple payment options</li>
      <li>⭐ <strong>Loyalty Rewards:</strong> Earn points on every order</li>
      <li>📞 <strong>WhatsApp Orders:</strong> Order directly via WhatsApp</li>
    </ul>

    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/products" class="button">Start Shopping</a>

    <p style="margin-top: 30px;">Have questions? We're here to help!</p>
  `
  return emailWrapper(content)
}

/**
 * Low Stock Alert Email Template (Admin)
 */
export function lowStockAlertTemplate(product) {
  const content = `
    <h2 style="color: #ef4444; margin-top: 0;">⚠️ Low Stock Alert</h2>
    <p>This is an automated alert from your inventory management system.</p>
    
    <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
      <h3 style="margin-top: 0; color: #991b1b;">Product Details</h3>
      <p style="margin: 5px 0;"><strong>Product:</strong> ${product.name}</p>
      <p style="margin: 5px 0;"><strong>Current Stock:</strong> <span style="color: #ef4444; font-weight: bold;">${product.stock} units</span></p>
      <p style="margin: 5px 0;"><strong>Category:</strong> ${product.category}</p>
    </div>

    <p><strong>Action Required:</strong> Please restock this product to avoid running out of inventory.</p>

    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/products" class="button">Manage Inventory</a>
  `
  return emailWrapper(content)
}

/**
 * Bulk Order Notification Email Template (Admin)
 */
export function bulkOrderNotificationTemplate(bulkOrder) {
  const content = `
    <h2 style="color: #DB2777; margin-top: 0;">🏢 New Bulk Order Inquiry</h2>
    <p>You have received a new bulk order inquiry. Please review and respond promptly.</p>
    
    <div style="background-color: #fce7f3; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #DB2777;">Company Information</h3>
      <p style="margin: 5px 0;"><strong>Company:</strong> ${bulkOrder.companyName}</p>
      <p style="margin: 5px 0;"><strong>Business Type:</strong> ${bulkOrder.businessType}</p>
      <p style="margin: 5px 0;"><strong>Contact Person:</strong> ${bulkOrder.contactPerson}</p>
    </div>

    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Contact Details</h3>
      <p style="margin: 5px 0;"><strong>Email:</strong> ${bulkOrder.email}</p>
      <p style="margin: 5px 0;"><strong>Phone:</strong> ${bulkOrder.phone}</p>
      <p style="margin: 5px 0;"><strong>WhatsApp:</strong> ${bulkOrder.whatsapp}</p>
      <p style="margin: 5px 0;"><strong>Location:</strong> ${bulkOrder.city}, ${bulkOrder.state}</p>
    </div>

    <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #065f46;">Order Requirements</h3>
      <p style="margin: 5px 0;"><strong>Products:</strong> ${bulkOrder.products}</p>
      <p style="margin: 5px 0;"><strong>Quantity:</strong> ${bulkOrder.quantity}</p>
      <p style="margin: 5px 0;"><strong>Budget:</strong> ₹${bulkOrder.budget}</p>
      <p style="margin: 5px 0;"><strong>Delivery Date:</strong> ${bulkOrder.deliveryDate || 'Flexible'}</p>
    </div>

    ${bulkOrder.message ? `
      <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Additional Message</h3>
        <p style="font-style: italic;">${bulkOrder.message}</p>
      </div>
    ` : ''}

    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/bulk-orders" class="button">View All Bulk Orders</a>

    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;"><strong>Tip:</strong> Respond within 24 hours for better conversion rates!</p>
  `
  return emailWrapper(content)
}
