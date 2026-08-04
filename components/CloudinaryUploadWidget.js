'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { Button } from '@/components/ui/button'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export function CloudinaryUploadWidget({ 
  onUploadSuccess, 
  folder = 'admin-media',
  buttonText = 'Upload Image'
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState(null)

  return (
    <div className="space-y-3">
      <CldUploadWidget
        signatureEndpoint="/api/cloudinary/sign"
        options={{
          sources: ['local'],
          multiple: false,
          maxFiles: 1,
          maxFileSize: 5000000, // 5MB
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
          resourceType: 'image',
          folder: folder,
        }}
        onQueuesStart={() => {
          setUploading(true)
          setUploadedUrl(null)
        }}
        onSuccess={(result) => {
          setUploading(false)
          if (result?.info?.secure_url) {
            const url = result.info.secure_url
            setUploadedUrl(url)
            onUploadSuccess(url, result.info)
            toast.success('Image uploaded successfully!')
          }
        }}
        onError={(error) => {
          setUploading(false)
          console.error('Upload error:', error)
          toast.error('Failed to upload image')
        }}
      >
        {({ open }) => (
          <div>
            <Button 
              type="button"
              onClick={() => open()}
              disabled={uploading}
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : uploadedUrl ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Uploaded! Click to change
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {buttonText}
                </>
              )}
            </Button>
            
            {uploadedUrl && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-800 font-medium mb-1">✓ Image uploaded successfully</p>
                <img 
                  src={uploadedUrl} 
                  alt="Uploaded preview" 
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            )}
          </div>
        )}
      </CldUploadWidget>
    </div>
  )
}
