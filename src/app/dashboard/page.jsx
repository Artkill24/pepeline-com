'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchMetrics = async () => {
        try {
            const res = await fetch('/api/advanced-metrics');
            const data = await res.json();
            setMetrics(data);
        } catch (error) {
            console.error('Metrics fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-3 sm:p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <Header />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 md:mt-12"
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">📊 Market Intelligence</h1>
                    <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-8">Real-time on-chain and macro indicators</p>

                    {loading ? (
                        <div className="flex justify-center items-center h-64 md:h-96">
                            <div className="animate-spin rounded-full h-16 md:h-32 w-16 md:w-32 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    ) : metrics && (
                        <>
                            {/* Main Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-12">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="p-4 md:p-8 bg-gradient-to-br from-purple-900/30 to-gray-800 rounded-xl border border-purple-500/30"
                                >
                                    <p className="text-xs md:text-sm text-gray-400 mb-2">Alpha Score</p>
                                    <p className="text-4xl md:text-6xl font-bold mb-2 md:mb-3">{metrics.alphaScore}</p>
                                    <p className="text-base md:text-xl text-purple-400 font-semibold">{metrics.signal}</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="p-4 md:p-8 bg-gradient-to-br from-blue-900/30 to-gray-800 rounded-xl border border-blue-500/30"
                                >
                                    <p className="text-xs md:text-sm text-gray-400 mb-2">On-Chain Signal</p>
                                    <p className="text-3xl md:text-5xl font-bold mb-2 md:mb-3">{metrics.onchain.emoji} {metrics.onchain.score}</p>
                                    <p className="text-base md:text-xl text-blue-400 font-semibold">{metrics.onchain.signal}</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="p-4 md:p-8 bg-gradient-to-br from-green-900/30 to-gray-800 rounded-xl border border-green-500/30"
                                >
                                    <p className="text-xs md:text-sm text-gray-400 mb-2">Macro Score</p>
                                    <p className="text-3xl md:text-5xl font-bold mb-2 md:mb-3">{metrics.macro.emoji} {metrics.macro.score}</p>
                                    <p className="text-base md:text-xl text-green-400 font-semibold">{metrics.macro.signal}</p>
                                </motion.div>
                            </div>

                            {/* Detailed Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-6 md:mb-12">
                                {/* On-Chain Details */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="p-4 md:p-6 bg-gray-800 rounded-xl border border-gray-700"
                                >
                                    <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 flex items-center gap-2">
                                        🐋 On-Chain Activity
                                    </h3>
                                    <div className="space-y-3 md:space-y-4">
                                        <div>
                                            <p className="text-gray-400 text-xs md:text-sm">Whale Signal</p>
                                            <p className="text-xl md:text-2xl font-bold">{metrics.onchain.whales.signal}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs md:text-sm">Recent Transfers</p>
                                            <p className="text-xl md:text-2xl font-bold">{metrics.onchain.whales.recentTransfers}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs md:text-sm">Total Volume</p>
                                            <p className="text-xl md:text-2xl font-bold">${(metrics.onchain.whales.totalVolume / 1e6).toFixed(1)}M</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs md:text-sm">Network Congestion</p>
                                            <p className="text-xl md:text-2xl font-bold">{metrics.onchain.gas.congestion}</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Macro Details */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="p-4 md:p-6 bg-gray-800 rounded-xl border border-gray-700"
                                >
                                    <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 flex items-center gap-2">
                                        📈 Macro Indicators
                                    </h3>
                                    <div className="space-y-3 md:space-y-4">
                                        <div>
                                            <p className="text-gray-400 text-xs md:text-sm">Fear & Greed Index</p>
                                            <p className="text-xl md:text-2xl font-bold">{metrics.macro.fng.emoji} {metrics.macro.fng.value}/100</p>
                                            <p className="text-xs md:text-sm text-gray-500">{metrics.macro.fng.classification}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs md:text-sm">BTC Dominance</p>
                                            <p className="text-xl md:text-2xl font-bold">{metrics.macro.btcDom.emoji} {metrics.macro.btcDom.percentage}%</p>
                                            <p className="text-xs md:text-sm text-gray-500">{metrics.macro.btcDom.trend}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs md:text-sm">Total Market Cap</p>
                                            <p className="text-xl md:text-2xl font-bold">{metrics.macro.mcap.emoji} {metrics.macro.mcap.formatted}</p>
                                            <p className="text-xs md:text-sm text-gray-500">
                                                {metrics.macro.mcap.change24h > 0 ? '+' : ''}{metrics.macro.mcap.change24h}% (24h)
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Info Footer */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="p-4 md:p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 text-center"
                            >
                                <p className="text-xs md:text-sm text-gray-400">
                                    Data refreshes every 60 seconds • Powered by Alchemy + CoinGecko + Alternative.me
                                </p>
                            </motion.div>
                        </>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
