'use client'

import { useState } from 'react'
import Script from 'next/script'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { CreditCard, Loader2 } from 'lucide-react'

export function RazorpayCheckout({ amount, customerInfo, cartItems, onSuccess, onFailure }) {
  const [loading, setLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  const handlePayment = async () => {
    if (!scriptLoaded) {
      toast.error('Payment system is loading. Please try again in a moment.')
      return
    }

    setLoading(true)

    try {
      // Create order on server
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: cartItems,
          customer: customerInfo,
          deliveryDetails: customerInfo.deliveryDetails
        })
      })

      if (!orderResponse.ok) {
        const error = await orderResponse.json()
        throw new Error(error.error || 'Failed to create order')
      }

      const orderData = await orderResponse.json()

      // Razorpay checkout options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Mr. COCO Bakery',
        description: 'Order Payment',
        image: '/images/mrcoco-logo.png',
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // Verify payment on server
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                internalOrderId: orderData.internalOrderId
              })
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              toast.success('Payment successful! 🎉')
              if (onSuccess) {
                onSuccess(verifyData)
              }
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            toast.error('Payment verification failed')
            if (onFailure) {
              onFailure(error)
            }
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          name: customerInfo?.name || '',
          email: customerInfo?.email || '',
          contact: customerInfo?.phone || ''
        },
        notes: {
          address: customerInfo?.address || ''
        },
        theme: {
          color: '#EC4899' // Pink color matching your theme
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
            toast.info('Payment cancelled')
            if (onFailure) {
              onFailure(new Error('Payment cancelled by user'))
            }
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Payment failed. Please try again.')
      setLoading(false)
      if (onFailure) {
        onFailure(error)
      }
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
        onError={() => {
          toast.error('Failed to load payment system')
        }}
      />
      <Button
        onClick={handlePayment}
        disabled={loading || !scriptLoaded}
        className="w-full bg-pink-600 hover:bg-pink-700 text-white text-lg py-6"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Pay ₹{amount.toFixed(2)}
          </>
        )}
      </Button>
    </>
  )
}
