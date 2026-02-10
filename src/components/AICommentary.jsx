'use client';

import { motion } from 'framer-motion';
import { generateCommentary, getConfidenceColor } from '@/lib/ai-commentary';

export default function AICommentary({ indexData }) {
    if (!indexData || !indexData.breakdown) {
        return (
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                <p className="text-gray-400">Loading AI analysis...</p>
            </div>
        );
    }

    const commentary = generateCommentary(indexData.index, indexData.breakdown);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700"
        >
            <h3 className="text-2xl font-bold mb-4">{commentary.title}</h3>
            
            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-400 mb-1">Analysis</p>
                    <p className="text-gray-200">{commentary.analysis}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-400 mb-1">Recommendation</p>
                    <p className="text-lg font-semibold text-green-400">{commentary.recommendation}</p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400">Confidence:</p>
                    <p className={`text-sm font-semibold ${getConfidenceColor(commentary.confidence)}`}>
                        {commentary.confidence.toUpperCase()}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
