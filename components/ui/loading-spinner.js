import React from 'react'
import { Loader2 } from 'lucide-react'

export function LoadingSpinner({ size = 'default', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }
  
  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  )
}

export function LoadingButton({ loading, children, ...props }) {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <LoadingSpinner size="sm" />
          <span>Loading...</span>
        </span>
      ) : children}
    </button>
  )
}

export function FormLoadingOverlay({ message = 'Processing...' }) {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-3 text-pink-600" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  )
}
