'use client';

import { motion } from 'framer-motion';

export default function Header() {
    return (
        <motion.header
            className="text-center mb-16"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            {/* Logo Emoji */}
            <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                    duration: 0.8,
                    ease: 'easeOut',
                    type: 'spring',
                    stiffness: 200
                }}
            >
                <motion.div
                    className="text-9xl cursor-pointer select-none"
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{
                        y: [0, -15, 0],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                    style={{
                        filter: 'drop-shadow(0 0 40px rgba(16, 185, 129, 0.6))',
                        WebkitTextStroke: '2px rgba(16, 185, 129, 0.3)'
                    }}
                >
                    🐸
                </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
                className="text-6xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
                animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'linear'
                }}
                style={{
                    backgroundSize: '200% 200%'
                }}
            >
                PEPELINE
            </motion.h1>

            {/* Subtitle */}
            <motion.p
                className="text-lg md:text-xl text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                Crypto Sentiment Engine • Real Data • Zero BS
            </motion.p>
        </motion.header>
    );
}
