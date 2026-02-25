'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard', emoji: '📊' },
        { href: '/trading', label: 'Signals', emoji: '🤖' },
        { href: '/explain', label: 'Explainable AI', emoji: '🧠' },
        { href: '/coins', label: 'Coins', emoji: '💰' },
        { href: '/prices', label: 'Prices', emoji: '📈' },
        { href: '/war-room', label: 'War Room', emoji: '⚔️' },
        { href: '/backtest', label: 'Backtest', emoji: '📊' },
        { href: '/premium', label: 'Premium', emoji: '💎' },
        { href: '/paper-trading', label: 'Paper Trading', emoji: '📝' },
        { href: '/ai-predictor', label: 'AI Predictor', emoji: '🔮' },
        { href: '/toollab', label: 'ToolLab', emoji: '🤝' },
    ];

    return (
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <span className="text-3xl">🐸</span>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                            Pepeline
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.slice(0, 8).map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    isActive(link.href)
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}>
                                <span className="mr-1">{link.emoji}</span>
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                        aria-label="Toggle menu">
                        {mobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-gray-800">
                        <nav className="flex flex-col gap-2">
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                                        isActive(link.href)
                                            ? 'bg-purple-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}>
                                    <span className="mr-2 text-xl">{link.emoji}</span>
                                    {link.label}
                                </Link>
                            ))}
                            
                            {/* Extra Links */}
                            <div className="border-t border-gray-800 mt-2 pt-2">
                                <Link href="/privacy" onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-2 block text-sm text-gray-400 hover:text-white">
                                    Privacy Policy
                                </Link>
                                <Link href="/terms" onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-2 block text-sm text-gray-400 hover:text-white">
                                    Terms of Service
                                </Link>
                                <a href="https://github.com/Artkill24/pepeline-com" target="_blank" rel="noopener noreferrer"
                                    className="px-4 py-2 block text-sm text-gray-400 hover:text-white">
                                    GitHub →
                                </a>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
