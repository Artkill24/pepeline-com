'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CoinsPage() {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchCoins();
    }, []);

    const fetchCoins = async () => {
        try {
            const response = await fetch('/api/all-coins');
            const data = await response.json();
            setCoins(data.coins || []);
        } catch (error) {
            console.error('Failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = coins.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.symbol.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <Header />
                <div className="mt-12 mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">🪙 All Coins</h1>
                    <p className="text-gray-400">Track sentiment for 100+ cryptocurrencies</p>
                </div>

                <input
                    type="text"
                    placeholder="Search coins..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 mb-8"
                />

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="p-4 bg-gray-800/50 rounded-xl animate-pulse h-40" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filtered.map((coin, idx) => (
                            <Link key={coin.id} href={`/coin/${coin.id}`}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.02 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 cursor-pointer hover:border-green-500/50 transition-all"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{coin.symbol}</p>
                                            <p className="text-xs text-gray-500 truncate">{coin.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-3xl font-bold mb-1">{coin.sentiment}</p>
                                        <p className="text-xs flex items-center justify-center gap-1">
                                            <span>{coin.emoji}</span>
                                            <span className="text-gray-400">{coin.level}</span>
                                        </p>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-gray-700">
                                        <p className={`text-xs text-center ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {coin.change24h >= 0 ? '↗' : '↘'} {Math.abs(coin.change24h).toFixed(2)}%
                                        </p>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
                <Footer />
            </div>
        </main>
    );
}
