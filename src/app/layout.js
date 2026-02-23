import { Inter } from 'next/font/google'
import './globals.css'

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
    'non-custodial crypto platform'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pepeline.com',
    siteName: 'Pepeline',
    title: 'Pepeline - AI Crypto Trading Signals with 73% Accuracy',
    description: 'Explainable AI crypto signals. 73% accuracy. Non-custodial. Open source.',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Pepeline - AI Crypto Intelligence',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pepeline - AI Crypto Trading Signals',
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
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-CVGPD06Z46"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CVGPD06Z46');
            `,
          }}
        />
        
        {/* Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Pepeline",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "description": "AI-powered crypto trading signals with 73% accuracy",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
