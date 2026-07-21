import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Analytics from '@/components/Analytics'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#eab308',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.dallaslights.com'),
  title: {
    default: 'Dallas Lights — Lighting Companies in Dallas, TX',
    template: '%s | DallasLights.com',
  },
  description: 'Find top-rated lighting companies, designers, and electricians in Dallas, TX. Compare reviews, services, and get free quotes from local lighting pros.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.dallaslights.com',
    siteName: 'DallasLights.com',
    images: [{ url: '/brand/og-image-wide.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/brand/og-image-wide.png'],
  },
  alternates: {
    canonical: 'https://www.dallaslights.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
