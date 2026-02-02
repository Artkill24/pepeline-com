'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function TopCoinsSection() {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCoins();
    }, []);

    const fetchCoins = async () => {
        try {
            const response = await fetch('/api/top-coins');
            const data = await response.json();
            setCoins(data.coins || []);
        } catch (error) {
            console.error('Failed:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto mt-20">
                <h2 className="text-3xl font-bold text-center mb-8">
                    🔥 Top 10 Coin Sentiment
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="p-4 bg-gray-800/50 rounded-xl animate-pulse h-32" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto mt-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-8"
            >
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                    🔥 Top 10 Coin Sentiment
                </h2>
                <p className="text-gray-400">
                    Sentiment scores for top crypto assets
                </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {coins.map((coin, idx) => (
                    <motion.div
                        key={coin.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 cursor-pointer hover:border-green-500/50 transition-all"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                            <div className="flex-1">
                                <p className="font-bold text-sm">{coin.symbol}</p>
                                <p className="text-xs text-gray-500">{coin.name}</p>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-3xl font-bold mb-1">{coin.sentiment}</p>
                            <p className="text-xs flex items-center justify-center gap-1">
                                <span>{coin.emoji}</span>
                                <span className="text-gray-400">{coin.level}</span>
                            </p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-700">
                            <p className={`text-xs text-center ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {coin.change24h >= 0 ? '↗' : '↘'} {Math.abs(coin.change24h).toFixed(2)}%
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mt-8"
            >
                <p className="text-gray-500 text-sm">
                    💡 Full coin pages coming soon!
                </p>
            </motion.div>
        </div>
    );
}
