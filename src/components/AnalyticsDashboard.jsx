'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch('/api/analytics');
            const data = await res.json();
            setAnalytics(data.data);
        } catch (error) {
            console.error('Analytics fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 bg-gray-800 rounded-xl">
                <div className="animate-pulse">Loading analytics...</div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="p-8 bg-gray-800 rounded-xl">
                <p className="text-gray-400">No analytics data available</p>
            </div>
        );
    }

    const chartData = Object.entries(analytics.last7Days).map(([date, clicks]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        clicks
    }));

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">📊 Analytics Dashboard</h2>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-gradient-to-br from-blue-900/30 to-gray-800 rounded-xl border border-blue-500/30"
                >
                    <p className="text-sm text-gray-400 mb-1">Total Clicks</p>
                    <p className="text-4xl font-bold">{analytics.totalClicks}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 bg-gradient-to-br from-green-900/30 to-gray-800 rounded-xl border border-green-500/30"
                >
                    <p className="text-sm text-gray-400 mb-1">Conversion Rate</p>
                    <p className="text-4xl font-bold">{analytics.conversionRate}%</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 bg-gradient-to-br from-purple-900/30 to-gray-800 rounded-xl border border-purple-500/30"
                >
                    <p className="text-sm text-gray-400 mb-1">Traffic Sources</p>
                    <p className="text-4xl font-bold">{Object.keys(analytics.sources).length}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 bg-gradient-to-br from-orange-900/30 to-gray-800 rounded-xl border border-orange-500/30"
                >
                    <p className="text-sm text-gray-400 mb-1">Today</p>
                    <p className="text-4xl font-bold">
                        {analytics.dates[new Date().toISOString().split('T')[0]] || 0}
                    </p>
                </motion.div>
            </div>

            {/* 7 Day Chart */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 bg-gray-800 rounded-xl border border-gray-700"
            >
                <h3 className="text-xl font-bold mb-4">Last 7 Days</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                        <XAxis dataKey="date" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#1f2937', 
                                border: '1px solid #374151' 
                            }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="clicks" 
                            stroke="#10b981" 
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Top Sources */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 bg-gray-800 rounded-xl border border-gray-700"
            >
                <h3 className="text-xl font-bold mb-4">Top Traffic Sources</h3>
                <div className="space-y-3">
                    {analytics.topSources.map(([source, clicks], idx) => (
                        <div key={source} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '📊'}</span>
                                <span className="font-semibold capitalize">{source}</span>
                            </div>
                            <span className="text-green-400 font-bold">{clicks} clicks</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
