'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Search, Package, Eye } from 'lucide-react'
import { toast } from 'sonner'
import Cookies from 'js-cookie'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showDialog, setShowDialog] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: '',
    category: 'cakes',
    cakeType: '',
    occasion: '',
    specialDay: '',
    flavour: '',
    size: '',
    cookieType: '',
    namkeenType: '',
    giftType: '',
    images: '',
    stock: '',
    weight: '',
    inStock: true
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchQuery, categoryFilter])

  const fetchProducts = async () => {
    try {
      const adminToken = Cookies.get('admin_token')
      const response = await fetch('/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setProducts(data.products || [])
      } else {
        toast.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter)
    }
    
    setFilteredProducts(filtered)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const openAddDialog = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      discount: '',
      category: 'cakes',
      cakeType: '',
      occasion: '',
      specialDay: '',
      flavour: '',
      size: '',
      cookieType: '',
      namkeenType: '',
      giftType: '',
      images: '',
      stock: '',
      weight: '',
      inStock: true
    })
    setEditMode(false)
    setCurrentProduct(null)
    setShowDialog(true)
  }

  const openEditDialog = (product) => {
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      discount: product.discount || '',
      category: product.category || 'cakes',
      cakeType: product.cakeType || '',
      occasion: product.occasion || '',
      specialDay: product.specialDay || '',
      flavour: product.flavour || '',
      size: product.size || '',
      cookieType: product.cookieType || '',
      namkeenType: product.namkeenType || '',
      giftType: product.giftType || '',
      images: Array.isArray(product.images) ? product.images.join(', ') : '',
      stock: product.stock || '',
      weight: product.weight || '',
      inStock: product.inStock !== false
    })
    setEditMode(true)
    setCurrentProduct(product)
    setShowDialog(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      const adminToken = Cookies.get('admin_token')
      const imagesArray = formData.images ? formData.images.split(',').map(img => img.trim()) : []
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice || formData.price),
        discount: parseInt(formData.discount || 0),
        stock: parseInt(formData.stock || 0),
        images: imagesArray
      }

      if (editMode && currentProduct) {
        productData._id = currentProduct._id
      }

      const response = await fetch('/api/admin/products', {
        method: editMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(productData)
      })

      if (response.ok) {
        toast.success(editMode ? 'Product updated successfully!' : 'Product created successfully!')
        setShowDialog(false)
        fetchProducts()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to save product')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to save product')
    }
  }

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const adminToken = Cookies.get('admin_token')
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })

      if (response.ok) {
        toast.success('Product deleted successfully!')
        fetchProducts()
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to delete product')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-500 mt-1">Manage your bakery products</p>
        </div>
        <Button onClick={openAddDialog} className="bg-pink-600 hover:bg-pink-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="cakes">Cakes</SelectItem>
                <SelectItem value="cookies">Cookies</SelectItem>
                <SelectItem value="namkeen">Namkeen</SelectItem>
                <SelectItem value="gifts">Gifts</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{filteredProducts.length} Products</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No products found. Add your first product to get started!
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.images && product.images.length > 0 && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            {product.size && (
                              <div className="text-xs text-gray-500">{product.size}</div>
                            )}
                            {product.flavour && (
                              <div className="text-xs text-pink-600">{product.flavour}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="capitalize">
                          {product.category}
                        </Badge>
                        {product.cakeType && (
                          <Badge variant="secondary" className="ml-1 text-xs">
                            {product.cakeType}
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">₹{product.price}</div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-xs text-gray-500 line-through">₹{product.originalPrice}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                          {product.stock || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={product.inStock ? 'default' : 'secondary'} className={product.inStock ? 'bg-green-100 text-green-800' : ''}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Add/Edit Product Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Chocolate Truffle Cake"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cakes">Cakes</SelectItem>
                    <SelectItem value="cookies">Cookies</SelectItem>
                    <SelectItem value="namkeen">Namkeen</SelectItem>
                    <SelectItem value="gifts">Gifts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Product description..."
                rows={3}
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Price (₹) *</Label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="899"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Original Price (₹)</Label>
                <Input
                  name="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="1099"
                />
              </div>
              <div className="space-y-2">
                <Label>Discount (%)</Label>
                <Input
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="18"
                />
              </div>
            </div>

            {/* Cake-Specific Fields */}
            {formData.category === 'cakes' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cake Type</Label>
                    <Select value={formData.cakeType} onValueChange={(val) => handleSelectChange('cakeType', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="eggless">Eggless</SelectItem>
                        <SelectItem value="designer">Designer</SelectItem>
                        <SelectItem value="photo">Photo Cake</SelectItem>
                        <SelectItem value="fondant">Fondant</SelectItem>
                        <SelectItem value="fruit">Fruit</SelectItem>
                        <SelectItem value="chocolate">Chocolate</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="cheesecake">Cheesecake</SelectItem>
                        <SelectItem value="bento">Bento</SelectItem>
                        <SelectItem value="jar">Jar Cake</SelectItem>
                        <SelectItem value="mini">Mini Cake</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Occasion</Label>
                    <Select value={formData.occasion} onValueChange={(val) => handleSelectChange('occasion', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select occasion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="birthday">Birthday</SelectItem>
                        <SelectItem value="anniversary">Anniversary</SelectItem>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                        <SelectItem value="baby shower">Baby Shower</SelectItem>
                        <SelectItem value="retirement">Retirement</SelectItem>
                        <SelectItem value="house warming">House Warming</SelectItem>
                        <SelectItem value="graduation">Graduation</SelectItem>
                        <SelectItem value="congratulations">Congratulations</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Special Day</Label>
                    <Select value={formData.specialDay} onValueChange={(val) => handleSelectChange('specialDay', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="mothers day">Mother's Day</SelectItem>
                        <SelectItem value="fathers day">Father's Day</SelectItem>
                        <SelectItem value="valentine">Valentine's Day</SelectItem>
                        <SelectItem value="christmas">Christmas</SelectItem>
                        <SelectItem value="new year">New Year</SelectItem>
                        <SelectItem value="diwali">Diwali</SelectItem>
                        <SelectItem value="holi">Holi</SelectItem>
                        <SelectItem value="eid">Eid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Flavour</Label>
                    <Input
                      name="flavour"
                      value={formData.flavour}
                      onChange={handleInputChange}
                      placeholder="e.g., Chocolate, Vanilla"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Size (kg)</Label>
                    <Input
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      placeholder="e.g., 1kg, 500g"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Cookie-Specific Fields */}
            {formData.category === 'cookies' && (
              <div className="space-y-2">
                <Label>Cookie Type</Label>
                <Select value={formData.cookieType} onValueChange={(val) => handleSelectChange('cookieType', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="butter">Butter</SelectItem>
                    <SelectItem value="tea">Tea Cookies</SelectItem>
                    <SelectItem value="healthy">Healthy</SelectItem>
                    <SelectItem value="millet">Millet</SelectItem>
                    <SelectItem value="dry fruit">Dry Fruit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Namkeen-Specific Fields */}
            {formData.category === 'namkeen' && (
              <div className="space-y-2">
                <Label>Namkeen Type</Label>
                <Select value={formData.namkeenType} onValueChange={(val) => handleSelectChange('namkeenType', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="traditional">Traditional</SelectItem>
                    <SelectItem value="baked">Baked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Gift-Specific Fields */}
            {formData.category === 'gifts' && (
              <div className="space-y-2">
                <Label>Gift Type</Label>
                <Select value={formData.giftType} onValueChange={(val) => handleSelectChange('giftType', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="festival hamper">Festival Hamper</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Stock & Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stock Quantity</Label>
                <Input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="100"
                />
              </div>
              <div className="space-y-2">
                <Label>Weight</Label>
                <Input
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="e.g., 500g"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Image URLs (comma-separated)</Label>
              <Textarea
                name="images"
                value={formData.images}
                onChange={handleInputChange}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={formData.inStock}
                onChange={handleInputChange}
                className="rounded"
              />
              <Label htmlFor="inStock" className="cursor-pointer">In Stock</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                {editMode ? 'Update Product' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
