'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SupraStatus() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkSupraStatus();
        const interval = setInterval(checkSupraStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const checkSupraStatus = async () => {
        try {
            const res = await fetch('/api/supra-status');
            const data = await res.json();
            setStatus(data);
        } catch (error) {
            console.error('Supra status check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 animate-pulse">
                <div className="h-20 bg-gray-700 rounded"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-br from-indigo-900/30 to-gray-800 rounded-xl border border-indigo-500/30"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    Supra Oracle
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    status?.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                    {status?.active ? 'ACTIVE' : 'OFFLINE'}
                </span>
            </div>

            {status?.active && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Price Feeds</span>
                        <span className="font-bold">{status.priceFeeds || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Latency</span>
                        <span className="font-bold text-green-400">{status.latency || 'N/A'}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Confidence</span>
                        <span className="font-bold text-blue-400">{status.confidence || 100}%</span>
                    </div>
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500">
                    Ultra-fast oracle data • Cross-chain verified
                </p>
            </div>
        </motion.div>
    );
}
