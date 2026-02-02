'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MarketBrief() {
    const [brief, setBrief] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/market-brief')
            .then(res => res.json())
            .then(data => setBrief(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto mt-20">
                <div className="p-6 bg-gray-800/50 rounded-xl animate-pulse h-48" />
            </div>
        );
    }

    if (!brief || brief.error) return null;

    return (
        <div className="max-w-4xl mx-auto mt-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">{brief.mood.emoji}</span>
                    <div>
                        <h2 className="text-3xl font-bold">Market Brief</h2>
                        <p className="text-gray-400 text-sm">AI-powered daily summary</p>
                    </div>
                </div>

                {/* Mood Banner */}
                <div className={`p-4 rounded-xl border mb-6 ${
                    brief.mood.label === 'Bullish' || brief.mood.label === 'Cautiously Bullish'
                        ? 'bg-green-900/20 border-green-500/30'
                        : brief.mood.label === 'Neutral'
                        ? 'bg-yellow-900/20 border-yellow-500/30'
                        : 'bg-red-900/20 border-red-500/30'
                }`}>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xl font-bold">{brief.mood.emoji} {brief.mood.label}</p>
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                            brief.stats.avgChange24h >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                            {brief.stats.avgChange24h >= 0 ? '+' : ''}{brief.stats.avgChange24h}% avg
                        </span>
                    </div>
                    <p className="text-gray-300 text-sm">{brief.mood.description}</p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                    <div className="p-3 bg-gray-800/60 rounded-lg border border-gray-700 text-center">
                        <p className="text-xs text-gray-500 mb-1">Total</p>
                        <p className="text-lg font-bold">{brief.stats.totalCoins}</p>
                    </div>
                    <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30 text-center">
                        <p className="text-xs text-green-500 mb-1">Green</p>
                        <p className="text-lg font-bold text-green-400">{brief.stats.green}</p>
                    </div>
                    <div className="p-3 bg-red-900/20 rounded-lg border border-red-500/30 text-center">
                        <p className="text-xs text-red-500 mb-1">Red</p>
                        <p className="text-lg font-bold text-red-400">{brief.stats.red}</p>
                    </div>
                    <div className="p-3 bg-gray-800/60 rounded-lg border border-gray-700 text-center">
                        <p className="text-xs text-gray-500 mb-1">BTC Dom</p>
                        <p className="text-lg font-bold">{brief.stats.dominance.total > 0 ? Math.round((brief.stats.dominance.btc / brief.stats.dominance.total) * 100) : 0}%</p>
                    </div>
                </div>

                {/* Gainers & Losers */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-green-900/10 rounded-xl border border-green-500/20">
                        <p className="text-green-400 font-semibold mb-3">🚀 Top Gainers</p>
                        {brief.topGainers.map(coin => (
                            <Link key={coin.id} href={`/coin/${coin.id}`}>
                                <div className="flex items-center justify-between py-2 hover:bg-green-900/20 px-2 rounded transition">
                                    <div className="flex items-center gap-2">
                                        <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full" />
                                        <span className="font-semibold text-sm">{coin.symbol}</span>
                                        <span className="text-xs text-gray-500">{coin.name}</span>
                                    </div>
                                    <span className="text-green-400 font-bold text-sm">+{coin.change24h.toFixed(2)}%</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="p-4 bg-red-900/10 rounded-xl border border-red-500/20">
                        <p className="text-red-400 font-semibold mb-3">📉 Top Losers</p>
                        {brief.topLosers.map(coin => (
                            <Link key={coin.id} href={`/coin/${coin.id}`}>
                                <div className="flex items-center justify-between py-2 hover:bg-red-900/20 px-2 rounded transition">
                                    <div className="flex items-center gap-2">
                                        <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full" />
                                        <span className="font-semibold text-sm">{coin.symbol}</span>
                                        <span className="text-xs text-gray-500">{coin.name}</span>
                                    </div>
                                    <span className="text-red-400 font-bold text-sm">{coin.change24h.toFixed(2)}%</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* AI Brief Text */}
                <div className="p-5 bg-gradient-to-br from-green-900/20 to-gray-900 rounded-xl border border-green-500/30">
                    <p className="text-green-400 font-semibold mb-2">🤖 AI Analysis</p>
                    <p className="text-gray-300 leading-relaxed text-sm">{brief.brief}</p>
                </div>
            </motion.div>
        </div>
    );
}
