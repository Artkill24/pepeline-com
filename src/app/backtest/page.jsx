'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BacktestPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [coin, setCoin] = useState('bitcoin');
    const [days, setDays] = useState(30);

    const coins = [
        { id: 'bitcoin', name: 'Bitcoin' },
        { id: 'ethereum', name: 'Ethereum' },
        { id: 'solana', name: 'Solana' },
        { id: 'cardano', name: 'Cardano' },
    ];

    const fetchBacktest = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/backtest?coin=${coin}&days=${days}`);
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBacktest();
    }, [coin, days]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />

            <div className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Hero */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="text-6xl mb-4">📊</div>
                    <h1 className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                        Pepeline Index Backtest
                    </h1>
                    <p className="text-xl text-gray-300">
                        How accurate is our sentiment prediction? Let's find out.
                    </p>
                </motion.div>

                {/* Controls */}
                <div className="flex flex-wrap gap-4 justify-center mb-10">
                    <select value={coin} onChange={(e) => setCoin(e.target.value)}
                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                        {coins.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select value={days} onChange={(e) => setDays(parseInt(e.target.value))}
                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value={7}>7 days</option>
                        <option value={30}>30 days</option>
                        <option value={90}>90 days</option>
                    </select>
                    <button onClick={fetchBacktest}
                        className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-xl font-semibold transition-all">
                        Run Backtest
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
                        <p className="mt-4 text-gray-400">Analyzing historical data...</p>
                    </div>
                ) : data?.error ? (
                    <div className="text-center py-20">
                        <p className="text-red-400 text-xl">❌ {data.error}</p>
                    </div>
                ) : data ? (
                    <>
                        {/* Metrics Cards */}
                        <div className="grid md:grid-cols-4 gap-6 mb-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="p-6 bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30 rounded-2xl">
                                <p className="text-sm text-gray-400 mb-1">Win Rate</p>
                                <p className="text-4xl font-bold text-green-400">{data.metrics.winRate}%</p>
                                <p className="text-xs text-gray-500 mt-1">{data.metrics.correctCalls}/{data.metrics.totalSignals} correct</p>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="p-6 bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-2xl">
                                <p className="text-sm text-gray-400 mb-1">Correlation</p>
                                <p className="text-4xl font-bold text-blue-400">{data.metrics.correlationPct}%</p>
                                <p className="text-xs text-gray-500 mt-1">r = {data.metrics.correlation}</p>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                className="p-6 bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-2xl">
                                <p className="text-sm text-gray-400 mb-1">Correct Calls</p>
                                <p className="text-4xl font-bold text-purple-400">{data.metrics.correctCalls}</p>
                                <p className="text-xs text-gray-500 mt-1">vs {data.metrics.wrongCalls} wrong</p>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                className="p-6 bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border border-yellow-500/30 rounded-2xl">
                                <p className="text-sm text-gray-400 mb-1">Period</p>
                                <p className="text-4xl font-bold text-yellow-400">{days}</p>
                                <p className="text-xs text-gray-500 mt-1">days analyzed</p>
                            </motion.div>
                        </div>

                        {/* Summary */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                            className="p-6 bg-gray-800/50 border border-gray-700 rounded-2xl mb-10 text-center">
                            <p className="text-xl font-semibold text-gray-200">
                                {data.summary}
                            </p>
                            <p className="text-sm text-gray-400 mt-2">
                                Based on {data.coin} price movements over the last {data.period}
                            </p>
                        </motion.div>

                        {/* Chart */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                            className="p-6 bg-gray-800 border border-gray-700 rounded-2xl">
                            <h2 className="text-2xl font-bold mb-6">Index vs Price Movement</h2>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={data.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="date" stroke="#9CA3AF" />
                                    <YAxis yAxisId="left" stroke="#10B981" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                                        labelStyle={{ color: '#D1D5DB' }}
                                    />
                                    <Legend />
                                    <Line yAxisId="left" type="monotone" dataKey="index" stroke="#10B981" strokeWidth={2} name="Pepeline Index" dot={false} />
                                    <Line yAxisId="right" type="monotone" dataKey="change" stroke="#3B82F6" strokeWidth={2} name="Price Change %" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </motion.div>

                        {/* Methodology */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                            className="mt-10 p-6 bg-gray-800/30 border border-gray-700/50 rounded-2xl">
                            <h3 className="text-xl font-bold mb-3">📖 How it works</h3>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li>• <strong>Directional Accuracy:</strong> Percentage of times the index correctly predicted price direction</li>
                                <li>• <strong>Correlation:</strong> Statistical measure of how index and price move together (0-100%)</li>
                                <li>• <strong>Win Rate:</strong> Success rate in predicting next-day price movements</li>
                                <li>• Index &lt;50 = Bearish signal (predict price down) | Index &gt;50 = Bullish signal (predict price up)</li>
                            </ul>
                        </motion.div>
                    </>
                ) : null}
            </div>

            <Footer />
        </main>
    );
}
