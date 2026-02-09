'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SmartMoneyDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/smart-money');
            const result = await res.json();
            setData(result);
        } catch (error) {
            console.error('Smart money fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 animate-pulse">
                <div className="h-40 bg-gray-700 rounded"></div>
            </div>
        );
    }

    if (!data || data.error) {
        return (
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                <p className="text-gray-400">Smart money data unavailable</p>
            </div>
        );
    }

    const { smartMoney, dexActivity } = data;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">💎 Smart Money Tracking</h2>

            {/* Smart Money Score */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gradient-to-br from-purple-900/30 to-gray-800 rounded-xl border border-purple-500/30"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Whale Sentiment</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        smartMoney.signal === 'ACCUMULATION' 
                            ? 'bg-green-500/20 text-green-400'
                            : smartMoney.signal === 'DISTRIBUTION'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-gray-500/20 text-gray-400'
                    }`}>
                        {smartMoney.signal}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Smart Money Score</p>
                        <p className="text-4xl font-bold">{smartMoney.emoji} {smartMoney.score}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Active Wallets</p>
                        <p className="text-4xl font-bold">{smartMoney.activeWallets}/{smartMoney.totalWallets}</p>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Buy Pressure:</span>
                        <span className="text-green-400 font-semibold">{smartMoney.totalBuys} txs</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-400">Sell Pressure:</span>
                        <span className="text-red-400 font-semibold">{smartMoney.totalSells} txs</span>
                    </div>
                </div>
            </motion.div>

            {/* DEX Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 bg-gray-800 rounded-xl border border-gray-700"
            >
                <h3 className="text-xl font-bold mb-4">🔄 DEX Activity</h3>

                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Total Liquidity</p>
                        <p className="text-2xl font-bold">${(dexActivity.totalLiquidity / 1e6).toFixed(2)}M</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm mb-1">24h Volume</p>
                        <p className="text-2xl font-bold">${(dexActivity.totalVolume24h / 1e6).toFixed(2)}M</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Exchanges</p>
                        <p className="text-2xl font-bold">{dexActivity.exchanges.length}</p>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="flex gap-2">
                        <div className={`flex-1 h-2 rounded ${
                            dexActivity.liquidityScore > 60 ? 'bg-green-500' : 
                            dexActivity.liquidityScore > 30 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} style={{ width: `${dexActivity.liquidityScore}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Liquidity Health Score</p>
                </div>
            </motion.div>

            {/* Active Smart Wallets */}
            {smartMoney.wallets && smartMoney.wallets.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 bg-gray-800 rounded-xl border border-gray-700"
                >
                    <h3 className="text-xl font-bold mb-4">🐋 Active Whales (24h)</h3>

                    <div className="space-y-3">
                        {smartMoney.wallets.slice(0, 5).map((wallet, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-mono text-sm">
                                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {wallet.recentTxCount} transactions
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                        wallet.sentiment === 'BULLISH' 
                                            ? 'bg-green-500/20 text-green-400'
                                            : wallet.sentiment === 'BEARISH'
                                            ? 'bg-red-500/20 text-red-400'
                                            : 'bg-gray-500/20 text-gray-400'
                                    }`}>
                                        {wallet.sentiment}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Net: {wallet.netFlow > 0 ? '+' : ''}{wallet.netFlow}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Last Update */}
            <p className="text-xs text-gray-500 text-center">
                Last updated: {new Date(data.timestamp).toLocaleTimeString()}
            </p>
        </div>
    );
}
