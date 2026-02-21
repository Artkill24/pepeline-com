'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CoinsPage() {
    const [coins, setCoins] = useState([]);
    const [filteredCoins, setFilteredCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('market_cap');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filter, setFilter] = useState('all'); // all, gainers, losers, trending
    const [viewMode, setViewMode] = useState('grid'); // grid, table

    useEffect(() => {
        fetchCoins();
    }, []);

    useEffect(() => {
        filterAndSort();
    }, [coins, search, sortBy, sortOrder, filter]);

    const fetchCoins = async () => {
        try {
            const res = await fetch('/api/all-coins');
            const data = await res.json();
            setCoins(data.coins || []);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const filterAndSort = () => {
        let filtered = [...coins];

        // Search filter
        if (search) {
            filtered = filtered.filter(coin => 
                coin.name.toLowerCase().includes(search.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Category filter
        if (filter === 'gainers') {
            filtered = filtered.filter(c => c.price_change_percentage_24h > 0);
        } else if (filter === 'losers') {
            filtered = filtered.filter(c => c.price_change_percentage_24h < 0);
        } else if (filter === 'trending') {
            filtered = filtered.filter(c => c.market_cap_rank <= 100);
        }

        // Sort
        filtered.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];
            
            if (sortBy === 'market_cap' || sortBy === 'total_volume' || sortBy === 'current_price') {
                aVal = parseFloat(aVal) || 0;
                bVal = parseFloat(bVal) || 0;
            }
            
            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            }
            return aVal < bVal ? 1 : -1;
        });

        setFilteredCoins(filtered);
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

    const MiniSparkline = ({ data }) => {
        if (!data || data.length === 0) return <div className="h-10 w-20 bg-gray-700 rounded" />;
        
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min;
        
        const points = data.map((price, i) => {
            const x = (i / (data.length - 1)) * 80;
            const y = 40 - ((price - min) / range) * 40;
            return `${x},${y}`;
        }).join(' ');

        const color = data[data.length - 1] > data[0] ? '#10b981' : '#ef4444';

        return (
            <svg width="80" height="40" className="inline-block">
                <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                />
            </svg>
        );
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="text-6xl mb-4">💰</div>
                    <h1 className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                        Cryptocurrency Markets
                    </h1>
                    <p className="text-xl text-gray-300">
                        Top 250 coins by market cap • Real-time prices • 7-day charts
                    </p>
                </motion.div>

                {/* Filters & Search */}
                <div className="mb-6 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search coins..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {/* View Mode */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-4 py-3 rounded-xl font-bold transition-all ${
                                    viewMode === 'grid' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                                }`}>
                                🔲 Grid
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-4 py-3 rounded-xl font-bold transition-all ${
                                    viewMode === 'table' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                                }`}>
                                📋 Table
                            </button>
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2">
                        {['all', 'gainers', 'losers', 'trending'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl font-bold transition-all capitalize ${
                                    filter === f ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
                                }`}>
                                {f === 'gainers' && '📈'} {f === 'losers' && '📉'} {f === 'trending' && '🔥'} {f}
                            </button>
                        ))}
                    </div>

                    {/* Sort Options */}
                    <div className="flex flex-wrap gap-2">
                        <span className="px-4 py-2 text-gray-400">Sort by:</span>
                        {[
                            { key: 'market_cap_rank', label: 'Rank' },
                            { key: 'market_cap', label: 'Market Cap' },
                            { key: 'total_volume', label: 'Volume' },
                            { key: 'current_price', label: 'Price' },
                            { key: 'price_change_percentage_24h', label: '24h %' }
                        ].map(sort => (
                            <button
                                key={sort.key}
                                onClick={() => {
                                    if (sortBy === sort.key) {
                                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                    } else {
                                        setSortBy(sort.key);
                                        setSortOrder('desc');
                                    }
                                }}
                                className={`px-3 py-2 rounded-lg transition-all text-sm ${
                                    sortBy === sort.key ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                                }`}>
                                {sort.label} {sortBy === sort.key && (sortOrder === 'asc' ? '↑' : '↓')}
                            </button>
                        ))}
                    </div>

                    <p className="text-sm text-gray-400">
                        Showing {filteredCoins.length} of {coins.length} coins
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent" />
                    </div>
                )}

                {/* Grid View */}
                {!loading && viewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredCoins.map((coin, i) => (
                            <motion.div
                                key={coin.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.02 }}
                            >
                                <Link href={`/coin/${coin.id}`}>
                                    <div className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 hover:border-gray-600 transition-all cursor-pointer">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Image src={coin.image} alt={coin.name} width={32} height={32} className="rounded-full" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold truncate">{coin.name}</p>
                                                <p className="text-xs text-gray-400">{coin.symbol}</p>
                                            </div>
                                            <span className="text-xs text-gray-500">#{coin.market_cap_rank}</span>
                                        </div>

                                        <div className="mb-2">
                                            <p className="text-2xl font-bold">{formatPrice(coin.current_price)}</p>
                                            <p className={`text-sm font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}% 24h
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                                            <span>MCap: {formatNumber(coin.market_cap)}</span>
                                            <span>Vol: {formatNumber(coin.total_volume)}</span>
                                        </div>

                                        <MiniSparkline data={coin.sparkline} />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Table View */}
                {!loading && viewMode === 'table' && (
                    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Coin</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">Price</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">1h</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">24h</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">7d</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">Market Cap</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">Volume</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Chart</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCoins.map((coin) => (
                                        <tr key={coin.id} className="border-t border-gray-700 hover:bg-gray-900/30">
                                            <td className="px-4 py-3 text-sm text-gray-400">{coin.market_cap_rank}</td>
                                            <td className="px-4 py-3">
                                                <Link href={`/coin/${coin.id}`} className="flex items-center gap-2 hover:text-blue-400">
                                                    <Image src={coin.image} alt={coin.name} width={24} height={24} className="rounded-full" />
                                                    <div>
                                                        <p className="font-bold">{coin.name}</p>
                                                        <p className="text-xs text-gray-400">{coin.symbol}</p>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold">{formatPrice(coin.current_price)}</td>
                                            <td className={`px-4 py-3 text-right font-bold ${coin.price_change_percentage_1h_in_currency >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {coin.price_change_percentage_1h_in_currency?.toFixed(2)}%
                                            </td>
                                            <td className={`px-4 py-3 text-right font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {coin.price_change_percentage_24h?.toFixed(2)}%
                                            </td>
                                            <td className={`px-4 py-3 text-right font-bold ${coin.price_change_percentage_7d_in_currency >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
                                            </td>
                                            <td className="px-4 py-3 text-right">{formatNumber(coin.market_cap)}</td>
                                            <td className="px-4 py-3 text-right">{formatNumber(coin.total_volume)}</td>
                                            <td className="px-4 py-3 text-center">
                                                <MiniSparkline data={coin.sparkline} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
