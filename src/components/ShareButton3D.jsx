'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ShareButton3D({ index, level }) {
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(false);

    const handleShare = async () => {
        const text = `🐸 Pepeline Index: ${index}/100

${level.emoji} ${level.label}
"${level.message}"

Track crypto sentiment live: https://pepeline.com`;

        try {
            // Try native share first (mobile)
            if (navigator.share) {
                await navigator.share({
                    title: 'Pepeline - Crypto Sentiment Index',
                    text: text,
                    url: 'https://pepeline.com'
                });
                return;
            }
        } catch (err) {
            // User cancelled or share failed, try clipboard
            console.log('Share failed, trying clipboard');
        }

        // Clipboard fallback
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Final fallback: create temporary textarea
            try {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (finalErr) {
                console.error('All share methods failed:', finalErr);
                setError(true);
                setTimeout(() => setError(false), 2000);
            }
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
            <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                <motion.span
                    animate={copied ? { scale: [1, 1.3, 1] } : error ? { rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.3 }}
                >
                    {error ? '❌' : copied ? '✓' : '📤'}
                </motion.span>
                <span>
                    {error ? 'Failed' : copied ? 'Copied!' : 'Share Index'}
                </span>
            </span>
        </motion.button>
    );
}
