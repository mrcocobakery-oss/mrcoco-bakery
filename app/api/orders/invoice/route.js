import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// GET - Generate invoice HTML
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const order = await db.collection('orders').findOne({ _id: orderId })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Generate invoice HTML
    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice #${order._id.substring(0, 8)}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    .invoice-header { border-bottom: 3px solid #DB2777; padding-bottom: 20px; margin-bottom: 30px; }
    .company-name { color: #DB2777; font-size: 32px; font-weight: bold; margin: 0; }
    .invoice-title { font-size: 24px; color: #666; margin: 10px 0; }
    .invoice-details { display: flex; justify-content: space-between; margin: 20px 0; }
    .section { margin: 30px 0; }
    .section-title { font-size: 18px; font-weight: bold; color: #DB2777; margin-bottom: 10px; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background-color: #DB2777; color: white; padding: 12px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #ddd; }
    .total-section { background-color: #f9f9f9; padding: 15px; margin-top: 20px; }
    .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
    .grand-total { font-size: 20px; font-weight: bold; color: #DB2777; border-top: 2px solid #DB2777; padding-top: 10px; margin-top: 10px; }
    .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  <div class="invoice-header">
    <h1 class="company-name">Mr. COCO Bakery 🎂</h1>
    <p style="margin: 5px 0; color: #666;">Premium Bakery & Cakes</p>
    <p style="margin: 5px 0; color: #666;">Phone: +91 8447655399 | Email: info@mrcoco.com</p>
  </div>

  <div class="invoice-title">TAX INVOICE</div>

  <div class="invoice-details">
    <div>
      <strong>Invoice No:</strong> ${order._id.substring(0, 8).toUpperCase()}<br>
      <strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}<br>
      <strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}<br>
      <strong>Payment Status:</strong> ${order.paymentStatus.toUpperCase()}
    </div>
    <div style="text-align: right;">
      <strong>Bill To:</strong><br>
      ${order.customerName}<br>
      ${order.customerEmail}<br>
      ${order.customerPhone}<br>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Delivery Address</div>
    <p>${order.address}<br>
    ${order.city}, ${order.state} - ${order.pincode}</p>
    ${order.deliveryDate ? `<p><strong>Scheduled Delivery:</strong> ${order.deliveryDate} ${order.deliveryTime ? '(' + order.deliveryTime + ')' : ''}</p>` : ''}
    ${order.expressDelivery ? '<p style="color: #DB2777;"><strong>⚡ Express Delivery (2 hours)</strong></p>' : ''}
  </div>

  <div class="section">
    <div class="section-title">Order Items</div>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(item => `
        <tr>
          <td>
            <strong>${item.productName}</strong><br>
            ${item.weight ? `<small>${item.weight}</small>` : ''}
          </td>
          <td>${item.quantity}</td>
          <td>₹${item.price}</td>
          <td>₹${item.price * item.quantity}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="total-section">
    <div class="total-row">
      <span>Subtotal:</span>
      <span>₹${order.subtotal}</span>
    </div>
    <div class="total-row">
      <span>Delivery Fee:</span>
      <span>₹${order.deliveryFee || 0}</span>
    </div>
    ${order.expressDeliveryFee ? `
    <div class="total-row" style="color: #DB2777;">
      <span>Express Delivery Fee:</span>
      <span>₹${order.expressDeliveryFee}</span>
    </div>
    ` : ''}
    <div class="total-row grand-total">
      <span>Grand Total:</span>
      <span>₹${order.total}</span>
    </div>
  </div>

  ${order.giftMessage ? `
  <div class="section">
    <div class="section-title">Gift Message</div>
    <p style="font-style: italic;">${order.giftMessage}</p>
  </div>
  ` : ''}

  ${order.specialInstructions ? `
  <div class="section">
    <div class="section-title">Special Instructions</div>
    <p>${order.specialInstructions}</p>
  </div>
  ` : ''}

  <div class="footer">
    <p><strong>Thank you for your order!</strong></p>
    <p>This is a computer-generated invoice and does not require a signature.</p>
    <p>For any queries, contact us at +91 8447655399 or info@mrcoco.com</p>
  </div>

  <button onclick="window.print()" style="
    background-color: #DB2777;
    color: white;
    border: none;
    padding: 12px 24px;
    font-size: 16px;
    border-radius: 6px;
    cursor: pointer;
    margin: 20px auto;
    display: block;
  ">Print Invoice</button>
</body>
</html>
    `

    return new NextResponse(invoiceHTML, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 })
  }
}
