'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function WarRoomPage() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAll();
        const interval = setInterval(fetchAll, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchAll = async () => {
        try {
            const [aiPred, solana, base, social] = await Promise.all([
                fetch('/api/ai-predictor').then(r => r.json()),
                fetch('/api/solana-metrics').then(r => r.json()),
                fetch('/api/base-metrics').then(r => r.json()),
                fetch('/api/social-signals').then(r => r.json())
            ]);
            
            setData({ aiPred, solana, base, social });
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
                    <div className="text-6xl mb-4">⚔️</div>
                    <h1 className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-500">
                        War Room
                    </h1>
                    <p className="text-xl text-gray-300">
                        Multi-Chain Intelligence • AI Predictions • Social Signals
                    </p>
                </motion.div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent inline-block" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* AI Predictor */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                            className="p-6 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl border border-purple-500/30">
                            <h3 className="text-2xl font-bold mb-4">🤖 AI Predictor</h3>
                            {data.aiPred?.prediction && (
                                <>
                                    <p className="text-4xl font-bold mb-2">{data.aiPred.prediction.signal}</p>
                                    <p className="text-sm text-gray-300 mb-2">{data.aiPred.prediction.reasoning}</p>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-purple-900/50 rounded text-xs">{data.aiPred.prediction.type}</span>
                                        <span className="px-2 py-1 bg-purple-900/50 rounded text-xs">{data.aiPred.prediction.confidence}%</span>
                                    </div>
                                </>
                            )}
                        </motion.div>

                        {/* Solana */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="p-6 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-2xl border border-blue-500/30">
                            <h3 className="text-2xl font-bold mb-4">🟣 Solana</h3>
                            <p className="text-4xl font-bold mb-2">{data.solana?.heat || 'LOW'}</p>
                            <p className="text-sm text-gray-300 mb-2">Network Heat</p>
                            <p className="text-2xl font-bold">{data.solana?.smartMoney?.signal || 'NEUTRAL'}</p>
                            <p className="text-xs text-gray-400">Smart Money</p>
                        </motion.div>

                        {/* Base */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="p-6 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-2xl border border-green-500/30">
                            <h3 className="text-2xl font-bold mb-4">🔵 Base</h3>
                            <p className="text-4xl font-bold mb-2">{data.base?.heat || 'LOW'}</p>
                            <p className="text-sm text-gray-300 mb-2">Activity</p>
                            <p className="text-lg">Tx/block: {data.base?.txCount || '—'}</p>
                            <p className="text-sm text-gray-400">{data.base?.signal || 'NEUTRAL'}</p>
                        </motion.div>

                        {/* Social */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="p-6 bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-2xl border border-orange-500/30">
                            <h3 className="text-2xl font-bold mb-4">📱 Social</h3>
                            <p className="text-4xl font-bold mb-2">{data.social?.phase || 'MIXED'}</p>
                            <p className="text-sm text-gray-300">BTC Dom: {data.social?.btcDominance}%</p>
                            <p className="text-lg mt-2">{data.social?.signal || 'NEUTRAL'}</p>
                        </motion.div>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
