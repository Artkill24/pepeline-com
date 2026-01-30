'use client';

export default function Footer() {
    return (
        <footer className="mt-20 border-t border-gray-800 pt-12 pb-8">
            <div className="max-w-6xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* About */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">🐸 Pepeline</h3>
                        <p className="text-gray-400 text-sm">
                            Real-time crypto sentiment tracking. No BS, just data.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                            <li><a href="#formula" className="hover:text-white transition">The Formula</a></li>
                            <li><a href="https://github.com" target="_blank" rel="noopener" className="hover:text-white transition">GitHub</a></li>
                            <li><a href="https://twitter.com" target="_blank" rel="noopener" className="hover:text-white transition">Twitter/X</a></li>
                        </ul>
                    </div>

                    {/* Data Sources */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>• CoinGecko API</li>
                            <li>• Fear & Greed Index</li>
                            <li>• Updated every hour</li>
                            <li>• 100% free & open</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    <p>Built with real data • Not financial advice • DYOR</p>
                    <p className="mt-2">© 2026 Pepeline • Made with 🐸 by independent devs</p>
                </div>
            </div>
        </footer>
    );
}
