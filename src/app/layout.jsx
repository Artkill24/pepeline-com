import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Pepeline - Real-time Crypto Sentiment Index',
    description: 'Track cryptocurrency market sentiment with AI-powered analysis. Real-time on-chain data, whale tracking, and macro indicators for informed trading decisions.',
    keywords: 'crypto, sentiment, analysis, bitcoin, ethereum, trading, on-chain, market intelligence',
    authors: [{ name: 'Pepeline Team' }],
    openGraph: {
        title: 'Pepeline - Crypto Sentiment Index',
        description: 'AI-powered cryptocurrency sentiment tracking and market intelligence',
        url: 'https://pepeline.com',
        siteName: 'Pepeline',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Pepeline Crypto Sentiment Index'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Pepeline - Crypto Sentiment Index',
        description: 'Real-time crypto market sentiment tracking',
        images: ['/twitter-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        }
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <meta name="theme-color" content="#10b981" />
            </head>
            <body className={inter.className}>
                {children}
                
                {/* Analytics placeholder */}
                {process.env.NEXT_PUBLIC_GA_ID && (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                            `
                        }}
                    />
                )}
            </body>
        </html>
    );
}
