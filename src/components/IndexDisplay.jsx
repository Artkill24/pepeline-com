'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function IndexDisplay({ data }) {
    const [showDetails, setShowDetails] = useState(false);

    // Safety check - se data è undefined o null
    if (!data || typeof data !== 'object') {
        return (
            <div className="text-center py-12">
                <div className="animate-spin text-4xl mb-4">⏳</div>
                <p className="text-gray-400">Loading index data...</p>
            </div>
        );
    }

    const { value, label, components, breakdown } = data;

    // Safety check per components
    const safeComponents = components && typeof components === 'object' ? components : {};
    const safeBreakdown = breakdown && typeof breakdown === 'object' ? breakdown : {};

    const getColorClass = (val) => {
        if (val >= 75) return 'text-green-400';
        if (val >= 50) return 'text-yellow-400';
        if (val >= 25) return 'text-orange-400';
        return 'text-red-400';
    };

    const getBgClass = (val) => {
        if (val >= 75) return 'from-green-900/20 to-green-600/20 border-green-500/30';
        if (val >= 50) return 'from-yellow-900/20 to-yellow-600/20 border-yellow-500/30';
        if (val >= 25) return 'from-orange-900/20 to-orange-600/20 border-orange-500/30';
        return 'from-red-900/20 to-red-600/20 border-red-500/30';
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto">
            
            {/* Main Index Card */}
            <div className={`p-8 rounded-2xl bg-gradient-to-br ${getBgClass(value || 50)} border backdrop-blur-sm`}>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-300 mb-2">
                        🐸 Pepeline Index
                    </h2>
                    <div className={`text-7xl font-extrabold ${getColorClass(value || 50)} mb-2`}>
                        {value?.toFixed(1) || '--'}
                    </div>
                    <div className="text-2xl font-bold text-white">
                        {label || 'LOADING'}
                    </div>
                </div>

                {/* Components Grid */}
                {Object.keys(safeComponents).length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {Object.entries(safeComponents).map(([key, value]) => (
                            <div key={key} className="bg-gray-800/50 rounded-lg p-4 text-center">
                                <div className="text-sm text-gray-400 capitalize mb-1">
                                    {key}
                                </div>
                                <div className={`text-2xl font-bold ${getColorClass(value || 0)}`}>
                                    {value?.toFixed(0) || '0'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Show Details Button */}
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-white font-semibold transition-all">
                    {showDetails ? '▲ Hide Details' : '▼ Show Details'}
                </button>

                {/* Breakdown Details */}
                {showDetails && Object.keys(safeBreakdown).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 space-y-3">
                        {Object.entries(safeBreakdown).map(([key, val]) => (
                            <div key={key} className="flex justify-between items-center bg-gray-800/30 p-3 rounded-lg">
                                <span className="text-gray-300 capitalize">{key}:</span>
                                <span className={`font-bold ${getColorClass(val || 0)}`}>
                                    {val?.toFixed(1) || '0.0'}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
