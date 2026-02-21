'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CopyTradingPage() {
    const [wallets, setWallets] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [walletsRes, subsRes] = await Promise.all([
                fetch('/api/smart-wallets'),
                fetch('/api/copy-trading?userId=demo')
            ]);
            
            const walletsData = await walletsRes.json();
            const subsData = await subsRes.json();
            
            setWallets(walletsData.wallets || []);
            setSubscriptions(subsData.subscriptions || []);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleFollow = async (address) => {
        try {
            await fetch('/api/copy-trading', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'follow', userId: 'demo', walletAddress: address, allocation: 10 })
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const isFollowing = (address) => {
        return subscriptions.some(s => s.wallet_address === address);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="text-6xl mb-4">🤖</div>
                    <h1 className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                        Copy Trading
                    </h1>
                    <p className="text-xl text-gray-300">Auto-follow smart money wallets</p>
                </motion.div>

                <div className="mb-8 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-xl text-sm text-yellow-200">
                    <p className="font-bold mb-1">⚠️ Coming Soon</p>
                    <p>Automatic copy-trading is in development. Currently in monitoring mode.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wallets.map((wallet, i) => (
                        <motion.div
                            key={wallet.address}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 bg-gray-800 rounded-xl border border-gray-700"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{wallet.label}</h3>
                                    <p className="text-sm text-gray-400">{wallet.category} • {wallet.network}</p>
                                </div>
                                <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-lg text-sm font-bold">
                                    {(wallet.winRate * 100).toFixed(0)}% Win Rate
                                </span>
                            </div>

                            <p className="text-xs text-gray-500 font-mono mb-4 break-all">{wallet.address}</p>

                            <button
                                onClick={() => handleFollow(wallet.address)}
                                disabled={isFollowing(wallet.address)}
                                className={`w-full py-3 rounded-xl font-bold transition-all ${
                                    isFollowing(wallet.address)
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                                }`}
                            >
                                {isFollowing(wallet.address) ? '✓ Following' : '+ Follow'}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}
