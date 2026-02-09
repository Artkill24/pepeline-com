'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default function AdminDashboard() {
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchMetrics = async () => {
        try {
            const res = await fetch('/api/advanced-metrics');
            const data = await res.json();
            setMetrics(data);
        } catch (error) {
            console.error('Metrics fetch failed:', error);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">🔐 Admin Control Center</h1>
                            <p className="text-gray-400">Internal analytics & system controls</p>
                        </div>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            ← Back to Home
                        </button>
                    </div>

                    {/* Quick Metrics */}
                    {metrics && (
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            <div className="p-6 bg-gradient-to-br from-purple-900/30 to-gray-800 rounded-xl border border-purple-500/30">
                                <p className="text-sm text-gray-400 mb-1">Alpha Score</p>
                                <p className="text-5xl font-bold mb-2">{metrics.alphaScore}</p>
                                <p className="text-lg text-purple-400">{metrics.signal}</p>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-blue-900/30 to-gray-800 rounded-xl border border-blue-500/30">
                                <p className="text-sm text-gray-400 mb-1">On-Chain</p>
                                <p className="text-3xl font-bold mb-2">{metrics.onchain.emoji} {metrics.onchain.score}</p>
                                <p className="text-lg text-blue-400">{metrics.onchain.signal}</p>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-green-900/30 to-gray-800 rounded-xl border border-green-500/30">
                                <p className="text-sm text-gray-400 mb-1">Macro</p>
                                <p className="text-3xl font-bold mb-2">{metrics.macro.emoji} {metrics.macro.score}</p>
                                <p className="text-lg text-green-400">{metrics.macro.signal}</p>
                            </div>
                        </div>
                    )}

                    {/* Analytics Dashboard */}
                    <AnalyticsDashboard />

                    {/* Quick Actions */}
                    <div className="mt-12 p-6 bg-gray-800 rounded-xl border border-gray-700">
                        <h3 className="text-xl font-bold mb-4">⚡ Quick Actions</h3>
                        <div className="grid md:grid-cols-4 gap-4">
                            <button 
                                onClick={async () => {
                                    const res = await fetch('/api/post-tweet', {
                                        method: 'POST',
                                        headers: {'Content-Type': 'application/json'},
                                        body: JSON.stringify({
                                            type: 'sentiment',
                                            data: {
                                                index: metrics?.alphaScore || 50,
                                                emoji: '🐸',
                                                level: metrics?.signal || 'NEUTRAL',
                                                change: 0
                                            }
                                        })
                                    });
                                    const data = await res.json();
                                    alert(data.success ? '✅ Tweet posted!' : '❌ Error: ' + data.error);
                                }}
                                className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                            >
                                🐦 Post Tweet
                            </button>
                            <button 
                                onClick={() => window.location.reload()}
                                className="p-4 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
                            >
                                🔄 Refresh
                            </button>
                            <button 
                                onClick={() => window.open('/api/analytics', '_blank')}
                                className="p-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
                            >
                                📊 Export Analytics
                            </button>
                            <button 
                                onClick={() => window.open('/api/advanced-metrics', '_blank')}
                                className="p-4 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold transition-colors"
                            >
                                🔬 API Debug
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

// Add import at top
import BacktestingDashboard from '@/components/BacktestingDashboard';

// Add section before Quick Actions:
                    {/* Backtesting Section */}
                    <div className="mt-12">
                        <BacktestingDashboard />
                    </div>
