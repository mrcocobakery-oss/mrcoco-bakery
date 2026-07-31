'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { MapPin, Plus, Edit, Trash2, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function AddressBookPage() {
  const { user } = useAuth()
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  })

  useEffect(() => {
    if (user) {
      fetchAddresses()
    }
  }, [user])

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses')
      const data = await response.json()
      if (data.success) {
        setAddresses(data.addresses || [])
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = editingAddress ? '/api/addresses' : '/api/addresses'
      const method = editingAddress ? 'PUT' : 'POST'
      const body = editingAddress 
        ? { addressId: editingAddress._id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(editingAddress ? 'Address updated!' : 'Address added!')
        fetchAddresses()
        handleCloseDialog()
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('Failed to save address')
    }
  }

  const handleDelete = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return
    
    try {
      const response = await fetch(`/api/addresses?addressId=${addressId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Address deleted')
        fetchAddresses()
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('Failed to delete address')
    }
  }

  const handleEdit = (address) => {
    setEditingAddress(address)
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault
    })
    setShowDialog(true)
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
    setEditingAddress(null)
    setFormData({
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    })
  }

  if (loading) {
    return <div className="p-6">Loading addresses...</div>
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-pink-900">Address Book</h2>
          <p className="text-gray-600">Manage your delivery addresses</p>
        </div>
        <Button onClick={() => setShowDialog(true)} className="bg-pink-600 hover:bg-pink-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card className="border-2 border-pink-100">
          <CardContent className="p-12 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No addresses saved yet</p>
            <Button onClick={() => setShowDialog(true)} className="bg-pink-600 hover:bg-pink-700">
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card key={address._id} className="border-2 border-pink-100 relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-pink-600" />
                    <CardTitle className="text-lg">{address.name}</CardTitle>
                  </div>
                  {address.isDefault && (
                    <Badge className="bg-pink-600">Default</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-700">{address.address}</p>
                  <p className="text-gray-700">{address.city}, {address.state} - {address.pincode}</p>
                  <p className="text-gray-600">📞 {address.phone}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(address)} variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(address._id)} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Address Dialog */}
      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address *</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="House no., Building name, Street"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State *</label>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">PIN Code *</label>
              <Input
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isDefault" className="text-sm">Set as default address</label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-pink-600 hover:bg-pink-700">
                <Check className="w-4 h-4 mr-2" />
                {editingAddress ? 'Update' : 'Save'} Address
              </Button>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
