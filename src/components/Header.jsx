'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Header() {
    return (
        <motion.header
            className="text-center mb-16"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            {/* Logo */}
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
                    className="relative w-40 h-40"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                >
                    <Image
                        src="/pepeline-logo.png"
                        alt="Pepeline Logo"
                        width={160}
                        height={160}
                        className="drop-shadow-2xl"
                        priority
                    />
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
