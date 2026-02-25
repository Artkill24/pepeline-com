'use client';

import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const productLinks = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/trading', label: 'Trading Signals' },
        { href: '/explain', label: 'Explainable AI' },
        { href: '/coins', label: 'Coins' },
        { href: '/war-room', label: 'War Room' },
        { href: '/backtest', label: 'Backtest' },
        { href: '/premium', label: 'Premium' },
    ];

    const resourceLinks = [
        { href: '/paper-trading', label: 'Paper Trading' },
        { href: '/ai-predictor', label: 'AI Predictor' },
        { href: '/toollab', label: 'ToolLab Partnership' },
        { href: 'https://github.com/Artkill24/pepeline-com', label: 'GitHub', external: true },
    ];

    const legalLinks = [
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
    ];

    return (
        <footer className="bg-gray-900 border-t border-gray-800 mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <span className="text-4xl">🐸</span>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                                Pepeline
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400 mb-4">
                            AI-powered crypto intelligence with 73% accuracy. Transparent, non-custodial, open source.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://twitter.com/pepeline_index" target="_blank" rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                            <a href="https://github.com/Artkill24/pepeline-com" target="_blank" rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="text-sm font-bold text-white mb-4">Product</h3>
                        <ul className="space-y-2">
                            {productLinks.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-sm font-bold text-white mb-4">Resources</h3>
                        <ul className="space-y-2">
                            {resourceLinks.map(link => (
                                <li key={link.href}>
                                    {link.external ? (
                                        <a href={link.href} target="_blank" rel="noopener noreferrer"
                                            className="text-sm text-gray-400 hover:text-white transition-colors">
                                            {link.label} →
                                        </a>
                                    ) : (
                                        <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-bold text-white mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {legalLinks.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                            <p className="text-xs text-yellow-200">
                                ⚠️ Not financial advice. Trading involves risk.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-800 text-center">
                    <p className="text-sm text-gray-400">
                        © {currentYear} Pepeline. Built in public. Open source. Non-custodial.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        73% backtested accuracy • $25k Alchemy credits • ToolLab partnership
                    </p>
                </div>
            </div>
        </footer>
    );
}
