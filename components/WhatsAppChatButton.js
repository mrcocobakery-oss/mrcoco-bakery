'use client'

import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

export function WhatsAppChatButton({ product, variant = 'default', className = '' }) {
  const handleWhatsAppClick = () => {
    const phoneNumber = '918447655399' // Business WhatsApp number (without +)
    
    // Build WhatsApp message
    let message = `Hi! I'm interested in:\n\n`
    message += `*${product.name}*\n`
    if (product.size) message += `Size: ${product.size}\n`
    if (product.flavour) message += `Flavour: ${product.flavour}\n`
    message += `Price: ₹${product.price}\n`
    if (product.description) message += `\n${product.description}\n`
    
    // Add image URL if available
    if (product.image || (product.images && product.images[0])) {
      const imageUrl = product.image || product.images[0]
      message += `\nProduct Link: ${window.location.origin}/products?id=${product.id || product._id}`
    }
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message)
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  if (variant === 'icon') {
    return (
      <Button
        onClick={handleWhatsAppClick}
        size="icon"
        className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
        title="Chat & Order on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      Chat & Order
    </Button>
  )
}
