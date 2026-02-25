'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Coin categories (same as before)
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
    { id: 'ALL', label: 'All', emoji: '🌐' },
    { id: 'Major', label: 'Major', emoji: '⭐' },
    { id: 'Meme', label: 'Meme', emoji: '🐸' },
    { id: 'L1', label: 'L1', emoji: '🔷' },
    { id: 'DeFi', label: 'DeFi', emoji: '🦄' },
];

export default function TradingPage() {
    const { publicKey, connected } = useWallet();
    const { setVisible } = useWalletModal();
    const [data, setData] = useState(null);
    const [selectedCoin, setSelectedCoin] = useState('BTC');
    const [amount, setAmount] = useState(100);
    const [executing, setExecuting] = useState(false);
    const [signalFilter, setSignalFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('strength');
    const [lastUpdated, setLastUpdated] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

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

    const getCoinCategory = (symbol) => COIN_CATEGORIES[symbol]?.category || 'Other';
    const getCoinEmoji = (symbol) => COIN_CATEGORIES[symbol]?.emoji || '💎';

    const getFilteredAndSortedSignals = () => {
        if (!data?.signals) return [];
        let filtered = data.signals;
        if (signalFilter !== 'ALL') filtered = filtered.filter(s => s.signal === signalFilter);
        if (categoryFilter !== 'ALL') filtered = filtered.filter(s => getCoinCategory(s.symbol) === categoryFilter);
        return [...filtered].sort((a, b) => {
            if (sortBy === 'strength') return b.strength - a.strength;
            if (sortBy === 'alphabetical') return a.symbol.localeCompare(b.symbol);
            if (sortBy === 'change') return b.change24h - a.change24h;
            return 0;
        });
    };

    const filteredSignals = getFilteredAndSortedSignals();
    const signal = data?.signals?.find(s => s.symbol === selectedCoin);

    const stats = data?.signals ? {
        total: data.signals.length,
        buy: data.signals.filter(s => s.signal === 'BUY').length,
        sell: data.signals.filter(s => s.signal === 'SELL').length,
        hold: data.signals.filter(s => s.signal === 'HOLD').length,
    } : null;

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pb-20 md:pb-0">
            <Header />
            
            {/* Mobile-optimized container */}
            <div className="container mx-auto px-3 md:px-4 py-6 md:py-12 max-w-7xl">

                {/* Compact header for mobile */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4 md:mb-8">
                    <div className="text-4xl md:text-6xl mb-2 md:mb-4">🤖</div>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-2 md:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                        AI Signals
                    </h1>
                    <p className="text-sm md:text-xl text-gray-300">15 Coins • Real-time</p>
                </motion.div>

                {/* Compact stats for mobile */}
                {stats && (
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        <div className="p-2 md:p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                            <p className="text-xs text-gray-400">Total</p>
                            <p className="text-lg md:text-2xl font-bold text-purple-400">{stats.total}</p>
                        </div>
                        <div className="p-2 md:p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                            <p className="text-xs text-gray-400">Buy</p>
                            <p className="text-lg md:text-2xl font-bold text-green-400">{stats.buy}</p>
                        </div>
                        <div className="p-2 md:p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                            <p className="text-xs text-gray-400">Sell</p>
                            <p className="text-lg md:text-2xl font-bold text-red-400">{stats.sell}</p>
                        </div>
                        <div className="p-2 md:p-3 bg-gray-800 rounded-lg border border-gray-700">
                            <p className="text-xs text-gray-400">Hold</p>
                            <p className="text-lg md:text-2xl font-bold text-gray-400">{stats.hold}</p>
                        </div>
                    </div>
                )}

                {/* Mobile filter toggle button */}
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden w-full mb-3 p-3 bg-gray-800 rounded-lg font-semibold flex items-center justify-between">
                    <span>🔍 Filters & Sort</span>
                    <span>{showFilters ? '▲' : '▼'}</span>
                </button>

                {/* Filters - collapsible on mobile */}
                <div className={`space-y-3 mb-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
                    {/* Category filters */}
                    <div>
                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                            {CATEGORY_FILTERS.map(cat => (
                                <button key={cat.id}
                                    onClick={() => setCategoryFilter(cat.id)}
                                    className={`px-2 md:px-4 py-1.5 md:py-2 rounded-lg font-semibold transition-all text-xs md:text-sm ${
                                        categoryFilter === cat.id ? 'bg-purple-600' : 'bg-gray-800'
                                    }`}>
                                    {cat.emoji} {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Signal + Sort */}
                    <div className="flex gap-2 items-center justify-between">
                        <div className="flex gap-1.5">
                            {['ALL', 'BUY', 'SELL'].map(sig => (
                                <button key={sig}
                                    onClick={() => setSignalFilter(sig)}
                                    className={`px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold ${
                                        signalFilter === sig ? 
                                        (sig === 'BUY' ? 'bg-green-600' : sig === 'SELL' ? 'bg-red-600' : 'bg-purple-600')
                                        : 'bg-gray-800'
                                    }`}>
                                    {sig === 'BUY' ? '🟢' : sig === 'SELL' ? '🔴' : '⚪'} {sig}
                                </button>
                            ))}
                        </div>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                            className="px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs focus:outline-none">
                            <option value="strength">Strength</option>
                            <option value="change">24h</option>
                        </select>
                    </div>
                </div>

                {/* Signal Cards - optimized grid for mobile */}
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3 mb-6">
                    {filteredSignals.map(s => (
                        <motion.button
                            key={s.symbol}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCoin(s.symbol)}
                            className={`p-2 md:p-4 rounded-lg md:rounded-xl border transition-all ${
                                selectedCoin === s.symbol
                                    ? 'bg-purple-900/50 border-purple-500 ring-2 ring-purple-500'
                                    : s.signal === 'BUY'
                                    ? 'bg-green-900/20 border-green-500/30'
                                    : s.signal === 'SELL'
                                    ? 'bg-red-900/20 border-red-500/30'
                                    : 'bg-gray-800 border-gray-700'
                            }`}>
                            <div className="text-lg md:text-xl mb-1">{getCoinEmoji(s.symbol)}</div>
                            <p className="text-xs md:text-base font-bold">{s.symbol}</p>
                            <p className={`text-xs md:text-sm font-bold ${
                                s.signal === 'BUY' ? 'text-green-400' : 
                                s.signal === 'SELL' ? 'text-red-400' : 'text-gray-400'
                            }`}>
                                {s.signal}
                            </p>
                            <p className="text-xs text-purple-400 font-bold">{s.strength}</p>
                        </motion.button>
                    ))}
                </div>

                {/* Selected Signal - mobile optimized */}
                {signal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div className={`p-4 md:p-6 rounded-xl md:rounded-2xl border ${
                            signal.signal === 'BUY' ? 'bg-green-900/20 border-green-500/30' :
                            signal.signal === 'SELL' ? 'bg-red-900/20 border-red-500/30' :
                            'bg-gray-800 border-gray-700'
                        }`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-3xl md:text-4xl">{getCoinEmoji(signal.symbol)}</span>
                                        <div>
                                            <p className="text-lg md:text-xl font-bold">{signal.symbol}</p>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                                                {getCoinCategory(signal.symbol)}
                                            </span>
                                        </div>
                                    </div>
                                    <p className={`text-4xl md:text-5xl font-bold ${
                                        signal.signal === 'BUY' ? 'text-green-400' :
                                        signal.signal === 'SELL' ? 'text-red-400' : 'text-gray-400'
                                    }`}>{signal.signal}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400">Strength</p>
                                    <p className="text-3xl md:text-4xl font-bold text-purple-400">{signal.strength}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="p-3 bg-gray-900/50 rounded-lg">
                                    <p className="text-xs text-gray-400">Price</p>
                                    <p className="text-lg md:text-xl font-bold">${signal.price.toFixed(2)}</p>
                                </div>
                                <div className="p-3 bg-gray-900/50 rounded-lg">
                                    <p className="text-xs text-gray-400">24h</p>
                                    <p className={`text-lg md:text-xl font-bold ${signal.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {signal.change24h >= 0 ? '+' : ''}{signal.change24h.toFixed(2)}%
                                    </p>
                                </div>
                            </div>

                            <Link href={`/explain?symbol=${signal.symbol}`}>
                                <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg active:bg-blue-900/40">
                                    <div className="flex items-center justify-between">
                                        <p className="font-bold text-blue-300 text-sm md:text-base">🧠 Why this signal?</p>
                                        <span className="text-xl">→</span>
                                    </div>
                                </div>
                            </Link>

                            {connected && signal.signal !== 'HOLD' && (
                                <>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                                        className="w-full px-3 py-3 mb-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-lg"
                                        min="10"
                                        placeholder="Amount (USDC)"
                                    />
                                    <button
                                        onClick={() => executeQuickTrade(signal.signal)}
                                        disabled={executing}
                                        className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 active:from-green-700 active:to-blue-700 rounded-lg font-bold text-base md:text-lg">
                                        {executing ? '⏳ Preparing...' : `⚡ ${signal.signal} on Jupiter`}
                                    </button>
                                </>
                            )}

                            {!connected && signal.signal !== 'HOLD' && (
                                <button onClick={() => setVisible(true)}
                                    className="w-full py-4 bg-purple-600 active:bg-purple-700 rounded-lg font-bold">
                                    👛 Connect Wallet to Trade
                                </button>
                            )}
                        </div>

                        {/* AI Reasoning - compact on mobile */}
                        <div className="p-4 bg-gray-800 rounded-lg">
                            <h3 className="font-bold mb-3 flex items-center gap-2">
                                <span>🤖</span><span>AI Reasoning</span>
                            </h3>
                            <div className="space-y-1.5 text-sm text-gray-300">
                                {signal.reasoning.map((r, i) => (
                                    <p key={i} className="flex items-start gap-2">
                                        <span className="text-purple-400">•</span>
                                        <span>{r}</span>
                                    </p>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Mobile bottom navigation (optional) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 py-3 px-4 flex justify-around items-center z-50">
                <Link href="/dashboard" className="flex flex-col items-center gap-1">
                    <span className="text-xl">📊</span>
                    <span className="text-xs">Dashboard</span>
                </Link>
                <Link href="/trading" className="flex flex-col items-center gap-1 text-purple-400">
                    <span className="text-xl">🤖</span>
                    <span className="text-xs font-bold">Signals</span>
                </Link>
                <Link href="/explain" className="flex flex-col items-center gap-1">
                    <span className="text-xl">🧠</span>
                    <span className="text-xs">Explain</span>
                </Link>
                <Link href="/premium" className="flex flex-col items-center gap-1">
                    <span className="text-xl">💎</span>
                    <span className="text-xs">Premium</span>
                </Link>
            </div>

            <Footer />
        </main>
    );
}
