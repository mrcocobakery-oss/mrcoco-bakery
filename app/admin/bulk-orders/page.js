'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Search, Briefcase, Eye } from 'lucide-react'
import { toast } from 'sonner'
import Cookies from 'js-cookie'

export default function AdminBulkOrdersPage() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => { fetchOrders() }, [])
  useEffect(() => { filterOrders() }, [orders, searchQuery])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/bulk-orders')
      const data = await response.json()
      if (response.ok) { setOrders(data.orders || []) } else { toast.error('Failed to fetch bulk orders') }
    } catch (error) { toast.error('Failed to fetch bulk orders') } finally { setLoading(false) }
  }

  const filterOrders = () => {
    let filtered = [...orders]
    if (searchQuery) { filtered = filtered.filter(o => o.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) || o.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase())) }
    setFilteredOrders(filtered)
  }

  const formatDate = (dateString) => { if (!dateString) return 'N/A'; return new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">Bulk Orders</h1><p className="text-gray-500 mt-1">Manage corporate and event order inquiries</p></div>
      <Card><CardContent className="pt-6"><div className="relative"><Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" /><Input placeholder="Search by company or contact..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div></CardContent></Card>
      <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead><tbody className="divide-y">{filteredOrders.length === 0 ? <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">No bulk orders found</td></tr> : filteredOrders.map((order) => (<tr key={order._id} className="hover:bg-gray-50"><td className="px-6 py-4"><div className="font-medium">{order.companyName}</div><Badge variant="outline" className="mt-1">{order.businessType}</Badge></td><td className="px-6 py-4"><div>{order.contactPerson}</div><div className="text-xs text-gray-500">{order.phone}</div></td><td className="px-6 py-4"><div className="text-sm">{order.products}</div><div className="text-xs text-gray-500">Qty: {order.quantity}</div></td><td className="px-6 py-4">₹{order.budget}</td><td className="px-6 py-4">{formatDate(order.createdAt)}</td><td className="px-6 py-4 text-right"><Button size="sm" variant="ghost" onClick={() => { setSelectedOrder(order); setShowDialog(true) }}><Eye className="w-4 h-4" /></Button></td></tr>))}</tbody></table></div></CardContent></Card>
      <Dialog open={showDialog} onOpenChange={setShowDialog}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Bulk Order Details</DialogTitle></DialogHeader>{selectedOrder && (<div className="space-y-4"><div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded"><div><div className="text-xs text-gray-500">Company</div><div className="font-medium">{selectedOrder.companyName}</div></div><div><div className="text-xs text-gray-500">Business Type</div><div>{selectedOrder.businessType}</div></div></div><Card><CardContent className="pt-6"><h3 className="font-semibold mb-2">Contact Information</h3><div className="space-y-1 text-sm"><p><strong>Name:</strong> {selectedOrder.contactPerson}</p><p><strong>Email:</strong> {selectedOrder.email}</p><p><strong>Phone:</strong> {selectedOrder.phone}</p><p><strong>WhatsApp:</strong> {selectedOrder.whatsapp}</p><p><strong>Location:</strong> {selectedOrder.city}, {selectedOrder.state}</p></div></CardContent></Card><Card><CardContent className="pt-6"><h3 className="font-semibold mb-2">Order Requirements</h3><div className="space-y-1 text-sm"><p><strong>Products:</strong> {selectedOrder.products}</p><p><strong>Quantity:</strong> {selectedOrder.quantity}</p><p><strong>Budget:</strong> ₹{selectedOrder.budget}</p><p><strong>Delivery Date:</strong> {selectedOrder.deliveryDate || 'Flexible'}</p></div></CardContent></Card>{selectedOrder.message && (<Card><CardContent className="pt-6"><h3 className="font-semibold mb-2">Additional Message</h3><p className="text-sm text-gray-600">{selectedOrder.message}</p></CardContent></Card>)}</div>)}</DialogContent></Dialog>
    </div>
  )
}
