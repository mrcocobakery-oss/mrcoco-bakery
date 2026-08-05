import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'
import { Playfair_Display, Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { AdminProvider } from '@/contexts/AdminContext'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap'
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata = {
  title: 'Mr. COCO Bakery - Keep It Simple, Keep It Tasty | Haldwani',
  description: 'Premium bakery in Haldwani offering fresh cakes, cookies, pastries, and more. Located opposite Hotel Blue Saphire, Rampur Road. Call +918447655399',
  icons: {
    icon: [
      { url: '/images/mrcoco-logo.png', sizes: 'any' },
      { url: '/images/mrcoco-logo.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/images/mrcoco-logo.png',
    shortcut: '/images/mrcoco-logo.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="font-sans">
        <Providers>
          <AuthProvider>
            <AdminProvider>
              {children}
              <Toaster />
            </AdminProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
