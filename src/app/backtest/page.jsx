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

    useEffect(() => { fetchBacktest(); }, [coin, days]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            <div className="container mx-auto px-3 sm:px-4 py-6 md:py-12 max-w-7xl">

                {/* Hero */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 md:mb-12">
                    <div className="text-4xl md:text-6xl mb-3 md:mb-4">📊</div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 md:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                        Pepeline Backtest
                    </h1>
                    <p className="text-sm md:text-xl text-gray-300 px-4">
                        How accurate is our sentiment prediction?
                    </p>
                </motion.div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-4 justify-center mb-6 md:mb-10 px-4">
                    <select value={coin} onChange={(e) => setCoin(e.target.value)}
                        className="w-full sm:w-auto px-3 md:px-4 py-2 md:py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-500">
                        {coins.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select value={days} onChange={(e) => setDays(parseInt(e.target.value))}
                        className="w-full sm:w-auto px-3 md:px-4 py-2 md:py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value={7}>7 days</option>
                        <option value={30}>30 days</option>
                        <option value={90}>90 days</option>
                    </select>
                    <button onClick={fetchBacktest}
                        className="w-full sm:w-auto px-5 md:px-6 py-2 md:py-2.5 bg-green-600 hover:bg-green-500 rounded-xl font-semibold text-sm md:text-base transition-all active:scale-95">
                        Run Backtest
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-16 md:py-20">
                        <div className="inline-block animate-spin rounded-full h-10 md:h-12 w-10 md:w-12 border-4 border-green-500 border-t-transparent" />
                        <p className="mt-4 text-gray-400 text-sm md:text-base">Analyzing historical data...</p>
                    </div>
                ) : data?.error ? (
                    <div className="text-center py-16 md:py-20">
                        <p className="text-red-400 text-base md:text-xl">❌ {data.error}</p>
                    </div>
                ) : data ? (
                    <>
                        {/* Metrics Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 mb-6 md:mb-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="p-3 md:p-6 bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30 rounded-2xl">
                                <p className="text-[10px] md:text-sm text-gray-400 mb-1">Win Rate</p>
                                <p className="text-2xl md:text-4xl font-bold text-green-400">{data.metrics.winRate}%</p>
                                <p className="text-[10px] md:text-xs text-gray-500 mt-1">{data.metrics.correctCalls}/{data.metrics.totalSignals} correct</p>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="p-3 md:p-6 bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-2xl">
                                <p className="text-[10px] md:text-sm text-gray-400 mb-1">Correlation</p>
                                <p className="text-2xl md:text-4xl font-bold text-blue-400">{data.metrics.correlationPct}%</p>
                                <p className="text-[10px] md:text-xs text-gray-500 mt-1">r = {data.metrics.correlation}</p>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                className="p-3 md:p-6 bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-2xl">
                                <p className="text-[10px] md:text-sm text-gray-400 mb-1">Correct Calls</p>
                                <p className="text-2xl md:text-4xl font-bold text-purple-400">{data.metrics.correctCalls}</p>
                                <p className="text-[10px] md:text-xs text-gray-500 mt-1">vs {data.metrics.wrongCalls} wrong</p>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                className="p-3 md:p-6 bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border border-yellow-500/30 rounded-2xl">
                                <p className="text-[10px] md:text-sm text-gray-400 mb-1">Period</p>
                                <p className="text-2xl md:text-4xl font-bold text-yellow-400">{days}</p>
                                <p className="text-[10px] md:text-xs text-gray-500 mt-1">days analyzed</p>
                            </motion.div>
                        </div>

                        {/* Summary */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                            className="p-4 md:p-6 bg-gray-800/50 border border-gray-700 rounded-2xl mb-6 md:mb-10 text-center">
                            <p className="text-sm md:text-xl font-semibold text-gray-200">{data.summary}</p>
                            <p className="text-xs md:text-sm text-gray-400 mt-2">
                                Based on {data.coin} price movements over the last {data.period}
                            </p>
                        </motion.div>

                        {/* Chart */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                            className="p-4 md:p-6 bg-gray-800 border border-gray-700 rounded-2xl mb-6 md:mb-10">
                            <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">Index vs Price Movement</h2>
                            <ResponsiveContainer width="100%" height={250} className="md:!h-[400px]">
                                <LineChart data={data.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 10 }}
                                        tickFormatter={(v) => v.slice(5)} />
                                    <YAxis yAxisId="left" stroke="#10B981" tick={{ fontSize: 10 }} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" tick={{ fontSize: 10 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }}
                                        labelStyle={{ color: '#D1D5DB' }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    <Line yAxisId="left" type="monotone" dataKey="index" stroke="#10B981" strokeWidth={2} name="Pepeline Index" dot={false} />
                                    <Line yAxisId="right" type="monotone" dataKey="change" stroke="#3B82F6" strokeWidth={2} name="Price Change %" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </motion.div>

                        {/* Methodology */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                            className="p-4 md:p-6 bg-gray-800/30 border border-gray-700/50 rounded-2xl">
                            <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3">📖 How it works</h3>
                            <div className="space-y-1.5 md:space-y-2 text-gray-300 text-xs md:text-sm">
                                <p>• <strong>Directional Accuracy:</strong> % of times index correctly predicted price direction</p>
                                <p>• <strong>Correlation:</strong> Statistical measure of how index and price move together</p>
                                <p>• <strong>Win Rate:</strong> Success rate in predicting next-day price movements</p>
                                <p>• Index &lt;50 = Bearish | Index &gt;50 = Bullish</p>
                            </div>
                        </motion.div>
                    </>
                ) : null}
            </div>
            <Footer />
        </main>
    );
}
