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
    const [data, setData] = useState(null);
    const [selectedCoin, setSelectedCoin] = useState('BTC');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSignals();
        const interval = setInterval(fetchSignals, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchSignals = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/signals');
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const signal = data?.signals?.find(s => s.symbol === selectedCoin);
    const topSignal = data?.topSignal;

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

    const openJupiter = () => {
        window.open('https://jup.ag', '_blank');
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            <div className="container mx-auto px-3 sm:px-4 py-6 md:py-12 max-w-7xl">

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 md:mb-12">
                    <div className="text-4xl md:text-6xl mb-3">🤖</div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                        AI Trading Signals
                    </h1>
                    <p className="text-sm md:text-xl text-gray-300">
                        Multi-coin • Hybrid Strategy • Risk Management
                    </p>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    className="mb-6 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-xl text-xs md:text-sm text-yellow-200">
                    <p className="font-bold mb-1">⚠️ Disclaimer</p>
                    <p>NOT financial advice. Trading involves risk. You control your wallet.</p>
                </motion.div>

                {!connected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="mb-6 p-4 md:p-6 bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-2xl border border-purple-500/30 text-center">
                        <p className="text-base md:text-lg mb-3">Connect wallet to trade</p>
                        <button onClick={() => setVisible(true)}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-bold transition-all">
                            👛 Connect Phantom
                        </button>
                    </motion.div>
                )}

                {connected && data && (
                    <>
                        {topSignal && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="mb-6 p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/50 rounded-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-300 mb-1">🔥 Strongest Signal</p>
                                        <p className="text-2xl font-bold">
                                            {topSignal.symbol} {topSignal.signal} 
                                            <span className="text-purple-400 ml-2">{topSignal.strength}/100</span>
                                        </p>
                                    </div>
                                    <button onClick={() => setSelectedCoin(topSignal.symbol)}
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold text-sm">
                                        View →
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 mb-6">
                            {data.signals.map(s => (
                                <button key={s.symbol}
                                    onClick={() => setSelectedCoin(s.symbol)}
                                    className={`p-2 rounded-lg border font-bold transition-all ${
                                        selectedCoin === s.symbol 
                                            ? 'bg-purple-900/50 border-purple-500' 
                                            : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                    }`}>
                                    <p className="text-sm">{s.symbol}</p>
                                    <p className={`text-xs ${getSignalColor(s.signal)}`}>{s.signal}</p>
                                </button>
                            ))}
                        </div>

                        {signal && (
                            <motion.div key={selectedCoin} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className={`mb-6 p-4 md:p-6 bg-gradient-to-br ${getSignalBg(signal.signal)} rounded-2xl border`}>
                                
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-xs text-gray-400">{signal.symbol} Signal</p>
                                        <p className={`text-4xl font-bold ${getSignalColor(signal.signal)}`}>
                                            {signal.signal}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">Strength</p>
                                        <p className="text-3xl font-bold text-purple-300">{signal.strength}/100</p>
                                        <p className="text-xs text-gray-500">{signal.confidence}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="p-2 bg-gray-900/50 rounded-lg">
                                        <p className="text-xs text-gray-400">Price</p>
                                        <p className="text-xl font-bold">${signal.price.toFixed(2)}</p>
                                    </div>
                                    <div className="p-2 bg-gray-900/50 rounded-lg">
                                        <p className="text-xs text-gray-400">24h Change</p>
                                        <p className={`text-xl font-bold ${signal.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {signal.change24h >= 0 ? '+' : ''}{signal.change24h.toFixed(2)}%
                                        </p>
                                    </div>
                                </div>

                                {signal.signal !== 'HOLD' && (
                                    <button onClick={openJupiter}
                                        className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl font-bold transition-all">
                                        Trade on Jupiter →
                                    </button>
                                )}

                                <div className="mt-4 text-xs text-gray-400">
                                    {signal.reasoning.map((r, i) => (
                                        <p key={i}>• {r}</p>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </>
                )}

                {loading && (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
                        <p className="mt-4 text-gray-400">Analyzing {data?.signals?.length || 9} coins...</p>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
