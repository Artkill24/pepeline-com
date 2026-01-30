'use client';

import { motion } from 'framer-motion';
import { generateCommentary, generateInsight } from '@/lib/ai-commentary';

export default function AICommentary({ indexData }) {
    if (!indexData) return null;

    const commentary = generateCommentary(indexData);
    const insight = generateInsight(indexData);

    return (
        <motion.div
            className="mt-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
        >
            {/* Main Commentary */}
            <motion.div
                className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-md bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20"
                whileHover={{ scale: 1.01 }}
            >
                {/* Animated background */}
                <motion.div
                    className="absolute inset-0 opacity-10"
                    style={{
                        background: 'radial-gradient(circle at 20% 50%, #a855f7 0%, transparent 50%)'
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />

                <div className="flex items-start gap-4 relative z-10">
                    <motion.div
                        className="text-4xl"
                        animate={{ 
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    >
                        🤖
                    </motion.div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm font-semibold text-purple-400">AI Analysis</p>
                            <motion.div
                                className="px-2 py-0.5 bg-purple-500/20 rounded text-xs text-purple-300"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                LIVE
                            </motion.div>
                        </div>
                        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
                            {commentary}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Quick Insight */}
            <motion.div
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                whileHover={{ x: 5 }}
            >
                <div className="text-2xl">💡</div>
                <p className="text-sm text-gray-300">{insight}</p>
            </motion.div>
        </motion.div>
    );
}
