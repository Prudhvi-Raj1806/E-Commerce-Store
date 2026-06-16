import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Plus_Jakarta_Sans } from 'next/font/google'
import '@/styles/globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Corporate Gifting Solutions | Premium Branded Gifts India — GiftForge',
    template: '%s | GiftForge',
  },
  description:
    'GiftForge offers premium corporate gifting solutions for employees, clients, and events. Custom branded gifts with PAN India delivery. Minimum 25 units. Get a free quote.',
  keywords: [
    'corporate gifting india',
    'branded gifts',
    'employee gifts',
    'bulk gifts',
    'customized corporate gifts',
    'diwali gifting',
    'onboarding kits',
    'promotional merchandise',
  ],
  authors: [{ name: 'GiftForge', url: 'https://giftforge.in' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'GiftForge',
    title: 'Corporate Gifting Solutions | Premium Branded Gifts India',
    description:
      'Premium customized gifts for employees, clients, events, and festive campaigns. PAN India delivery.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GiftForge — Corporate Gifting Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Corporate Gifting Solutions | GiftForge',
    description: 'Premium customized corporate gifts. PAN India delivery.',
    images: ['/og-image.png'],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo-mark.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  )
}
