'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-extrabold mb-8">Terms of Service</h1>
                
                <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
                    <p className="text-sm text-gray-400">Last updated: February 21, 2026</p>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using Pepeline ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                            If you disagree with any part, you may not access the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Description of Service</h2>
                        <p>Pepeline provides:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>AI-powered cryptocurrency sentiment analysis</li>
                            <li>Trading signals based on on-chain data and market indicators</li>
                            <li>Whale tracking and smart money monitoring</li>
                            <li>Market intelligence and analytics tools</li>
                            <li>Non-custodial trading suggestions (you control your funds)</li>
                        </ul>
                    </section>

                    <section className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">⚠️ 3. CRITICAL DISCLAIMERS</h2>
                        
                        <h3 className="text-xl font-bold text-white mt-6 mb-3">3.1 Not Financial Advice</h3>
                        <p className="font-bold">
                            THE SERVICE DOES NOT PROVIDE FINANCIAL, INVESTMENT, TRADING, OR LEGAL ADVICE. All signals, 
                            predictions, and analytics are FOR INFORMATIONAL PURPOSES ONLY. You are solely responsible 
                            for your trading decisions.
                        </p>

                        <h3 className="text-xl font-bold text-white mt-6 mb-3">3.2 Risk of Loss</h3>
                        <p className="font-bold">
                            CRYPTOCURRENCY TRADING INVOLVES SUBSTANTIAL RISK OF LOSS. Past performance (including our 
                            73% backtest accuracy) does NOT guarantee future results. You may lose some or all of your capital.
                        </p>

                        <h3 className="text-xl font-bold text-white mt-6 mb-3">3.3 No Guarantees</h3>
                        <p>
                            We make NO WARRANTIES about the accuracy, completeness, or timeliness of our signals or data. 
                            Market conditions change rapidly and unpredictably.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Non-Custodial Nature</h2>
                        <p className="font-bold">
                            Pepeline is STRICTLY NON-CUSTODIAL. We never:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>Hold, control, or have access to your cryptocurrency</li>
                            <li>Store your private keys or seed phrases</li>
                            <li>Execute trades on your behalf (signals are suggestions only)</li>
                            <li>Act as a broker, exchange, or financial intermediary</li>
                        </ul>
                        <p className="mt-4">
                            You maintain full custody and control of your funds at all times.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. User Responsibilities</h2>
                        <p>You agree to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Conduct your own research (DYOR) before making trading decisions</li>
                            <li>Only trade with capital you can afford to lose</li>
                            <li>Comply with all applicable laws and regulations in your jurisdiction</li>
                            <li>Not use the Service for illegal activities or market manipulation</li>
                            <li>Secure your wallet and private keys</li>
                            <li>Verify all transaction details before executing trades</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Accuracy and Reliability</h2>
                        <p>
                            While we strive for accuracy, the Service may contain errors, inaccuracies, or downtime. We are not liable for:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Incorrect signals or predictions</li>
                            <li>Data delays or API failures from third-party providers</li>
                            <li>Service interruptions or bugs</li>
                            <li>Losses resulting from following our signals</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Prohibited Activities</h2>
                        <p>You may NOT:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Use the Service to manipulate markets or engage in wash trading</li>
                            <li>Reverse engineer or attempt to access our AI models</li>
                            <li>Scrape data for commercial use without permission</li>
                            <li>Overload our servers with excessive API requests</li>
                            <li>Impersonate others or provide false information</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Intellectual Property</h2>
                        <p>
                            The Service, including our AI models, algorithms, and UI, is protected by copyright and other 
                            intellectual property laws. You may not copy, modify, or redistribute without explicit permission.
                        </p>
                        <p className="mt-4">
                            Our open-source code on GitHub is licensed under MIT License (see repository for details).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Limitation of Liability</h2>
                        <p className="font-bold uppercase">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, PEPELINE AND ITS TEAM SHALL NOT BE LIABLE FOR ANY 
                            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, 
                            ARISING FROM YOUR USE OF THE SERVICE.
                        </p>
                        <p className="mt-4">
                            IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED $100 USD.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Third-Party Integrations</h2>
                        <p>
                            The Service integrates with third-party platforms (Alchemy, CoinGecko, Jupiter DEX, etc.). 
                            We are not responsible for their actions, downtime, or changes to their services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. Modifications to Service</h2>
                        <p>
                            We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) 
                            at any time without notice. We are not liable for any modification or discontinuation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">12. Termination</h2>
                        <p>
                            We may terminate or suspend your access immediately, without prior notice, for any reason, 
                            including breach of these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">13. Governing Law</h2>
                        <p>
                            These Terms are governed by international arbitration principles. Any disputes shall be 
                            resolved through binding arbitration.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">14. Changes to Terms</h2>
                        <p>
                            We may update these Terms at any time. Continued use after changes constitutes acceptance. 
                            Check this page regularly for updates.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">15. Contact</h2>
                        <p>Questions about these Terms? Contact us:</p>
                        <ul className="list-none space-y-2 mt-4">
                            <li>📧 Email: <a href="mailto:legal@pepeline.com" className="text-blue-400 hover:underline">legal@pepeline.com</a></li>
                            <li>🐦 Twitter: <a href="https://x.com/pepeline_index" target="_blank" rel="noopener" className="text-blue-400 hover:underline">@pepeline_index</a></li>
                        </ul>
                    </section>

                    <div className="mt-12 p-6 bg-yellow-900/20 border border-yellow-500/30 rounded-xl">
                        <p className="font-bold mb-2 text-yellow-300">By using Pepeline, you acknowledge that:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>You have read and understood these Terms</li>
                            <li>Cryptocurrency trading is high-risk</li>
                            <li>We provide information, not financial advice</li>
                            <li>You are solely responsible for your trading decisions and losses</li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
