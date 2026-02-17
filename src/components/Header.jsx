import Link from 'next/link';
import MobileMenu from './MobileMenu';

export default function Header() {
    return (
        <header className="flex items-center justify-between gap-4 mb-8 relative z-30">
            <Link href="/" className="text-xl md:text-2xl font-bold hover:text-green-400 transition-colors shrink-0">
                🐸 Pepeline
            </Link>
            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 flex-wrap">
                <Link href="/coins" className="text-gray-300 hover:text-white transition-colors text-sm xl:text-base">💰 Coins</Link>
                <Link href="/heatmap" className="text-gray-300 hover:text-white transition-colors text-sm xl:text-base">🗺️ Heatmap</Link>
                <Link href="/portfolio" className="text-gray-300 hover:text-white transition-colors text-sm xl:text-base">📊 Portfolio</Link>
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm xl:text-base">🎯 Dashboard</Link>
                <Link href="/backtest" className="text-gray-300 hover:text-white transition-colors text-sm xl:text-base">📈 Backtest</Link>
                <Link href="/whitelist"
                    className="px-3 xl:px-4 py-1.5 xl:py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 rounded-lg font-bold text-sm transition-all">
                    🎯 Whitelist
                </Link>
            </nav>
            {/* Mobile Menu */}
            <MobileMenu />
        </header>
    );
}
