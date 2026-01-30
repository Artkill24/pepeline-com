'use client';

import { motion } from 'framer-motion';

export default function IndexGlobe({ index, level }) {
    const colorMap = {
        'pepeline-green': '#10b981',
        'pepeline-blue': '#3b82f6',
        'pepeline-yellow': '#f59e0b',
        'pepeline-orange': '#f97316',
        'pepeline-red': '#ef4444',
    };

    const color = colorMap[level.color];
    const intensity = index / 100;

    return (
        <div className="relative w-full h-[400px] flex items-center justify-center mb-8">
            {/* Animated rings */}
            {[0, 1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full border-2"
                    style={{
                        width: `${200 + i * 50}px`,
                        height: `${200 + i * 50}px`,
                        borderColor: color,
                        opacity: 0.2 - i * 0.05,
                    }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.2 - i * 0.05, 0.4 - i * 0.05, 0.2 - i * 0.05],
                    }}
                    transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.2,
                    }}
                />
            ))}

            {/* Central sphere */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: '200px',
                    height: '200px',
                    background: `radial-gradient(circle at 30% 30%, ${color}dd, ${color}66, ${color}33)`,
                    boxShadow: `0 0 60px ${color}88, inset 0 0 40px ${color}44`,
                }}
                animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                        `0 0 60px ${color}88, inset 0 0 40px ${color}44`,
                        `0 0 80px ${color}aa, inset 0 0 60px ${color}66`,
                        `0 0 60px ${color}88, inset 0 0 40px ${color}44`,
                    ],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Orbiting particles */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.div
                    key={`particle-${i}`}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                        backgroundColor: color,
                        left: '50%',
                        top: '50%',
                        marginLeft: '-4px',
                        marginTop: '-4px',
                    }}
                    animate={{
                        x: [
                            Math.cos((i * Math.PI * 2) / 6) * 150,
                            Math.cos((i * Math.PI * 2) / 6 + Math.PI) * 150,
                            Math.cos((i * Math.PI * 2) / 6) * 150,
                        ],
                        y: [
                            Math.sin((i * Math.PI * 2) / 6) * 150,
                            Math.sin((i * Math.PI * 2) / 6 + Math.PI) * 150,
                            Math.sin((i * Math.PI * 2) / 6) * 150,
                        ],
                        opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                        duration: 4 + i * 0.3,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            ))}

            {/* Floating particles background */}
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={`bg-particle-${i}`}
                    className="absolute w-1 h-1 rounded-full bg-green-400"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        opacity: 0.3,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            {/* Index number overlay */}
            <motion.div
                className="absolute flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="text-center">
                    <motion.div
                        className="text-8xl font-bold text-white drop-shadow-2xl"
                        style={{
                            textShadow: `0 0 30px ${color}, 0 0 60px ${color}88`,
                        }}
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        {index}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
