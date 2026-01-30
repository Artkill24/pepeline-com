import './globals.css'

export const metadata = {
  title: 'Pepeline - Crypto Sentiment Engine',
  description: 'Real-time crypto market sentiment index. Track sentiment, volatility, FOMO, and meme intensity.',
  icons: {
    icon: '/pepeline-logo.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
