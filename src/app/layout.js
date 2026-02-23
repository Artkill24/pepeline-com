import { Inter } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from './googleanalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://pepeline.com'),
  title: {
    default: 'Pepeline - AI Crypto Trading Signals with 73% Accuracy',
    template: '%s | Pepeline'
  },
  description: 'Get explainable AI-powered crypto trading signals backed by Fear & Greed Index, whale tracking, and on-chain data. 73% backtested accuracy. Non-custodial. Open source.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
