'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NFTTrendingSection from '@/components/NFTTrendingSection';
import { motion } from 'framer-motion';

export default function NFTPage() {
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <div className="container mx-auto px-4 py-16 relative z-10">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-14"
                >
                    <div className="text-6xl mb-4">🖼️</div>
                    <h1 className="text-4xl md:text-5xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400">
                        NFT Hype Index
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Top 10 NFT collections ranked by on-chain volume, floor price momentum and degen hype signal.
                    </p>
                </motion.div>

                {/* Full NFT section (non compact) */}
                <NFTTrendingSection compact={false} />
            </div>

            <Footer />
        </div>
    );
}
