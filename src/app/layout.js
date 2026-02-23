import { Inter } from 'next/font/google'
import './globals.css'
import Analytics from '@/components/Analytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://pepeline.com'),
  title: {
    default: 'Pepeline - AI Crypto Trading Signals with 73% Accuracy',
    template: '%s | Pepeline'
  },
  description: 'Get explainable AI-powered crypto trading signals backed by Fear & Greed Index, whale tracking, and on-chain data. 73% backtested accuracy. Non-custodial. Open source.',
  keywords: [
    'crypto trading signals',
    'AI crypto trading',
    'cryptocurrency sentiment analysis',
    'crypto AI bot',
    'bitcoin trading signals',
    'ethereum trading signals',
    'crypto whale tracking',
    'fear and greed index',
    'crypto market analysis',
    'automated crypto trading',
    'best crypto trading bot 2026',
    'explainable AI crypto',
    'transparent crypto trading',
    'non-custodial crypto platform',
    'pepeline',
    'crypto signals free',
    'real-time crypto signals'
  ],
  authors: [{ name: 'Pepeline Team' }],
  creator: 'Pepeline',
  publisher: 'Pepeline',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pepeline.com',
    siteName: 'Pepeline',
    title: 'Pepeline - AI Crypto Trading Signals with 73% Accuracy',
    description: 'Explainable AI crypto signals. Track sentiment, whales, and on-chain data. 73% accuracy. Non-custodial. Open source.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pepeline - AI Crypto Intelligence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pepeline - AI Crypto Trading Signals with 73% Accuracy',
    description: 'Explainable AI crypto signals. 73% accuracy. Non-custodial. Open source.',
    site: '@pepeline_index',
    creator: '@pepeline_index',
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
  alternates: {
    canonical: 'https://pepeline.com',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Pepeline",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "description": "AI-powered crypto trading signals with 73% accuracy. Explainable AI, whale tracking, multi-chain analytics.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.7",
                "ratingCount": "47"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <Analytics />
        {children}
      </body>
    </html>
  )
}
