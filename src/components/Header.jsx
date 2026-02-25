'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    // TUTTI i link - come nella homepage
    const topRowLinks = [
        { href: '/coins', label: 'Coins', emoji: '🪙' },
        { href: '/heatmap', label: 'Heatmap', emoji: '🔥' },
        { href: '/portfolio', label: 'Portfolio', emoji: '📊' },
        { href: '/dashboard', label: 'Dashboard', emoji: '📊' },
        { href: '/backtest', label: 'Backtest', emoji: '📈' },
        { href: '/trading', label: 'Trading', emoji: '🤖' },
        { href: '/ai-predictor', label: 'AI Predictor', emoji: '🔮' },
        { href: '/war-room', label: 'War Room', emoji: '⚔️' },
        { href: '/paper-trading', label: 'Paper Trading', emoji: '📝' },
        { href: '/copy-trading', label: 'Copy Trading', emoji: '📋' },
        { href: '/premium', label: 'Premium', emoji: '💎' },
    ];

    const bottomRowLinks = [
        { href: '/explain', label: 'Explain AI', emoji: '🧠' },
        { href: '/prices', label: 'Prices', emoji: '💰' },
        { href: '/whitelist', label: 'Whitelist', emoji: '🎯', highlight: true },
    ];

    const allLinks = [...topRowLinks, ...bottomRowLinks];

    return (
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                {/* Main row */}
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
                        <span className="text-3xl">🐸</span>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 hidden sm:block">
                            Pepeline
                        </span>
                    </Link>

                    {/* Desktop Navigation - Top Row */}
                    <nav className="hidden xl:flex items-center gap-1 flex-wrap">
                        {topRowLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
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
                        className="xl:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
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

                {/* Desktop Navigation - Bottom Row */}
                <div className="hidden xl:flex items-center gap-2 pb-2">
                    {bottomRowLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                link.highlight
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                                    : isActive(link.href)
                                    ? 'bg-purple-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}>
                            <span className="mr-1">{link.emoji}</span>
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="xl:hidden py-4 border-t border-gray-800 max-h-[70vh] overflow-y-auto">
                        <nav className="flex flex-col gap-2">
                            {/* Top Row Links */}
                            <div className="mb-2">
                                <p className="px-4 py-1 text-xs font-bold text-gray-500 uppercase">Main</p>
                                {topRowLinks.map(link => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-3 ${
                                            isActive(link.href)
                                                ? 'bg-purple-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}>
                                        <span className="text-xl">{link.emoji}</span>
                                        <span>{link.label}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* Bottom Row Links */}
                            <div className="border-t border-gray-800 pt-2">
                                <p className="px-4 py-1 text-xs font-bold text-gray-500 uppercase">Tools</p>
                                {bottomRowLinks.map(link => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-3 ${
                                            link.highlight
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                                : isActive(link.href)
                                                ? 'bg-purple-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}>
                                        <span className="text-xl">{link.emoji}</span>
                                        <span>{link.label}</span>
                                        {link.highlight && <span className="ml-auto text-xs bg-pink-500 px-2 py-0.5 rounded-full">NEW</span>}
                                    </Link>
                                ))}
                            </div>
                            
                            {/* Extra Links */}
                            <div className="border-t border-gray-800 pt-2 mt-2">
                                <p className="px-4 py-1 text-xs font-bold text-gray-500 uppercase">More</p>
                                <Link href="/toollab" onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-2 block text-sm text-gray-400 hover:text-white">
                                    🤝 ToolLab Partnership
                                </Link>
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
                                    💻 GitHub →
                                </a>
                                <a href="https://twitter.com/pepeline_index" target="_blank" rel="noopener noreferrer"
                                    className="px-4 py-2 block text-sm text-gray-400 hover:text-white">
                                    🐦 Twitter →
                                </a>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
