'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PricesPage() {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

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

    const filteredPrices = search
        ? prices.filter(p => 
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.symbol?.toLowerCase().includes(search.toLowerCase())
          )
        : prices;

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="text-6xl mb-4">💰</div>
                    <h1 className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-green-500">
                        Live Prices
                    </h1>
                    <p className="text-xl text-gray-300">Real-time cryptocurrency prices • Updated every 30s</p>
                </motion.div>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search coins..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent" />
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Coin</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">Price</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">24h</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">7d</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">Market Cap</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">Volume</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">24h Range</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPrices.map((coin, i) => (
                                        <tr key={i} className="border-t border-gray-700 hover:bg-gray-900/30">
                                            <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                                            <td className="px-4 py-3">
                                                <Link href={`/coin/${coin.id || coin.symbol.toLowerCase()}`} className="flex items-center gap-2 hover:text-blue-400">
                                                    {coin.image && (
                                                        <Image 
                                                            src={coin.image} 
                                                            alt={coin.name} 
                                                            width={24} 
                                                            height={24} 
                                                            className="rounded-full"
                                                            unoptimized
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-bold">{coin.name}</p>
                                                        <p className="text-xs text-gray-400">{coin.symbol}</p>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold">
                                                ${coin.price ? coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 }) : '0.00'}
                                            </td>
                                            <td className={`px-4 py-3 text-right font-bold ${(coin.change24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {(coin.change24h || 0) >= 0 ? '+' : ''}{(coin.change24h || 0).toFixed(2)}%
                                            </td>
                                            <td className={`px-4 py-3 text-right font-bold ${(coin.change7d || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {(coin.change7d || 0) >= 0 ? '+' : ''}{(coin.change7d || 0).toFixed(2)}%
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {coin.marketCap ? `$${(coin.marketCap / 1e9).toFixed(2)}B` : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {coin.volume24h ? `$${(coin.volume24h / 1e9).toFixed(2)}B` : '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-400">Low:</span>
                                                    <span className="text-sm">${coin.low24h ? coin.low24h.toFixed(2) : '—'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-400">High:</span>
                                                    <span className={`text-sm ${(coin.high24h || 0) < (coin.price || 0) ? 'text-green-400' : 'text-gray-300'}`}>
                                                        ${coin.high24h ? coin.high24h.toFixed(2) : '—'}
                                                    </span>
                                                </div>
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
