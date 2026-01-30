'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function UpdateTimer({ nextUpdateIn }) {
    const [timeLeft, setTimeLeft] = useState(nextUpdateIn || 3600);

    useEffect(() => {
        setTimeLeft(nextUpdateIn || 3600);

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) return 0;
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [nextUpdateIn]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const getColor = () => {
        if (timeLeft < 300) return 'text-red-400'; // < 5 min
        if (timeLeft < 900) return 'text-yellow-400'; // < 15 min
        return 'text-green-400';
    };

    const getEmoji = () => {
        if (timeLeft < 300) return '⚡';
        if (timeLeft < 900) return '⏰';
        return '🕐';
    };

    return (
        <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
        >
            <motion.span
                className="text-lg"
                animate={timeLeft < 60 ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
            >
                {getEmoji()}
            </motion.span>
            <span className="text-sm text-gray-400">Next update in</span>
            <span className={`font-mono font-bold ${getColor()}`}>
                {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
        </motion.div>
    );
}
