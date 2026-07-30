'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileUploader } from '@/components/upload/FileUploader'
import { ArrowLeft, Cake, Upload, Image as ImageIcon, FileText, Camera } from 'lucide-react'
import { toast } from 'sonner'

export default function UploadDemoPage() {
  const [productImages, setProductImages] = useState([])
  const [customerPhotos, setCustomerPhotos] = useState([])
  const [documents, setDocuments] = useState([])
  const [allUploads, setAllUploads] = useState([])

  const handleProductUpload = (files) => {
    setProductImages(prev => [...prev, ...files])
    setAllUploads(prev => [...prev, ...files])
  }

  const handleCustomerPhotoUpload = (files) => {
    setCustomerPhotos(prev => [...prev, ...files])
    setAllUploads(prev => [...prev, ...files])
  }

  const handleDocumentUpload = (files) => {
    setDocuments(prev => [...prev, ...files])
    setAllUploads(prev => [...prev, ...files])
  }

  const viewUploads = async (kind) => {
    try {
      const response = await fetch(`/api/uploads?kind=${kind}&limit=20`)
      const data = await response.json()
      if (data.success) {
        toast.success(`Found ${data.files.length} uploaded files`)
        console.log('Uploaded files:', data.files)
      }
    } catch (error) {
      toast.error('Failed to fetch uploads')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/images/mrcoco-logo.png" alt="Mr. COCO Bakery" className="h-16 w-auto" />
            </Link>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-800 py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">File Upload Demo</h1>
          <p className="text-pink-100 text-lg">Test the file upload system with product images, customer photos, and documents</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Product Images
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Customer Photos
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          {/* Product Images Tab */}
          <TabsContent value="products">
            <Card className="border-2 border-pink-200">
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-pink-900 flex items-center gap-2">
                  <ImageIcon className="w-6 h-6" />
                  Upload Product Images
                </CardTitle>
                <CardDescription>
                  Upload high-quality images for cakes, cookies, and other bakery products. 
                  Supports JPG, PNG, WebP, and GIF up to 10MB.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader
                  kind="product_image"
                  accept="image/*"
                  maxSize={10}
                  multiple={true}
                  showPreview={true}
                  onUploadComplete={handleProductUpload}
                />
                <div className="mt-6 flex gap-3">
                  <Button onClick={() => viewUploads('product_image')} variant="outline">
                    View All Product Images
                  </Button>
                  <div className="flex-1" />
                  <p className="text-sm text-gray-600">Total uploaded: {productImages.length}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customer Photos Tab */}
          <TabsContent value="photos">
            <Card className="border-2 border-pink-200">
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-pink-900 flex items-center gap-2">
                  <Camera className="w-6 h-6" />
                  Upload Customer Photos
                </CardTitle>
                <CardDescription>
                  Customers can upload photos for personalized photo cakes. 
                  Supports JPG, PNG, and WebP up to 10MB.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader
                  kind="customer_photo"
                  accept="image/jpeg,image/png,image/webp"
                  maxSize={10}
                  multiple={false}
                  showPreview={true}
                  onUploadComplete={handleCustomerPhotoUpload}
                />
                <div className="mt-6 flex gap-3">
                  <Button onClick={() => viewUploads('customer_photo')} variant="outline">
                    View All Customer Photos
                  </Button>
                  <div className="flex-1" />
                  <p className="text-sm text-gray-600">Total uploaded: {customerPhotos.length}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="border-2 border-pink-200">
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-pink-900 flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Upload Documents
                </CardTitle>
                <CardDescription>
                  Upload documents for bulk orders, quotes, or other business purposes. 
                  Supports PDF, DOC, DOCX, XLS, XLSX up to 10MB.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader
                  kind="document"
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  maxSize={10}
                  multiple={true}
                  showPreview={false}
                  onUploadComplete={handleDocumentUpload}
                />
                <div className="mt-6 flex gap-3">
                  <Button onClick={() => viewUploads('document')} variant="outline">
                    View All Documents
                  </Button>
                  <div className="flex-1" />
                  <p className="text-sm text-gray-600">Total uploaded: {documents.length}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Section */}
        <Card className="mt-8 border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-xl font-serif text-green-900">Upload Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Product Images</p>
                <p className="text-3xl font-bold text-green-700">{productImages.length}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Customer Photos</p>
                <p className="text-3xl font-bold text-green-700">{customerPhotos.length}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Documents</p>
                <p className="text-3xl font-bold text-green-700">{documents.length}</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-2">Recent Uploads:</p>
              {allUploads.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No uploads yet</p>
              ) : (
                <ul className="space-y-1">
                  {allUploads.slice(-5).reverse().map((file, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-green-600" />
                      <span className="truncate">{file.filename}</span>
                      <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-pink-200">
            <CardHeader>
              <CardTitle className="text-lg">✅ Features Implemented</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Multiple file uploads with drag & drop</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>File type validation (images, documents)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>File size validation (max 10MB)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Real-time upload progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Image preview before upload</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>MongoDB metadata storage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Local filesystem storage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>File deletion capability</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">📁 Storage Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900 mb-1">Local Storage:</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                    /public/uploads/products/
                  </code>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">
                    /public/uploads/customers/
                  </code>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">
                    /public/uploads/documents/
                  </code>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Database:</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                    MongoDB: media collection
                  </code>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-900">
                    <strong>Note:</strong> Files are stored locally for development. 
                    Can be easily migrated to AWS S3, Cloudflare R2, or DigitalOcean Spaces for production.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
