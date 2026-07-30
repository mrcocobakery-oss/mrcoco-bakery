'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Search, Ticket } from 'lucide-react'
import { toast } from 'sonner'
import Cookies from 'js-cookie'

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([])
  const [filteredCoupons, setFilteredCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentCoupon, setCurrentCoupon] = useState(null)
  const [formData, setFormData] = useState({ code: '', description: '', discountType: 'percentage', discountValue: '', minOrderValue: '', maxDiscount: '', usageLimit: '', validFrom: '', validTo: '', isActive: true })

  useEffect(() => { fetchCoupons() }, [])
  useEffect(() => { filterCoupons() }, [coupons, searchQuery])

  const fetchCoupons = async () => {
    try {
      const adminToken = Cookies.get('admin_token')
      const response = await fetch('/api/admin/coupons', { headers: { 'Authorization': `Bearer ${adminToken}` } })
      const data = await response.json()
      if (response.ok) { setCoupons(data.coupons || []) } else { toast.error('Failed to fetch coupons') }
    } catch (error) { toast.error('Failed to fetch coupons') } finally { setLoading(false) }
  }

  const filterCoupons = () => {
    let filtered = [...coupons]
    if (searchQuery) { filtered = filtered.filter(c => c.code?.toLowerCase().includes(searchQuery.toLowerCase()) || c.description?.toLowerCase().includes(searchQuery.toLowerCase())) }
    setFilteredCoupons(filtered)
  }

  const openAddDialog = () => { setFormData({ code: '', description: '', discountType: 'percentage', discountValue: '', minOrderValue: '', maxDiscount: '', usageLimit: '', validFrom: '', validTo: '', isActive: true }); setEditMode(false); setCurrentCoupon(null); setShowDialog(true) }
  const openEditDialog = (coupon) => { setFormData({ code: coupon.code, description: coupon.description, discountType: coupon.discountType, discountValue: coupon.discountValue, minOrderValue: coupon.minOrderValue, maxDiscount: coupon.maxDiscount, usageLimit: coupon.usageLimit, validFrom: coupon.validFrom?.split('T')[0], validTo: coupon.validTo?.split('T')[0], isActive: coupon.isActive }); setEditMode(true); setCurrentCoupon(coupon); setShowDialog(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.code || !formData.discountValue) { toast.error('Please fill required fields'); return }
    try {
      const adminToken = Cookies.get('admin_token')
      const couponData = { ...formData }
      if (editMode && currentCoupon) { couponData._id = currentCoupon._id }
      const response = await fetch('/api/admin/coupons', { method: editMode ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }, body: JSON.stringify(couponData) })
      if (response.ok) { toast.success(editMode ? 'Coupon updated!' : 'Coupon created!'); setShowDialog(false); fetchCoupons() } else { const data = await response.json(); toast.error(data.error || 'Failed to save coupon') }
    } catch (error) { toast.error('Failed to save coupon') }
  }

  const handleDelete = async (couponId) => {
    if (!confirm('Delete this coupon?')) return
    try {
      const adminToken = Cookies.get('admin_token')
      const response = await fetch(`/api/admin/coupons?id=${couponId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${adminToken}` } })
      if (response.ok) { toast.success('Coupon deleted!'); fetchCoupons() } else { toast.error('Failed to delete') }
    } catch (error) { toast.error('Failed to delete') }
  }

  const formatDate = (dateString) => { if (!dateString) return 'N/A'; return new Date(dateString).toLocaleDateString('en-IN') }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Coupons Management</h1><p className="text-gray-500 mt-1">Create and manage discount coupons</p></div><Button onClick={openAddDialog} className="bg-pink-600 hover:bg-pink-700"><Plus className="w-4 h-4 mr-2" />Add Coupon</Button></div>
      <Card><CardContent className="pt-6"><div className="relative"><Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" /><Input placeholder="Search coupons..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div></CardContent></Card>
      <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Order</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid Period</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead><tbody className="divide-y">{filteredCoupons.length === 0 ? <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No coupons found</td></tr> : filteredCoupons.map((coupon) => (<tr key={coupon._id} className="hover:bg-gray-50"><td className="px-6 py-4"><div className="font-bold text-pink-900">{coupon.code}</div><div className="text-xs text-gray-500">{coupon.description}</div></td><td className="px-6 py-4"><Badge variant="outline">{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</Badge></td><td className="px-6 py-4">₹{coupon.minOrderValue || 0}</td><td className="px-6 py-4">{coupon.usedCount || 0} / {coupon.usageLimit || '∞'}</td><td className="px-6 py-4"><div className="text-sm">{formatDate(coupon.validFrom)}</div><div className="text-xs text-gray-500">to {formatDate(coupon.validTo)}</div></td><td className="px-6 py-4"><Badge className={coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100'}>{coupon.isActive ? 'Active' : 'Inactive'}</Badge></td><td className="px-6 py-4 text-right space-x-2"><Button size="sm" variant="ghost" onClick={() => openEditDialog(coupon)}><Edit className="w-4 h-4" /></Button><Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(coupon._id)}><Trash2 className="w-4 h-4" /></Button></td></tr>))}</tbody></table></div></CardContent></Card>
      <Dialog open={showDialog} onOpenChange={setShowDialog}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{editMode ? 'Edit' : 'Add'} Coupon</DialogTitle></DialogHeader><form onSubmit={handleSubmit} className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label>Coupon Code *</Label><Input name="code" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="SUMMER25" required /></div><div><Label>Discount Type *</Label><Select value={formData.discountType} onValueChange={(val) => setFormData({...formData, discountType: val})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="percentage">Percentage</SelectItem><SelectItem value="fixed">Fixed Amount</SelectItem></SelectContent></Select></div></div><div><Label>Description</Label><Input name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div><div className="grid grid-cols-3 gap-4"><div><Label>Discount Value *</Label><Input type="number" name="discountValue" value={formData.discountValue} onChange={(e) => setFormData({...formData, discountValue: e.target.value})} placeholder={formData.discountType === 'percentage' ? '10' : '100'} required /></div><div><Label>Min Order Value</Label><Input type="number" name="minOrderValue" value={formData.minOrderValue} onChange={(e) => setFormData({...formData, minOrderValue: e.target.value})} /></div><div><Label>Max Discount</Label><Input type="number" name="maxDiscount" value={formData.maxDiscount} onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})} /></div></div><div className="grid grid-cols-3 gap-4"><div><Label>Usage Limit</Label><Input type="number" name="usageLimit" value={formData.usageLimit} onChange={(e) => setFormData({...formData, usageLimit: e.target.value})} /></div><div><Label>Valid From</Label><Input type="date" name="validFrom" value={formData.validFrom} onChange={(e) => setFormData({...formData, validFrom: e.target.value})} /></div><div><Label>Valid To</Label><Input type="date" name="validTo" value={formData.validTo} onChange={(e) => setFormData({...formData, validTo: e.target.value})} /></div></div><div className="flex items-center gap-4"><input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} /><Label htmlFor="isActive" className="cursor-pointer">Active</Label></div><DialogFooter><Button type="button" variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button><Button type="submit" className="bg-pink-600 hover:bg-pink-700">{editMode ? 'Update' : 'Create'}</Button></DialogFooter></form></DialogContent></Dialog>
    </div>
  )
}
