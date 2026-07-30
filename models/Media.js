// MongoDB Media Schema for file metadata
// Collections: media

export const MediaSchema = {
  _id: 'ObjectId', // Auto-generated
  userId: 'string', // User who uploaded (for future auth)
  kind: 'string', // 'product_image', 'customer_photo', 'document', 'media'
  filename: 'string', // Original filename
  storedName: 'string', // Stored filename (UUID-based)
  path: 'string', // Relative path (/uploads/products/...)
  url: 'string', // Full URL to access file
  mimeType: 'string', // File MIME type
  size: 'number', // File size in bytes
  status: 'string', // 'uploaded', 'pending', 'rejected'
  metadata: 'object', // Additional metadata (dimensions, etc.)
  createdAt: 'Date',
  updatedAt: 'Date'
}

// Indexes to create:
// db.media.createIndex({ userId: 1 })
// db.media.createIndex({ kind: 1 })
// db.media.createIndex({ status: 1 })
// db.media.createIndex({ createdAt: 1 })
