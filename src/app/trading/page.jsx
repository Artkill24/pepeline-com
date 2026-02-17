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
    const [lastUpdate, setLastUpdate] = useState(null);

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
            setLastUpdate(new Date());
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

    const getConfidenceBadge = (conf) => {
        if (conf === 'HIGH') return 'bg-green-900/50 text-green-300 border-green-500/50';
        if (conf === 'MEDIUM') return 'bg-yellow-900/50 text-yellow-300 border-yellow-500/50';
        return 'bg-gray-900/50 text-gray-300 border-gray-500/50';
    };

    const openJupiter = (sym) => {
        const mints = {
            BTC: { symbol: 'WBTC', mint: '3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh' },
            ETH: { symbol: 'WETH', mint: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs' },
            SOL: { symbol: 'SOL', mint: 'So11111111111111111111111111111111111111112' }
        };
        const coin = mints[sym];
        const usdc = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
        
        const sig = data?.signals?.find(s => s.symbol === sym);
        const inputMint = sig?.signal === 'BUY' ? usdc : coin.mint;
        const outputMint = sig?.signal === 'BUY' ? coin.mint : usdc;
        
        window.open(`https://jup.ag/swap/${inputMint}-${outputMint}`, '_blank');
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            <div className="container mx-auto px-3 sm:px-4 py-6 md:py-12 max-w-6xl">

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 md:mb-12">
                    <div className="text-4xl md:text-6xl mb-3 md:mb-4">🤖</div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 md:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                        AI Trading Signals
                    </h1>
                    <p className="text-sm md:text-xl text-gray-300">
                        Multi-coin • Technical Analysis • Risk Management
                    </p>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    className="mb-6 md:mb-8 p-3 md:p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-xl text-xs md:text-sm text-yellow-200">
                    <p className="font-bold mb-1">⚠️ Disclaimer</p>
                    <p>NOT financial advice. You control your wallet. Trading involves risk of loss.</p>
                </motion.div>

                {!connected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="mb-6 md:mb-8 p-4 md:p-6 bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-2xl border border-purple-500/30 text-center">
                        <p className="text-base md:text-lg mb-3 md:mb-4">Connect wallet to trade</p>
                        <button onClick={() => setVisible(true)}
                            className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-bold text-sm md:text-base transition-all transform active:scale-95">
                            👛 Connect Phantom
                        </button>
                    </motion.div>
                )}

                {connected && data && (
                    <>
                        {/* Top Signal Alert */}
                        {topSignal && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className="mb-6 p-4 md:p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/50 rounded-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs md:text-sm text-gray-300 mb-1">🔥 Strongest Signal</p>
                                        <p className="text-2xl md:text-3xl font-bold">
                                            {topSignal.symbol} {topSignal.signal} 
                                            <span className="text-purple-400 ml-2">{topSignal.strength}/100</span>
                                        </p>
                                    </div>
                                    <button onClick={() => { setSelectedCoin(topSignal.symbol); }}
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold text-sm transition-all">
                                        View →
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Coin Selector */}
                        <div className="flex gap-2 md:gap-3 mb-6 md:mb-8">
                            {data.signals.map(s => (
                                <button key={s.symbol}
                                    onClick={() => setSelectedCoin(s.symbol)}
                                    className={`flex-1 p-3 md:p-4 rounded-xl border font-bold transition-all ${
                                        selectedCoin === s.symbol 
                                            ? 'bg-purple-900/50 border-purple-500' 
                                            : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                    }`}>
                                    <p className="text-base md:text-lg">{s.symbol}</p>
                                    <p className={`text-xs md:text-sm ${getSignalColor(s.signal)}`}>{s.signal}</p>
                                    <p className="text-xs text-gray-500">{s.strength}/100</p>
                                </button>
                            ))}
                        </div>

                        {/* Selected Coin Signal */}
                        {signal && (
                            <>
                                <motion.div key={selectedCoin} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                    className={`mb-6 md:mb-8 p-4 md:p-8 bg-gradient-to-br ${getSignalBg(signal.signal)} rounded-2xl border`}>
                                    
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
                                        <div>
                                            <p className="text-xs md:text-sm text-gray-400 mb-1">{signal.symbol} Signal</p>
                                            <p className={`text-4xl md:text-6xl font-bold ${getSignalColor(signal.signal)}`}>
                                                {signal.signal}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-bold border ${getConfidenceBadge(signal.confidence)}`}>
                                                {signal.confidence}
                                            </span>
                                            <span className="px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-bold bg-purple-900/50 text-purple-300 border border-purple-500/50">
                                                {signal.strength}/100
                                            </span>
                                        </div>
                                    </div>

                                    {signal.signal !== 'HOLD' && (
                                        <>
                                            <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4">
                                                <div className="p-2 md:p-3 bg-gray-900/50 rounded-xl">
                                                    <p className="text-[10px] md:text-xs text-gray-400">Allocation</p>
                                                    <p className="text-xl md:text-2xl font-bold">{signal.allocation}%</p>
                                                </div>
                                                <div className="p-2 md:p-3 bg-gray-900/50 rounded-xl">
                                                    <p className="text-[10px] md:text-xs text-gray-400">Price</p>
                                                    <p className="text-xl md:text-2xl font-bold">${signal.price.toFixed(2)}</p>
                                                </div>
                                                <div className="p-2 md:p-3 bg-gray-900/50 rounded-xl">
                                                    <p className="text-[10px] md:text-xs text-gray-400">Take Profit</p>
                                                    <p className="text-xl md:text-2xl font-bold text-green-400">+{signal.takeProfit}%</p>
                                                </div>
                                                <div className="p-2 md:p-3 bg-gray-900/50 rounded-xl">
                                                    <p className="text-[10px] md:text-xs text-gray-400">Stop Loss</p>
                                                    <p className="text-xl md:text-2xl font-bold text-red-400">{signal.stopLoss}%</p>
                                                </div>
                                            </div>

                                            <button onClick={() => openJupiter(signal.symbol)}
                                                className="w-full py-3 md:py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl font-bold text-sm md:text-base transition-all transform active:scale-95 mb-2">
                                                {signal.signal === 'BUY' ? '🔵 Buy on Jupiter' : '🔴 Sell on Jupiter'}
                                            </button>
                                            <p className="text-[10px] md:text-xs text-gray-400 text-center">Your keys, your coins</p>
                                        </>
                                    )}

                                    {signal.signal === 'HOLD' && (
                                        <div className="text-center py-4">
                                            <p className="text-base text-gray-300">No strong signal for {signal.symbol}.</p>
                                        </div>
                                    )}
                                </motion.div>

                                {/* Technical Indicators */}
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="mb-6 p-4 md:p-6 bg-gray-800 rounded-xl border border-gray-700">
                                    <h3 className="text-base md:text-lg font-bold mb-4">📊 Technical Indicators</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                                            <p className="text-xs text-gray-400">RSI</p>
                                            <p className="text-2xl font-bold">{signal.indicators.rsi}</p>
                                            <p className="text-xs text-gray-500">{signal.indicators.trend}</p>
                                        </div>
                                        <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                                            <p className="text-xs text-gray-400">Volume</p>
                                            <p className="text-2xl font-bold">{signal.indicators.volumeRatio}x</p>
                                        </div>
                                        <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                                            <p className="text-xs text-gray-400">Position</p>
                                            <p className="text-2xl font-bold">{signal.indicators.pricePosition}%</p>
                                        </div>
                                        <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                                            <p className="text-xs text-gray-400">Index</p>
                                            <p className="text-2xl font-bold">{signal.inputs.indexValue}</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* 3 Legs */}
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                                    {Object.entries(signal.legs).map(([name, leg]) => (
                                        <div key={name} className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                                            <h3 className="text-sm font-bold mb-2 capitalize">{name}</h3>
                                            <div className="flex justify-between">
                                                <span className={`font-bold ${getSignalColor(leg.signal)}`}>{leg.signal}</span>
                                                <span className="font-bold">{leg.strength}/100</span>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>

                                {/* AI Reasoning */}
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="mb-6 p-4 md:p-6 bg-gray-800 rounded-xl border border-gray-700">
                                    <h3 className="text-base md:text-lg font-bold mb-3">🧠 AI Reasoning</h3>
                                    <div className="space-y-1.5">
                                        {signal.reasoning.map((r, i) => (
                                            <p key={i} className="text-xs md:text-sm text-gray-300">• {r}</p>
                                        ))}
                                    </div>
                                </motion.div>
                            </>
                        )}

                        {lastUpdate && (
                            <p className="text-xs text-center text-gray-500">
                                Updated: {lastUpdate.toLocaleTimeString()} • Refresh 60s
                            </p>
                        )}
                    </>
                )}

                {connected && loading && !data && (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
                        <p className="mt-4 text-gray-400">Analyzing markets...</p>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
