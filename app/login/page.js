'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Mail, Phone, Lock, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const { login, loginWithOTP } = useAuth()
  const [loading, setLoading] = useState(false)
  
  // Email/Password form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Phone/OTP form
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [mockOTP, setMockOTP] = useState('')

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await login(email, password)
    setLoading(false)
    
    if (result.success) {
      router.push('/dashboard')
    }
  }

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })

      const data = await response.json()
      
      if (response.ok) {
        setOtpSent(true)
        setMockOTP(data.otp) // Mock: Show OTP
        toast.success('OTP sent successfully!')
      } else {
        toast.error(data.error || 'Failed to send OTP')
      }
    } catch (error) {
      toast.error('Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await loginWithOTP(phone, otp)
    setLoading(false)
    
    if (result.success) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-pink-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" className="text-pink-900">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md border-2 border-pink-200 shadow-xl">
          <CardHeader className="text-center">
            <div className="mb-4">
              <img src="/images/mrcoco-logo.png" alt="Mr. COCO Bakery" className="h-20 mx-auto" />
            </div>
            <CardTitle className="text-3xl font-serif text-pink-900">Welcome Back!</CardTitle>
            <CardDescription>Login to your Mr. COCO Bakery account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="phone">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone
                </TabsTrigger>
              </TabsList>

              {/* Email/Password Tab */}
              <TabsContent value="email">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <Link href="/forgot-password" className="text-sm text-pink-600 hover:text-pink-700">
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Phone/OTP Tab */}
              <TabsContent value="phone">
                {!otpSent ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="10-digit mobile number"
                          className="pl-10"
                          maxLength={10}
                          required
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleSendOTP}
                      disabled={loading}
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        'Send OTP'
                      )}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleOTPLogin} className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-green-900 mb-1">
                        <strong>Mock OTP System:</strong> Your OTP is:
                      </p>
                      <p className="text-2xl font-bold text-green-700 text-center tracking-wider">
                        {mockOTP}
                      </p>
                      <p className="text-xs text-green-600 mt-2">
                        In production, this will be sent via SMS
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="6-digit OTP"
                        maxLength={6}
                        className="text-center text-2xl tracking-wider"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify & Login'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setOtpSent(false)
                        setOtp('')
                        setMockOTP('')
                      }}
                      className="w-full"
                    >
                      Change Number
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/signup" className="text-pink-600 hover:text-pink-700 font-semibold">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
