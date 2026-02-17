'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
    { href: '/coins',     label: '💰 Coins' },
    { href: '/portfolio', label: '📊 Portfolio' },
    { href: '/dashboard', label: '🎯 Dashboard' },
    { href: '/heatmap',   label: '🗺️ Heatmap' },
    { href: '/backtest',  label: '📈 Backtest' },
    { href: '/trading',   label: '🤖 AI Trading' },
    { href: '/whitelist', label: '🎯 Whitelist' },
];

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="lg:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-300 hover:text-white"
                aria-label="Menu"
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
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, x: '100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '100%' }}
                            transition={{ type: 'tween', duration: 0.25 }}
                            className="fixed top-0 right-0 h-full w-72 bg-gray-900 border-l border-gray-800 shadow-2xl z-50 flex flex-col"
                        >
                            <div className="flex items-center justify-between p-5 border-b border-gray-800">
                                <span className="text-xl font-bold">🐸 Pepeline</span>
                                <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-white">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <nav className="flex flex-col p-4 gap-1 flex-1">
                                {links.map(({ href, label }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        className="p-3.5 hover:bg-gray-800 rounded-xl transition-colors text-gray-200 hover:text-white font-medium text-base"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="p-4 border-t border-gray-800">
                                <Link href="/whitelist" onClick={() => setIsOpen(false)}
                                    className="block w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-bold text-center text-sm transition-all active:scale-95">
                                    🎯 Get $SENT Whitelist
                                </Link>
                                <a href="https://t.me/Pepelinebot" target="_blank" rel="noopener noreferrer"
                                    className="block w-full py-3 mt-2 bg-blue-600/20 border border-blue-500/30 rounded-xl font-bold text-center text-sm text-blue-400 transition-all active:scale-95">
                                    🤖 Telegram Bot
                                </a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
