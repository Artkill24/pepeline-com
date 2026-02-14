'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';

const SENTIMENT_CONFIG = {
    'BULLISH':          { color: '#22c55e', bg: 'from-green-900/30 to-green-950/50',   border: 'border-green-500/30',   emoji: '🚀' },
    'SLIGHTLY BULLISH': { color: '#3b82f6', bg: 'from-blue-900/30 to-blue-950/50',    border: 'border-blue-500/30',    emoji: '📈' },
    'NEUTRAL':          { color: '#eab308', bg: 'from-yellow-900/30 to-yellow-950/50', border: 'border-yellow-500/30',  emoji: '😐' },
    'SLIGHTLY BEARISH': { color: '#f97316', bg: 'from-orange-900/30 to-orange-950/50', border: 'border-orange-500/30',  emoji: '📉' },
    'BEARISH':          { color: '#ef4444', bg: 'from-red-900/30 to-red-950/50',       border: 'border-red-500/30',     emoji: '🐻' },
};

function formatPrice(price) {
    if (!price || price === 0) return '$—';
    if (price < 0.0001) return `$${price.toFixed(8)}`;
    if (price < 0.01)   return `$${price.toFixed(6)}`;
    if (price < 1)      return `$${price.toFixed(4)}`;
    if (price < 1000)   return `$${price.toFixed(2)}`;
    return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function formatLarge(n) {
    if (!n || n === 0) return '—';
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`;
    return `$${n.toLocaleString()}`;
}

function PriceFlash({ direction, children }) {
    return (
        <motion.span
            key={direction}
            initial={{ backgroundColor: direction === 'up' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)' }}
            animate={{ backgroundColor: 'transparent' }}
            transition={{ duration: 1.5 }}
            className="rounded px-1"
        >
            {children}
        </motion.span>
    );
}

export default function CoinPage({ params }) {
    const [coin, setCoin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countdown, setCountdown] = useState(5);
    const [priceDir, setPriceDir] = useState(null);
    const prevPriceRef = useRef(null);

    const fetchCoin = async () => {
        try {
            const res = await fetch(`/api/coin/${params.id}`);
            const data = await res.json();
            if (data.error) { setError(data.error); return; }

            if (prevPriceRef.current && data.price) {
                const dir = data.price > prevPriceRef.current ? 'up' : data.price < prevPriceRef.current ? 'down' : null;
                if (dir) { setPriceDir(dir); setTimeout(() => setPriceDir(null), 2000); }
            }
            prevPriceRef.current = data.price;
            setCoin(data);
            setCountdown(5);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoin();
        const interval = setInterval(fetchCoin, 5000);
        const cdInterval = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 5), 1000);
        return () => { clearInterval(interval); clearInterval(cdInterval); };
    }, [params.id]);

    const cfg = SENTIMENT_CONFIG[coin?.sentimentLevel] || SENTIMENT_CONFIG['NEUTRAL'];

    return (
        <main className="min-h-screen bg-[#0a0a14] text-white">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
            </div>

            <Header />

            <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">

                {/* Back */}
                <Link href="/coins" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6 transition-colors text-sm">
                    ← Back to Coins
                </Link>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
                        <p className="text-gray-400 text-sm">Loading on-chain data...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">❌</div>
                        <p className="text-red-400 mb-2">{error}</p>
                        <Link href="/coins" className="text-purple-400 hover:underline">← Go back</Link>
                    </div>
                ) : coin ? (
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

                            {/* Header Card */}
                            <div className={`p-6 rounded-2xl bg-gradient-to-br ${cfg.bg} border ${cfg.border} mb-6`}>
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={coin.image}
                                            alt={coin.name}
                                            className="w-16 h-16 rounded-full shadow-lg"
                                            onError={e => e.target.style.display = 'none'}
                                        />
                                        <div>
                                            <h1 className="text-3xl font-black">{coin.name}</h1>
                                            <p className="text-gray-400 text-sm">{coin.symbol} · Ethereum Mainnet</p>
                                            {coin.address && (
                                                <p className="text-xs text-gray-600 mt-1 font-mono">
                                                    {coin.address.slice(0, 10)}...{coin.address.slice(-6)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <PriceFlash direction={priceDir}>
                                            <p className="text-4xl font-black">{formatPrice(coin.price)}</p>
                                        </PriceFlash>
                                        <p className={`text-lg font-bold ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h || 0).toFixed(2)}% (24h)
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">Refreshes in {countdown}s</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sentiment + On-Chain Row */}
                            <div className="grid md:grid-cols-2 gap-4 mb-6">

                                {/* Sentiment */}
                                <div className={`p-5 rounded-xl bg-gradient-to-br ${cfg.bg} border ${cfg.border}`}>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Pepeline Sentiment</p>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <svg width="80" height="80" className="-rotate-90">
                                                <circle cx="40" cy="40" r="32" fill="none" stroke="#1e1b4b" strokeWidth="8" />
                                                <circle
                                                    cx="40" cy="40" r="32" fill="none"
                                                    stroke={cfg.color}
                                                    strokeWidth="8"
                                                    strokeLinecap="round"
                                                    strokeDasharray={2 * Math.PI * 32}
                                                    strokeDashoffset={2 * Math.PI * 32 * (1 - (coin.sentiment || 50) / 100)}
                                                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xl font-black" style={{ color: cfg.color }}>{coin.sentiment}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black" style={{ color: cfg.color }}>{cfg.emoji} {coin.sentimentLevel}</p>
                                            <p className="text-xs text-gray-400 mt-1">Score 0-100</p>
                                            <div className="mt-2 w-full bg-gray-800 rounded-full h-1.5">
                                                <div className="h-1.5 rounded-full transition-all duration-1000" style={{ width: `${coin.sentiment}%`, backgroundColor: cfg.color }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* On-Chain Stats */}
                                <div className="p-5 rounded-xl bg-purple-950/30 border border-purple-800/30">
                                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">⛓️ On-Chain Data (Alchemy)</p>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">Transfers (recent)</span>
                                            <span className="font-bold text-purple-300">{coin.onChain?.transfers24h || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">Unique Addresses</span>
                                            <span className="font-bold text-purple-300">{coin.onChain?.uniqueAddresses || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">Large Transfers 🐋</span>
                                            <span className={`font-bold ${(coin.onChain?.largeTransfers || 0) > 3 ? 'text-orange-400' : 'text-gray-300'}`}>
                                                {coin.onChain?.largeTransfers || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">Gas Price</span>
                                            <span className="font-bold text-orange-300">{coin.onChain?.gasPrice || '—'} Gwei</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Market Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                {[
                                    { label: 'Price', value: formatPrice(coin.price), icon: '💲' },
                                    { label: '24h Change', value: `${coin.change24h >= 0 ? '+' : ''}${(coin.change24h || 0).toFixed(2)}%`, icon: '📊', color: coin.change24h >= 0 ? 'text-green-400' : 'text-red-400' },
                                    { label: 'Market Cap', value: formatLarge(coin.marketCap), icon: '💰' },
                                    { label: '24h Volume', value: formatLarge(coin.volume24h), icon: '📈' },
                                ].map(stat => (
                                    <motion.div key={stat.label} whileHover={{ scale: 1.03 }} className="p-4 bg-purple-950/30 rounded-xl border border-purple-800/30 text-center">
                                        <p className="text-2xl mb-1">{stat.icon}</p>
                                        <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                                        <p className={`font-bold text-sm ${stat.color || 'text-white'}`}>{stat.value || '—'}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* AI Commentary */}
                            {coin.commentary && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-5 bg-gradient-to-r from-violet-900/20 to-purple-900/20 rounded-xl border border-purple-700/30 mb-6"
                                >
                                    <p className="text-xs text-purple-400 uppercase tracking-widest mb-2">🤖 Gemini AI Analysis</p>
                                    <p className="text-gray-200 text-sm leading-relaxed">{coin.commentary}</p>
                                </motion.div>
                            )}

                            {/* Data Source Badge */}
                            <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>⛓️ Data: Alchemy Ethereum Mainnet + CoinGecko</span>
                                <span>Updated: {new Date(coin.timestamp).toLocaleTimeString()}</span>
                            </div>

                            {/* Back to coins */}
                            <div className="mt-8 text-center">
                                <Link href="/coins"
                                    className="px-6 py-3 bg-purple-900/40 hover:bg-purple-800/40 border border-purple-700/30 rounded-xl text-sm font-semibold transition-all">
                                    ← View All Coins
                                </Link>
                            </div>

                        </motion.div>
                    </AnimatePresence>
                ) : null}
            </div>
        </main>
    );
}
