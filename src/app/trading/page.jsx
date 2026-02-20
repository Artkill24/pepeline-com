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
    const [amount, setAmount] = useState(100);
    const [executing, setExecuting] = useState(false);

    useEffect(() => {
        fetchSignals();
        const interval = setInterval(fetchSignals, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchSignals = async () => {
        try {
            const res = await fetch('/api/signals');
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error(err);
        }
    };

    const executeQuickTrade = async (signal) => {
        setExecuting(true);
        try {
            const res = await fetch('/api/execute-trade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ signal, symbol: selectedCoin, amount })
            });
            
            const result = await res.json();
            if (result.jupiterUrl) {
                window.open(result.jupiterUrl, '_blank');
            }
        } catch (err) {
            console.error(err);
        }
        setExecuting(false);
    };

    const signal = data?.signals?.find(s => s.symbol === selectedCoin);

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="text-6xl mb-4">🤖</div>
                    <h1 className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                        AI Trading Signals
                    </h1>
                    <p className="text-xl text-gray-300">One-Click Execution • Non-Custodial • Jupiter DEX</p>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-xl text-sm text-yellow-200">
                    <p className="font-bold mb-1">⚠️ Disclaimer</p>
                    <p>NOT financial advice. You control your wallet and approve every trade. Trading involves risk of loss.</p>
                </motion.div>

                {!connected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-6 bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-2xl border border-purple-500/30 text-center">
                        <p className="text-lg mb-4">Connect wallet for one-click trading</p>
                        <button onClick={() => setVisible(true)}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-bold transition-all">
                            👛 Connect Phantom
                        </button>
                    </motion.div>
                )}

                {connected && data && (
                    <>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-8">
                            {data.signals.map(s => (
                                <button key={s.symbol}
                                    onClick={() => setSelectedCoin(s.symbol)}
                                    className={`p-3 rounded-xl border font-bold transition-all ${
                                        selectedCoin === s.symbol 
                                            ? 'bg-purple-900/50 border-purple-500' 
                                            : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                    }`}>
                                    <p className="text-base">{s.symbol}</p>
                                    <p className={`text-xs ${s.signal === 'BUY' ? 'text-green-400' : s.signal === 'SELL' ? 'text-red-400' : 'text-gray-400'}`}>
                                        {s.signal}
                                    </p>
                                </button>
                            ))}
                        </div>

                        {signal && (
                            <motion.div key={selectedCoin} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                
                                <div className={`p-6 rounded-2xl border ${
                                    signal.signal === 'BUY' ? 'bg-green-900/20 border-green-500/30' :
                                    signal.signal === 'SELL' ? 'bg-red-900/20 border-red-500/30' :
                                    'bg-gray-800 border-gray-700'
                                }`}>
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="text-sm text-gray-400">{signal.symbol} Signal</p>
                                            <p className={`text-5xl font-bold ${
                                                signal.signal === 'BUY' ? 'text-green-400' :
                                                signal.signal === 'SELL' ? 'text-red-400' : 'text-gray-400'
                                            }`}>{signal.signal}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-400">Strength</p>
                                            <p className="text-4xl font-bold text-purple-400">{signal.strength}/100</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="p-3 bg-gray-900/50 rounded-xl">
                                            <p className="text-xs text-gray-400">Price</p>
                                            <p className="text-xl font-bold">${signal.price.toFixed(2)}</p>
                                        </div>
                                        <div className="p-3 bg-gray-900/50 rounded-xl">
                                            <p className="text-xs text-gray-400">24h</p>
                                            <p className={`text-xl font-bold ${signal.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {signal.change24h >= 0 ? '+' : ''}{signal.change24h.toFixed(2)}%
                                            </p>
                                        </div>
                                    </div>

                                    {signal.signal !== 'HOLD' && (
                                        <>
                                            <div className="mb-4">
                                                <label className="block text-sm text-gray-400 mb-2">Trade Amount (USDC)</label>
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                                                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    min="10"
                                                    max="10000"
                                                    step="10"
                                                />
                                            </div>

                                            <button
                                                onClick={() => executeQuickTrade(signal.signal)}
                                                disabled={executing}
                                                className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl font-bold transition-all disabled:opacity-50">
                                                {executing ? '⏳ Preparing...' : `⚡ ${signal.signal} ${signal.symbol} on Jupiter`}
                                            </button>
                                            <p className="text-xs text-gray-500 text-center mt-2">Your wallet, your approval required</p>
                                        </>
                                    )}
                                </div>

                                <div className="p-4 bg-gray-800 rounded-xl">
                                    <h3 className="font-bold mb-2">🧠 AI Reasoning</h3>
                                    <div className="space-y-1 text-sm text-gray-300">
                                        {signal.reasoning.map((r, i) => (
                                            <p key={i}>• {r}</p>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </main>
    );
}
