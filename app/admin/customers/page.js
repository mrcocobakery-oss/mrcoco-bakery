'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Search, Users, Mail, Phone, Calendar, Plus, Edit, MessageSquare, Gift, Trash2, ShoppingBag, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import Cookies from 'js-cookie'

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [whatsappMessage, setWhatsappMessage] = useState('')
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false)
  
  // Order History states
  const [customerOrders, setCustomerOrders] = useState([])
  const [orderStats, setOrderStats] = useState(null)
  const [loadingOrders, setLoadingOrders] = useState(false)
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    birthdays: []
  })
  
  const [newBirthday, setNewBirthday] = useState({ name: '', date: '' })

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    filterCustomers()
  }, [customers, searchQuery])

  const fetchCustomers = async () => {
    try {
      const adminToken = Cookies.get('admin_token')
      const response = await fetch('/api/admin/customers', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      })
      const data = await response.json()
      if (response.ok) {
        setCustomers(data.customers || [])
      } else {
        toast.error('Failed to fetch customers')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }

  const filterCustomers = () => {
    let filtered = [...customers]
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone?.includes(searchQuery)
      )
    }
    setFilteredCustomers(filtered)
  }

  const handleAddCustomer = async () => {
    if (!formData.name || !formData.phone) {
      toast.error('Name and phone are required')
      return
    }

    try {
      const adminToken = Cookies.get('admin_token')
      const response = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (response.ok) {
        toast.success('Customer added successfully')
        fetchCustomers()
        setShowAddDialog(false)
        resetForm()
      } else {
        toast.error(data.error || 'Failed to add customer')
      }
    } catch (error) {
      toast.error('Failed to add customer')
    }
  }

  const handleEditCustomer = async (customer) => {
    setSelectedCustomer(customer)
    setFormData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      birthdays: customer.birthdays || []
    })
    
    // Fetch customer orders
    await fetchCustomerOrders(customer._id, customer.email)
    
    setShowEditDialog(true)
  }
  
  const fetchCustomerOrders = async (customerId, email) => {
    setLoadingOrders(true)
    try {
      const adminToken = Cookies.get('admin_token')
      const response = await fetch(`/api/admin/customers/orders?customerId=${customerId}&email=${email}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      })
      const data = await response.json()
      
      if (response.ok) {
        setCustomerOrders(data.orders || [])
        setOrderStats(data.statistics || null)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleUpdateCustomer = async () => {
    if (!formData.name || !formData.phone) {
      toast.error('Name and phone are required')
      return
    }

    try {
      const adminToken = Cookies.get('admin_token')
      const response = await fetch('/api/admin/customers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          customerId: selectedCustomer._id,
          ...formData
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        toast.success('Customer updated successfully')
        fetchCustomers()
        setShowEditDialog(false)
        resetForm()
      } else {
        toast.error(data.error || 'Failed to update customer')
      }
    } catch (error) {
      toast.error('Failed to update customer')
    }
  }

  const addBirthdayToForm = () => {
    if (!newBirthday.name || !newBirthday.date) {
      toast.error('Please enter name and date')
      return
    }
    
    setFormData(prev => ({
      ...prev,
      birthdays: [...prev.birthdays, newBirthday]
    }))
    setNewBirthday({ name: '', date: '' })
  }

  const removeBirthdayFromForm = (index) => {
    setFormData(prev => ({
      ...prev,
      birthdays: prev.birthdays.filter((_, i) => i !== index)
    }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      birthdays: []
    })
    setNewBirthday({ name: '', date: '' })
    setSelectedCustomer(null)
    setCustomerOrders([])
    setOrderStats(null)
  }

  const handleBulkWhatsApp = async () => {
    if (!whatsappMessage.trim()) {
      toast.error('Please enter a message')
      return
    }

    setSendingWhatsApp(true)
    
    try {
      const adminToken = Cookies.get('admin_token')
      const response = await fetch('/api/admin/whatsapp/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          message: whatsappMessage,
          customerIds: [] // Empty array means send to all
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        // Open WhatsApp links in new tabs
        data.customers.forEach((customer, index) => {
          setTimeout(() => {
            window.open(customer.whatsappLink, '_blank')
          }, index * 500) // Delay to prevent browser blocking
        })
        
        toast.success(`Opening WhatsApp for ${data.count} customers`)
        setShowWhatsAppDialog(false)
        setWhatsappMessage('')
      } else {
        toast.error(data.error || 'Failed to send messages')
      }
    } catch (error) {
      toast.error('Failed to send messages')
    } finally {
      setSendingWhatsApp(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading customers...</div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-500 mt-1">Manage customers, birthdays & send WhatsApp messages</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowWhatsAppDialog(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Bulk WhatsApp
          </Button>
          <Button onClick={() => setShowAddDialog(true)} className="bg-pink-600 hover:bg-pink-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="text-center"><Users className="w-8 h-8 text-pink-600 mx-auto mb-2" /><div className="text-3xl font-bold">{customers.length}</div><div className="text-sm text-gray-500">Total Customers</div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-center"><Mail className="w-8 h-8 text-green-600 mx-auto mb-2" /><div className="text-3xl font-bold">{customers.filter(c => c.emailVerified).length}</div><div className="text-sm text-gray-500">Email Verified</div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-center"><Phone className="w-8 h-8 text-blue-600 mx-auto mb-2" /><div className="text-3xl font-bold">{customers.filter(c => c.phoneVerified).length}</div><div className="text-sm text-gray-500">Phone Verified</div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-center"><Gift className="w-8 h-8 text-purple-600 mx-auto mb-2" /><div className="text-3xl font-bold">{customers.reduce((acc, c) => acc + (c.birthdays?.length || 0), 0)}</div><div className="text-sm text-gray-500">Total Birthdays</div></div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input placeholder="Search by name, email, or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Birthdays</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wallet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loyalty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No customers found</td></tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{customer.name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{customer.email || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{customer.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">
                          {customer.birthdays?.length || 0} birthdays
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">₹{customer.walletBalance || 0}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{customer.loyaltyPoints || 0} pts</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{formatDate(customer.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditCustomer(customer)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Customer Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Add customer details including multiple birthday dates
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Customer name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="customer@example.com"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full address"
                rows={2}
              />
            </div>
            
            {/* Birthdays Section */}
            <div className="border-t pt-4">
              <Label className="text-base font-semibold mb-3 flex items-center gap-2">
                <Gift className="w-4 h-4 text-purple-600" />
                Birthday Dates
              </Label>
              
              {/* Existing Birthdays */}
              {formData.birthdays.length > 0 && (
                <div className="space-y-2 mb-3">
                  {formData.birthdays.map((birthday, index) => (
                    <div key={index} className="flex items-center gap-2 bg-purple-50 p-2 rounded">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{birthday.name}</div>
                        <div className="text-xs text-gray-500">{birthday.date}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeBirthdayFromForm(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add New Birthday */}
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Person name (e.g., Self, Wife, Son)"
                  value={newBirthday.name}
                  onChange={(e) => setNewBirthday({ ...newBirthday, name: e.target.value })}
                />
                <Input
                  type="date"
                  value={newBirthday.date}
                  onChange={(e) => setNewBirthday({ ...newBirthday, date: e.target.value })}
                />
                <Button onClick={addBirthdayToForm} variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Add multiple birthdays (family/friends) for automated reminders
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomer} className="bg-pink-600 hover:bg-pink-700">
              Add Customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer details, birthdays, and view order history
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
            {/* Left Column - Customer Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone *</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    maxLength={10}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Textarea
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                />
              </div>
              
              {/* Birthdays Section */}
              <div className="border-t pt-4">
                <Label className="text-base font-semibold mb-3 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-purple-600" />
                  Birthday Dates
                </Label>
                
                {formData.birthdays.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {formData.birthdays.map((birthday, index) => (
                      <div key={index} className="flex items-center gap-2 bg-purple-50 p-2 rounded">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{birthday.name}</div>
                          <div className="text-xs text-gray-500">{birthday.date}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeBirthdayFromForm(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Person name"
                    value={newBirthday.name}
                    onChange={(e) => setNewBirthday({ ...newBirthday, name: e.target.value })}
                  />
                  <Input
                    type="date"
                    value={newBirthday.date}
                    onChange={(e) => setNewBirthday({ ...newBirthday, date: e.target.value })}
                  />
                  <Button onClick={addBirthdayToForm} variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Right Column - Order History */}
            <div className="border-l pl-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-pink-600" />
                <h3 className="text-lg font-semibold">Order History</h3>
              </div>
              
              {loadingOrders ? (
                <div className="text-center py-8 text-gray-500">Loading orders...</div>
              ) : (
                <>
                  {/* Order Statistics */}
                  {orderStats && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-3">
                          <div className="text-xs text-blue-600">Total Orders</div>
                          <div className="text-2xl font-bold text-blue-900">{orderStats.totalOrders}</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-3">
                          <div className="text-xs text-green-600">Total Spent</div>
                          <div className="text-2xl font-bold text-green-900">₹{orderStats.totalSpent}</div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  {/* Orders List */}
                  {customerOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {customerOrders.map((order) => (
                        <Card key={order._id} className="border-2 hover:border-pink-300 transition">
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="font-semibold text-sm">Order #{order._id?.toString().slice(-6).toUpperCase()}</div>
                                <div className="text-xs text-gray-500">
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </div>
                              </div>
                              <Badge className={
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }>
                                {order.status}
                              </Badge>
                            </div>
                            
                            <div className="space-y-1 mb-2">
                              {order.items?.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="text-xs text-gray-600">
                                  • {item.name} x {item.quantity}
                                </div>
                              ))}
                              {order.items?.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{order.items.length - 2} more items
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between pt-2 border-t">
                              <span className="text-xs text-gray-500">Total</span>
                              <span className="font-bold text-pink-600">₹{order.totalAmount}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={() => { setShowEditDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCustomer} className="bg-pink-600 hover:bg-pink-700">
              Update Customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk WhatsApp Dialog */}
      <Dialog open={showWhatsAppDialog} onOpenChange={setShowWhatsAppDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              Send Bulk WhatsApp Message
            </DialogTitle>
            <DialogDescription>
              Message will be sent to all {customers.length} customers with phone numbers
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="whatsapp-message">Message</Label>
              <Textarea
                id="whatsapp-message"
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={5}
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-900">
                <strong>Note:</strong> WhatsApp web links will open in new tabs. Please allow popups and send messages individually.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowWhatsAppDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBulkWhatsApp} 
              disabled={sendingWhatsApp}
              className="bg-green-600 hover:bg-green-700"
            >
              {sendingWhatsApp ? 'Opening...' : 'Open WhatsApp Links'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
