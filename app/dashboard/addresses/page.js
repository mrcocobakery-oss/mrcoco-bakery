'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase, MapPinned, Star } from 'lucide-react'
import { toast } from 'sonner'

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'home',
    isDefault: false
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/addresses', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses)
      } else {
        toast.error('Failed to fetch addresses')
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (address = null) => {
    if (address) {
      setEditingAddress(address)
      setFormData({
        name: address.name,
        phone: address.phone,
        addressLine: address.addressLine,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        addressType: address.addressType,
        isDefault: address.isDefault
      })
    } else {
      setEditingAddress(null)
      setFormData({
        name: '',
        phone: '',
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
        addressType: 'home',
        isDefault: false
      })
    }
    setDialogOpen(true)
  }

  const handleSaveAddress = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.phone || !formData.addressLine || !formData.city || !formData.state || !formData.pincode) {
      toast.error('All fields are required')
      return
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      toast.error('PIN code must be 6 digits')
      return
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error('Phone must be 10 digits')
      return
    }

    try {
      setSaving(true)
      
      const url = editingAddress 
        ? `/api/user/addresses/${editingAddress._id}`
        : '/api/user/addresses'
      
      const method = editingAddress ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        setDialogOpen(false)
        fetchAddresses()
      } else {
        toast.error(data.error || 'Failed to save address')
      }
    } catch (error) {
      console.error('Error saving address:', error)
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return
    }

    try {
      setDeleting(addressId)
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Address deleted successfully')
        fetchAddresses()
      } else {
        toast.error(data.error || 'Failed to delete address')
      }
    } catch (error) {
      console.error('Error deleting address:', error)
      toast.error('Something went wrong')
    } finally {
      setDeleting(null)
    }
  }

  const getAddressIcon = (type) => {
    const icons = {
      home: <Home className="w-5 h-5" />,
      work: <Briefcase className="w-5 h-5" />,
      other: <MapPinned className="w-5 h-5" />
    }
    return icons[type] || icons.home
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-pink-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading addresses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-pink-900 mb-2">My Addresses</h1>
          <p className="text-gray-600">Manage your delivery addresses</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-pink-600 hover:bg-pink-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {/* Addresses Grid */}
      {addresses.length === 0 ? (
        <Card className="border-2 border-pink-200">
          <CardContent className="p-12">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No addresses saved</h3>
              <p className="text-gray-600 mb-6">Add your first delivery address to get started</p>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card 
              key={address._id} 
              className={`border-2 ${address.isDefault ? 'border-pink-400 bg-pink-50' : 'border-pink-100'} hover:border-pink-300 transition-all relative`}
            >
              {address.isDefault && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 text-pink-600 text-xs font-semibold bg-white px-2 py-1 rounded-full border border-pink-300">
                    <Star className="w-3 h-3 fill-pink-600" />
                    Default
                  </div>
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                    {getAddressIcon(address.addressType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{address.name}</h3>
                      <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-0.5 rounded">
                        {address.addressType}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 text-sm">{address.addressLine}</p>
                  <p className="text-gray-700 text-sm">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDialog(address)}
                    className="flex-1 border-pink-300 text-pink-600 hover:bg-pink-50"
                  >
                    <Edit2 className="w-3 h-3 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteAddress(address._id)}
                    disabled={deleting === address._id}
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    {deleting === address._id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Address Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
            <DialogDescription>
              {editingAddress ? 'Update your delivery address details' : 'Enter your delivery address details'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveAddress}>
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  maxLength={10}
                  required
                />
              </div>

              {/* Address Line */}
              <div className="space-y-2">
                <Label htmlFor="addressLine">Address Line *</Label>
                <Input
                  id="addressLine"
                  placeholder="House No., Building Name, Street, Area"
                  value={formData.addressLine}
                  onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                  required
                />
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* PIN Code */}
              <div className="space-y-2">
                <Label htmlFor="pincode">PIN Code *</Label>
                <Input
                  id="pincode"
                  type="tel"
                  placeholder="6-digit PIN code"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  maxLength={6}
                  required
                />
              </div>

              {/* Address Type */}
              <div className="space-y-2">
                <Label>Address Type *</Label>
                <Select
                  value={formData.addressType}
                  onValueChange={(value) => setFormData({ ...formData, addressType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Default Address */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
                />
                <label
                  htmlFor="isDefault"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Set as default address
                </label>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white"
                disabled={saving}
              >
                {saving ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
