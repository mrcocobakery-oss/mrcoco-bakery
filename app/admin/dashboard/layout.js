'use client'

import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute'
import { useAdmin } from '@/contexts/AdminContext'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LayoutDashboard, Package, ShoppingBag, Users, MapPin, Ticket, Briefcase, Bell, LogOut, Menu, X, MessageSquare, FileText, GraduationCap, Image as ImageIcon, Settings, Monitor, BookOpen, Download } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function AdminLayout({ children }) {
  const { admin, logoutAdmin } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [newInquiriesCount, setNewInquiriesCount] = useState(0)

  useEffect(() => {
    fetchNewInquiriesCount()
    // Poll every 30 seconds for new inquiries
    const interval = setInterval(fetchNewInquiriesCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchNewInquiriesCount = async () => {
    try {
      const response = await fetch('/api/contact?status=new')
      const data = await response.json()
      if (data.success) {
        setNewInquiriesCount(data.count || 0)
      }
    } catch (error) {
      console.error('Error fetching new inquiries count:', error)
    }
  }

  const handleLogout = () => {
    logoutAdmin()
    router.push('/admin/login')
  }

  const handleMenuClick = () => {
    // Close menu on mobile after clicking a link
    if (window.innerWidth < 1024) {
      setMenuOpen(false)
    }
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Monitor, label: 'Homepage Slider', href: '/admin/homepage-slider' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: BookOpen, label: 'Menu', href: '/admin/menu' },
    { icon: Download, label: 'Catalogue', href: '/admin/catalogue' },
    { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
    { icon: Users, label: 'Customers', href: '/admin/customers' },
    { icon: FileText, label: 'Inquiries', href: '/admin/inquiries', badge: newInquiriesCount },
    { icon: GraduationCap, label: 'Baking Course', href: '/admin/baking-course' },
    { icon: ImageIcon, label: 'Decoration Gallery', href: '/admin/decoration-gallery' },
    { icon: MapPin, label: 'Delivery Areas', href: '/admin/delivery-areas' },
    { icon: Ticket, label: 'Coupons', href: '/admin/coupons' },
    { icon: Bell, label: 'Notifications', href: '/admin/notifications' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ]

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={() => setMenuOpen(!menuOpen)} variant="ghost" size="icon" className="lg:hidden">
                {menuOpen ? <X /> : <Menu />}
              </Button>
              <Link href="/admin/dashboard">
                <img src="/images/mrcoco-logo.png" alt="Mr. COCO" className="h-12" />
              </Link>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">View Website</Button>
              </Link>
              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="flex relative">
          {/* Mobile Backdrop Overlay */}
          {menuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`
              fixed lg:sticky top-[73px] left-0 z-40
              w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]
              transform transition-transform duration-300 ease-in-out
              ${menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link key={item.href} href={item.href} onClick={handleMenuClick}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={`w-full justify-start relative ${
                        isActive ? 'bg-pink-600 text-white hover:bg-pink-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                      {item.badge > 0 && (
                        <Badge
                          className={`ml-auto ${
                            isActive
                              ? 'bg-white text-pink-600'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedAdminRoute>
  )
}
