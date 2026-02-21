'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IndexInlineDisplay from '@/components/IndexInlineDisplay';

export default function HomePage() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [indexRes, pricesRes] = await Promise.all([
                fetch('/api/index'),
                fetch('/api/all-prices')
            ]);
            const index = await indexRes.json();
            const prices = await pricesRes.json();
            setStats({ index, totalCoins: prices.prices?.length || 50 });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <Header />
            
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20" />
                <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-5xl mx-auto"
                    >
                        <div className="text-6xl md:text-8xl mb-6">🐸</div>
                        
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
                            AI-Powered Crypto Intelligence
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                            Real-time sentiment tracking, whale monitoring, and AI trading signals.<br/>
                            <span className="text-green-400 font-bold">73% backtest accuracy</span> • Non-custodial • 50+ coins
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Link href="/whitelist" 
                                className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg">
                                🎯 Join Whitelist
                            </Link>
                            <Link href="/dashboard"
                                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-bold text-lg transition-all">
                                📊 View Dashboard
                            </Link>
                        </div>

                        {stats && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                                <div className="p-4 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700">
                                    <p className="text-3xl font-bold text-green-400">{stats.index.index}</p>
                                    <p className="text-sm text-gray-400">Current Index</p>
                                </div>
                                <div className="p-4 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700">
                                    <p className="text-3xl font-bold text-blue-400">73%</p>
                                    <p className="text-sm text-gray-400">Accuracy</p>
                                </div>
                                <div className="p-4 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700">
                                    <p className="text-3xl font-bold text-purple-400">{stats.totalCoins}+</p>
                                    <p className="text-sm text-gray-400">Coins Tracked</p>
                                </div>
                                <div className="p-4 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700">
                                    <p className="text-3xl font-bold text-orange-400">15</p>
                                    <p className="text-sm text-gray-400">AI Signals</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Live Index Display */}
            <section className="py-12 bg-gray-900/50">
                <div className="container mx-auto px-4 max-w-4xl">
                    <IndexInlineDisplay />
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
                            Complete Trading Intelligence Suite
                        </h2>
                        <p className="text-xl text-gray-400">Everything you need to trade smarter, not harder</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {[
                            {
                                icon: '🤖',
                                title: 'AI Trading Signals',
                                desc: '15 coins with automated buy/sell signals. Non-custodial, you control your wallet.',
                                link: '/trading',
                                color: 'from-green-900/40 to-blue-900/40'
                            },
                            {
                                icon: '🐋',
                                title: 'Whale Tracker',
                                desc: 'Monitor smart money wallets in real-time. 75%+ win rate tracked.',
                                link: '/premium',
                                color: 'from-purple-900/40 to-pink-900/40'
                            },
                            {
                                icon: '⛽',
                                title: 'Gas Oracle',
                                desc: 'Save on transaction costs. Know the best time to trade.',
                                link: '/premium',
                                color: 'from-green-900/40 to-emerald-900/40'
                            },
                            {
                                icon: '📊',
                                title: 'Paper Trading',
                                desc: 'Test strategies risk-free. Track performance before committing capital.',
                                link: '/paper-trading',
                                color: 'from-blue-900/40 to-cyan-900/40'
                            },
                            {
                                icon: '🔙',
                                title: 'Backtest Engine',
                                desc: 'Sharpe Ratio, Max Drawdown, Win Rate analysis on 30-day windows.',
                                link: '/backtest',
                                color: 'from-orange-900/40 to-red-900/40'
                            },
                            {
                                icon: '🖼️',
                                title: 'NFT Floor Prices',
                                desc: 'Track top 8 collections. BAYC, CryptoPunks, Azuki floor prices live.',
                                link: '/premium',
                                color: 'from-pink-900/40 to-purple-900/40'
                            },
                            {
                                icon: '⚔️',
                                title: 'War Room',
                                desc: 'Multi-chain intelligence. Solana, Base, Ethereum activity aggregated.',
                                link: '/war-room',
                                color: 'from-red-900/40 to-orange-900/40'
                            },
                            {
                                icon: '🤖',
                                title: 'AI Predictor',
                                desc: 'Anomaly detection. Bull traps, accumulation zones, distribution tops.',
                                link: '/ai-predictor',
                                color: 'from-purple-900/40 to-blue-900/40'
                            },
                            {
                                icon: '🎯',
                                title: 'Copy Trading',
                                desc: 'Auto-follow smart wallets. Coming soon: automated execution.',
                                link: '/copy-trading',
                                color: 'from-indigo-900/40 to-purple-900/40'
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link href={feature.link}>
                                    <div className={`p-6 bg-gradient-to-br ${feature.color} rounded-2xl border border-gray-700 hover:border-gray-600 transition-all h-full cursor-pointer group hover:scale-105`}>
                                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                                        <h3 className="text-2xl font-bold mb-2 text-white">{feature.title}</h3>
                                        <p className="text-gray-300">{feature.desc}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-20 bg-gray-900/50">
                <div className="container mx-auto px-4 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-4xl font-extrabold mb-12 text-white">Why Pepeline?</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-8 bg-gray-800/50 rounded-2xl border border-gray-700">
                                <div className="text-5xl mb-4">🎯</div>
                                <h3 className="text-2xl font-bold mb-3 text-white">Data-Driven</h3>
                                <p className="text-gray-300">
                                    Aggregates Fear & Greed, whale activity, gas fees, and technical indicators into one actionable index.
                                </p>
                            </div>

                            <div className="p-8 bg-gray-800/50 rounded-2xl border border-gray-700">
                                <div className="text-5xl mb-4">🔒</div>
                                <h3 className="text-2xl font-bold mb-3 text-white">Non-Custodial</h3>
                                <p className="text-gray-300">
                                    Your keys, your crypto. We never touch your funds. Signals are suggestions, you execute.
                                </p>
                            </div>

                            <div className="p-8 bg-gray-800/50 rounded-2xl border border-gray-700">
                                <div className="text-5xl mb-4">🚀</div>
                                <h3 className="text-2xl font-bold mb-3 text-white">Community-Driven</h3>
                                <p className="text-gray-300">
                                    Open-source roadmap. Earn whitelist points by contributing feedback and ideas.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-12 bg-gradient-to-br from-green-900/40 to-blue-900/40 rounded-3xl border border-green-500/30 text-center"
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
                            Ready to Trade Smarter?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Join the whitelist for $SENT token allocation. 100 points = guaranteed spot.
                        </p>
                        <Link href="/whitelist"
                            className="inline-block px-10 py-5 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl">
                            🎯 Join Whitelist Now
                        </Link>
                        <p className="text-sm text-gray-400 mt-4">No credit card required • Free forever</p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
