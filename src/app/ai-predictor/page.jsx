'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AIPredictorPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPrediction();
        const interval = setInterval(fetchPrediction, 120000);
        return () => clearInterval(interval);
    }, []);

    const fetchPrediction = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/ai-predictor');
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const pred = data?.prediction;
    const getColor = () => {
        if (!pred) return 'gray';
        if (pred.severity === 'critical') return 'red';
        if (pred.severity === 'high') return 'orange';
        if (pred.severity === 'medium') return 'yellow';
        return 'green';
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="text-6xl mb-4">🤖</div>
                    <h1 className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                        AI Market Predictor
                    </h1>
                    <p className="text-xl text-gray-300">
                        Anomaly Detection • Smart Money Analysis
                    </p>
                </motion.div>

                {loading && !data && (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent" />
                        <p className="mt-4 text-gray-400">Analyzing market data...</p>
                    </div>
                )}

                {pred && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        
                        <div className={`p-8 rounded-2xl border-2 ${
                            pred.anomaly 
                                ? `border-${getColor()}-500 bg-${getColor()}-900/20` 
                                : 'border-gray-700 bg-gray-800/50'
                        }`}>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-gray-400">Status</p>
                                    <p className="text-4xl font-bold">
                                        {pred.anomaly ? '⚠️ ANOMALY' : '✅ NORMAL'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400">Confidence</p>
                                    <p className="text-4xl font-bold text-purple-400">{pred.confidence}%</p>
                                </div>
                            </div>

                            {pred.anomaly && (
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="p-4 bg-gray-900/50 rounded-xl">
                                        <p className="text-xs text-gray-400">Type</p>
                                        <p className="text-xl font-bold uppercase">{pred.type.replace('_', ' ')}</p>
                                    </div>
                                    <div className="p-4 bg-gray-900/50 rounded-xl">
                                        <p className="text-xs text-gray-400">Severity</p>
                                        <p className="text-xl font-bold uppercase">{pred.severity}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl border border-purple-500/30">
                            <p className="text-sm text-gray-400 mb-2">AI Recommendation</p>
                            <p className="text-5xl font-bold mb-4">{pred.signal}</p>
                            <p className="text-gray-300">{pred.reasoning}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {data.marketData && Object.entries(data.marketData).map(([key, value]) => (
                                <div key={key} className="p-4 bg-gray-800 rounded-xl">
                                    <p className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                                    <p className="text-lg font-bold">{String(value)}</p>
                                </div>
                            ))}
                        </div>

                        <p className="text-xs text-center text-gray-500">
                            Updated: {new Date(data.timestamp).toLocaleTimeString()} • Refreshes 2min
                        </p>
                    </motion.div>
                )}
            </div>
            <Footer />
        </main>
    );
}
