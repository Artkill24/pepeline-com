'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';

export default function CoinPage({ params }) {
    const [coin, setCoin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/coin/${params.id}`)
            .then(res => res.json())
            .then(data => setCoin(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [params.id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
                <div className="max-w-4xl mx-auto"><Header /><div className="mt-12 animate-pulse"><div className="h-64 bg-gray-800 rounded"></div></div></div>
            </main>
        );
    }

    if (!coin || coin.error) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
                <div className="max-w-4xl mx-auto"><Header /><div className="mt-12 text-center"><p className="text-4xl mb-4">🤷</p><p className="text-xl text-gray-400">Coin not found</p><Link href="/coins" className="text-green-400 mt-4 inline-block">← Back</Link></div></div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <Header />
                <Link href="/coins" className="text-green-400 mt-8 inline-flex items-center gap-2">← Back</Link>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                    <div className="flex items-center gap-4 mb-8">
                        <img src={coin.image} alt={coin.name} className="w-16 h-16 rounded-full" />
                        <div><h1 className="text-4xl font-bold">{coin.name}</h1><p className="text-gray-400">{coin.symbol}</p></div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
                            <p className="text-sm text-gray-400 mb-2">Sentiment</p>
                            <div className="flex items-center gap-4">
                                <p className="text-6xl font-bold">{coin.sentiment}</p>
                                <div><p className="text-3xl">{coin.emoji}</p><p className="text-lg text-gray-400">{coin.level}</p></div>
                            </div>
                        </div>
                        
                        <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
                            <p className="text-sm text-gray-400 mb-2">Price</p>
                            <p className="text-4xl font-bold mb-2">${coin.price?.toLocaleString()}</p>
                            <p className={`text-lg ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {coin.change24h >= 0 ? '↗' : '↘'} {Math.abs(coin.change24h).toFixed(2)}% (24h)
                            </p>
                        </div>
                    </div>

                    {coin.risk && (
                        <div className={`p-6 rounded-xl border-2 mb-8 ${
                            coin.risk.color === 'green' ? 'bg-green-900/20 border-green-500/50' :
                            coin.risk.color === 'yellow' ? 'bg-yellow-900/20 border-yellow-500/50' :
                            coin.risk.color === 'orange' ? 'bg-orange-900/20 border-orange-500/50' :
                            'bg-red-900/20 border-red-500/50'
                        }`}>
                            <div className="flex items-start gap-3 mb-4">
                                <span className="text-3xl">{coin.risk.emoji}</span>
                                <div className="flex-1">
                                    <p className="font-semibold text-lg mb-1">Risk Score: {coin.risk.score}/100</p>
                                    <p className="text-2xl font-bold mb-2">{coin.risk.level}</p>
                                    <p className="text-sm text-gray-300 mb-3">{coin.risk.description}</p>
                                    <p className="text-sm font-medium text-gray-200">{coin.risk.recommendation}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-700">
                                <div>
                                    <p className="text-xs text-gray-500">Volatility</p>
                                    <p className="text-sm font-semibold">{coin.risk.factors.volatility}%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Sentiment</p>
                                    <p className="text-sm font-semibold">{coin.risk.factors.sentiment}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Market Cap</p>
                                    <p className="text-sm font-semibold">{coin.risk.factors.marketCap}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Volume</p>
                                    <p className="text-sm font-semibold">{coin.risk.factors.volume}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {coin.commentary && (
                        <div className="p-6 bg-gradient-to-br from-green-900/20 to-gray-900 rounded-xl border border-green-500/30 mb-8">
                            <p className="font-semibold text-green-400 mb-2">💬 Commentary</p>
                            <p className="text-gray-300">{coin.commentary}</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
