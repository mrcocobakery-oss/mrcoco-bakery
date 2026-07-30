'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, X, CheckCircle, FileImage, FileText, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

export function FileUploader({ 
  kind = 'media', 
  accept = 'image/*', 
  maxSize = 10, // MB
  onUploadComplete,
  multiple = false,
  showPreview = true 
}) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate file sizes
    const maxBytes = maxSize * 1024 * 1024
    for (const file of files) {
      if (file.size > maxBytes) {
        toast.error(`File ${file.name} is too large. Max ${maxSize}MB`)
        return
      }
    }

    // Generate previews for images
    if (showPreview && accept.includes('image')) {
      const previews = []
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file)
          previews.push({ file, url })
        }
      }
      setPreviewUrls(previews)
    }

    await uploadFiles(files)
  }

  const uploadFiles = async (files) => {
    setUploading(true)
    setProgress(0)
    const results = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('kind', kind)
      formData.append('userId', 'demo-user') // Replace with actual user ID

      try {
        const response = await fetch('/api/uploads', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Upload failed')
        }

        const data = await response.json()
        results.push(data)
        setProgress(((i + 1) / files.length) * 100)
      } catch (error) {
        console.error('Upload error:', error)
        toast.error(`Failed to upload ${file.name}: ${error.message}`)
      }
    }

    setUploadedFiles(prev => [...prev, ...results])
    setUploading(false)
    setProgress(100)
    
    if (results.length > 0) {
      toast.success(`Successfully uploaded ${results.length} file(s)!`)
      if (onUploadComplete) {
        onUploadComplete(multiple ? results : results[0])
      }
    }

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index].url)
    }
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith('image/')) return <FileImage className="w-5 h-5" />
    if (mimeType?.includes('pdf')) return <FileText className="w-5 h-5" />
    return <FileText className="w-5 h-5" />
  }

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center justify-center w-full">
        <label 
          htmlFor="file-upload" 
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-amber-300 rounded-lg cursor-pointer bg-amber-50 hover:bg-amber-100 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-12 h-12 text-amber-600 mb-3" />
            <p className="mb-2 text-sm text-gray-700">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              {accept.includes('image') ? 'Images' : 'Files'} up to {maxSize}MB
            </p>
            {multiple && <p className="text-xs text-gray-500 mt-1">Multiple files allowed</p>}
          </div>
          <input 
            id="file-upload" 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Uploading...</span>
            <span className="text-amber-600 font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Preview Grid */}
      {showPreview && previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previewUrls.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-amber-200">
                <img 
                  src={preview.url} 
                  alt={preview.file.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <p className="text-white text-xs text-center px-2 truncate">
                  {preview.file.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
          {uploadedFiles.map((file, index) => (
            <Card key={index} className="border-green-200">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-green-600">
                      {file.mimeType?.startsWith('image/') ? (
                        <ImageIcon className="w-5 h-5" />
                      ) : (
                        getFileIcon(file.mimeType)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
