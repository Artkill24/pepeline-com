'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-extrabold mb-8">Privacy Policy</h1>
                
                <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
                    <p className="text-sm text-gray-400">Last updated: February 21, 2026</p>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Introduction</h2>
                        <p>
                            Pepeline ("we", "our", "us") operates pepeline.com (the "Service"). This Privacy Policy explains how we collect, 
                            use, disclose, and safeguard your information when you visit our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Information We Collect</h2>
                        <h3 className="text-xl font-bold text-white mt-6 mb-3">2.1 Information You Provide</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Wallet addresses (when you connect your wallet)</li>
                            <li>Email address (for whitelist registration)</li>
                            <li>Trading preferences and settings</li>
                            <li>Feedback and communications</li>
                        </ul>

                        <h3 className="text-xl font-bold text-white mt-6 mb-3">2.2 Automatically Collected Information</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Browser type and version</li>
                            <li>IP address (anonymized)</li>
                            <li>Usage data and analytics</li>
                            <li>Device information</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. How We Use Your Information</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide and maintain our Service</li>
                            <li>Send AI trading signals and alerts</li>
                            <li>Improve user experience and Service functionality</li>
                            <li>Communicate updates and whitelist information</li>
                            <li>Detect and prevent fraud or abuse</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Data Storage and Security</h2>
                        <p>
                            We use industry-standard security measures to protect your information. Data is stored using:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Encrypted databases (Supabase with Row Level Security)</li>
                            <li>Secure API endpoints with rate limiting</li>
                            <li>No storage of private keys or sensitive wallet data</li>
                            <li>Regular security audits and updates</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Third-Party Services</h2>
                        <p>We integrate with the following third-party services:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Alchemy:</strong> Blockchain data and whale tracking</li>
                            <li><strong>CoinGecko:</strong> Cryptocurrency price data</li>
                            <li><strong>Google Analytics:</strong> Anonymous usage statistics</li>
                            <li><strong>Vercel:</strong> Hosting infrastructure</li>
                        </ul>
                        <p className="mt-4">
                            These services have their own privacy policies. We do not control their practices.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Your Rights (GDPR Compliance)</h2>
                        <p>If you are in the European Economic Area (EEA), you have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Access:</strong> Request a copy of your data</li>
                            <li><strong>Rectification:</strong> Correct inaccurate data</li>
                            <li><strong>Erasure:</strong> Request deletion of your data</li>
                            <li><strong>Portability:</strong> Receive your data in machine-readable format</li>
                            <li><strong>Object:</strong> Opt-out of certain data processing</li>
                        </ul>
                        <p className="mt-4">
                            Contact us at <a href="mailto:privacy@pepeline.com" className="text-blue-400 hover:underline">privacy@pepeline.com</a> to exercise these rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Cookies and Tracking</h2>
                        <p>We use cookies and similar technologies to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Remember your preferences and settings</li>
                            <li>Analyze site traffic and usage patterns</li>
                            <li>Improve Service performance</li>
                        </ul>
                        <p className="mt-4">
                            You can control cookies through your browser settings. Disabling cookies may limit functionality.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Non-Custodial Nature</h2>
                        <p className="font-bold">
                            IMPORTANT: Pepeline is a non-custodial platform. We never store, control, or have access to your 
                            private keys or cryptocurrency funds. You maintain full control of your assets at all times.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Children's Privacy</h2>
                        <p>
                            Our Service is not intended for users under 18. We do not knowingly collect data from children. 
                            If you believe a child has provided us with personal information, contact us immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy periodically. Changes will be posted on this page with an updated 
                            "Last updated" date. Continued use of the Service constitutes acceptance of changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. Contact Us</h2>
                        <p>For privacy-related questions or requests:</p>
                        <ul className="list-none space-y-2 mt-4">
                            <li>📧 Email: <a href="mailto:privacy@pepeline.com" className="text-blue-400 hover:underline">privacy@pepeline.com</a></li>
                            <li>🐦 Twitter: <a href="https://x.com/pepeline_index" target="_blank" rel="noopener" className="text-blue-400 hover:underline">@pepeline_index</a></li>
                            <li>💬 Telegram: <a href="https://t.me/Pepelinebot" target="_blank" rel="noopener" className="text-blue-400 hover:underline">@Pepelinebot</a></li>
                        </ul>
                    </section>

                    <div className="mt-12 p-6 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                        <p className="font-bold mb-2">Open Source Commitment</p>
                        <p>
                            Pepeline is committed to transparency. Our codebase is open source and available on{' '}
                            <a href="https://github.com/Artkill24/pepeline-com" target="_blank" rel="noopener" className="text-blue-400 hover:underline">
                                GitHub
                            </a>. You can verify our data handling practices yourself.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
