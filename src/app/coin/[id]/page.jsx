'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Header from '@/components/Header';

export default function CoinPage({ params }) {
    const [coin, setCoin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [priceHistory, setPriceHistory] = useState([]);
    const [priceChange, setPriceChange] = useState(null);
    const [mcapChange, setMcapChange] = useState(null);
    const [volumeChange, setVolumeChange] = useState(null);
    const [countdown, setCountdown] = useState(5);
    const prevPriceRef = useRef(null);
    const prevMcapRef = useRef(null);
    const prevVolumeRef = useRef(null);

    useEffect(() => {
        const fetchCoin = () => {
            fetch(`/api/coin/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        console.error('Coin error:', data.error);
                        return;
                    }

                    if (prevPriceRef.current && data.price) {
                        if (data.price > prevPriceRef.current) {
                            setPriceChange('up');
                        } else if (data.price < prevPriceRef.current) {
                            setPriceChange('down');
                        }
                        setTimeout(() => setPriceChange(null), 2000);
                    }
                    prevPriceRef.current = data.price;

                    if (prevMcapRef.current && data.marketCap) {
                        if (data.marketCap > prevMcapRef.current) {
                            setMcapChange('up');
                        } else if (data.marketCap < prevMcapRef.current) {
                            setMcapChange('down');
                        }
                        setTimeout(() => setMcapChange(null), 2000);
                    }
                    prevMcapRef.current = data.marketCap;

                    if (prevVolumeRef.current && data.volume) {
                        if (data.volume > prevVolumeRef.current) {
                            setVolumeChange('up');
                        } else if (data.volume < prevVolumeRef.current) {
                            setVolumeChange('down');
                        }
                        setTimeout(() => setVolumeChange(null), 2000);
                    }
                    prevVolumeRef.current = data.volume;

                    setPriceHistory(prev => {
                        const newHistory = [...prev, { price: data.price, time: Date.now() }];
                        return newHistory.slice(-20);
                    });

                    setCoin(data);
                    setCountdown(5);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        };

        fetchCoin();
        const interval = setInterval(fetchCoin, 5000);
        return () => clearInterval(interval);
    }, [params.id]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => prev > 0 ? prev - 1 : 5);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
                <div className="max-w-6xl mx-auto">
                    <Header />
                    <div className="mt-12 animate-pulse">
                        <div className="h-64 bg-gray-800 rounded mb-8"></div>
                    </div>
                </div>
            </main>
        );
    }

    if (!coin || coin.error) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
                <div className="max-w-6xl mx-auto">
                    <Header />
                    <div className="mt-12 text-center">
                        <p className="text-4xl mb-4">🤷</p>
                        <p className="text-xl text-gray-400">Coin not found</p>
                        <Link href="/coins" className="text-green-400 mt-4 inline-block">← Back to Coins</Link>
                    </div>
                </div>
            </main>
        );
    }

    const formatPrice = (price) => {
        if (!price) return '$0';
        if (price < 0.001) return `$${price.toFixed(8)}`;
        if (price < 0.01) return `$${price.toFixed(6)}`;
        if (price < 1) return `$${price.toFixed(4)}`;
        if (price < 100) return `$${price.toFixed(4)}`;
        return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
    };

    const formatLargeNumber = (num) => {
        if (!num) return '$0';
        if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
        return `$${num.toLocaleString()}`;
    };

    const getSourceColor = (source) => {
        if (source === 'coinmarketcap') return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
        if (source === 'binance') return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
        return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <Header />
                <Link href="/coins" className="text-green-400 mt-8 inline-flex items-center gap-2 hover:underline">
                    ← Back to Coins
                </Link>
                
                <div className="mt-8 mb-4 overflow-hidden bg-gray-800/50 border border-gray-700 rounded-lg">
                    <div className="flex items-center gap-8 px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">PRICE:</span>
                            <motion.span 
                                key={coin.price}
                                initial={{ color: priceChange === 'up' ? '#10b981' : priceChange === 'down' ? '#ef4444' : '#ffffff' }}
                                animate={{ color: '#ffffff' }}
                                className="font-bold"
                            >
                                {formatPrice(coin.price)}
                            </motion.span>
                            {priceChange === 'up' && <span className="text-green-400">↗</span>}
                            {priceChange === 'down' && <span className="text-red-400">↘</span>}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">24H:</span>
                            <span className={coin.change24h >= 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                                {coin.change24h >= 0 ? '+' : ''}{coin.change24h?.toFixed(2)}%
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">MCAP:</span>
                            <motion.span 
                                key={coin.marketCap}
                                initial={{ color: mcapChange === 'up' ? '#10b981' : mcapChange === 'down' ? '#ef4444' : '#ffffff' }}
                                animate={{ color: '#ffffff' }}
                                className="font-bold"
                            >
                                {formatLargeNumber(coin.marketCap)}
                            </motion.span>
                            {mcapChange === 'up' && <span className="text-green-400 text-xs">↗</span>}
                            {mcapChange === 'down' && <span className="text-red-400 text-xs">↘</span>}
                        </div>
                    </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                        <div className="flex items-center gap-4">
                            <img src={coin.image} alt={coin.name} className="w-16 h-16 rounded-full" />
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold">{coin.name}</h1>
                                <p className="text-gray-400">{coin.symbol}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
                                    <motion.span 
                                        className="w-2 h-2 bg-green-500 rounded-full"
                                        animate={{ scale: [1, 1.3, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    />
                                    <span className="text-xs font-semibold text-green-400">LIVE</span>
                                </div>
                                {coin.priceSource && (
                                    <div className={`px-3 py-1 border rounded-full ${getSourceColor(coin.priceSource)}`}>
                                        <span className="text-xs font-semibold uppercase">
                                            {coin.priceSource}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-gray-600">Next update: {countdown}s</span>
                        </div>
                    </div>

                    <motion.div 
                        className={`mb-8 p-6 md:p-8 rounded-xl border-2 relative overflow-hidden ${
                            priceChange === 'up' ? 'bg-green-900/30 border-green-500' :
                            priceChange === 'down' ? 'bg-red-900/30 border-red-500' :
                            'bg-gray-800/60 border-gray-700'
                        }`}
                        animate={{
                            scale: priceChange ? [1, 1.03, 1] : 1,
                            boxShadow: priceChange ? [
                                '0 0 0px rgba(16, 185, 129, 0)',
                                priceChange === 'up' ? '0 0 40px rgba(16, 185, 129, 0.6)' : '0 0 40px rgba(239, 68, 68, 0.6)',
                                '0 0 0px rgba(16, 185, 129, 0)'
                            ] : '0 0 0px rgba(0,0,0,0)'
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <AnimatePresence>
                            {priceChange && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 0.3, 0] }}
                                    exit={{ opacity: 0 }}
                                    className={`absolute inset-0 ${priceChange === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
                                    transition={{ duration: 1 }}
                                />
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {priceChange && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0, y: -50 }}
                                    animate={{ opacity: 1, scale: 2, y: 0 }}
                                    exit={{ opacity: 0, scale: 3, y: -100 }}
                                    className="absolute top-4 right-4 text-4xl md:text-6xl"
                                >
                                    {priceChange === 'up' ? '🚀' : '📉'}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <p className="text-sm text-gray-500 mb-2 relative z-10">Current Price</p>
                        <motion.p 
                            key={coin.price}
                            initial={{ 
                                scale: 1.2, 
                                color: priceChange === 'up' ? '#10b981' : priceChange === 'down' ? '#ef4444' : '#ffffff',
                                y: priceChange ? -10 : 0
                            }}
                            animate={{ 
                                scale: 1, 
                                color: '#ffffff',
                                y: 0
                            }}
                            transition={{ 
                                type: 'spring',
                                stiffness: 200,
                                damping: 15
                            }}
                            className="text-5xl md:text-7xl font-bold mb-4 relative z-10 break-all"
                        >
                            {formatPrice(coin.price)}
                        </motion.p>

                        {priceHistory.length > 2 && (
                            <div className="h-16 mb-4 relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={priceHistory}>
                                        <Line 
                                            type="monotone" 
                                            dataKey="price" 
                                            stroke={priceChange === 'up' ? '#10b981' : priceChange === 'down' ? '#ef4444' : '#6b7280'}
                                            strokeWidth={2}
                                            dot={false}
                                            animationDuration={300}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-4 relative z-10">
                            <motion.p 
                                key={coin.change24h}
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                className={`text-xl md:text-2xl font-semibold ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}
                            >
                                {coin.change24h >= 0 ? '↗' : '↘'} {Math.abs(coin.change24h || 0).toFixed(2)}% (24h)
                            </motion.p>
                            {coin.change7d !== undefined && (
                                <p className={`text-base md:text-lg ${coin.change7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    7D: {coin.change7d >= 0 ? '+' : ''}{coin.change7d.toFixed(2)}%
                                </p>
                            )}
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <motion.div 
                            className={`p-4 rounded-xl border transition-all ${
                                mcapChange === 'up' ? 'bg-green-900/20 border-green-500/50' :
                                mcapChange === 'down' ? 'bg-red-900/20 border-red-500/50' :
                                'bg-gray-800 border-gray-700'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            animate={{ scale: mcapChange ? [1, 1.05, 1] : 1 }}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-xs text-gray-500">Market Cap</p>
                                {mcapChange && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={mcapChange === 'up' ? 'text-green-400' : 'text-red-400'}
                                    >
                                        {mcapChange === 'up' ? '↗' : '↘'}
                                    </motion.span>
                                )}
                            </div>
                            <motion.p 
                                key={coin.marketCap}
                                initial={{ opacity: 0.5, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-lg md:text-xl font-bold break-all"
                            >
                                {formatLargeNumber(coin.marketCap)}
                            </motion.p>
                            <p className="text-xs text-gray-500">Rank #{coin.marketCapRank || 'N/A'}</p>
                        </motion.div>

                        <motion.div 
                            className={`p-4 rounded-xl border transition-all ${
                                volumeChange === 'up' ? 'bg-green-900/20 border-green-500/50' :
                                volumeChange === 'down' ? 'bg-red-900/20 border-red-500/50' :
                                'bg-gray-800 border-gray-700'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            animate={{ scale: volumeChange ? [1, 1.05, 1] : 1 }}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-xs text-gray-500">24h Volume</p>
                                {volumeChange && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={volumeChange === 'up' ? 'text-green-400' : 'text-red-400'}
                                    >
                                        {volumeChange === 'up' ? '↗' : '↘'}
                                    </motion.span>
                                )}
                            </div>
                            <motion.p 
                                key={coin.volume}
                                initial={{ opacity: 0.5, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-lg md:text-xl font-bold break-all"
                            >
                                {formatLargeNumber(coin.volume)}
                            </motion.p>
                            <p className="text-xs text-gray-500">
                                Vol/MCap: {coin.volume && coin.marketCap ? ((coin.volume / coin.marketCap) * 100).toFixed(1) : 0}%
                            </p>
                        </motion.div>

                        <motion.div 
                            className="p-4 bg-gray-800 rounded-xl border border-gray-700"
                            whileHover={{ scale: 1.02 }}
                        >
                            <p className="text-xs text-gray-500 mb-1">24h Range</p>
                            <p className="text-base md:text-lg font-semibold text-green-400 break-all">{formatPrice(coin.high24h)}</p>
                            <p className="text-xs text-gray-500 mb-1">Low</p>
                            <p className="text-base md:text-lg font-semibold text-red-400 break-all">{formatPrice(coin.low24h)}</p>
                        </motion.div>

                        <motion.div 
                            className="p-4 bg-gray-800 rounded-xl border border-gray-700"
                            whileHover={{ scale: 1.02 }}
                        >
                            <p className="text-xs text-gray-500 mb-1">Sentiment</p>
                            <div className="flex items-center gap-2">
                                <p className="text-2xl md:text-3xl font-bold">{coin.sentiment}</p>
                                <div>
                                    <p className="text-xl md:text-2xl">{coin.emoji}</p>
                                    <p className="text-xs text-gray-400">{coin.level}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {coin.chart && coin.chart.priceHistory && coin.chart.priceHistory.length > 1 && (
                        <div className="mb-8 p-4 md:p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg md:text-xl font-bold">7-Day Price Movement</h3>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Volatility</p>
                                    <p className="text-base md:text-lg font-bold">{coin.chart.volatility}%</p>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={coin.chart.priceHistory}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis 
                                        dataKey="time" 
                                        stroke="#6b7280" 
                                        fontSize={12}
                                        tickFormatter={(value, index) => index % 24 === 0 ? value.split(',')[0] : ''}
                                    />
                                    <YAxis 
                                        stroke="#6b7280" 
                                        fontSize={12}
                                        domain={['auto', 'auto']}
                                        tickFormatter={(value) => formatPrice(value)}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#1f2937', 
                                            border: '1px solid #374151',
                                            borderRadius: '8px'
                                        }}
                                        labelStyle={{ color: '#9ca3af' }}
                                        formatter={(value) => [formatPrice(value), 'Price']}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="price" 
                                        stroke="#10b981" 
                                        strokeWidth={2}
                                        fill="url(#colorPrice)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                            <div className="grid grid-cols-3 gap-3 mt-4">
                                <div className="text-center p-2 bg-gray-800/50 rounded">
                                    <p className="text-xs text-gray-500">7D High</p>
                                    <p className="font-semibold text-green-400 text-sm break-all">{formatPrice(coin.chart.high7d)}</p>
                                </div>
                                <div className="text-center p-2 bg-gray-800/50 rounded">
                                    <p className="text-xs text-gray-500">7D Average</p>
                                    <p className="font-semibold text-sm break-all">{formatPrice(coin.chart.avg7d)}</p>
                                </div>
                                <div className="text-center p-2 bg-gray-800/50 rounded">
                                    <p className="text-xs text-gray-500">7D Low</p>
                                    <p className="font-semibold text-red-400 text-sm break-all">{formatPrice(coin.chart.low7d)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {coin.liveAnalysis && coin.liveAnalysis.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl md:text-2xl font-bold mb-4">🤖 AI Live Analysis</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {coin.liveAnalysis.map((analysis, idx) => (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`p-4 rounded-xl border ${
                                            analysis.type === 'momentum' && analysis.icon === '🚀' ? 'bg-green-900/15 border-green-500/30' :
                                            analysis.type === 'momentum' && analysis.icon === '🔻' ? 'bg-red-900/15 border-red-500/30' :
                                            analysis.type === 'volatility' && analysis.icon === '⚡' ? 'bg-orange-900/15 border-orange-500/30' :
                                            'bg-blue-900/15 border-blue-500/30'
                                        }`}
                                    >
                                        <p className="font-semibold mb-1 flex items-center gap-2">
                                            <span className="text-xl">{analysis.icon}</span>
                                            {analysis.title}
                                        </p>
                                        <p className="text-sm text-gray-300">{analysis.text}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {coin.risk && (
                        <div className={`p-4 md:p-6 rounded-xl border-2 mb-8 ${
                            coin.risk.color === 'green' ? 'bg-green-900/20 border-green-500/50' :
                            coin.risk.color === 'yellow' ? 'bg-yellow-900/20 border-yellow-500/50' :
                            coin.risk.color === 'orange' ? 'bg-orange-900/20 border-orange-500/50' :
                            'bg-red-900/20 border-red-500/50'
                        }`}>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl md:text-3xl">{coin.risk.emoji}</span>
                                <div className="flex-1">
                                    <p className="font-semibold text-base md:text-lg mb-1">Risk Score: {coin.risk.score}/100</p>
                                    <p className="text-xl md:text-2xl font-bold mb-2">{coin.risk.level}</p>
                                    <p className="text-sm text-gray-300 mb-3">{coin.risk.description}</p>
                                    <p className="text-sm font-medium text-gray-200">{coin.risk.recommendation}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {coin.commentary && (
                        <div className="p-4 md:p-6 bg-gradient-to-br from-green-900/20 to-gray-900 rounded-xl border border-green-500/30 mb-8">
                            <p className="font-semibold text-green-400 mb-2">💬 AI Commentary</p>
                            <p className="text-sm md:text-base text-gray-300">{coin.commentary}</p>
                        </div>
                    )}

                    <p className="text-xs text-center text-gray-600 mt-8">
                        🔴 LIVE • Auto-refresh every 5 seconds • Last: {new Date(coin.timestamp).toLocaleTimeString()}
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
