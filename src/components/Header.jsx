import Link from 'next/link';
import MobileMenu from './MobileMenu';

export default function Header() {
    return (
        <header className="flex items-center justify-between gap-4 mb-8 relative z-30">
            <Link href="/" className="text-xl md:text-2xl font-bold hover:text-green-400 transition-colors shrink-0">
                🐸 Pepeline
            </Link>
            <nav className="hidden lg:flex items-center gap-3 xl:gap-5 flex-wrap">
                <Link href="/coins" className="text-gray-300 hover:text-white transition-colors text-sm xl:text-base">💰 Coins</Link>
                <Link href="/heatmap" className="text-gray-300 hover:text-white transition-colors text-sm xl:text-base">🗺️ Heatmap</Link>
                <Link href="/portfolio" className="text-gray-300 hover:text-white transition-colors text-sm xl:text-base">📊 Portfolio</Link>
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm xl:text-base">🎯 Dashboard</Link>
                <Link href="/backtest" className="text-gray-300 hover:text-white transition-colors text-sm xl:text-base">📈 Backtest</Link>
                <Link href="/trading" className="text-gray-300 hover:text-white transition-colors text-sm xl:text-base">🤖 Trading</Link>
                <Link href="/ai-predictor" className="text-gray-300 hover:text-white transition-colors text-sm xl:text-base">🤖 AI Predictor</Link>
                <Link href="/war-room" className="text-gray-300 hover:text-white transition-colors text-sm xl:text-base">⚔️ War Room</Link>
                <Link href="/paper-trading" className="text-gray-300 hover:text-white transition-colors text-sm xl:text-base">📊 Paper Trading</Link>
                <Link href="/copy-trading" className="text-gray-300 hover:text-white transition-colors text-sm xl:text-base">🤖 Copy Trading</Link>
                <Link href="/premium" className="text-gray-300 hover:text-white transition-colors text-sm xl:text-base">💎 Premium</Link>
                <Link href="/explain" className="text-gray-300 hover:text-white transition-colors text-sm xl:text-base">🔍 Explain AI</Link>
                <Link href="/prices" className="text-gray-300 hover:text-white transition-colors text-sm xl:text-base">💰 Prices</Link>
                <Link href="/whitelist"
                    className="px-3 xl:px-4 py-1.5 xl:py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 rounded-lg font-bold text-sm transition-all">
                    🎯 Whitelist
                </Link>
            </nav>
            <MobileMenu />
        </header>
    );
}
