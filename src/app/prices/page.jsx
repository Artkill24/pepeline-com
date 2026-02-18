'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PricesPage() {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('volume'); // price, change, volume

    useEffect(() => {
        fetchPrices();
        const interval = setInterval(fetchPrices, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchPrices = async () => {
        try {
            const res = await fetch('/api/all-prices');
            const data = await res.json();
            setPrices(data.prices || []);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const filtered = prices.filter(p => 
        p.symbol.toLowerCase().includes(search.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'price') return b.price - a.price;
        if (sortBy === 'change') return b.change24h - a.change24h;
        return (b.price * b.volume24h) - (a.price * a.volume24h);
    });

    const stats = {
        gainers: prices.filter(p => p.change24h > 0).length,
        losers: prices.filter(p => p.change24h < 0).length,
        avgChange: prices.length > 0 
            ? (prices.reduce((sum, p) => sum + p.change24h, 0) / prices.length).toFixed(2)
            : 0
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            <div className="container mx-auto px-3 sm:px-4 py-6 md:py-12 max-w-7xl">

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 md:mb-12">
                    <div className="text-4xl md:text-6xl mb-3">💰</div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                        Live Crypto Prices
                    </h1>
                    <p className="text-sm md:text-xl text-gray-300">
                        30+ coins • Real-time data via Supra Oracle
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
                    <div className="p-3 md:p-4 bg-green-900/20 border border-green-700/30 rounded-xl text-center">
                        <p className="text-xs md:text-sm text-gray-400">Gainers</p>
                        <p className="text-2xl md:text-3xl font-bold text-green-400">{stats.gainers}</p>
                    </div>
                    <div className="p-3 md:p-4 bg-red-900/20 border border-red-700/30 rounded-xl text-center">
                        <p className="text-xs md:text-sm text-gray-400">Losers</p>
                        <p className="text-2xl md:text-3xl font-bold text-red-400">{stats.losers}</p>
                    </div>
                    <div className="p-3 md:p-4 bg-purple-900/20 border border-purple-700/30 rounded-xl text-center">
                        <p className="text-xs md:text-sm text-gray-400">Avg Change</p>
                        <p className={`text-2xl md:text-3xl font-bold ${stats.avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {stats.avgChange > 0 ? '+' : ''}{stats.avgChange}%
                        </p>
                    </div>
                </motion.div>

                {/* Search & Sort */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="🔍 Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="volume">Volume</option>
                        <option value="price">Price</option>
                        <option value="change">Change</option>
                    </select>
                </motion.div>

                {loading ? (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
                        <p className="mt-4 text-gray-400">Loading prices...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {sorted.map((coin, i) => {
                            const isPositive = coin.change24h >= 0;
                            return (
                                <motion.div
                                    key={coin.symbol}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.02 }}
                                    className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-all"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-bold">{coin.symbol}</h3>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                            isPositive ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                                        }`}>
                                            {isPositive ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(2)}%
                                        </span>
                                    </div>

                                    <p className="text-2xl font-bold mb-2">
                                        ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString()}
                                    </p>

                                    <div className="text-xs text-gray-400 space-y-1">
                                        <div className="flex justify-between">
                                            <span>High:</span>
                                            <span className="text-green-400">${coin.high24h < 1 ? coin.high24h.toFixed(4) : coin.high24h.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Low:</span>
                                            <span className="text-red-400">${coin.low24h < 1 ? coin.low24h.toFixed(4) : coin.low24h.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                <p className="text-xs text-center text-gray-500 mt-8">
                    Powered by Supra Oracle • Updates every 30s • {prices.length} coins tracked
                </p>
            </div>
            <Footer />
        </main>
    );
}
