import './globals.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'Pepeline - Crypto Sentiment Engine',
  description: 'Real-time crypto market sentiment index. Track sentiment, volatility, FOMO, and meme intensity with live AI analysis.',
  keywords: 'crypto, sentiment, bitcoin, ethereum, trading, index, market analysis',
  authors: [{ name: 'Pepeline' }],
  openGraph: {
    title: 'Pepeline - Crypto Sentiment Engine',
    description: 'Real-time crypto market sentiment tracking with AI-powered insights',
    url: 'https://pepeline.com',
    siteName: 'Pepeline',
    images: [{ url: '/pepeline-logo.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pepeline - Crypto Sentiment Engine',
    description: 'Real-time crypto market sentiment tracking',
    images: ['/pepeline-logo.png'],
  },
  icons: {
    icon: '/pepeline-logo.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
