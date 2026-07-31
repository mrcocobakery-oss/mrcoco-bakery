'use client'

import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-3">Terms & Conditions</h1>
          <p className="text-pink-100">Last Updated: January 2025</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto border-2 border-pink-100">
          <CardContent className="p-8 md:p-12">
            <div className="prose prose-pink max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Welcome to Mr. COCO Bakery ("we," "us," or "our"). By accessing or using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully before placing an order.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  These terms apply to all users of the website, including browsers, customers, and any other users of the service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">2. Use of Website</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By using our website, you warrant that:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>You are at least 18 years of age or have parental/guardian consent</li>
                  <li>You will provide accurate and complete information when placing orders</li>
                  <li>You will not use the website for any illegal or unauthorized purpose</li>
                  <li>You will not transmit any viruses or malicious code</li>
                  <li>You will not violate any applicable laws or regulations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">3. Products and Pricing</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We strive to display our products and prices as accurately as possible. However:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Product images are for illustration purposes and may vary slightly from actual products</li>
                  <li>Prices are subject to change without notice</li>
                  <li>We reserve the right to limit quantities purchased</li>
                  <li>All prices are in Indian Rupees (INR) and include applicable taxes</li>
                  <li>Custom cake designs are subject to feasibility and additional charges</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">4. Orders and Payment</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-2">Order Acceptance</h3>
                    <p className="text-gray-700 leading-relaxed">
                      All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason, including product availability, errors in pricing, or suspected fraudulent transactions.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-2">Payment Terms</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>Payment must be made in full at the time of order</li>
                      <li>We accept credit/debit cards, UPI, net banking, and digital wallets</li>
                      <li>All payments are processed through Razorpay secure payment gateway</li>
                      <li>Payment confirmation will be sent via email</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">5. Delivery</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-2">Delivery Areas</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li><strong>Cakes:</strong> Delivery only to PIN Code 263139 (Haldwani area)</li>
                      <li><strong>Other Products:</strong> Nationwide shipping available</li>
                      <li>Delivery charges apply based on location and order value</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-2">Delivery Times</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Standard delivery time is 10:00 AM - 8:00 PM. Express delivery available for additional charges. We recommend ordering at least 24 hours in advance for custom cakes.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">6. Cancellation and Refunds</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-2">Cancellation Policy</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>Orders can be cancelled up to 12 hours before scheduled delivery</li>
                      <li>Cancellation requests must be made via phone or email</li>
                      <li>Custom cake orders may have different cancellation terms</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-2">Refund Policy</h3>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      Refunds will be processed for:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>Cancelled orders (as per cancellation policy)</li>
                      <li>Damaged or defective products (reported within 2 hours of delivery)</li>
                      <li>Non-delivery of orders</li>
                      <li>Refunds processed within 5-7 business days to original payment method</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">7. Product Quality and Food Safety</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We take food safety seriously:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>All products are made fresh using quality ingredients</li>
                  <li>We follow strict hygiene and food safety standards</li>
                  <li>Please inform us of any food allergies or dietary restrictions</li>
                  <li>We are not liable for allergic reactions if allergen information was not provided</li>
                  <li>Consume perishable items within recommended timeframes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">8. User Accounts</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When you create an account:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>You are responsible for maintaining account confidentiality</li>
                  <li>You are responsible for all activities under your account</li>
                  <li>You must notify us immediately of any unauthorized access</li>
                  <li>We reserve the right to suspend or terminate accounts for violations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">9. Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  All content on this website, including text, graphics, logos, images, and software, is the property of Mr. COCO Bakery and protected by copyright laws. You may not:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Reproduce, distribute, or modify any content without permission</li>
                  <li>Use our branding or logos without authorization</li>
                  <li>Copy or scrape content from the website</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">10. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To the maximum extent permitted by law:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>We are not liable for any indirect, incidental, or consequential damages</li>
                  <li>Our liability is limited to the value of your order</li>
                  <li>We are not responsible for delays due to unforeseen circumstances</li>
                  <li>We do not guarantee uninterrupted or error-free website operation</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">11. Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">12. Modifications</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting. Your continued use of the website constitutes acceptance of modified terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">13. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms and Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Haldwani, Uttarakhand.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">14. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have questions about these Terms and Conditions, please contact us:
                </p>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <p className="text-gray-700"><strong>Mr. COCO Bakery</strong></p>
                  <p className="text-gray-700">Email: mrcocobakery@gmail.com</p>
                  <p className="text-gray-700">Phone: +91 8447655399, +91 8979751914, +91 7455065399</p>
                  <p className="text-gray-700">Address: Teenpani & Rampur Road, Haldwani, Uttarakhand</p>
                </div>
              </section>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
                <p className="text-sm text-blue-900">
                  By placing an order or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
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
