'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Search, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import Cookies from 'js-cookie'

export default function AdminDeliveryAreasPage() {
  const [areas, setAreas] = useState([])
  const [filteredAreas, setFilteredAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentArea, setCurrentArea] = useState(null)
  const [formData, setFormData] = useState({ pincode: '', area: '', city: '', state: '', deliveryFee: '', cakeDeliveryAvailable: true, isActive: true })

  useEffect(() => { fetchAreas() }, [])
  useEffect(() => { filterAreas() }, [areas, searchQuery])

  const fetchAreas = async () => {
    try {
      const adminToken = Cookies.get('admin_token')
      const response = await fetch('/api/admin/delivery-areas', { headers: { 'Authorization': `Bearer ${adminToken}` } })
      const data = await response.json()
      if (response.ok) { setAreas(data.areas || []) } else { toast.error('Failed to fetch areas') }
    } catch (error) { toast.error('Failed to fetch areas') } finally { setLoading(false) }
  }

  const filterAreas = () => {
    let filtered = [...areas]
    if (searchQuery) { filtered = filtered.filter(a => a.pincode?.includes(searchQuery) || a.area?.toLowerCase().includes(searchQuery.toLowerCase()) || a.city?.toLowerCase().includes(searchQuery.toLowerCase())) }
    setFilteredAreas(filtered)
  }

  const openAddDialog = () => { setFormData({ pincode: '', area: '', city: '', state: '', deliveryFee: '', cakeDeliveryAvailable: true, isActive: true }); setEditMode(false); setCurrentArea(null); setShowDialog(true) }
  const openEditDialog = (area) => { setFormData({ pincode: area.pincode, area: area.area, city: area.city, state: area.state, deliveryFee: area.deliveryFee, cakeDeliveryAvailable: area.cakeDeliveryAvailable, isActive: area.isActive }); setEditMode(true); setCurrentArea(area); setShowDialog(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.pincode || !formData.city) { toast.error('Please fill required fields'); return }
    try {
      const adminToken = Cookies.get('admin_token')
      const areaData = { ...formData, deliveryFee: parseFloat(formData.deliveryFee || 0) }
      if (editMode && currentArea) { areaData._id = currentArea._id }
      const response = await fetch('/api/admin/delivery-areas', { method: editMode ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }, body: JSON.stringify(areaData) })
      if (response.ok) { toast.success(editMode ? 'Area updated!' : 'Area created!'); setShowDialog(false); fetchAreas() } else { toast.error('Failed to save area') }
    } catch (error) { toast.error('Failed to save area') }
  }

  const handleDelete = async (areaId) => {
    if (!confirm('Delete this area?')) return
    try {
      const adminToken = Cookies.get('admin_token')
      const response = await fetch(`/api/admin/delivery-areas?id=${areaId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${adminToken}` } })
      if (response.ok) { toast.success('Area deleted!'); fetchAreas() } else { toast.error('Failed to delete') }
    } catch (error) { toast.error('Failed to delete') }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Delivery Areas</h1><p className="text-gray-500 mt-1">Manage delivery PIN codes</p></div><Button onClick={openAddDialog} className="bg-pink-600 hover:bg-pink-700"><Plus className="w-4 h-4 mr-2" />Add Area</Button></div>
      <Card><CardContent className="pt-6"><div className="relative"><Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" /><Input placeholder="Search by PIN code, area, or city..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div></CardContent></Card>
      <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PIN Code</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Fee</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cake Delivery</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead><tbody className="divide-y">{filteredAreas.length === 0 ? <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No delivery areas found</td></tr> : filteredAreas.map((area) => (<tr key={area._id} className="hover:bg-gray-50"><td className="px-6 py-4 font-medium">{area.pincode}</td><td className="px-6 py-4">{area.area || 'N/A'}</td><td className="px-6 py-4">{area.city}, {area.state}</td><td className="px-6 py-4">₹{area.deliveryFee || 0}</td><td className="px-6 py-4"><Badge className={area.cakeDeliveryAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{area.cakeDeliveryAvailable ? 'Available' : 'Not Available'}</Badge></td><td className="px-6 py-4"><Badge className={area.isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}>{area.isActive ? 'Active' : 'Inactive'}</Badge></td><td className="px-6 py-4 text-right space-x-2"><Button size="sm" variant="ghost" onClick={() => openEditDialog(area)}><Edit className="w-4 h-4" /></Button><Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(area._id)}><Trash2 className="w-4 h-4" /></Button></td></tr>))}</tbody></table></div></CardContent></Card>
      <Dialog open={showDialog} onOpenChange={setShowDialog}><DialogContent><DialogHeader><DialogTitle>{editMode ? 'Edit' : 'Add'} Delivery Area</DialogTitle></DialogHeader><form onSubmit={handleSubmit} className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label>PIN Code *</Label><Input name="pincode" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} required /></div><div><Label>Area Name</Label><Input name="area" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} /></div></div><div className="grid grid-cols-2 gap-4"><div><Label>City *</Label><Input name="city" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required /></div><div><Label>State</Label><Input name="state" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} /></div></div><div><Label>Delivery Fee (₹)</Label><Input type="number" name="deliveryFee" value={formData.deliveryFee} onChange={(e) => setFormData({...formData, deliveryFee: e.target.value})} /></div><div className="flex items-center gap-4"><input type="checkbox" id="cakeDelivery" checked={formData.cakeDeliveryAvailable} onChange={(e) => setFormData({...formData, cakeDeliveryAvailable: e.target.checked})} /><Label htmlFor="cakeDelivery" className="cursor-pointer">Cake Delivery Available</Label></div><div className="flex items-center gap-4"><input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} /><Label htmlFor="isActive" className="cursor-pointer">Active</Label></div><DialogFooter><Button type="button" variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button><Button type="submit" className="bg-pink-600 hover:bg-pink-700">{editMode ? 'Update' : 'Create'}</Button></DialogFooter></form></DialogContent></Dialog>
    </div>
  )
}
