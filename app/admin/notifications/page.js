'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bell, Mail, Phone, Search, Eye, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Cookies from 'js-cookie'
import { toast } from 'sonner'

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => { fetchNotifications() }, [])
  useEffect(() => { filterNotifications() }, [notifications, searchQuery, typeFilter, statusFilter])

  const fetchNotifications = async () => {
    try {
      const adminToken = Cookies.get('admin_token')
      const response = await fetch('/api/admin/notifications', { headers: { 'Authorization': `Bearer ${adminToken}` } })
      const data = await response.json()
      if (response.ok) { setNotifications(data.notifications || []) } else { toast.error('Failed to fetch notifications') }
    } catch (error) { toast.error('Failed to fetch notifications') } finally { setLoading(false) }
  }

  const filterNotifications = () => {
    let filtered = [...notifications]
    if (typeFilter !== 'all') { filtered = filtered.filter(n => n.type === typeFilter) }
    if (statusFilter !== 'all') { filtered = filtered.filter(n => n.status === statusFilter) }
    if (searchQuery) { filtered = filtered.filter(n => n.recipientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) || n.message?.toLowerCase().includes(searchQuery.toLowerCase())) }
    setFilteredNotifications(filtered)
  }

  const getTypeIcon = (type) => {
    const icons = { order_status: '📦', welcome: '👋', order_confirmation: '✅', bulk_order: '🏢', low_stock: '⚠️' }
    return icons[type] || '📧'
  }

  const getTypeBadge = (type) => {
    const colors = { order_status: 'bg-blue-100 text-blue-800', welcome: 'bg-green-100 text-green-800', order_confirmation: 'bg-purple-100 text-purple-800', bulk_order: 'bg-orange-100 text-orange-800', low_stock: 'bg-red-100 text-red-800' }
    return <Badge className={colors[type] || 'bg-gray-100'}>{type.replace('_', ' ')}</Badge>
  }

  const getStatusBadge = (status) => {
    const config = { sent: { icon: CheckCircle, className: 'bg-green-100 text-green-800' }, pending: { icon: Clock, className: 'bg-yellow-100 text-yellow-800' }, failed: { icon: XCircle, className: 'bg-red-100 text-red-800' } }
    const { icon: Icon, className } = config[status] || config.pending
    return <Badge className={className}><Icon className="w-3 h-3 mr-1" />{status}</Badge>
  }

  const formatDate = (dateString) => { if (!dateString) return 'N/A'; return new Date(dateString).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading notifications...</div></div>

  const stats = { total: notifications.length, sent: notifications.filter(n => n.status === 'sent').length, pending: notifications.filter(n => n.status === 'pending').length, failed: notifications.filter(n => n.status === 'failed').length }

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">Notifications</h1><p className="text-gray-500 mt-1">View all system notifications</p></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="text-center"><Bell className="w-8 h-8 text-pink-600 mx-auto mb-2" /><div className="text-3xl font-bold">{stats.total}</div><div className="text-sm text-gray-500">Total Notifications</div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-center"><CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" /><div className="text-3xl font-bold">{stats.sent}</div><div className="text-sm text-gray-500">Sent</div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-center"><Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" /><div className="text-3xl font-bold">{stats.pending}</div><div className="text-sm text-gray-500">Pending</div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-center"><XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" /><div className="text-3xl font-bold">{stats.failed}</div><div className="text-sm text-gray-500">Failed</div></div></CardContent></Card>
      </div>
      <Card><CardContent className="pt-6"><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="relative"><Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" /><Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div><Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="order_status">Order Status</SelectItem><SelectItem value="welcome">Welcome</SelectItem><SelectItem value="order_confirmation">Order Confirmation</SelectItem><SelectItem value="bulk_order">Bulk Order</SelectItem><SelectItem value="low_stock">Low Stock</SelectItem></SelectContent></Select><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="sent">Sent</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="failed">Failed</SelectItem></SelectContent></Select></div></CardContent></Card>
      <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead><tbody className="divide-y">{filteredNotifications.length === 0 ? <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">No notifications found</td></tr> : filteredNotifications.map((notification) => (<tr key={notification._id} className="hover:bg-gray-50"><td className="px-6 py-4"><div className="flex items-center gap-2"><span className="text-2xl">{getTypeIcon(notification.type)}</span>{getTypeBadge(notification.type)}</div></td><td className="px-6 py-4"><div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-gray-400" />{notification.recipientEmail}</div>{notification.recipientPhone && <div className="flex items-center gap-2 text-xs text-gray-500 mt-1"><Phone className="w-3 h-3" />{notification.recipientPhone}</div>}</td><td className="px-6 py-4"><div className="text-sm font-medium">{notification.subject}</div></td><td className="px-6 py-4">{getStatusBadge(notification.status)}</td><td className="px-6 py-4 text-sm">{formatDate(notification.sentAt || notification.createdAt)}</td><td className="px-6 py-4 text-right"><Button size="sm" variant="ghost" onClick={() => { setSelectedNotification(notification); setShowDialog(true) }}><Eye className="w-4 h-4" /></Button></td></tr>))}</tbody></table></div></CardContent></Card>
      <Dialog open={showDialog} onOpenChange={setShowDialog}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Notification Details</DialogTitle></DialogHeader>{selectedNotification && (<div className="space-y-4"><div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded"><div><div className="text-xs text-gray-500">Type</div><div>{getTypeBadge(selectedNotification.type)}</div></div><div><div className="text-xs text-gray-500">Status</div><div>{getStatusBadge(selectedNotification.status)}</div></div></div><Card><CardHeader><CardTitle className="text-lg">Recipient</CardTitle></CardHeader><CardContent><div className="space-y-2"><div className="flex items-center gap-2"><Mail className="w-4 h-4" /><span>{selectedNotification.recipientEmail}</span></div>{selectedNotification.recipientPhone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><span>{selectedNotification.recipientPhone}</span></div>}</div></CardContent></Card><Card><CardHeader><CardTitle className="text-lg">Message</CardTitle></CardHeader><CardContent><div className="font-medium mb-2">{selectedNotification.subject}</div><p className="text-gray-600">{selectedNotification.message}</p></CardContent></Card>{selectedNotification.metadata && <Card><CardHeader><CardTitle className="text-lg">Metadata</CardTitle></CardHeader><CardContent><pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(selectedNotification.metadata, null, 2)}</pre></CardContent></Card>}<div className="text-xs text-gray-500">Sent at: {formatDate(selectedNotification.sentAt || selectedNotification.createdAt)}</div></div>)}</DialogContent></Dialog>
    </div>
  )
}
