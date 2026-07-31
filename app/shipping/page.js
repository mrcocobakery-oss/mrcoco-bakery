'use client'

import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Truck, Package, MapPin, Clock, Phone, AlertCircle } from 'lucide-react'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-3">Shipping & Delivery Policy</h1>
          <p className="text-pink-100">Last Updated: January 2025</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto border-2 border-pink-100">
          <CardContent className="p-8 md:p-12">
            <div className="prose prose-pink max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">1. Delivery Coverage</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  At Mr. COCO Bakery, we strive to deliver happiness to your doorstep. Our delivery coverage varies based on product category:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="w-5 h-5 text-pink-600" />
                      <h3 className="text-lg font-semibold text-pink-900">Fresh Cakes</h3>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      <strong>Delivery Area:</strong> PIN Code 263139 only
                    </p>
                    <p className="text-gray-700 text-sm">
                      <strong>Coverage:</strong> Haldwani and surrounding areas (Teenpani, Rampur Road, and nearby localities)
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">Other Products</h3>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      <strong>Delivery Area:</strong> Pan-India
                    </p>
                    <p className="text-gray-700 text-sm">
                      <strong>Products:</strong> Pastries, Cookies, Namkeen, Gift Packs, and packaged items available for nationwide shipping
                    </p>
                  </div>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-900">
                      <strong>Important:</strong> During checkout, the system will automatically verify PIN code eligibility for cake deliveries. If your PIN code is outside 263139, cake items will be removed from your cart.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">2. Delivery Time Slots</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-2">Standard Delivery</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li><strong>Time Window:</strong> 10:00 AM - 8:00 PM (all days)</li>
                      <li><strong>Cake Orders:</strong> Same-day delivery available for orders placed before 2:00 PM</li>
                      <li><strong>Other Products:</strong> 2-5 business days for domestic shipping</li>
                      <li><strong>Advance Orders:</strong> We recommend ordering cakes at least 24 hours in advance for custom designs</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-2">Express Delivery</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li><strong>Availability:</strong> Available for local cake deliveries (PIN 263139)</li>
                      <li><strong>Time Window:</strong> 2-3 hours from order confirmation</li>
                      <li><strong>Additional Charges:</strong> ₹100 for express delivery</li>
                      <li><strong>Cut-off Time:</strong> Express orders must be placed before 6:00 PM</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-2">Midnight Delivery</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li><strong>Availability:</strong> Available for select cake designs in PIN 263139</li>
                      <li><strong>Time Window:</strong> 11:00 PM - 12:30 AM</li>
                      <li><strong>Additional Charges:</strong> ₹200 for midnight delivery</li>
                      <li><strong>Pre-order Required:</strong> Must be ordered at least 24 hours in advance</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">3. Delivery Charges</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-pink-200 rounded-lg">
                    <thead className="bg-pink-100">
                      <tr>
                        <th className="border border-pink-200 p-3 text-left text-pink-900">Order Type</th>
                        <th className="border border-pink-200 p-3 text-left text-pink-900">Order Value</th>
                        <th className="border border-pink-200 p-3 text-left text-pink-900">Delivery Charges</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-pink-200 p-3 text-gray-700">Local Cakes (263139)</td>
                        <td className="border border-pink-200 p-3 text-gray-700">Above ₹500</td>
                        <td className="border border-pink-200 p-3 text-gray-700 font-semibold text-green-600">FREE</td>
                      </tr>
                      <tr className="bg-pink-50">
                        <td className="border border-pink-200 p-3 text-gray-700">Local Cakes (263139)</td>
                        <td className="border border-pink-200 p-3 text-gray-700">Below ₹500</td>
                        <td className="border border-pink-200 p-3 text-gray-700">₹50</td>
                      </tr>
                      <tr>
                        <td className="border border-pink-200 p-3 text-gray-700">Pan-India Shipping</td>
                        <td className="border border-pink-200 p-3 text-gray-700">Above ₹1000</td>
                        <td className="border border-pink-200 p-3 text-gray-700 font-semibold text-green-600">FREE</td>
                      </tr>
                      <tr className="bg-pink-50">
                        <td className="border border-pink-200 p-3 text-gray-700">Pan-India Shipping</td>
                        <td className="border border-pink-200 p-3 text-gray-700">Below ₹1000</td>
                        <td className="border border-pink-200 p-3 text-gray-700">₹100-250 (based on location)</td>
                      </tr>
                      <tr>
                        <td className="border border-pink-200 p-3 text-gray-700">Express Delivery</td>
                        <td className="border border-pink-200 p-3 text-gray-700">Any</td>
                        <td className="border border-pink-200 p-3 text-gray-700">+₹100</td>
                      </tr>
                      <tr className="bg-pink-50">
                        <td className="border border-pink-200 p-3 text-gray-700">Midnight Delivery</td>
                        <td className="border border-pink-200 p-3 text-gray-700">Any</td>
                        <td className="border border-pink-200 p-3 text-gray-700">+₹200</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">4. Order Processing</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Order Confirmation</h3>
                      <p className="text-gray-700 text-sm">You will receive an email and SMS confirmation immediately after placing your order with order details and expected delivery time.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Preparation</h3>
                      <p className="text-gray-700 text-sm">Our bakers start preparing your fresh order. For custom cakes, we may contact you for design confirmation.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Quality Check</h3>
                      <p className="text-gray-700 text-sm">Every product undergoes a quality check before packaging to ensure it meets our high standards.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">4</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Dispatch</h3>
                      <p className="text-gray-700 text-sm">Your order is carefully packaged and dispatched. You'll receive tracking details for pan-India orders.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">5</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Delivery</h3>
                      <p className="text-gray-700 text-sm">Our delivery partner will contact you 30 minutes before delivery. Please be available to receive the order.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">5. Delivery Instructions</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Address Accuracy:</strong> Please ensure your delivery address is complete with landmarks, contact number, and PIN code</li>
                  <li><strong>Contactless Delivery:</strong> Available upon request. The delivery person will place the order at your doorstep and maintain safe distance</li>
                  <li><strong>Recipient Availability:</strong> Someone must be available to receive the order. We recommend providing alternate contact numbers</li>
                  <li><strong>ID Verification:</strong> For alcohol-infused products (if applicable), ID verification may be required (18+ only)</li>
                  <li><strong>Delivery Proof:</strong> Our delivery partners will take a photo confirmation upon delivery</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">6. Delivery Delays and Issues</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-2">Possible Delay Reasons</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>Extreme weather conditions (heavy rain, storms)</li>
                      <li>Traffic congestion or road closures</li>
                      <li>Incorrect or incomplete delivery address</li>
                      <li>Recipient unavailability</li>
                      <li>High order volume during festivals/special occasions</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-2">What We Do</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>We will inform you immediately of any expected delays</li>
                      <li>Our customer support team will keep you updated via call/SMS</li>
                      <li>If delivery is not possible, we will process a full refund within 5-7 business days</li>
                      <li>For perishable items, we may offer a replacement order at no additional cost</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">7. Order Cancellation</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-2">Cancellation by Customer</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li><strong>Before 12 hours of delivery:</strong> Full refund (100% of order value)</li>
                      <li><strong>6-12 hours before delivery:</strong> 50% refund</li>
                      <li><strong>Less than 6 hours before delivery:</strong> No refund (order already in preparation)</li>
                      <li><strong>Custom/Designer Cakes:</strong> Non-refundable once preparation begins (usually 24 hours before delivery)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-2">Cancellation by Mr. COCO Bakery</h3>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      We reserve the right to cancel orders in the following situations:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>Product unavailability due to unforeseen circumstances</li>
                      <li>Delivery area not serviceable</li>
                      <li>Suspected fraudulent transaction</li>
                      <li>Pricing or product description errors</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed mt-2">
                      In such cases, you will receive a full refund within 5-7 business days.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">8. Damaged or Defective Products</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We take utmost care in packaging and delivering our products. However, if you receive a damaged or defective product:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Report Immediately:</strong> Contact us within 2 hours of delivery with photos of the damaged product</li>
                  <li><strong>WhatsApp:</strong> Send images to +91 8447655399</li>
                  <li><strong>Email:</strong> mrcocobakery@gmail.com</li>
                  <li><strong>Resolution:</strong> We will either send a replacement or process a full refund</li>
                  <li><strong>Return:</strong> No return pickup required for perishable items; photos are sufficient</li>
                </ul>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
                  <p className="text-sm text-red-900">
                    <strong>Important:</strong> Claims for damaged products will not be accepted after 2 hours of delivery, as our products are perishable and time-sensitive.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">9. Bulk Orders and Corporate Deliveries</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  For bulk orders (10+ items) or corporate events:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Place orders at least 48 hours in advance</li>
                  <li>Contact our bulk order team for special pricing and customization</li>
                  <li>Dedicated delivery coordinator assigned for large orders</li>
                  <li>Flexible delivery timings available for corporate events</li>
                  <li>Invoice and GST documentation provided</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Visit our <Link href="/bulk-order" className="text-pink-600 hover:text-pink-700 font-semibold">Bulk Order page</Link> or call us for more information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">10. Special Instructions</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  During checkout, you can add special instructions such as:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Custom message on cake</li>
                  <li>Delivery notes ("Ring the doorbell twice", "Leave at security gate")</li>
                  <li>Gift message for recipient</li>
                  <li>Contactless delivery preference</li>
                  <li>Specific delivery time preferences</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  We'll do our best to accommodate your requests, though some may be subject to feasibility.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">11. Storage and Consumption Guidelines</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To enjoy our products at their best:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Cakes:</strong> Refrigerate immediately upon delivery. Best consumed within 24 hours. Bring to room temperature 30 minutes before serving.</li>
                  <li><strong>Pastries:</strong> Store in refrigerator. Consume within 24 hours for optimal freshness.</li>
                  <li><strong>Cookies:</strong> Store in airtight container. Best consumed within 7 days.</li>
                  <li><strong>Namkeen:</strong> Store in cool, dry place. Check packaging for expiry date.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">12. Contact Delivery Support</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  For delivery-related queries or issues, reach out to us:
                </p>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <p className="text-gray-700"><strong>Mr. COCO Bakery - Delivery Support</strong></p>
                  <div className="flex items-center gap-2 mt-2">
                    <Phone className="w-4 h-4 text-pink-600" />
                    <p className="text-gray-700">Phone: +91 8447655399, +91 8979751914, +91 7455065399</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Mail className="w-4 h-4 text-pink-600" />
                    <p className="text-gray-700">Email: mrcocobakery@gmail.com</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-pink-600" />
                    <p className="text-gray-700">Support Hours: Mon-Sun, 8:00 AM - 10:00 PM</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-pink-600" />
                    <p className="text-gray-700">Teenpani & Rampur Road, Haldwani, Uttarakhand 263139</p>
                  </div>
                </div>
              </section>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-8">
                <p className="text-sm text-green-900">
                  <strong>Our Promise:</strong> We are committed to delivering fresh, high-quality products with care and love. Your satisfaction is our priority, and we're here to make every celebration special.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}

import Link from 'next/link'
import { Mail } from 'lucide-react'
