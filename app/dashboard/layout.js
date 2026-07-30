'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Home, ShoppingBag, User, MapPin, Wallet, Award, Gift, Heart, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: ShoppingBag, label: 'My Orders', href: '/dashboard/orders' },
    { icon: Heart, label: 'Wishlist', href: '/dashboard/wishlist' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
    { icon: MapPin, label: 'Addresses', href: '/dashboard/addresses' },
    { icon: Wallet, label: 'Wallet', href: '/dashboard/wallet' },
    { icon: Award, label: 'Loyalty Points', href: '/dashboard/loyalty' },
    { icon: Gift, label: 'Referrals', href: '/dashboard/referrals' },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        {/* Top Header */}
        <header className="bg-white border-b border-pink-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
              <img src="/images/mrcoco-logo.png" alt="Mr. COCO" className="h-12" />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">Back to Store</Button>
              </Link>
              <Button onClick={() => setMenuOpen(!menuOpen)} variant="ghost" size="icon" className="lg:hidden">
                {menuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className={`lg:block ${menuOpen ? 'block' : 'hidden'}`}>
              <div className="bg-white rounded-xl border-2 border-pink-200 p-6 sticky top-24">
                {/* User Info */}
                <div className="text-center mb-6 pb-6 border-b border-pink-100">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-pink-900">{user?.name}</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>

                {/* Menu */}
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant={isActive ? 'default' : 'ghost'}
                          className={`w-full justify-start ${isActive ? 'bg-pink-600 text-white hover:bg-pink-700' : 'hover:bg-pink-50'}`}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {item.label}
                        </Button>
                      </Link>
                    )
                  })}
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </Button>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
