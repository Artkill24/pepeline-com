'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PaperTradingPage() {
    const [trades, setTrades] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrades();
    }, []);

    const fetchTrades = async () => {
        try {
            const res = await fetch('/api/paper-trading?userId=demo');
            const data = await res.json();
            setTrades(data.trades || []);
            setStats(data.stats);
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
                    <div className="text-6xl mb-4">📊</div>
                    <h1 className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500">
                        Paper Trading
                    </h1>
                    <p className="text-xl text-gray-300">Track AI signal performance without risking capital</p>
                </motion.div>

                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                            <p className="text-sm text-gray-400">Win Rate</p>
                            <p className="text-4xl font-bold text-green-400">{stats.winRate}%</p>
                        </div>
                        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                            <p className="text-sm text-gray-400">Total P&L</p>
                            <p className={`text-4xl font-bold ${parseFloat(stats.totalPnl) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                ${stats.totalPnl}
                            </p>
                        </div>
                        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                            <p className="text-sm text-gray-400">Open</p>
                            <p className="text-4xl font-bold text-blue-400">{stats.open}</p>
                        </div>
                        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                            <p className="text-sm text-gray-400">Closed</p>
                            <p className="text-4xl font-bold text-purple-400">{stats.closed}</p>
                        </div>
                    </div>
                )}

                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <h2 className="text-2xl font-bold mb-4">Trade History</h2>
                    {loading ? (
                        <div className="text-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto" />
                        </div>
                    ) : trades.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <p className="text-xl mb-2">No trades yet</p>
                            <p className="text-sm">Execute AI signals on the Trading page to start tracking</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Symbol</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Signal</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Entry</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Exit</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">P&L</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trades.map((trade) => (
                                        <tr key={trade.id} className="border-t border-gray-700">
                                            <td className="px-4 py-3 font-bold">{trade.symbol}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    trade.signal === 'BUY' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                                                }`}>{trade.signal}</span>
                                            </td>
                                            <td className="px-4 py-3">${trade.entry_price}</td>
                                            <td className="px-4 py-3">{trade.exit_price || '—'}</td>
                                            <td className="px-4 py-3">
                                                {trade.pnl_usd ? (
                                                    <span className={trade.pnl_usd >= 0 ? 'text-green-400' : 'text-red-400'}>
                                                        ${trade.pnl_usd.toFixed(2)}
                                                    </span>
                                                ) : '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    trade.status === 'open' ? 'bg-blue-900/50 text-blue-300' : 'bg-gray-700'
                                                }`}>{trade.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
