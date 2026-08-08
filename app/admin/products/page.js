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
import { CloudinaryUploadWidget } from '@/components/CloudinaryUploadWidget'
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
    theme: '',
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
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploading, setUploading] = useState(false)

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

  const handleImageUpload = (url) => {
    setUploadedImages([...uploadedImages, url])
  }

  const removeImage = (index) => {
    const newImages = [...uploadedImages]
    newImages.splice(index, 1)
    setUploadedImages(newImages)
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
      theme: '',
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
    setUploadedImages([])
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
      theme: product.theme || '',
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
    setUploadedImages(Array.isArray(product.images) ? product.images : [])
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
      
      // Use uploaded images if available, otherwise fall back to manual URLs
      const finalImages = uploadedImages.length > 0 
        ? uploadedImages 
        : (formData.images ? formData.images.split(',').map(img => img.trim()) : [])
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice || formData.price),
        discount: parseInt(formData.discount || 0),
        stock: parseInt(formData.stock || 0),
        images: finalImages
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
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
      <Dialog open={showDialog} onOpenChange={setShowDialog} modal={false}>
        <DialogContent 
          className="max-w-3xl max-h-[90vh] overflow-y-auto"
          onInteractOutside={(e) => {
            // Prevent dialog from closing when clicking on Cloudinary widget
            const target = e.target
            if (target.closest('.cloudinary-widget') || 
                target.closest('[id^="cloudinary"]') ||
                target.closest('iframe')) {
              e.preventDefault()
            }
          }}
        >
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
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="regular cakes">Regular Cakes</SelectItem>
                        <SelectItem value="mini cakes">Mini Cakes</SelectItem>
                        <SelectItem value="photo cakes">Photo Cakes</SelectItem>
                        <SelectItem value="jar cake">Jar Cake</SelectItem>
                        <SelectItem value="pinata cake">Pinata Cake</SelectItem>
                        <SelectItem value="number cake">Number Cake</SelectItem>
                        <SelectItem value="alphabet cake">Alphabet cake</SelectItem>
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
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="birthday cake">Birthday Cake</SelectItem>
                        <SelectItem value="anniversary cake">Anniversary Cake</SelectItem>
                        <SelectItem value="engagement & wedding cake">Engagement & Wedding Cake</SelectItem>
                        <SelectItem value="bride to be cake">Bride To Be cake</SelectItem>
                        <SelectItem value="kids birthday cake for girls">Kids Birthday Cake For Girls</SelectItem>
                        <SelectItem value="kids birthday cake for boys">Kids Birthday Cake For Boys</SelectItem>
                        <SelectItem value="husband birthday cake">Husband Birthday Cake</SelectItem>
                        <SelectItem value="wife birthday cake">Wife Birthday cake</SelectItem>
                        <SelectItem value="retirement cake">Retirement Cake</SelectItem>
                        <SelectItem value="farewell cake">Farewell Cake</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Special Day</Label>
                    <Select value={formData.specialDay} onValueChange={(val) => handleSelectChange('specialDay', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="mother's day">Mother's Day</SelectItem>
                        <SelectItem value="father's day">Father's Day</SelectItem>
                        <SelectItem value="friendship day">Friendship Day</SelectItem>
                        <SelectItem value="valentine's day">Valentine's Day</SelectItem>
                        <SelectItem value="daughter's day">Daughter's day</SelectItem>
                        <SelectItem value="brother's day">Brother's Day</SelectItem>
                        <SelectItem value="teacher's day">Teacher's Day</SelectItem>
                        <SelectItem value="christmas day">Christmas Day</SelectItem>
                        <SelectItem value="new year">New Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={formData.theme} onValueChange={(val) => handleSelectChange('theme', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="6 month birthday cake">6 month Birthday Cake</SelectItem>
                        <SelectItem value="6 month anniversary cake">6 Month Anniversary Cake</SelectItem>
                        <SelectItem value="hidden message cake">Hidden Message Cake</SelectItem>
                        <SelectItem value="prank cake">Prank Cake</SelectItem>
                        <SelectItem value="annaprashan (rice feeding ceremony) cake">Annaprashan (Rice feeding ceremony) Cake</SelectItem>
                        <SelectItem value="18th birthday cake">18th Birthday Cake</SelectItem>
                        <SelectItem value="sorry cake">Sorry Cake</SelectItem>
                        <SelectItem value="good luck cake">Good Luck Cake</SelectItem>
                        <SelectItem value="divorce cake">Divorce Cake</SelectItem>
                        <SelectItem value="bachelor party cakes">Bachelor Party Cakes</SelectItem>
                        <SelectItem value="naming ceremony cake">Naming Ceremony Cake</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <SelectItem value="none">None</SelectItem>
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
                    <SelectItem value="none">None</SelectItem>
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
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="festival hamper">Festival Hamper</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Weight */}
            <div className="space-y-2">
              <Label>Weight</Label>
              <Input
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="e.g., 500g"
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <Label>Product Images</Label>
              
              {/* Cloudinary Upload */}
              <div>
                <Label className="mb-2 block font-semibold">Product Images</Label>
                <CloudinaryUploadWidget
                  onUploadSuccess={(url) => handleImageUpload(url)}
                  folder="products"
                  buttonText={`Upload Product Image (${uploadedImages.length} uploaded)`}
                />
                <p className="text-xs text-gray-500 mt-1">You can upload multiple images one by one</p>
              </div>

              {/* Preview Uploaded Images */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {uploadedImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Optional: Manual URL Input */}
              <details className="text-sm">
                <summary className="cursor-pointer text-gray-600">Or enter image URLs manually</summary>
                <Textarea
                  name="images"
                  value={formData.images}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  rows={2}
                  className="mt-2"
                />
              </details>
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
