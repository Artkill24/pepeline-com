'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AutoTweetButton({ indexData }) {
    const [posting, setPosting] = useState(false);
    const [result, setResult] = useState(null);

    if (!indexData) return null;

    const handleTweet = async () => {
        setPosting(true);
        setResult(null);

        try {
            const response = await fetch('/api/post-tweet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'sentiment',
                    data: {
                        index: indexData.index,
                        emoji: indexData.emoji,
                        level: indexData.level,
                        change: indexData.change || 0
                    }
                })
            });

            const data = await response.json();
            setResult(data);

        } catch (error) {
            console.error('Tweet error:', error);
            setResult({ success: false, error: error.message });
        } finally {
            setPosting(false);
        }
    };

    return (
        <div className="mt-6 flex flex-col items-center">
            <motion.button
                onClick={handleTweet}
                disabled={posting}
                whileHover={{ scale: posting ? 1 : 1.05 }}
                whileTap={{ scale: posting ? 1 : 0.95 }}
                className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all ${
                    posting 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-blue-500/50'
                }`}
            >
                <span className="text-2xl">🐦</span>
                <span>{posting ? 'Posting...' : 'Share on X (Twitter)'}</span>
            </motion.button>

            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-4 rounded-xl max-w-md w-full ${
                        result.success 
                            ? 'bg-green-900/30 border border-green-500/50' 
                            : 'bg-red-900/30 border border-red-500/50'
                    }`}
                >
                    <p className="text-sm font-semibold mb-2">
                        {result.success 
                            ? '✅ Tweet posted successfully!' 
                            : `❌ Error: ${result.error}`}
                    </p>
                    {result.success && result.id && (
                        <a 
                            href={`https://twitter.com/user/status/${result.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:underline flex items-center gap-1"
                        >
                            View Tweet on X →
                        </a>
                    )}
                </motion.div>
            )}
        </div>
    );
}
