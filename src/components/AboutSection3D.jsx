'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AboutSection3D() {
    const [showFormula, setShowFormula] = useState(false);

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' }
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-20 space-y-12">
            {/* What is Pepeline */}
            <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                className="relative overflow-hidden rounded-2xl p-8 backdrop-blur-md bg-white/5 border border-white/10"
            >
                <motion.div
                    className="absolute inset-0 opacity-20"
                    style={{
                        background: 'radial-gradient(circle at 20% 50%, #10b981 0%, transparent 50%)'
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
                
                <h2 className="text-3xl font-bold mb-4 relative z-10">🐸 What is Pepeline?</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-4 relative z-10">
                    Pepeline is a <span className="text-green-400 font-semibold">real-time crypto sentiment engine</span> that 
                    cuts through the noise. No BS, no moon promises — just data-driven insights into market chaos.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed relative z-10">
                    We track sentiment, volatility, FOMO, and meme intensity to give you a single number: 
                    <span className="text-blue-400 font-semibold"> the Pepeline Index</span> (0-100).
                </p>
            </motion.div>

            {/* How It Works */}
            <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                className="relative overflow-hidden rounded-2xl p-8 backdrop-blur-md bg-white/5 border border-white/10"
            >
                <h2 className="text-3xl font-bold mb-6">⚙️ How It Works</h2>
                
                <div className="space-y-6">
                    {[
                        { emoji: '😎', title: 'Sentiment (40%)', desc: 'Fear & Greed Index + Twitter vibes. Are people bullish or rekt?', color: '#10b981' },
                        { emoji: '📊', title: 'Volatility (30%)', desc: 'BTC + ETH price swings in 24h. Higher = more chaos.', color: '#3b82f6' },
                        { emoji: '🚀', title: 'FOMO (20%)', desc: 'Google searches, trading volume, new wallets. Is retail FOMO-ing in?', color: '#f59e0b' },
                        { emoji: '🎪', title: 'Meme Intensity (10%)', desc: 'DOGE, PEPE, SHIB activity. Peak degeneracy indicator.', color: '#f97316' }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ x: 10 }}
                            className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <motion.div
                                className="text-4xl"
                                whileHover={{ scale: 1.2, rotate: 10 }}
                            >
                                {item.emoji}
                            </motion.div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2" style={{ color: item.color }}>
                                    {item.title}
                                </h3>
                                <p className="text-gray-300">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Formula Toggle */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                    <motion.button
                        onClick={() => setShowFormula(!showFormula)}
                        className="text-gray-400 hover:text-white transition flex items-center gap-2"
                        whileHover={{ x: 5 }}
                    >
                        <motion.span
                            animate={{ rotate: showFormula ? 90 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            ►
                        </motion.span>
                        <span className="underline">Show the formula</span>
                    </motion.button>
                    
                    <AnimatePresence>
                        {showFormula && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-4 bg-gray-900 p-4 rounded font-mono text-sm text-green-400">
                                    <p>Pepeline Index = (S × 0.4) + (V × 0.3) + (F × 0.2) + (M × 0.1)</p>
                                    <p className="text-gray-500 mt-2">Where S, V, F, M are normalized 0-100 scores</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Reading the Index */}
            <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                className="relative overflow-hidden rounded-2xl p-8 backdrop-blur-md bg-white/5 border border-white/10"
            >
                <h2 className="text-3xl font-bold mb-6">📖 Reading the Index</h2>
                
                <div className="space-y-4">
                    {[
                        { emoji: '🟢', range: '0-20: Calm', desc: 'Market bottom? Everyone\'s depressed.' },
                        { emoji: '🔵', range: '21-40: Neutral', desc: 'Healthy vibes. Business as usual.' },
                        { emoji: '🟡', range: '41-60: Active', desc: 'Things heating up. Pay attention.' },
                        { emoji: '🟠', range: '61-80: Hyped', desc: 'FOMO zone. Be careful.' },
                        { emoji: '🔴', range: '81-100: Peak Degen', desc: 'Everyone\'s a genius. Top signal?' }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <motion.span
                                className="text-3xl"
                                whileHover={{ scale: 1.3, rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                {item.emoji}
                            </motion.span>
                            <div className="flex-1">
                                <span className="font-semibold">{item.range}</span>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
