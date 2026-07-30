import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// Admin authentication check
function checkAdminAuth(request) {
  const authHeader = request.headers.get('authorization')
  const adminToken = request.cookies.get('admin_token')?.value
  
  if (adminToken !== 'admin_logged_in' && authHeader !== 'Bearer admin_logged_in') {
    return false
  }
  return true
}

// GET - Fetch analytics data
export async function GET(request) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    
    // Get orders for analytics
    const orders = await db.collection('orders').find({}).toArray()
    const products = await db.collection('products').find({}).toArray()
    const customers = await db.collection('users').find({}).toArray()
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    
    // Calculate orders by status
    const ordersByStatus = {
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    }
    
    // Calculate revenue trend (last 7 days)
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt).toISOString().split('T')[0]
        return orderDate === dateStr
      })
      
      const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0)
      
      last7Days.push({
        date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        orders: dayOrders.length,
        revenue: dayRevenue
      })
    }
    
    // Top products by orders
    const productSales = {}
    orders.forEach(order => {
      order.items?.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.productName,
            quantity: 0,
            revenue: 0
          }
        }
        productSales[item.productId].quantity += item.quantity
        productSales[item.productId].revenue += item.price * item.quantity
      })
    })
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
    
    // Calculate average order value
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0
    
    return NextResponse.json({
      stats: {
        totalOrders: orders.length,
        totalRevenue,
        totalCustomers: customers.length,
        totalProducts: products.length,
        avgOrderValue: Math.round(avgOrderValue)
      },
      ordersByStatus,
      revenueTrend: last7Days,
      topProducts
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
