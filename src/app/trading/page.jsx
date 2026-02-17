'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TradingPage() {
    const { publicKey, connected } = useWallet();
    const { setVisible } = useWalletModal();
    const [signal, setSignal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(null);

    useEffect(() => {
        fetchSignal();
        const interval = setInterval(fetchSignal, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchSignal = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/signals');
            const data = await res.json();
            setSignal(data);
            setLastUpdate(new Date());
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const getSignalColor = (sig) => {
        if (sig === 'BUY') return 'text-green-400';
        if (sig === 'SELL') return 'text-red-400';
        return 'text-gray-400';
    };

    const getSignalBg = (sig) => {
        if (sig === 'BUY') return 'from-green-900/40 to-green-800/20 border-green-500/30';
        if (sig === 'SELL') return 'from-red-900/40 to-red-800/20 border-red-500/30';
        return 'from-gray-900/40 to-gray-800/20 border-gray-500/30';
    };

    const getConfidenceBadge = (conf) => {
        if (conf === 'HIGH') return 'bg-green-900/50 text-green-300 border-green-500/50';
        if (conf === 'MEDIUM') return 'bg-yellow-900/50 text-yellow-300 border-yellow-500/50';
        return 'bg-gray-900/50 text-gray-300 border-gray-500/50';
    };

    const openJupiter = () => {
        if (!signal) return;
        const inputMint = signal.signal === 'BUY' 
            ? 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' // USDC
            : 'So11111111111111111111111111111111111111112';  // SOL
        const outputMint = signal.signal === 'BUY'
            ? 'So11111111111111111111111111111111111111112'  // SOL
            : 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC
        
        window.open(`https://jup.ag/swap/${inputMint}-${outputMint}`, '_blank');
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            <div className="container mx-auto px-3 sm:px-4 py-6 md:py-12 max-w-5xl">

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 md:mb-12">
                    <div className="text-4xl md:text-6xl mb-3 md:mb-4">🤖</div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 md:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                        AI Trading Signals
                    </h1>
                    <p className="text-sm md:text-xl text-gray-300">
                        Hybrid strategy: Index + Whale Signals + Alpha
                    </p>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    className="mb-6 md:mb-8 p-3 md:p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-xl text-xs md:text-sm text-yellow-200">
                    <p className="font-bold mb-1">⚠️ Important Disclaimer</p>
                    <p>This is <b>NOT financial advice</b>. Signals are for informational purposes only. You control your wallet and approve every trade. Trading crypto involves risk of loss.</p>
                </motion.div>

                {!connected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="mb-6 md:mb-8 p-4 md:p-6 bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-2xl border border-purple-500/30 text-center">
                        <p className="text-base md:text-lg mb-3 md:mb-4">Connect wallet to view live signals</p>
                        <button onClick={() => setVisible(true)}
                            className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-bold text-sm md:text-base transition-all transform active:scale-95">
                            👛 Connect Phantom
                        </button>
                    </motion.div>
                )}

                {connected && signal && (
                    <>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className={`mb-6 md:mb-8 p-4 md:p-8 bg-gradient-to-br ${getSignalBg(signal.signal)} rounded-2xl border`}>
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
                                <div>
                                    <p className="text-xs md:text-sm text-gray-400 mb-1">Current Signal</p>
                                    <p className={`text-4xl md:text-6xl font-bold ${getSignalColor(signal.signal)}`}>
                                        {signal.signal}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 md:gap-3">
                                    <span className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-bold border ${getConfidenceBadge(signal.confidence)}`}>
                                        {signal.confidence}
                                    </span>
                                    <span className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-bold bg-purple-900/50 text-purple-300 border border-purple-500/50">
                                        {signal.strength}/100
                                    </span>
                                </div>
                            </div>

                            {signal.signal !== 'HOLD' && (
                                <>
                                    <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
                                        <div className="p-2 md:p-3 bg-gray-900/50 rounded-xl">
                                            <p className="text-[10px] md:text-xs text-gray-400 mb-1">Suggested Allocation</p>
                                            <p className="text-xl md:text-2xl font-bold">{signal.allocation}%</p>
                                        </div>
                                        <div className="p-2 md:p-3 bg-gray-900/50 rounded-xl">
                                            <p className="text-[10px] md:text-xs text-gray-400 mb-1">SOL Price</p>
                                            <p className="text-xl md:text-2xl font-bold">${signal.price?.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <button onClick={openJupiter}
                                        className="w-full py-3 md:py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl font-bold text-sm md:text-base transition-all transform active:scale-95 mb-3">
                                        {signal.signal === 'BUY' ? '🔵 Buy SOL on Jupiter' : '🔴 Sell SOL on Jupiter'}
                                    </button>
                                    <p className="text-[10px] md:text-xs text-gray-400 text-center">Opens Jupiter DEX • You approve every swap</p>
                                </>
                            )}

                            {signal.signal === 'HOLD' && (
                                <div className="text-center py-4 md:py-6">
                                    <p className="text-base md:text-lg text-gray-300">No strong signal. Market conditions not optimal.</p>
                                    <p className="text-xs md:text-sm text-gray-500 mt-2">Check back in a few hours.</p>
                                </div>
                            )}
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-6 md:mb-8">
                            <div className="p-4 md:p-6 bg-gray-800 rounded-xl border border-gray-700">
                                <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">🛡️ Conservative</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs md:text-sm text-gray-400">Signal</span>
                                        <span className={`font-bold ${getSignalColor(signal.legs.conservative.signal)}`}>
                                            {signal.legs.conservative.signal}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs md:text-sm text-gray-400">Strength</span>
                                        <span className="font-bold">{signal.legs.conservative.strength}/100</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 md:p-6 bg-gray-800 rounded-xl border border-gray-700">
                                <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">⚡ Aggressive</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs md:text-sm text-gray-400">Signal</span>
                                        <span className={`font-bold ${getSignalColor(signal.legs.aggressive.signal)}`}>
                                            {signal.legs.aggressive.signal}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs md:text-sm text-gray-400">Strength</span>
                                        <span className="font-bold">{signal.legs.aggressive.strength}/100</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                            className="mb-6 md:mb-8 p-4 md:p-6 bg-gray-800 rounded-xl border border-gray-700">
                            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">🧠 AI Reasoning</h3>
                            <div className="space-y-1.5">
                                {signal.reasoning.map((r, i) => (
                                    <p key={i} className="text-xs md:text-sm text-gray-300">• {r}</p>
                                ))}
                            </div>
                        </motion.div>

                        {lastUpdate && (
                            <p className="text-xs text-center text-gray-500">
                                Updated: {lastUpdate.toLocaleTimeString()} • Auto-refresh 60s
                            </p>
                        )}
                    </>
                )}

                {connected && loading && !signal && (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
                        <p className="mt-4 text-gray-400">Analyzing market...</p>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
