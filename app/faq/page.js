'use client'

import { useState } from 'react'
import { Header } from '@/components/navigation/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, HelpCircle, Package, Truck, CreditCard, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqCategories = [
    {
      title: 'Orders & Products',
      icon: Package,
      faqs: [
        {
          question: 'How do I place an order?',
          answer: 'Browse our products, add items to cart, proceed to checkout, fill in delivery details, and complete payment. You'll receive an order confirmation email immediately.'
        },
        {
          question: 'Can I customize my cake?',
          answer: 'Yes! We offer customization for cakes including flavor, size, design, and text. Contact us via WhatsApp or use the "Chat & Order" button on cake products for custom requests.'
        },
        {
          question: 'Do you have eggless options?',
          answer: 'Absolutely! We have a wide range of eggless cakes, pastries, and cookies. Filter by "Eggless" category when browsing our products.'
        },
        {
          question: 'What sizes are available for cakes?',
          answer: 'We offer cakes in various sizes: 250g, 500g, 1kg, 1.5kg, 2kg, and larger for special orders. Size options are displayed on each product page.'
        }
      ]
    },
    {
      title: 'Delivery & Shipping',
      icon: Truck,
      faqs: [
        {
          question: 'What are your delivery areas?',
          answer: 'Cakes are delivered only to PIN code 263139 (Haldwani area). Other products like cookies, namkeen, and gift packs are available for nationwide shipping.'
        },
        {
          question: 'What are the delivery charges?',
          answer: 'Delivery charges vary by location and order value. Free delivery is available for orders above ₹500 within our local delivery area. Check delivery charges at checkout.'
        },
        {
          question: 'When will my order be delivered?',
          answer: 'Choose your preferred delivery date and time slot during checkout. We deliver between 10:00 AM - 8:00 PM. Express delivery (same-day) is available for an additional ₹200.'
        },
        {
          question: 'Can I schedule delivery for a specific date?',
          answer: 'Yes! Select your preferred delivery date during checkout. We recommend ordering at least 24 hours in advance for custom cakes and 2-3 days for special occasion cakes.'
        },
        {
          question: 'Do you deliver on Sundays and holidays?',
          answer: 'Yes, we deliver 7 days a week including Sundays and most holidays. However, advance booking is recommended during festival seasons.'
        }
      ]
    },
    {
      title: 'Payment & Pricing',
      icon: CreditCard,
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major payment methods including Credit/Debit Cards, UPI, Net Banking, and Digital Wallets through Razorpay secure payment gateway.'
        },
        {
          question: 'Is it safe to pay online?',
          answer: 'Yes, completely safe! We use Razorpay, a PCI-DSS compliant payment gateway. Your card details are encrypted and never stored on our servers.'
        },
        {
          question: 'Can I use discount coupons?',
          answer: 'Yes! Enter your coupon code at checkout. Coupons are available during special occasions and festivals. Follow us on social media for exclusive offers.'
        },
        {
          question: 'What is the Loyalty Points program?',
          answer: 'Earn 1 point for every ₹100 spent. Redeem 100 points = ₹100 discount on future orders. Points are automatically added to your account after order delivery.'
        }
      ]
    },
    {
      title: 'Returns & Cancellations',
      icon: RefreshCw,
      faqs: [
        {
          question: 'Can I cancel my order?',
          answer: 'Orders can be cancelled up to 12 hours before scheduled delivery time. Contact us immediately at +91 8447655399. Refunds will be processed within 5-7 business days.'
        },
        {
          question: 'What if I receive a damaged product?',
          answer: 'We take utmost care in packaging. If you receive a damaged product, please contact us within 2 hours of delivery with photos. We'll arrange a replacement or refund immediately.'
        },
        {
          question: 'Do you offer refunds?',
          answer: 'Yes, refunds are provided for cancelled orders (as per policy) and damaged products. Refunds are processed to the original payment method within 5-7 business days.'
        },
        {
          question: 'What is your quality guarantee?',
          answer: 'We guarantee 100% fresh, high-quality products. If you're not satisfied, contact us within 2 hours of delivery and we'll make it right.'
        }
      ]
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-pink-100 max-w-2xl mx-auto">
            Find answers to common questions about our products, delivery, and services
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* FAQ Categories */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {faqCategories.map((category, catIndex) => {
            const IconComponent = category.icon
            return (
              <div key={catIndex}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-pink-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-pink-900">{category.title}</h2>
                </div>
                
                <div className="space-y-3">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = `${catIndex}-${faqIndex}`
                    const isOpen = openIndex === globalIndex
                    
                    return (
                      <Card key={faqIndex} className="border-2 border-pink-100 overflow-hidden">
                        <button
                          onClick={() => toggleFAQ(globalIndex)}
                          className="w-full text-left"
                        >
                          <CardContent className="p-4 hover:bg-pink-50 transition">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                              {isOpen ? (
                                <ChevronUp className="w-5 h-5 text-pink-600 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              )}
                            </div>
                          </CardContent>
                        </button>
                        {isOpen && (
                          <CardContent className="px-4 pb-4 pt-0">
                            <div className="bg-pink-50 rounded-lg p-4 border-l-4 border-pink-600">
                              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Still Have Questions? */}
        <Card className="mt-12 bg-gradient-to-r from-pink-50 to-white border-2 border-pink-100 max-w-3xl mx-auto">
          <CardContent className="p-8 text-center">
            <HelpCircle className="w-12 h-12 text-pink-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-pink-900 mb-3">Still Have Questions?</h3>
            <p className="text-gray-700 mb-6">
              Can't find what you're looking for? Our team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-pink-600 hover:bg-pink-700">
                  Contact Us
                </Button>
              </Link>
              <a href="https://wa.me/918447655399" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Chat
                </Button>
              </a>
              <a href="tel:+918447655399">
                <Button variant="outline">
                  Call +91 8447655399
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
