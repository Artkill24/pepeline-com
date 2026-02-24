import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

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
  authors: [{ name: 'Saad', url: 'https://pepeline.com' }],
  creator: 'Pepeline Team',
  publisher: 'Pepeline',
  openGraph: {
    title: 'Pepeline - AI Crypto Trading Signals with 73% Accuracy',
    description: 'Explainable AI crypto signals. Track sentiment, whales, and on-chain data. 73% accuracy. Non-custodial. Open source.',
    url: 'https://pepeline.com',
    siteName: 'Pepeline',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Pepeline - AI Crypto Intelligence',
    }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pepeline - AI Crypto Trading Signals with 73% Accuracy',
    description: 'Explainable AI crypto signals. 73% accuracy. Non-custodial. Open source.',
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
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-CVGPD06Z46"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CVGPD06Z46', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
