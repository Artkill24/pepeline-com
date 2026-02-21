'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PremiumDashboard() {
    const [whales, setWhales] = useState(null);
    const [gas, setGas] = useState(null);
    const [nfts, setNfts] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAll();
        const interval = setInterval(fetchAll, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchAll = async () => {
        try {
            const [whaleRes, gasRes, nftRes] = await Promise.all([
                fetch('/api/whale-tracker-premium'),
                fetch('/api/gas-oracle'),
                fetch('/api/nft-premium')
            ]);
            
            setWhales(await whaleRes.json());
            setGas(await gasRes.json());
            setNfts(await nftRes.json());
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="text-6xl mb-4">💎</div>
                    <h1 className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                        Premium Intelligence
                    </h1>
                    <p className="text-xl text-gray-300">Real-time Whale Tracking • Gas Oracle • NFT Floor Prices</p>
                </motion.div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent inline-block" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        
                        {/* Gas Oracle */}
                        {gas && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                                className="p-6 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-2xl border border-green-500/30">
                                <h2 className="text-2xl font-bold mb-4">⛽ Gas Oracle</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div className="p-4 bg-gray-900/50 rounded-xl">
                                        <p className="text-xs text-gray-400">Instant</p>
                                        <p className="text-2xl font-bold text-red-400">{gas.gas.instant} gwei</p>
                                    </div>
                                    <div className="p-4 bg-gray-900/50 rounded-xl">
                                        <p className="text-xs text-gray-400">Fast</p>
                                        <p className="text-2xl font-bold text-orange-400">{gas.gas.fast} gwei</p>
                                    </div>
                                    <div className="p-4 bg-gray-900/50 rounded-xl">
                                        <p className="text-xs text-gray-400">Standard</p>
                                        <p className="text-2xl font-bold text-yellow-400">{gas.gas.standard} gwei</p>
                                    </div>
                                    <div className="p-4 bg-gray-900/50 rounded-xl">
                                        <p className="text-xs text-gray-400">Slow</p>
                                        <p className="text-2xl font-bold text-green-400">{gas.gas.slow} gwei</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">Network Utilization</p>
                                        <p className="text-xl font-bold">{gas.utilization}%</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-3xl font-bold ${
                                            gas.recommendation === 'EXCELLENT' ? 'text-green-400' :
                                            gas.recommendation === 'GOOD' ? 'text-blue-400' :
                                            gas.recommendation === 'NORMAL' ? 'text-yellow-400' : 'text-red-400'
                                        }`}>{gas.recommendation}</p>
                                        <p className="text-sm text-gray-400">{gas.message}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Whale Tracker */}
                        {whales && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="p-6 bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-2xl border border-purple-500/30">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold">🐋 Whale Tracker</h2>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">24h Activity</p>
                                        <p className="text-3xl font-bold text-purple-400">{whales.stats.totalActivity24h}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {whales.wallets.map((whale, i) => (
                                        <div key={i} className="p-4 bg-gray-900/50 rounded-xl">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <p className="font-bold">{whale.label}</p>
                                                    <p className="text-xs text-gray-400">{whale.category}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    whale.signal === 'VERY_ACTIVE' ? 'bg-red-900/50 text-red-300' :
                                                    whale.signal === 'ACTIVE' ? 'bg-orange-900/50 text-orange-300' :
                                                    'bg-gray-700 text-gray-400'
                                                }`}>{whale.signal}</span>
                                            </div>
                                            <p className="text-2xl font-bold text-green-400 mb-1">{whale.ethBalance} ETH</p>
                                            <div className="flex justify-between text-xs text-gray-400">
                                                <span>{whale.tokenCount} tokens</span>
                                                <span>{whale.recentActivity.last24h} tx/24h</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {whales.alerts.length > 0 && (
                                    <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                                        <p className="font-bold mb-2">🚨 High Activity Alerts</p>
                                        {whales.alerts.map((alert, i) => (
                                            <p key={i} className="text-sm text-gray-300">{alert.message}</p>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* NFT Floor Prices */}
                        {nfts && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="p-6 bg-gradient-to-br from-pink-900/40 to-red-900/40 rounded-2xl border border-pink-500/30">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold">🖼️ NFT Floor Prices</h2>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">Avg Floor</p>
                                        <p className="text-2xl font-bold text-pink-400">{nfts.stats.avgFloor} ETH</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {nfts.collections.slice(0, 8).map((nft, i) => (
                                        <div key={i} className="p-4 bg-gray-900/50 rounded-xl">
                                            <p className="font-bold mb-1 truncate">{nft.name}</p>
                                            <p className="text-2xl font-bold text-pink-400">{nft.floorPrice} ETH</p>
                                            <p className="text-xs text-gray-400">${nft.floorUsd}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
