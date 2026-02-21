'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CoinDetailPage({ params }) {
    const [coin, setCoin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chartPeriod, setChartPeriod] = useState('7d');
    const [showFullDescription, setShowFullDescription] = useState(false);

    useEffect(() => {
        fetchCoin();
    }, [params.id]);

    const fetchCoin = async () => {
        try {
            const res = await fetch(`/api/coin/${params.id}`);
            const data = await res.json();
            setCoin(data.coin);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const formatNumber = (num) => {
        if (!num) return '—';
        if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
        if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
        return `$${num.toFixed(2)}`;
    };

    const formatPrice = (price) => {
        if (!price) return '$0.00';
        if (price >= 1) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (price >= 0.01) return `$${price.toFixed(4)}`;
        return `$${price.toFixed(8)}`;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const PriceChart = ({ data }) => {
        if (!data || data.length === 0) return null;

        const prices = data.map(p => p[1]);
        const max = Math.max(...prices);
        const min = Math.min(...prices);
        const range = max - min;

        const points = prices.map((price, i) => {
            const x = (i / (prices.length - 1)) * 100;
            const y = 100 - (((price - min) / range) * 100);
            return `${x},${y}`;
        }).join(' ');

        const color = prices[prices.length - 1] > prices[0] ? '#10b981' : '#ef4444';
        const fillColor = prices[prices.length - 1] > prices[0] ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';

        return (
            <svg viewBox="0 0 100 100" className="w-full h-64" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
                        <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
                    </linearGradient>
                </defs>
                <polyline
                    points={`0,100 ${points} 100,100`}
                    fill="url(#gradient)"
                />
                <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="0.5"
                />
            </svg>
        );
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent" />
                </div>
                <Footer />
            </main>
        );
    }

    if (!coin) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <p className="text-2xl text-gray-400">Coin not found</p>
                    <Link href="/coins" className="text-blue-400 hover:underline mt-4 inline-block">← Back to coins</Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <Link href="/coins" className="text-blue-400 hover:underline mb-4 inline-block">← Back to coins</Link>
                    
                    <div className="flex items-center gap-4 mb-6">
                        <Image src={coin.image} alt={coin.name} width={64} height={64} className="rounded-full" />
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold">{coin.name}</h1>
                            <p className="text-xl text-gray-400">{coin.symbol} • Rank #{coin.market_cap_rank}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div>
                            <p className="text-5xl font-extrabold">{formatPrice(coin.current_price)}</p>
                            <p className={`text-xl font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}% (24h)
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="mb-8 p-6 bg-gray-800 rounded-2xl border border-gray-700">
                    
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Price Chart</h2>
                        <div className="flex gap-2">
                            {['7d', '30d', '90d', '1y'].map(period => (
                                <button
                                    key={period}
                                    onClick={() => setChartPeriod(period)}
                                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                                        chartPeriod === period ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                                    }`}>
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>

                    <PriceChart data={coin.price_history} />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column - Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Market Stats */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="p-6 bg-gray-800 rounded-2xl border border-gray-700">
                            <h2 className="text-2xl font-bold mb-4">Market Stats</h2>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-400">Market Cap</p>
                                    <p className="text-xl font-bold">{formatNumber(coin.market_cap)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">24h Volume</p>
                                    <p className="text-xl font-bold">{formatNumber(coin.total_volume)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Circulating Supply</p>
                                    <p className="text-xl font-bold">{coin.circulating_supply?.toLocaleString()} {coin.symbol}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Max Supply</p>
                                    <p className="text-xl font-bold">
                                        {coin.max_supply ? coin.max_supply.toLocaleString() : '∞'} {coin.symbol}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Price Performance */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="p-6 bg-gray-800 rounded-2xl border border-gray-700">
                            <h2 className="text-2xl font-bold mb-4">Price Performance</h2>
                            
                            <div className="space-y-3">
                                {[
                                    { label: '24h', value: coin.price_change_percentage_24h },
                                    { label: '7d', value: coin.price_change_percentage_7d },
                                    { label: '30d', value: coin.price_change_percentage_30d },
                                    { label: '1y', value: coin.price_change_percentage_1y }
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl">
                                        <span className="text-gray-400">{label}</span>
                                        <span className={`font-bold ${value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {value >= 0 ? '+' : ''}{value?.toFixed(2)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* ATH/ATL */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            className="p-6 bg-gray-800 rounded-2xl border border-gray-700">
                            <h2 className="text-2xl font-bold mb-4">All-Time Highs & Lows</h2>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
                                    <p className="text-sm text-gray-400 mb-1">All-Time High</p>
                                    <p className="text-2xl font-bold text-green-400">{formatPrice(coin.ath)}</p>
                                    <p className="text-xs text-gray-400">{formatDate(coin.ath_date)}</p>
                                    <p className="text-sm font-bold text-red-400 mt-2">
                                        {coin.ath_change_percentage?.toFixed(1)}% from ATH
                                    </p>
                                </div>
                                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                                    <p className="text-sm text-gray-400 mb-1">All-Time Low</p>
                                    <p className="text-2xl font-bold text-red-400">{formatPrice(coin.atl)}</p>
                                    <p className="text-xs text-gray-400">{formatDate(coin.atl_date)}</p>
                                    <p className="text-sm font-bold text-green-400 mt-2">
                                        +{coin.atl_change_percentage?.toFixed(0)}% from ATL
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Description */}
                        {coin.description && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                                className="p-6 bg-gray-800 rounded-2xl border border-gray-700">
                                <h2 className="text-2xl font-bold mb-4">About {coin.name}</h2>
                                <div 
                                    className={`text-gray-300 prose prose-invert max-w-none ${!showFullDescription && 'line-clamp-4'}`}
                                    dangerouslySetInnerHTML={{ __html: coin.description }}
                                />
                                {coin.description.length > 300 && (
                                    <button
                                        onClick={() => setShowFullDescription(!showFullDescription)}
                                        className="text-blue-400 hover:underline mt-2">
                                        {showFullDescription ? 'Show less' : 'Read more'}
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column - Links & Community */}
                    <div className="space-y-6">
                        
                        {/* Links */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="p-6 bg-gray-800 rounded-2xl border border-gray-700">
                            <h2 className="text-xl font-bold mb-4">Links</h2>
                            
                            <div className="space-y-3">
                                {coin.homepage && (
                                    <a href={coin.homepage} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 bg-gray-900/50 hover:bg-gray-900 rounded-xl transition-all">
                                        🌐 <span>Website</span>
                                    </a>
                                )}
                                {coin.blockchain_site && (
                                    <a href={coin.blockchain_site} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 bg-gray-900/50 hover:bg-gray-900 rounded-xl transition-all">
                                        🔗 <span>Explorer</span>
                                    </a>
                                )}
                                {coin.twitter_screen_name && (
                                    <a href={`https://twitter.com/${coin.twitter_screen_name}`} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 bg-gray-900/50 hover:bg-gray-900 rounded-xl transition-all">
                                        𝕏 <span>Twitter</span>
                                    </a>
                                )}
                                {coin.telegram_channel_identifier && (
                                    <a href={`https://t.me/${coin.telegram_channel_identifier}`} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 bg-gray-900/50 hover:bg-gray-900 rounded-xl transition-all">
                                        ✈️ <span>Telegram</span>
                                    </a>
                                )}
                                {coin.subreddit_url && (
                                    <a href={coin.subreddit_url} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 bg-gray-900/50 hover:bg-gray-900 rounded-xl transition-all">
                                        🔴 <span>Reddit</span>
                                    </a>
                                )}
                                {coin.repos_url && (
                                    <a href={coin.repos_url} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 bg-gray-900/50 hover:bg-gray-900 rounded-xl transition-all">
                                        💻 <span>GitHub</span>
                                    </a>
                                )}
                            </div>
                        </motion.div>

                        {/* Community */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            className="p-6 bg-gray-800 rounded-2xl border border-gray-700">
                            <h2 className="text-xl font-bold mb-4">Community</h2>
                            
                            <div className="space-y-3">
                                {coin.community.twitter_followers && (
                                    <div className="flex justify-between p-3 bg-gray-900/50 rounded-xl">
                                        <span className="text-gray-400">Twitter</span>
                                        <span className="font-bold">{coin.community.twitter_followers.toLocaleString()}</span>
                                    </div>
                                )}
                                {coin.community.reddit_subscribers && (
                                    <div className="flex justify-between p-3 bg-gray-900/50 rounded-xl">
                                        <span className="text-gray-400">Reddit</span>
                                        <span className="font-bold">{coin.community.reddit_subscribers.toLocaleString()}</span>
                                    </div>
                                )}
                                {coin.community.telegram_channel_user_count && (
                                    <div className="flex justify-between p-3 bg-gray-900/50 rounded-xl">
                                        <span className="text-gray-400">Telegram</span>
                                        <span className="font-bold">{coin.community.telegram_channel_user_count.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Categories */}
                        {coin.categories && coin.categories.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                                className="p-6 bg-gray-800 rounded-2xl border border-gray-700">
                                <h2 className="text-xl font-bold mb-4">Categories</h2>
                                <div className="flex flex-wrap gap-2">
                                    {coin.categories.map((cat, i) => (
                                        <span key={i} className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-lg text-sm">
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
