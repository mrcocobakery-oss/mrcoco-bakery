'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { Button } from '@/components/ui/button'
import { Upload, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export function CloudinaryUploadWidget({ 
  onUploadSuccess, 
  folder = 'admin-media',
  buttonText = 'Upload Image',
  multiple = false
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState(null)

  return (
    <div className="space-y-3">
      <CldUploadWidget
        uploadPreset="ml_default"
        options={{
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'ueofrveh',
          sources: ['local', 'camera'],
          multiple: multiple,
          maxFiles: multiple ? 5 : 1,
          maxFileSize: 10000000, // 10MB
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
          resourceType: 'image',
          folder: folder,
          cropping: false,
          showSkipCropButton: true,
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#90A0B3",
              tabIcon: "#ec4899",
              menuIcons: "#5A616A",
              textDark: "#000000",
              textLight: "#FFFFFF",
              link: "#ec4899",
              action: "#FF620C",
              inactiveTabIcon: "#0E2F5A",
              error: "#F44235",
              inProgress: "#ec4899",
              complete: "#20B832",
              sourceBg: "#E4EBF1"
            }
          }
        }}
        onQueuesStart={() => {
          setUploading(true)
          setUploadedUrl(null)
        }}
        onSuccess={(result) => {
          setUploading(false)
          if (result?.info?.secure_url) {
            let url = result.info.secure_url
            
            // Cloudinary auto-optimization: WebP format + quality optimization
            if (url.includes('cloudinary.com')) {
              url = url.replace('/upload/', '/upload/f_auto,q_auto:good/')
            }
            
            setUploadedUrl(url)
            onUploadSuccess(url, result.info)
            toast.success('✓ Image uploaded successfully!')
          }
        }}
        onError={(error) => {
          setUploading(false)
          console.error('Upload error:', error)
          toast.error('Failed to upload image. Please try again.')
        }}
      >
        {({ open }) => (
          <div>
            <Button 
              type="button"
              onClick={() => open()}
              disabled={uploading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
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
