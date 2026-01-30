'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ShareButton3D({ index, level }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const text = `🐸 Pepeline Index: ${index}\n${level.emoji} ${level.label}\n"${level.message}"\n\nCheck it live: pepeline.com`;
        
        if (navigator.share) {
            try {
                await navigator.share({ text });
                return;
            } catch (err) {}
        }

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <motion.button
            onClick={handleShare}
            className="relative px-8 py-4 rounded-xl font-bold text-lg overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Animated background */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500"
                animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear'
                }}
                style={{
                    backgroundSize: '200% 200%'
                }}
            />
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-green-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            
            {/* Content */}
            <span className="relative z-10 flex items-center gap-2 text-white">
                <motion.span
                    animate={copied ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                >
                    {copied ? '✓' : '📤'}
                </motion.span>
                <span>{copied ? 'Copied!' : 'Share Index'}</span>
            </span>
        </motion.button>
    );
}
