import Link from 'next/link';
import MobileMenu from './MobileMenu';

export default function Header() {
    return (
        <header className="flex items-center justify-between gap-4 mb-8 relative">
            <Link href="/" className="text-2xl font-bold hover:text-green-400 transition-colors">
                🐸 Pepeline
            </Link>
            
            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center gap-6">
                <Link href="/coins" className="text-gray-300 hover:text-white transition-colors">
                    💰 Coins
                </Link>
                <Link href="/nft" className="text-gray-300 hover:text-white transition-colors">NFT</Link>
                <Link href="/heatmap" className="text-gray-300 hover:text-white transition-colors">
                  🗺️ Heatmap
                </Link>
                <Link href="/portfolio" className="text-gray-300 hover:text-white transition-colors">
                    📊 Portfolio
                </Link>
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                    🎯 Dashboard
                </Link>
            </nav>

            {/* Mobile Menu */}
            <MobileMenu />
        </header>
    );
}
