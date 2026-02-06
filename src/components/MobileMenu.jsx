'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="lg:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-300 hover:text-white"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-gray-900 border-t border-gray-800 shadow-xl"
                    >
                        <nav className="flex flex-col p-4 space-y-2">
                            <Link 
                                href="/coins" 
                                className="p-3 hover:bg-gray-800 rounded-lg transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                💰 Coins
                            </Link>
                            <Link 
                                href="/portfolio" 
                                className="p-3 hover:bg-gray-800 rounded-lg transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                📊 Portfolio
                            </Link>
                            <Link 
                                href="/dashboard" 
                                className="p-3 hover:bg-gray-800 rounded-lg transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                🎯 Dashboard
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
