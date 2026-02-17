'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PortfolioPage() {
    const [holdings, setHoldings] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [amountInput, setAmountInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState(null);

    // Load saved portfolio
    useEffect(() => {
        const saved = localStorage.getItem('pepeline_portfolio');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setHoldings(parsed);
                analyzePortfolio(parsed);
            } catch (e) {}
        }
    }, []);

    // Search coins
    useEffect(() => {
        if (searchInput.length < 2) { setSuggestions([]); return; }
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`https://api.coingecko.com/api/v3/search?query=${searchInput}`);
                const data = await res.json();
                setSuggestions(data.coins?.slice(0, 6) || []);
            } catch (e) {}
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const selectCoin = (coin) => {
        setSelectedCoin({ id: coin.id, name: coin.name, symbol: coin.symbol, thumb: coin.thumb });
        setSearchInput(coin.name);
        setSuggestions([]);
    };

    const addCoin = () => {
        if (!selectedCoin || !amountInput || isNaN(amountInput)) return;
        const exists = holdings.find(h => h.id === selectedCoin.id);
        let newHoldings;
        if (exists) {
            newHoldings = holdings.map(h => h.id === selectedCoin.id ? { ...h, amount: h.amount + parseFloat(amountInput) } : h);
        } else {
            newHoldings = [...holdings, { ...selectedCoin, amount: parseFloat(amountInput) }];
        }
        setHoldings(newHoldings);
        localStorage.setItem('pepeline_portfolio', JSON.stringify(newHoldings));
        setSelectedCoin(null);
        setSearchInput('');
        setAmountInput('');
        analyzePortfolio(newHoldings);
    };

    const removeCoin = (id) => {
        const newHoldings = holdings.filter(h => h.id !== id);
        setHoldings(newHoldings);
        localStorage.setItem('pepeline_portfolio', JSON.stringify(newHoldings));
        if (newHoldings.length > 0) analyzePortfolio(newHoldings);
        else setAnalysis(null);
    };

    const analyzePortfolio = async (coins) => {
        if (!coins || coins.length === 0) return;
        setLoading(true);
        try {
            const res = await fetch('/api/portfolio-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ coins: coins.map(c => ({ id: c.id, amount: c.amount })) })
            });
            const data = await res.json();
            setAnalysis(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const clearPortfolio = () => {
        setHoldings([]);
        setAnalysis(null);
        localStorage.removeItem('pepeline_portfolio');
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <Header />

                {/* Title */}
                <div className="mt-12 mb-4 md:mb-8">
                    <h1 className="text-2xl md:text-4xl md:text-3xl md:text-5xl font-bold mb-2">💼 Portfolio Advisor</h1>
                    <p className="text-gray-400">AI-powered portfolio analysis & recommendations</p>
                </div>

                {/* Add Coin Input */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 md:p-6 bg-gray-800/60 rounded-xl border border-gray-700 mb-4 md:mb-8 relative"
                >
                    <p className="text-sm text-gray-400 mb-4">Add your holdings</p>
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search coin (e.g. Bitcoin)"
                                value={searchInput}
                                onChange={(e) => { setSearchInput(e.target.value); setSelectedCoin(null); }}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                            />
                            {/* Suggestions Dropdown */}
                            {suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg z-10 max-h-48 overflow-y-auto">
                                    {suggestions.map(coin => (
                                        <button
                                            key={coin.id}
                                            onClick={() => selectCoin(coin)}
                                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 transition text-left"
                                        >
                                            <img src={coin.thumb} alt={coin.name} className="w-6 h-6 rounded-full" />
                                            <span className="font-semibold text-sm">{coin.name}</span>
                                            <span className="text-xs text-gray-500 uppercase">{coin.symbol}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <input
                            type="number"
                            placeholder="Amount"
                            value={amountInput}
                            onChange={(e) => setAmountInput(e.target.value)}
                            className="w-full md:w-40 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                        />
                        <button
                            onClick={addCoin}
                            disabled={!selectedCoin || !amountInput}
                            className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition"
                        >
                            + Add
                        </button>
                    </div>
                </motion.div>

                {/* Current Holdings */}
                {holdings.length > 0 && (
                    <div className="mb-4 md:mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-gray-400">Your Holdings ({holdings.length} coins)</p>
                            <button onClick={clearPortfolio} className="text-xs text-red-400 hover:text-red-300">🗑️ Clear all</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {holdings.map(h => (
                                <div key={h.id} className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700">
                                    {h.thumb && <img src={h.thumb} alt={h.name} className="w-5 h-5 rounded-full" />}
                                    <span className="text-sm font-semibold">{h.symbol?.toUpperCase()}</span>
                                    <span className="text-xs text-gray-500">{h.amount}</span>
                                    <button onClick={() => removeCoin(h.id)} className="text-gray-600 hover:text-red-400 ml-1">✕</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 animate-pulse">🤖 AI analyzing your portfolio...</p>
                    </div>
                )}

                {/* Analysis Results */}
                {analysis && !loading && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

                        {/* Top Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6">
                            <div className="p-4 bg-gray-800/60 rounded-xl border border-gray-700">
                                <p className="text-xs text-gray-500 mb-1">Total Value</p>
                                <p className="text-xl font-bold">${analysis.stats.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                            </div>
                            <div className="p-4 bg-gray-800/60 rounded-xl border border-gray-700">
                                <p className="text-xs text-gray-500 mb-1">24h Change</p>
                                <p className={`text-xl font-bold ${analysis.stats.change24hPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {analysis.stats.change24hPercent >= 0 ? '+' : ''}{analysis.stats.change24hPercent.toFixed(2)}%
                                </p>
                            </div>
                            <div className="p-4 bg-gray-800/60 rounded-xl border border-gray-700">
                                <p className="text-xs text-gray-500 mb-1">7d Change</p>
                                <p className={`text-xl font-bold ${analysis.stats.change7dPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {analysis.stats.change7dPercent >= 0 ? '+' : ''}{analysis.stats.change7dPercent.toFixed(2)}%
                                </p>
                            </div>
                            <div className="p-4 bg-gray-800/60 rounded-xl border border-gray-700">
                                <p className="text-xs text-gray-500 mb-1">Coins</p>
                                <p className="text-xl font-bold">{analysis.coins.length}</p>
                            </div>
                        </div>

                        {/* Sentiment + Risk + Diversification */}
                        <div className="grid md:grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mb-6">
                            <div className="p-5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 text-center">
                                <p className="text-xs text-gray-500 mb-2">Portfolio Sentiment</p>
                                <p className="text-3xl md:text-5xl font-bold mb-2">{analysis.sentiment.score}</p>
                                <p className="text-lg">{analysis.sentiment.emoji} {analysis.sentiment.level}</p>
                            </div>
                            <div className={`p-5 rounded-xl border text-center ${
                                analysis.risk.score < 40 ? 'bg-green-900/20 border-green-500/30' :
                                analysis.risk.score < 60 ? 'bg-yellow-900/20 border-yellow-500/30' :
                                'bg-red-900/20 border-red-500/30'
                            }`}>
                                <p className="text-xs text-gray-500 mb-2">Risk Score</p>
                                <p className="text-3xl md:text-5xl font-bold mb-2">{analysis.risk.score}</p>
                                <p className="text-lg">{analysis.risk.emoji} {analysis.risk.level}</p>
                            </div>
                            <div className={`p-5 rounded-xl border text-center ${
                                analysis.diversification >= 75 ? 'bg-green-900/20 border-green-500/30' :
                                analysis.diversification >= 50 ? 'bg-yellow-900/20 border-yellow-500/30' :
                                'bg-red-900/20 border-red-500/30'
                            }`}>
                                <p className="text-xs text-gray-500 mb-2">Diversification</p>
                                <p className="text-3xl md:text-5xl font-bold mb-2">{analysis.diversification}</p>
                                <p className="text-lg">{analysis.diversification >= 75 ? '✅ Good' : analysis.diversification >= 50 ? '⚠️ OK' : '🚨 Low'}</p>
                            </div>
                        </div>

                        {/* AI Recommendations */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold mb-4">🤖 AI Recommendations</h3>
                            <div className="grid md:grid-cols-2 gap-2 md:gap-4">
                                {analysis.recommendations.map((rec, idx) => (
                                    <div key={idx} className={`p-4 rounded-xl border ${
                                        rec.type === 'warning' ? 'bg-orange-900/15 border-orange-500/30' :
                                        rec.type === 'success' ? 'bg-green-900/15 border-green-500/30' :
                                        'bg-blue-900/15 border-blue-500/30'
                                    }`}>
                                        <p className="font-semibold mb-1">{rec.icon} {rec.title}</p>
                                        <p className="text-sm text-gray-300">{rec.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Coin Breakdown */}
                        <div className="p-3 md:p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                            <h3 className="text-lg font-bold mb-4">📊 Breakdown</h3>
                            <div className="space-y-3">
                                {analysis.coins.map(coin => (
                                    <Link key={coin.id} href={`/coin/${coin.id}`}>
                                        <div className="flex items-center gap-2 md:gap-4 p-3 rounded-lg hover:bg-gray-700/50 transition">
                                            <img src={coin.image} alt={coin.name} className="w-9 h-9 rounded-full" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold">{coin.symbol}</span>
                                                    <span className="text-xs text-gray-500">{coin.name}</span>
                                                </div>
                                                {/* Allocation bar */}
                                                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                                                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${coin.allocation}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">{coin.allocation}%</p>
                                                <p className={`text-xs ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                                                </p>
                                            </div>
                                            <div className="text-right w-20">
                                                <p className="text-sm font-semibold">${coin.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                                                <p className="text-xs text-gray-500">{coin.amount} {coin.symbol}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Empty State */}
                {holdings.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <p className="text-4xl md:text-6xl mb-4">💼</p>
                        <h3 className="text-xl font-bold mb-2">Add your first coin</h3>
                        <p className="text-gray-400">Search and add coins above to get AI-powered portfolio analysis</p>
                    </motion.div>
                )}

                <Footer />
            </div>
        </main>
    );
}
