'use client';

import { motion } from 'framer-motion';

export default function ShareButtons({ index, level }) {
    const tweetText = encodeURIComponent(
        `🐸 Pepeline Index: ${index}/100\n${level.emoji} ${level.label}\n"${level.message}"\n\nTrack crypto sentiment: https://pepeline.com`
    );

    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            {/* Twitter Share */}
            <motion.a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative px-8 py-4 rounded-xl font-bold text-lg overflow-hidden group bg-blue-500 hover:bg-blue-600 text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="flex items-center gap-2">
                    <span>🐦</span>
                    <span>Share on Twitter</span>
                </span>
            </motion.a>

            {/* Copy Link */}
            <motion.button
                onClick={() => {
                    navigator.clipboard.writeText('https://pepeline.com');
                    alert('Link copied!');
                }}
                className="px-8 py-4 rounded-xl font-bold text-lg bg-gray-700 hover:bg-gray-600 text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="flex items-center gap-2">
                    <span>🔗</span>
                    <span>Copy Link</span>
                </span>
            </motion.button>
        </div>
    );
}
