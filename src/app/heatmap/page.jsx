'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SIZE_OPTIONS = [
    { label: 'Large', value: 'large' },
    { label: 'Medium', value: 'medium' },
    { label: 'Small', value: 'small' },
];

const SORT_OPTIONS = [
    { label: '🎯 Sentiment', value: 'sentiment' },
    { label: '📈 24h Change', value: 'change' },
    { label: '⛓️ Transfers', value: 'transfers' },
    { label: '🔤 Name', value: 'name' },
];

function getSentimentColor(score) {
    if (score >= 80) return { bg: '#7f1d1d', border: '#ef4444', text: '#fca5a5' };  // Extreme Greed - deep red
    if (score >= 65) return { bg: '#7c2d12', border: '#f97316', text: '#fdba74' };  // Greed - orange
    if (score >= 50) return { bg: '#713f12', border: '#eab308', text: '#fde047' };  // Mild Greed - yellow
    if (score >= 35) return { bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd' };  // Mild Fear - blue
    if (score >= 20) return { bg: '#14532d', border: '#22c55e', text: '#86efac' };  // Fear - green
    return { bg: '#064e3b', border: '#10b981', text: '#6ee7b7' };                   // Extreme Fear - teal
}

function getLabel(score) {
    if (score >= 80) return 'EXTREME GREED';
    if (score >= 65) return 'GREED';
    if (score >= 50) return 'MILD GREED';
    if (score >= 35) return 'MILD FEAR';
    if (score >= 20) return 'FEAR';
    return 'EXTREME FEAR';
}

function CoinBlock({ coin, size }) {
    const colors = getSentimentColor(coin.sentiment);
    const isLarge = size === 'large';
    const isMedium = size === 'medium';

    const sizeClass = isLarge
        ? 'p-4 min-h-28'
        : isMedium
        ? 'p-3 min-h-20'
        : 'p-2 min-h-16';

    return (
        <Link href={`/coin/${coin.id}`}>
            <motion.div
                whileHover={{ scale: 1.05, zIndex: 10 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`relative ${sizeClass} rounded-xl border cursor-pointer transition-all overflow-hidden`}
                style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                    boxShadow: `0 0 12px ${colors.border}30`
                }}
                title={`${coin.name}: ${coin.sentiment} (${getLabel(coin.sentiment)})`}
            >
                {/* Glow overlay */}
                <div
                    className="absolute inset-0 opacity-10 rounded-xl"
                    style={{ background: `radial-gradient(circle at center, ${colors.border}, transparent)` }}
                />

                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex items-start justify-between gap-1">
                        {isLarge && (
                            <img
                                src={coin.image}
                                alt={coin.symbol}
                                className="w-6 h-6 rounded-full flex-shrink-0"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-black truncate" style={{ color: colors.text, fontSize: isLarge ? '14px' : isMedium ? '12px' : '10px' }}>
                                {coin.symbol}
                            </p>
                            {isLarge && (
                                <p className="text-xs truncate opacity-60" style={{ color: colors.text }}>
                                    {coin.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-1">
                        <p className="font-black leading-none" style={{ color: colors.text, fontSize: isLarge ? '28px' : isMedium ? '20px' : '16px' }}>
                            {coin.sentiment}
                        </p>
                        {!isLarge ? null : (
                            <p className="text-xs mt-0.5 font-semibold" style={{ color: colors.border }}>
                                {getLabel(coin.sentiment)}
                            </p>
                        )}
                        <p className={`font-semibold mt-0.5 ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}
                           style={{ fontSize: isLarge ? '12px' : '10px' }}>
                            {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h || 0).toFixed(1)}%
                        </p>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

export default function HeatmapPage() {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [size, setSize] = useState('large');
    const [sortBy, setSortBy] = useState('sentiment');
    const [lastUpdate, setLastUpdate] = useState(null);
    const [filter, setFilter] = useState('all');

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
            if (filter === 'bullish') return c.sentiment >= 60;
            if (filter === 'bearish') return c.sentiment < 40;
            if (filter === 'neutral') return c.sentiment >= 40 && c.sentiment < 60;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'sentiment') return b.sentiment - a.sentiment;
            if (sortBy === 'change') return b.change24h - a.change24h;
            if (sortBy === 'transfers') return b.transfers24h - a.transfers24h;
            if (sortBy === 'name') return a.symbol.localeCompare(b.symbol);
            return 0;
        });

    // Summary stats
    const bullish = coins.filter(c => c.sentiment >= 60).length;
    const bearish = coins.filter(c => c.sentiment < 40).length;
    const neutral = coins.filter(c => c.sentiment >= 40 && c.sentiment < 60).length;
    const avgSentiment = coins.length ? Math.round(coins.reduce((s, c) => s + c.sentiment, 0) / coins.length) : 0;

    return (
        <main className="min-h-screen bg-[#0a0a14] text-white">
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-10">

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-4xl font-black mb-1">🔥 Sentiment Heatmap</h1>
                            <p className="text-gray-400">Real-time on-chain sentiment for {coins.length} tokens</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                            <span className="text-xs text-purple-400">Alchemy Live</span>
                            {lastUpdate && (
                                <span className="text-xs text-gray-500 ml-2">
                                    {lastUpdate.toLocaleTimeString()}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-3 mt-6">
                        {[
                            { label: 'Avg Sentiment', value: avgSentiment, color: avgSentiment >= 60 ? '#f97316' : avgSentiment >= 40 ? '#eab308' : '#22c55e' },
                            { label: '🟢 Bullish', value: bullish, color: '#22c55e' },
                            { label: '🟡 Neutral', value: neutral, color: '#eab308' },
                            { label: '🔴 Bearish', value: bearish, color: '#ef4444' },
                        ].map(s => (
                            <div key={s.label} className="p-3 bg-purple-950/20 rounded-xl border border-purple-800/20 text-center">
                                <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
                                <p className="text-xs text-gray-400">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Controls */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {/* Size */}
                    <div className="flex rounded-lg overflow-hidden border border-purple-800/40">
                        {SIZE_OPTIONS.map(s => (
                            <button
                                key={s.value}
                                onClick={() => setSize(s.value)}
                                className={`px-4 py-2 text-xs font-semibold transition-all ${size === s.value ? 'bg-purple-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="px-4 py-2 bg-gray-800 border border-purple-800/40 rounded-lg text-sm focus:outline-none text-gray-300"
                    >
                        {SORT_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>

                    {/* Filter */}
                    {['all', 'bullish', 'neutral', 'bearish'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all border ${
                                filter === f
                                    ? 'bg-purple-700 border-purple-500 text-white'
                                    : 'bg-gray-800 border-purple-800/30 text-gray-400 hover:border-purple-600'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {[
                        { label: 'Extreme Fear (0-20)', bg: '#064e3b', border: '#10b981' },
                        { label: 'Fear (20-40)', bg: '#14532d', border: '#22c55e' },
                        { label: 'Neutral (40-50)', bg: '#1e3a5f', border: '#3b82f6' },
                        { label: 'Mild Greed (50-65)', bg: '#713f12', border: '#eab308' },
                        { label: 'Greed (65-80)', bg: '#7c2d12', border: '#f97316' },
                        { label: 'Extreme Greed (80+)', bg: '#7f1d1d', border: '#ef4444' },
                    ].map(z => (
                        <span key={z.label} className="flex items-center gap-1.5 text-xs text-gray-400">
                            <span className="w-3 h-3 rounded-sm border" style={{ backgroundColor: z.bg, borderColor: z.border }} />
                            {z.label}
                        </span>
                    ))}
                </div>

                {/* Heatmap Grid */}
                {loading ? (
                    <div className={`grid gap-3 ${size === 'large' ? 'grid-cols-4 md:grid-cols-5' : size === 'medium' ? 'grid-cols-5 md:grid-cols-7' : 'grid-cols-7 md:grid-cols-10'}`}>
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-gray-800/50 rounded-xl min-h-24" />
                        ))}
                    </div>
                ) : sorted.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">No coins match your filter.</div>
                ) : (
                    <div className={`grid gap-3 ${size === 'large' ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : size === 'medium' ? 'grid-cols-4 md:grid-cols-6 lg:grid-cols-7' : 'grid-cols-5 md:grid-cols-8 lg:grid-cols-10'}`}>
                        {sorted.map((coin, i) => (
                            <CoinBlock key={coin.id} coin={coin} size={size} />
                        ))}
                    </div>
                )}

                {/* Link to full list */}
                <div className="text-center mt-8">
                    <Link
                        href="/coins"
                        className="inline-block px-6 py-3 bg-purple-900/40 border border-purple-700/40 rounded-xl text-purple-300 hover:bg-purple-800/40 transition-all text-sm font-semibold"
                    >
                        ⛓️ View Full On-Chain List →
                    </Link>
                </div>
            </div>

            <Footer />
        </main>
    );
}
