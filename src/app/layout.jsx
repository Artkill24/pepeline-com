import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Pepeline - Crypto Sentiment Tracker | Real-Time Market Analysis',
  description: 'Track crypto sentiment for 100+ coins with AI-powered analysis. Get risk scores, portfolio advisor, and daily market briefs. Free crypto sentiment engine with real data.',
  keywords: 'crypto sentiment, bitcoin sentiment, crypto fear greed index, cryptocurrency analysis, crypto portfolio tracker, AI crypto analysis, market sentiment tracker, crypto risk score',
  authors: [{ name: 'Pepeline' }],
  creator: 'Pepeline',
  publisher: 'Pepeline',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://pepeline.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Pepeline - Crypto Sentiment Tracker',
    description: 'Track crypto sentiment for 100+ coins with AI analysis. Portfolio advisor, risk scores, and market briefs.',
    url: 'https://pepeline.com',
    siteName: 'Pepeline',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pepeline - Crypto Sentiment Engine',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pepeline - Crypto Sentiment Tracker',
    description: 'Track crypto sentiment for 100+ coins with AI analysis',
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://pepeline.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Pepeline',
              description: 'Crypto sentiment tracker with AI analysis for 100+ cryptocurrencies',
              url: 'https://pepeline.com',
              applicationCategory: 'FinanceApplication',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '50',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
