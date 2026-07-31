'use client'

import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-3">Privacy Policy</h1>
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
                  At Mr. COCO Bakery ("we," "us," or "our"), we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using our website and services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">2. Information We Collect</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-2">Personal Information</h3>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      We collect personal information that you voluntarily provide to us when you:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>Register for an account</li>
                      <li>Place an order</li>
                      <li>Subscribe to our newsletter</li>
                      <li>Contact us for customer support</li>
                      <li>Participate in promotions or surveys</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed mt-3 mb-2">
                      This information may include:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>Full name</li>
                      <li>Email address</li>
                      <li>Phone number</li>
                      <li>Delivery address</li>
                      <li>Billing information</li>
                      <li>Date of birth (for special occasion reminders)</li>
                      <li>Payment information (processed securely through Razorpay)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-2">Automatically Collected Information</h3>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      When you visit our website, we automatically collect certain information, including:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>IP address and device information</li>
                      <li>Browser type and version</li>
                      <li>Operating system</li>
                      <li>Pages visited and time spent on pages</li>
                      <li>Referring website addresses</li>
                      <li>Clickstream data</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-2">Cookies and Tracking Technologies</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We use cookies, web beacons, and similar tracking technologies to collect information about your browsing activities and to enhance your experience on our website. You can control cookies through your browser settings.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Order Processing:</strong> To process and fulfill your orders, including payment processing, delivery, and customer support</li>
                  <li><strong>Account Management:</strong> To create and manage your user account, including wallet, loyalty points, and referral programs</li>
                  <li><strong>Communication:</strong> To send order confirmations, delivery updates, promotional offers, and marketing communications</li>
                  <li><strong>Personalization:</strong> To personalize your experience, recommend products, and remember your preferences</li>
                  <li><strong>Analytics:</strong> To analyze website usage, improve our services, and optimize user experience</li>
                  <li><strong>Security:</strong> To detect and prevent fraud, unauthorized access, and other malicious activities</li>
                  <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
                  <li><strong>Customer Support:</strong> To respond to your inquiries, complaints, and feedback</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">4. How We Share Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We do not sell your personal information. We may share your information with:
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-2">Service Providers</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We share information with third-party service providers who perform services on our behalf, including:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                      <li>Payment processors (Razorpay) for secure payment processing</li>
                      <li>Delivery partners for order fulfillment</li>
                      <li>Email service providers for communications</li>
                      <li>Cloud storage providers for data hosting</li>
                      <li>Analytics providers for website performance monitoring</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-2">Legal Requirements</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We may disclose your information if required by law or in response to valid legal processes, such as court orders or subpoenas, or to protect our rights, privacy, safety, or property.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-2">Business Transfers</h3>
                    <p className="text-gray-700 leading-relaxed">
                      In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">5. Data Security</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Secure Socket Layer (SSL) encryption for data transmission</li>
                  <li>Encrypted storage of sensitive information</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Employee training on data protection</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">6. Your Privacy Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have certain rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Access:</strong> You can request access to the personal information we hold about you</li>
                  <li><strong>Correction:</strong> You can request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> You can request deletion of your personal information (subject to legal obligations)</li>
                  <li><strong>Opt-Out:</strong> You can opt-out of marketing communications at any time</li>
                  <li><strong>Data Portability:</strong> You can request a copy of your data in a structured, machine-readable format</li>
                  <li><strong>Withdraw Consent:</strong> You can withdraw consent for data processing where consent is the legal basis</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  To exercise these rights, please contact us using the information provided in Section 12.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">7. Cookies Policy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Essential Cookies:</strong> Necessary for website functionality (e.g., shopping cart, login)</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how visitors use our website</li>
                  <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Marketing Cookies:</strong> Track your online activity to deliver relevant advertisements</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  You can manage cookie preferences through your browser settings. Note that disabling certain cookies may affect website functionality.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">8. Third-Party Links</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our website may contain links to third-party websites (e.g., social media platforms, payment gateways). We are not responsible for the privacy practices of these websites. We encourage you to review their privacy policies before providing any personal information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">9. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">10. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Retention periods vary based on:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>The nature of the information</li>
                  <li>Legal and regulatory requirements</li>
                  <li>The purposes for which the information was collected</li>
                  <li>Your relationship with us (active customer vs. inactive account)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">11. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the updated policy on our website with a new "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">12. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <p className="text-gray-700"><strong>Mr. COCO Bakery</strong></p>
                  <p className="text-gray-700">Privacy Officer</p>
                  <p className="text-gray-700">Email: mrcocobakery@gmail.com</p>
                  <p className="text-gray-700">Phone: +91 8447655399, +91 8979751914, +91 7455065399</p>
                  <p className="text-gray-700">Address: Teenpani & Rampur Road, Haldwani, Uttarakhand 263139</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-pink-900 mb-4">13. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  This Privacy Policy is governed by the laws of India, including the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
                </p>
              </section>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
                <p className="text-sm text-blue-900">
                  By using our website and services, you acknowledge that you have read, understood, and agree to this Privacy Policy. If you do not agree, please discontinue use of our services.
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
