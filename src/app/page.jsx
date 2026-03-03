'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IndexDisplay from '@/components/IndexDisplay';
import TopCoinsSection from '@/components/TopCoinsSection';
import AboutSection from '@/components/AboutSection';
import SEOContent from '@/components/SEOContent';

export default function HomePage() {
    const [index, setIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIndex();
        const interval = setInterval(fetchIndex, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchIndex = async () => {
        try {
            const res = await fetch('/api/index');
            const data = await res.json();
            setIndex(data);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <Header />

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}>
                    
                    <div className="mb-6">
                        <span className="text-6xl">🐸</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
                        AI-Powered Crypto Intelligence
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        Real-time sentiment tracking, whale monitoring, and AI trading signals.
                        <br />
                        <span className="text-green-400 font-bold">73% backtested accuracy</span> • Non-custodial • Open source
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link href="/dashboard">
                            <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl text-white font-bold text-lg hover:from-green-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
                                📊 View Dashboard
                            </button>
                        </Link>
                        
                        <Link href="/agents-dashboard">
                            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl">
                                🤖 AI Agents Live
                            </button>
                        </Link>

                        <Link href="/trading">
                            <button className="px-8 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white font-bold text-lg hover:bg-gray-700 hover:border-purple-500 transition-all">
                                💎 Trading Signals
                            </button>
                        </Link>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
                        <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                            <div className="text-3xl font-bold text-green-400">73%</div>
                            <div className="text-sm text-gray-400">Accuracy</div>
                        </div>
                        <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                            <div className="text-3xl font-bold text-purple-400">250+</div>
                            <div className="text-sm text-gray-400">Coins Tracked</div>
                        </div>
                        <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                            <div className="text-3xl font-bold text-blue-400">&lt;1s</div>
                            <div className="text-sm text-gray-400">AI Response</div>
                        </div>
                        <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                            <div className="text-3xl font-bold text-pink-400">$0</div>
                            <div className="text-sm text-gray-400">100% Free</div>
                        </div>
                    </div>
                </motion.div>

                {/* Index Display */}
                {!loading && index && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}>
                        <IndexDisplay data={index} />
                    </motion.div>
                )}
            </section>

            {/* AI Agents Showcase */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                        🤖 AI Agents Ecosystem
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Autonomous trading, research, and portfolio management powered by Groq LLM
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-2xl cursor-pointer"
                        onClick={() => window.location.href = '/agents-dashboard'}>
                        <div className="text-4xl mb-4">🤖</div>
                        <h3 className="text-2xl font-bold mb-2">Trading Agent</h3>
                        <p className="text-gray-400 mb-4">
                            Auto-execute signals with LLM reasoning
                        </p>
                        <div className="flex items-center gap-2 text-green-400">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm font-bold">LIVE NOW</span>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-6 bg-gray-800 border border-gray-700 rounded-2xl">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold mb-2">Research Agent</h3>
                        <p className="text-gray-400 mb-4">
                            Find hidden gems automatically
                        </p>
                        <span className="text-sm text-purple-400">Coming Soon</span>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-6 bg-gray-800 border border-gray-700 rounded-2xl">
                        <div className="text-4xl mb-4">💼</div>
                        <h3 className="text-2xl font-bold mb-2">Portfolio Manager</h3>
                        <p className="text-gray-400 mb-4">
                            Auto-rebalance your portfolio
                        </p>
                        <span className="text-sm text-purple-400">Coming Soon</span>
                    </motion.div>
                </div>

                <div className="text-center">
                    <Link href="/agents">
                        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all">
                            Explore All Agents →
                        </button>
                    </Link>
                </div>
            </section>

            {/* Top Coins */}
            <section className="container mx-auto px-4 py-16">
                <TopCoinsSection />
            </section>

            {/* Features Grid */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard
                        icon="📊"
                        title="Real-time Signals"
                        description="15 AI-powered trading signals updated every minute"
                        link="/trading"
                    />
                    <FeatureCard
                        icon="🐋"
                        title="Whale Tracking"
                        description="Monitor smart money movements across chains"
                        link="/premium"
                    />
                    <FeatureCard
                        icon="🧠"
                        title="Explainable AI"
                        description="Understand why every signal is generated"
                        link="/explain"
                    />
                    <FeatureCard
                        icon="⚔️"
                        title="War Room"
                        description="Real-time market intelligence dashboard"
                        link="/war-room"
                    />
                    <FeatureCard
                        icon="📈"
                        title="Backtesting"
                        description="Historical performance analysis"
                        link="/backtest"
                    />
                    <FeatureCard
                        icon="💎"
                        title="Premium Features"
                        description="NFT floors, gas oracle, whale alerts"
                        link="/premium"
                    />
                </div>
            </section>

            {/* About */}
            <AboutSection />

            {/* SEO Content */}
            <SEOContent />

            <Footer />
        </main>
    );
}

function FeatureCard({ icon, title, description, link }) {
    return (
        <Link href={link}>
            <motion.div
                whileHover={{ scale: 1.05, borderColor: '#8b5cf6' }}
                className="p-6 bg-gray-800 border border-gray-700 rounded-xl cursor-pointer transition-all h-full">
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
                <p className="text-gray-400 text-sm">{description}</p>
            </motion.div>
        </Link>
    );
}
