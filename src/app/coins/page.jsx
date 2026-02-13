'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SORT_OPTIONS = [
    { value: 'sentiment', label: '🎯 Sentiment' },
    { value: 'price', label: '💰 Price' },
    { value: 'change24h', label: '📈 24h Change' },
    { value: 'transfers24h', label: '⛓️ Transfers' },
];

export default function CoinsPage() {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('sentiment');
    const [filter, setFilter] = useState('all');
    const [lastUpdate, setLastUpdate] = useState(null);

    useEffect(() => {
        fetchCoins();
        const interval = setInterval(fetchCoins, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchCoins = async () => {
        try {
            const res = await fetch('/api/all-coins');
            const data = await res.json();
            setCoins(data.coins || []);
            setLastUpdate(new Date());
        } catch (err) {
            console.error('Failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const sorted = [...coins]
        .filter(c => {
            const matchSearch =
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.symbol.toLowerCase().includes(search.toLowerCase());
            const matchFilter =
                filter === 'all' ||
                (filter === 'bullish' && c.change24h > 2) ||
                (filter === 'bearish' && c.change24h < -2) ||
                (filter === 'active' && c.transfers24h > 5);
            return matchSearch && matchFilter;
        })
        .sort((a, b) => {
            if (sortBy === 'sentiment') return b.sentiment - a.sentiment;
            if (sortBy === 'price') return b.price - a.price;
            if (sortBy === 'change24h') return b.change24h - a.change24h;
            if (sortBy === 'transfers24h') return b.transfers24h - a.transfers24h;
            return 0;
        });

    const formatPrice = (price) => {
        if (!price || price === 0) return '—';
        if (price < 0.001) return `$${price.toFixed(8)}`;
        if (price < 1) return `$${price.toFixed(4)}`;
        if (price < 1000) return `$${price.toFixed(2)}`;
        return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Header />

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 mb-8"
                >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">⛓️ On-Chain Coins</h1>
                            <p className="text-gray-400">
                                Real-time sentiment powered by Alchemy • {coins.length} tokens tracked
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-xs text-green-400">Alchemy Live</span>
                            {lastUpdate && (
                                <span className="text-xs text-gray-500 ml-2">
                                    Updated {lastUpdate.toLocaleTimeString()}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* On-chain stats bar */}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-6">
                        {[
                            { label: 'Total Tracked', value: coins.length, icon: '🪙' },
                            { label: 'Bullish', value: coins.filter(c => c.sentiment >= 60).length, icon: '🟢' },
                            { label: 'Neutral', value: coins.filter(c => c.sentiment >= 40 && c.sentiment < 60).length, icon: '🟡' },
                            { label: 'Bearish', value: coins.filter(c => c.sentiment < 40).length, icon: '🔴' },
                            { label: 'Active Chain', value: coins.filter(c => c.transfers24h > 0).length, icon: '⛓️' },
                            { label: 'Avg Sentiment', value: coins.length ? Math.round(coins.reduce((s, c) => s + c.sentiment, 0) / coins.length) : 0, icon: '🎯' },
                        ].map((stat) => (
                            <div key={stat.label} className="p-3 bg-gray-800/50 rounded-xl border border-gray-700 text-center">
                                <div className="text-xl mb-1">{stat.icon}</div>
                                <div className="text-lg font-bold">{stat.value}</div>
                                <div className="text-xs text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Search + Filters */}
                <div className="flex flex-col md:flex-row gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="🔍 Search by name or symbol..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-green-500 text-sm"
                    />
                    <div className="flex gap-2 flex-wrap">
                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:outline-none focus:border-green-500"
                        >
                            {SORT_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                        {/* Filter */}
                        {['all', 'bullish', 'bearish', 'active'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                                    filter === f
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-green-500'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Coins Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="p-4 bg-gray-800/50 rounded-xl animate-pulse h-52" />
                        ))}
                    </div>
                ) : sorted.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        No coins found matching your search.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {sorted.map((coin, idx) => (
                            <Link key={coin.id} href={`/coin/${coin.id}`}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                                    whileHover={{ scale: 1.04, y: -4 }}
                                    className="p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 cursor-pointer hover:border-green-500/50 transition-all"
                                >
                                    {/* Header */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <img
                                            src={coin.image}
                                            alt={coin.name}
                                            className="w-8 h-8 rounded-full"
                                            onError={(e) => { e.target.src = '/placeholder-coin.png'; }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{coin.symbol}</p>
                                            <p className="text-xs text-gray-500 truncate">{coin.name}</p>
                                        </div>
                                    </div>

                                    {/* Sentiment Score */}
                                    <div className="text-center mb-3">
                                        <p className="text-3xl font-bold">{coin.sentiment}</p>
                                        <p className="text-xs flex items-center justify-center gap-1 mt-0.5">
                                            <span>{coin.emoji}</span>
                                            <span className="text-gray-400">{coin.level}</span>
                                        </p>
                                    </div>

                                    {/* Sentiment bar */}
                                    <div className="w-full bg-gray-700 rounded-full h-1.5 mb-3">
                                        <div
                                            className={`h-1.5 rounded-full transition-all ${
                                                coin.sentiment >= 60 ? 'bg-green-500' :
                                                coin.sentiment >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${coin.sentiment}%` }}
                                        />
                                    </div>

                                    {/* Price */}
                                    <div className="pt-2 border-t border-gray-700 space-y-1">
                                        <p className="text-xs text-center text-white font-semibold">
                                            {formatPrice(coin.price)}
                                        </p>
                                        <p className={`text-xs text-center ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {coin.change24h >= 0 ? '↗' : '↘'} {Math.abs(coin.change24h || 0).toFixed(2)}%
                                        </p>
                                        {/* On-chain badge */}
                                        {coin.transfers24h > 0 && (
                                            <p className="text-xs text-center text-blue-400">
                                                ⛓️ {coin.transfers24h} txns
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Source note */}
                <div className="text-center mt-8 text-xs text-gray-600">
                    All data sourced from Alchemy on-chain APIs • Ethereum Mainnet • Auto-refresh every 60s
                </div>

                <Footer />
            </div>
        </main>
    );
}
