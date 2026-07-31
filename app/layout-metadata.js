import { Playfair_Display, Inter } from 'next/font/google'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'Mr. COCO Bakery - Premium Cakes, Cookies & Bakery Products',
  description: 'Order fresh cakes, pastries, cookies, and namkeen from Mr. COCO Bakery in Haldwani. Same-day delivery available. Crafting happiness since 2018.',
  keywords: 'bakery, cakes, pastries, cookies, namkeen, birthday cakes, anniversary cakes, Haldwani bakery, Mr COCO',
  authors: [{ name: 'Mr. COCO Bakery' }],
  creator: 'Mr. COCO Bakery',
  publisher: 'Mr. COCO Bakery',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Mr. COCO Bakery - Premium Cakes & Bakery Products',
    description: 'Fresh cakes, pastries, cookies delivered to your doorstep in Haldwani',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: 'Mr. COCO Bakery',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mr. COCO Bakery',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mr. COCO Bakery',
    description: 'Premium Cakes & Bakery Products',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
