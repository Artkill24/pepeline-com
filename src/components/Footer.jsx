'use client';

export default function Footer() {
    return (
        <footer className="mt-20 border-t border-gray-800 pt-12 pb-8">
            <div className="max-w-6xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* About */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">🐸 Pepeline</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Real-time crypto sentiment tracking. No BS, just data.
                        </p>
                        <div className="flex gap-4">
                            <a 
                                href="https://x.com/pepeline_index" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-400 transition text-2xl"
                                aria-label="Twitter"
                            >
                                𝕏
                            </a>
                            <a 
                                href="https://github.com/Artkill24/pepeline-com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition text-2xl"
                                aria-label="GitHub"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                            <li><a href="#formula" className="hover:text-white transition">The Formula</a></li>
                            <li>
                                <a 
                                    href="https://github.com/Artkill24/pepeline-com" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:text-white transition"
                                >
                                    GitHub →
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="https://x.com/pepeline_index" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:text-white transition"
                                >
                                    Twitter/X →
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Data Sources */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <a href="https://alternative.me/crypto/fear-and-greed-index/" target="_blank" rel="noopener" className="hover:text-white transition">
                                    Fear & Greed Index →
                                </a>
                            </li>
                            <li>
                                <a href="https://www.coingecko.com" target="_blank" rel="noopener" className="hover:text-white transition">
                                    CoinGecko API →
                                </a>
                            </li>
                            <li>
                                <a href="https://trends.google.com" target="_blank" rel="noopener" className="hover:text-white transition">
                                    Google Trends →
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="text-center pt-8 border-t border-gray-800">
                    <p className="text-gray-500 text-sm">
                        © 2026 Pepeline • Made with 🐸 by <a href="https://github.com/Artkill24" target="_blank" rel="noopener" className="hover:text-white transition">independent devs</a>
                    </p>
                    <p className="text-gray-600 text-xs mt-2">
                        Not financial advice • DYOR • Open source on <a href="https://github.com/Artkill24/pepeline-com" target="_blank" rel="noopener" className="hover:text-white transition">GitHub</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
