'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import AICommentary from './AICommentary';
import TrendIndicator from './TrendIndicator';
import UpdateTimer from './UpdateTimer';

const IndexGlobe = dynamic(() => import('./IndexGlobe'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] flex items-center justify-center">
            <div className="animate-pulse text-6xl">🐸</div>
        </div>
    )
});

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 100 }
    }
};

export default function IndexDisplay3D({ data }) {
    if (!data) {
        return (
            <div className="text-center py-12">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="text-6xl inline-block"
                >
                    🐸
                </motion.div>
                <p className="mt-4 text-gray-400">Loading Pepeline Index...</p>
            </div>
        );
    }

    const { index, level, components, timestamp, trend, historical, nextUpdateIn } = data;

    return (
        <motion.div
            className="max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* 3D Globe */}
            <motion.div variants={itemVariants}>
                <IndexGlobe index={index} level={level} />
            </motion.div>

            {/* Level Info */}
            <motion.div variants={itemVariants} className="text-center mb-6">
                <motion.p
                    className={`text-3xl font-bold mb-2 text-${level.color}`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                >
                    {level.emoji} {level.label}
                </motion.p>
                <motion.p
                    className="text-xl text-gray-400 italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    "{level.message}"
                </motion.p>
            </motion.div>

            {/* Trend & Timer */}
            <motion.div
                variants={itemVariants}
                className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8"
            >
                <TrendIndicator trend={trend} historical={historical} />
                <UpdateTimer nextUpdateIn={nextUpdateIn} />
            </motion.div>

            {/* AI Commentary */}
            <AICommentary indexData={data} />

            {/* Progress Bar */}
            <motion.div variants={itemVariants} className="mb-12 mt-8">
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden relative">
                    <motion.div
                        className={`h-full bg-gradient-to-r from-${level.color} to-${level.color}/50`}
                        initial={{ width: 0 }}
                        animate={{ width: `${index}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                    
                    <motion.div
                        className={`absolute top-0 right-0 h-full w-20 bg-${level.color} blur-xl opacity-50`}
                        style={{ right: `${100 - index}%` }}
                        animate={{
                            opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>0 Calm</span>
                    <span>50 Active</span>
                    <span>100 Peak Degen</span>
                </div>
            </motion.div>

            {/* Components Grid */}
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
                {components && Object.entries(components).map(([key, value], idx) => (
                    <motion.div
                        key={key}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="relative overflow-hidden rounded-xl p-6 text-center backdrop-blur-md bg-white/5 border border-white/10"
                    >
                        <motion.div
                            className="absolute inset-0 opacity-20"
                            style={{
                                background: `linear-gradient(135deg, ${getComponentColor(key)} 0%, transparent 100%)`
                            }}
                            animate={{
                                opacity: [0.1, 0.3, 0.1],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: idx * 0.2
                            }}
                        />
                        
                        <motion.div
                            className="text-4xl font-bold mb-2 relative z-10"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: 'spring',
                                stiffness: 200,
                                delay: 0.5 + idx * 0.1
                            }}
                        >
                            {value}
                        </motion.div>
                        <div className="text-sm text-gray-400 capitalize relative z-10">
                            {key}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Timestamp */}
            <motion.p
                variants={itemVariants}
                className="text-center text-sm text-gray-500"
            >
                Last update: {new Date(timestamp).toLocaleString()}
            </motion.p>
        </motion.div>
    );
}

function getComponentColor(key) {
    const colors = {
        sentiment: '#10b981',
        volatility: '#3b82f6',
        fomo: '#f59e0b',
        meme: '#f97316'
    };
    return colors[key] || '#3b82f6';
}
