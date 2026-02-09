'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BacktestingDashboard() {
    const [results, setResults] = useState(null);
    const [comparison, setComparison] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('180');

    useEffect(() => {
        fetchBacktest();
    }, [period]);

    const fetchBacktest = async () => {
        setLoading(true);
        try {
            const [singleRes, compareRes] = await Promise.all([
                fetch(`/api/backtest?days=${period}&strategy=contrarian`),
                fetch(`/api/backtest?days=${period}&compare=true`)
            ]);
            
            const single = await singleRes.json();
            const compare = await compareRes.json();
            
            setResults(single);
            setComparison(compare);
        } catch (error) {
            console.error('Backtest fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 animate-pulse">
                <div className="h-96 bg-gray-700 rounded"></div>
            </div>
        );
    }

    if (!results) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">📈 Backtesting Results</h2>
                
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                >
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="180">Last 180 days</option>
                    <option value="365">Last year</option>
                </select>
            </div>

            {/* Performance Cards */}
            <div className="grid md:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-gradient-to-br from-green-900/30 to-gray-800 rounded-xl border border-green-500/30"
                >
                    <p className="text-sm text-gray-400 mb-1">Total Return</p>
                    <p className={`text-3xl font-bold ${
                        results.performance.totalReturn > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                        {results.performance.totalReturn > 0 ? '+' : ''}
                        {results.performance.totalReturn}%
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 bg-gray-800 rounded-xl border border-gray-700"
                >
                    <p className="text-sm text-gray-400 mb-1">Win Rate</p>
                    <p className="text-3xl font-bold text-blue-400">
                        {results.performance.winRate}%
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 bg-gray-800 rounded-xl border border-gray-700"
                >
                    <p className="text-sm text-gray-400 mb-1">Total Trades</p>
                    <p className="text-3xl font-bold text-purple-400">
                        {results.performance.totalTrades}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 bg-gray-800 rounded-xl border border-gray-700"
                >
                    <p className="text-sm text-gray-400 mb-1">Max Drawdown</p>
                    <p className="text-3xl font-bold text-red-400">
                        -{results.performance.maxDrawdown}%
                    </p>
                </motion.div>
            </div>

            {/* Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 bg-gray-800 rounded-xl border border-gray-700"
            >
                <h3 className="text-xl font-bold mb-4">Index History & Signals</h3>
                
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={results.historicalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                            dataKey="date" 
                            stroke="#9CA3AF"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#1F2937', 
                                border: '1px solid #374151',
                                borderRadius: '8px'
                            }}
                        />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="index" 
                            stroke="#10B981" 
                            strokeWidth={2}
                            dot={false}
                            name="Pepeline Index"
                        />
                    </LineChart>
                </ResponsiveContainer>

                <div className="mt-4 flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-gray-400">Buy Signals: {results.signals.filter(s => s.type === 'BUY').length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-400">Sell Signals: {results.signals.filter(s => s.type === 'SELL').length}</span>
                    </div>
                </div>
            </motion.div>

            {/* Strategy Comparison */}
            {comparison && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-6 bg-gray-800 rounded-xl border border-gray-700"
                >
                    <h3 className="text-xl font-bold mb-4">Strategy Comparison</h3>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-900 rounded-lg">
                            <p className="text-sm text-gray-400 mb-2">Contrarian Strategy</p>
                            <p className={`text-2xl font-bold ${
                                comparison.contrarian.totalReturn > 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                                {comparison.contrarian.totalReturn > 0 ? '+' : ''}
                                {comparison.contrarian.totalReturn}%
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Win Rate: {comparison.contrarian.winRate}%
                            </p>
                        </div>

                        <div className="p-4 bg-gray-900 rounded-lg">
                            <p className="text-sm text-gray-400 mb-2">Momentum Strategy</p>
                            <p className={`text-2xl font-bold ${
                                comparison.momentum.totalReturn > 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                                {comparison.momentum.totalReturn > 0 ? '+' : ''}
                                {comparison.momentum.totalReturn}%
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Win Rate: {comparison.momentum.winRate}%
                            </p>
                        </div>

                        <div className="p-4 bg-gray-900 rounded-lg">
                            <p className="text-sm text-gray-400 mb-2">Buy & Hold</p>
                            <p className={`text-2xl font-bold ${
                                comparison.buyAndHold.totalReturn > 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                                {comparison.buyAndHold.totalReturn > 0 ? '+' : ''}
                                {comparison.buyAndHold.totalReturn}%
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Benchmark
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                        <p className="text-sm text-blue-400">
                            🏆 Best Strategy: <span className="font-bold">{comparison.winner}</span>
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Disclaimer */}
            <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <p className="text-xs text-yellow-400">
                    ⚠️ <strong>Disclaimer:</strong> Past performance does not guarantee future results. 
                    This backtesting uses simulated data and should not be considered financial advice.
                </p>
            </div>
        </div>
    );
}
