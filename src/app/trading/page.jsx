'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Coin categories
const COIN_CATEGORIES = {
    'BTC': { category: 'Major', emoji: '₿', color: 'orange' },
    'ETH': { category: 'Major', emoji: 'Ξ', color: 'purple' },
    'SOL': { category: 'L1', emoji: '◎', color: 'purple' },
    'BNB': { category: 'Exchange', emoji: '🔶', color: 'yellow' },
    'ADA': { category: 'L1', emoji: '🔷', color: 'blue' },
    'XRP': { category: 'Payment', emoji: '💧', color: 'blue' },
    'DOGE': { category: 'Meme', emoji: '🐕', color: 'yellow' },
    'SHIB': { category: 'Meme', emoji: '🐕', color: 'orange' },
    'PEPE': { category: 'Meme', emoji: '🐸', color: 'green' },
    'AVAX': { category: 'L1', emoji: '🔺', color: 'red' },
    'MATIC': { category: 'L2', emoji: '🟣', color: 'purple' },
    'LINK': { category: 'Oracle', emoji: '🔗', color: 'blue' },
    'UNI': { category: 'DeFi', emoji: '🦄', color: 'pink' },
    'AAVE': { category: 'DeFi', emoji: '👻', color: 'purple' },
    'ATOM': { category: 'L1', emoji: '⚛️', color: 'blue' },
};

const CATEGORY_FILTERS = [
    { id: 'ALL', label: 'All Coins', emoji: '🌐' },
    { id: 'Major', label: 'Major', emoji: '⭐' },
    { id: 'Meme', label: 'Meme', emoji: '🐸' },
    { id: 'L1', label: 'Layer 1', emoji: '🔷' },
    { id: 'L2', label: 'Layer 2', emoji: '🟣' },
    { id: 'DeFi', label: 'DeFi', emoji: '🦄' },
    { id: 'Other', label: 'Other', emoji: '💎' },
];

export default function TradingPage() {
    const { publicKey, connected } = useWallet();
    const { setVisible } = useWalletModal();
    const [data, setData] = useState(null);
    const [selectedCoin, setSelectedCoin] = useState('BTC');
    const [amount, setAmount] = useState(100);
    const [executing, setExecuting] = useState(false);
    const [signalFilter, setSignalFilter] = useState('ALL'); // ALL, BUY, SELL, HOLD
    const [categoryFilter, setCategoryFilter] = useState('ALL'); // ALL, Major, Meme, L1, etc
    const [sortBy, setSortBy] = useState('strength'); // strength, alphabetical, change
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        fetchSignals();
        const interval = setInterval(fetchSignals, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchSignals = async () => {
        try {
            const res = await fetch('/api/signals');
            const json = await res.json();
            setData(json);
            setLastUpdated(new Date());
        } catch (err) {
            console.error(err);
        }
    };

    const executeQuickTrade = async (signal) => {
        setExecuting(true);
        try {
            const res = await fetch('/api/execute-trade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ signal, symbol: selectedCoin, amount })
            });

            const result = await res.json();
            if (result.jupiterUrl) {
                window.open(result.jupiterUrl, '_blank');
            }
        } catch (err) {
            console.error(err);
        }
        setExecuting(false);
    };

    // Get coin category
    const getCoinCategory = (symbol) => {
        return COIN_CATEGORIES[symbol]?.category || 'Other';
    };

    const getCoinEmoji = (symbol) => {
        return COIN_CATEGORIES[symbol]?.emoji || '💎';
    };

    const getCoinColor = (symbol) => {
        return COIN_CATEGORIES[symbol]?.color || 'gray';
    };

    // Filter and sort signals
    const getFilteredAndSortedSignals = () => {
        if (!data?.signals) return [];
        
        let filtered = data.signals;
        
        // Apply signal filter (BUY/SELL/HOLD)
        if (signalFilter !== 'ALL') {
            filtered = filtered.filter(s => s.signal === signalFilter);
        }

        // Apply category filter
        if (categoryFilter !== 'ALL') {
            filtered = filtered.filter(s => getCoinCategory(s.symbol) === categoryFilter);
        }
        
        // Apply sort
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === 'strength') return b.strength - a.strength;
            if (sortBy === 'alphabetical') return a.symbol.localeCompare(b.symbol);
            if (sortBy === 'change') return b.change24h - a.change24h;
            return 0;
        });
        
        return sorted;
    };

    const filteredSignals = getFilteredAndSortedSignals();
    const signal = data?.signals?.find(s => s.symbol === selectedCoin);

    // Calculate stats
    const stats = data?.signals ? {
        total: data.signals.length,
        buy: data.signals.filter(s => s.signal === 'BUY').length,
        sell: data.signals.filter(s => s.signal === 'SELL').length,
        hold: data.signals.filter(s => s.signal === 'HOLD').length,
        avgStrength: Math.round(data.signals.reduce((acc, s) => acc + s.strength, 0) / data.signals.length),
        meme: data.signals.filter(s => getCoinCategory(s.symbol) === 'Meme').length,
        major: data.signals.filter(s => getCoinCategory(s.symbol) === 'Major').length,
        defi: data.signals.filter(s => getCoinCategory(s.symbol) === 'DeFi').length,
    } : null;

    // Category stats
    const getCategoryCount = (category) => {
        if (!data?.signals) return 0;
        if (category === 'ALL') return data.signals.length;
        return data.signals.filter(s => getCoinCategory(s.symbol) === category).length;
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            <div className="container mx-auto px-4 py-12 max-w-7xl">

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                    <div className="text-6xl mb-4">🤖</div>
                    <h1 className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                        AI Trading Signals
                    </h1>
                    <p className="text-xl text-gray-300">15 Coins • Real-time Analysis • One-Click Trading</p>
                    {lastUpdated && (
                        <p className="text-sm text-gray-500 mt-2">
                            Last updated: {lastUpdated.toLocaleTimeString()} • Auto-refresh every 60s
                        </p>
                    )}
                </motion.div>

                {/* Stats Overview */}
                {stats && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                        <div className="p-3 bg-purple-900/20 rounded-xl border border-purple-500/30">
                            <p className="text-xs text-gray-400">Total</p>
                            <p className="text-2xl font-bold text-purple-400">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-green-900/20 rounded-xl border border-green-500/30">
                            <p className="text-xs text-gray-400">🟢 Buy</p>
                            <p className="text-2xl font-bold text-green-400">{stats.buy}</p>
                        </div>
                        <div className="p-3 bg-red-900/20 rounded-xl border border-red-500/30">
                            <p className="text-xs text-gray-400">🔴 Sell</p>
                            <p className="text-2xl font-bold text-red-400">{stats.sell}</p>
                        </div>
                        <div className="p-3 bg-gray-800 rounded-xl border border-gray-700">
                            <p className="text-xs text-gray-400">⚪ Hold</p>
                            <p className="text-2xl font-bold text-gray-400">{stats.hold}</p>
                        </div>
                        <div className="p-3 bg-orange-900/20 rounded-xl border border-orange-500/30">
                            <p className="text-xs text-gray-400">⭐ Major</p>
                            <p className="text-2xl font-bold text-orange-400">{stats.major}</p>
                        </div>
                        <div className="p-3 bg-green-900/20 rounded-xl border border-green-500/30">
                            <p className="text-xs text-gray-400">🐸 Meme</p>
                            <p className="text-2xl font-bold text-green-400">{stats.meme}</p>
                        </div>
                        <div className="p-3 bg-pink-900/20 rounded-xl border border-pink-500/30">
                            <p className="text-xs text-gray-400">🦄 DeFi</p>
                            <p className="text-2xl font-bold text-pink-400">{stats.defi}</p>
                        </div>
                    </motion.div>
                )}

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-xl text-sm text-yellow-200">
                    <p className="font-bold mb-1">⚠️ Disclaimer</p>
                    <p>NOT financial advice. You control your wallet and approve every trade. Trading involves risk of loss.</p>
                </motion.div>

                {!connected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-6 bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-2xl border border-purple-500/30 text-center">
                        <p className="text-lg mb-4">Connect wallet for one-click trading</p>
                        <button onClick={() => setVisible(true)}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-bold transition-all">
                            👛 Connect Phantom
                        </button>
                    </motion.div>
                )}

                {data && (
                    <>
                        {/* Category Filters */}
                        <div className="mb-4">
                            <p className="text-sm text-gray-400 mb-2 font-semibold">Filter by Category:</p>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORY_FILTERS.map(cat => (
                                    <button key={cat.id}
                                        onClick={() => setCategoryFilter(cat.id)}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                                            categoryFilter === cat.id 
                                                ? 'bg-purple-600 scale-105' 
                                                : 'bg-gray-800 hover:bg-gray-700'
                                        }`}>
                                        {cat.emoji} {cat.label} ({getCategoryCount(cat.id)})
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Signal Filters & Sort */}
                        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
                            <div className="flex gap-2">
                                <p className="text-sm text-gray-400 font-semibold self-center mr-2">Signal:</p>
                                <button onClick={() => setSignalFilter('ALL')}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                                        signalFilter === 'ALL' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
                                    }`}>
                                    All
                                </button>
                                <button onClick={() => setSignalFilter('BUY')}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                                        signalFilter === 'BUY' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
                                    }`}>
                                    🟢 Buy
                                </button>
                                <button onClick={() => setSignalFilter('SELL')}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                                        signalFilter === 'SELL' ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'
                                    }`}>
                                    🔴 Sell
                                </button>
                                <button onClick={() => setSignalFilter('HOLD')}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                                        signalFilter === 'HOLD' ? 'bg-gray-600' : 'bg-gray-800 hover:bg-gray-700'
                                    }`}>
                                    ⚪ Hold
                                </button>
                            </div>

                            <div className="flex gap-2 items-center">
                                <span className="text-sm text-gray-400">Sort:</span>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    <option value="strength">Strength ↓</option>
                                    <option value="alphabetical">A-Z</option>
                                    <option value="change">24h Change ↓</option>
                                </select>
                            </div>
                        </div>

                        {/* Signal Cards Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
                            {filteredSignals.map(s => {
                                const coinCategory = getCoinCategory(s.symbol);
                                const coinEmoji = getCoinEmoji(s.symbol);
                                
                                return (
                                    <motion.button
                                        key={s.symbol}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => setSelectedCoin(s.symbol)}
                                        className={`p-4 rounded-xl border font-bold transition-all relative overflow-hidden ${
                                            selectedCoin === s.symbol
                                                ? 'bg-purple-900/50 border-purple-500 ring-2 ring-purple-500'
                                                : s.signal === 'BUY'
                                                ? 'bg-green-900/20 border-green-500/30 hover:border-green-500'
                                                : s.signal === 'SELL'
                                                ? 'bg-red-900/20 border-red-500/30 hover:border-red-500'
                                                : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                        }`}>
                                        
                                        {/* Category Badge */}
                                        <div className="absolute top-1 right-1">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-900/80 text-gray-300">
                                                {coinEmoji}
                                            </span>
                                        </div>

                                        <p className="text-lg mb-1 mt-2">{s.symbol}</p>
                                        <p className={`text-sm font-bold mb-1 ${
                                            s.signal === 'BUY' ? 'text-green-400' : 
                                            s.signal === 'SELL' ? 'text-red-400' : 'text-gray-400'
                                        }`}>
                                            {s.signal}
                                        </p>
                                        
                                        {/* Stats Row */}
                                        <div className="flex items-center justify-between text-xs mb-2">
                                            <span className="text-purple-400 font-bold">{s.strength}</span>
                                            <span className={s.change24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                                                {s.change24h >= 0 ? '+' : ''}{s.change24h.toFixed(1)}%
                                            </span>
                                        </div>
                                        
                                        {/* Confidence Badge */}
                                        <div className="flex gap-1">
                                            <span className={`text-xs px-2 py-1 rounded-full flex-1 text-center ${
                                                s.confidence === 'HIGH' ? 'bg-green-900/50 text-green-300' :
                                                s.confidence === 'MEDIUM' ? 'bg-yellow-900/50 text-yellow-300' :
                                                'bg-gray-700 text-gray-300'
                                            }`}>
                                                {s.confidence}
                                            </span>
                                        </div>

                                        {/* Meme Coin Special Effect */}
                                        {coinCategory === 'Meme' && (
                                            <div className="absolute -bottom-1 -right-1 text-2xl opacity-30">
                                                🚀
                                            </div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Selected Signal Details */}
                        {signal && (
                            <motion.div key={selectedCoin} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                                <div className={`p-6 rounded-2xl border ${
                                    signal.signal === 'BUY' ? 'bg-green-900/20 border-green-500/30' :
                                    signal.signal === 'SELL' ? 'bg-red-900/20 border-red-500/30' :
                                    'bg-gray-800 border-gray-700'
                                }`}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-4xl">{getCoinEmoji(signal.symbol)}</span>
                                                <div>
                                                    <p className="text-sm text-gray-400">{signal.symbol}</p>
                                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                                                        {getCoinCategory(signal.symbol)}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className={`text-5xl font-bold ${
                                                signal.signal === 'BUY' ? 'text-green-400' :
                                                signal.signal === 'SELL' ? 'text-red-400' : 'text-gray-400'
                                            }`}>{signal.signal}</p>
                                            <div className="mt-2">
                                                <span className={`text-sm px-3 py-1 rounded-full ${
                                                    signal.confidence === 'HIGH' ? 'bg-green-900/50 text-green-300' :
                                                    signal.confidence === 'MEDIUM' ? 'bg-yellow-900/50 text-yellow-300' :
                                                    'bg-gray-700 text-gray-300'
                                                }`}>
                                                    {signal.confidence} Confidence
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-400">Strength</p>
                                            <p className="text-4xl font-bold text-purple-400">{signal.strength}/100</p>
                                            {/* Visual Strength Bar */}
                                            <div className="w-24 h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500" 
                                                     style={{width: `${signal.strength}%`}}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="p-3 bg-gray-900/50 rounded-xl">
                                            <p className="text-xs text-gray-400">Price</p>
                                            <p className="text-xl font-bold">${signal.price.toFixed(2)}</p>
                                        </div>
                                        <div className="p-3 bg-gray-900/50 rounded-xl">
                                            <p className="text-xs text-gray-400">24h Change</p>
                                            <p className={`text-xl font-bold ${signal.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {signal.change24h >= 0 ? '+' : ''}{signal.change24h.toFixed(2)}%
                                            </p>
                                        </div>
                                    </div>

                                    {/* Explainable AI Link */}
                                    <Link href={`/explain?symbol=${signal.symbol}`}>
                                        <div className="mb-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl hover:bg-blue-900/30 transition-all cursor-pointer group">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-blue-300 group-hover:text-blue-200">🧠 Why this signal?</p>
                                                    <p className="text-sm text-gray-400">See full explainable AI breakdown</p>
                                                </div>
                                                <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                                            </div>
                                        </div>
                                    </Link>

                                    {connected && signal.signal !== 'HOLD' && (
                                        <>
                                            <div className="mb-4">
                                                <label className="block text-sm text-gray-400 mb-2">Trade Amount (USDC)</label>
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                                                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    min="10"
                                                    max="10000"
                                                    step="10"
                                                />
                                            </div>

                                            <button
                                                onClick={() => executeQuickTrade(signal.signal)}
                                                disabled={executing}
                                                className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl font-bold transition-all disabled:opacity-50 text-lg">
                                                {executing ? '⏳ Preparing...' : `⚡ ${signal.signal} ${signal.symbol} on Jupiter`}
                                            </button>
                                            <p className="text-xs text-gray-500 text-center mt-2">Your wallet, your approval required • Non-custodial</p>
                                        </>
                                    )}
                                </div>

                                {/* AI Reasoning */}
                                <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                        <span>🤖</span>
                                        <span>AI Reasoning</span>
                                    </h3>
                                    <div className="space-y-2 text-sm text-gray-300">
                                        {signal.reasoning.map((r, i) => (
                                            <motion.p 
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-start gap-2">
                                                <span className="text-purple-400 mt-1">•</span>
                                                <span>{r}</span>
                                            </motion.p>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}

                {/* No results message */}
                {data && filteredSignals.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-4xl mb-4">🔍</p>
                        <p className="text-xl font-bold text-gray-300 mb-2">No signals found</p>
                        <p className="text-gray-400 mb-4">
                            No {signalFilter !== 'ALL' && `${signalFilter} signals in `}
                            {categoryFilter !== 'ALL' ? categoryFilter : 'any category'}
                        </p>
                        <div className="flex gap-2 justify-center">
                            {signalFilter !== 'ALL' && (
                                <button onClick={() => setSignalFilter('ALL')} 
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all">
                                    Clear Signal Filter
                                </button>
                            )}
                            {categoryFilter !== 'ALL' && (
                                <button onClick={() => setCategoryFilter('ALL')} 
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all">
                                    Clear Category Filter
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
