'use client';

import { motion } from 'framer-motion';

export default function TrendIndicator({ trend, historical }) {
    if (!trend) return null;

    const { change, percentage, direction } = trend;

    const getTrendColor = () => {
        if (direction === 'up') return 'text-green-400';
        if (direction === 'down') return 'text-red-400';
        return 'text-gray-400';
    };

    const getTrendIcon = () => {
        if (direction === 'up') return '↗️';
        if (direction === 'down') return '↘️';
        return '→';
    };

    const getTrendBg = () => {
        if (direction === 'up') return 'from-green-500/10 to-green-500/5';
        if (direction === 'down') return 'from-red-500/10 to-red-500/5';
        return 'from-gray-500/10 to-gray-500/5';
    };

    return (
        <div className="space-y-3">
            {/* Trend Change */}
            <motion.div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${getTrendBg()} border border-white/10`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
            >
                <motion.span
                    className="text-2xl"
                    animate={{ y: direction === 'up' ? [-2, 0] : direction === 'down' ? [2, 0] : [0, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                >
                    {getTrendIcon()}
                </motion.span>
                <div>
                    <span className={`font-bold ${getTrendColor()}`}>
                        {change > 0 ? '+' : ''}{change}
                    </span>
                    <span className="text-gray-400 text-sm ml-2">
                        ({percentage > 0 ? '+' : ''}{percentage}%)
                    </span>
                    <span className="text-gray-500 text-xs ml-2">from last hour</span>
                </div>
            </motion.div>

            {/* Historical Comparison */}
            {historical && (
                <motion.div
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ x: 5 }}
                >
                    <div className="text-xl">📅</div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-purple-400">
                            Similar to {historical.period}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {historical.description}
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
