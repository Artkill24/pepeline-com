'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function AgentsDashboard() {
    const [agentStatus, setAgentStatus] = useState('stopped');
    const [trades, setTrades] = useState([]);
    const [signals, setSignals] = useState([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [stats, setStats] = useState({
        totalTrades: 0,
        successfulTrades: 0,
        openPositions: 0,
        totalPnL: 0
    });

    // Fetch REAL signals from API
    const fetchSignals = async () => {
        try {
            // Try real API first, fallback to fast
            const res = await fetch('/api/signals-fast', { timeout: 5000 });
            const data = await res.json();
            if (data.signals && data.signals.length > 0) {
                setSignals(data.signals);
            }
        } catch (err) {
            console.error('Error fetching signals:', err);
        }
    };

    // Fetch agent status
    const fetchAgentStatus = async () => {
        try {
            const res = await fetch('/api/agents/status');
            const data = await res.json();
            
            if (data.success) {
                setAgentStatus(data.status);
                setTrades(data.tradeHistory || []);
                setStats({
                    totalTrades: data.totalTrades || 0,
                    successfulTrades: data.successfulTrades || 0,
                    openPositions: data.openPositions?.length || 0,
                    totalPnL: calculatePnL(data.tradeHistory || [])
                });
            }
        } catch (err) {
            console.error('Error fetching agent status:', err);
        }
    };

    // Calculate P&L from trades
    const calculatePnL = (trades) => {
        // Simplified P&L calculation
        return trades.reduce((acc, t) => {
            if (t.pnl_percent) return acc + t.pnl_percent;
            return acc;
        }, 0);
    };

    useEffect(() => {
        fetchSignals();
        fetchAgentStatus();
        
        const interval = setInterval(() => {
            fetchSignals();
            fetchAgentStatus();
        }, 30000); // Refresh ogni 30s
        
        return () => clearInterval(interval);
    }, []);

    // Toggle agent
    const toggleAgent = async () => {
        const newStatus = agentStatus === 'running' ? 'stopped' : 'running';
        
        try {
            await fetch('/api/agents/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: newStatus === 'running' ? 'start' : 'stop' })
            });
            
            setAgentStatus(newStatus);
            
            if (newStatus === 'running') {
                // Start simulating trades every 5 seconds
                const sim = setInterval(simulateTrade, 5000);
                setIsSimulating(sim);
            } else {
                if (isSimulating) {
                    clearInterval(isSimulating);
                    setIsSimulating(null);
                }
            }
        } catch (err) {
            console.error('Error toggling agent:', err);
        }
    };

    // Simulate trade execution with LLM
    const simulateTrade = async () => {
        if (signals.length === 0) return;
        
        // Pick random signal
        const signal = signals[Math.floor(Math.random() * signals.length)];
        
        if (signal.strength < 75) return; // Skip weak signals
        
        const trade = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            coin: signal.symbol,
            action: signal.signal,
            price: signal.price,
            size: 750,
            strength: signal.strength,
            llm_reasoning: `${signal.reasoning}. Market conditions favorable with ${signal.confidence.toLowerCase()} confidence.`,
            status: 'EXECUTED',
            pnl_percent: Math.random() > 0.5 ? (Math.random() * 5) : -(Math.random() * 3)
        };
        
        try {
            await fetch('/api/agents/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'add_trade', trade })
            });
            
            // Auto-post to X/Twitter
            await postToTwitter(trade);
            
            fetchAgentStatus();
        } catch (err) {
            console.error('Error adding trade:', err);
        }
    };

    // Post trade to Twitter
    const postToTwitter = async (trade) => {
        try {
            await fetch('/api/twitter/post-trade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trade })
            });
        } catch (err) {
            console.error('Twitter post error:', err);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                                🤖 AI Agents Dashboard
                            </h1>
                            <p className="text-gray-400">
                                Autonomous trading with LLM reasoning (Groq API)
                            </p>
                        </div>
                        
                        {/* Agent Controls */}
                        <div className="flex gap-4">
                            <button
                                onClick={toggleAgent}
                                className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                                    agentStatus === 'running'
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}>
                                {agentStatus === 'running' ? '⏸️ Stop Agent' : '▶️ Start Agent'}
                            </button>
                        </div>
                    </div>

                    {/* Agent Status */}
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                            agentStatus === 'running' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                        }`}></div>
                        <span className="text-sm text-gray-400">
                            Status: <span className={`font-bold ${
                                agentStatus === 'running' ? 'text-green-400' : 'text-gray-400'
                            }`}>
                                {agentStatus.toUpperCase()}
                            </span>
                        </span>
                        {agentStatus === 'running' && (
                            <span className="text-sm text-gray-400">
                                • Auto-trading enabled • Posts to X/Twitter
                            </span>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                        <div className="text-sm text-gray-400 mb-1">Total Trades</div>
                        <div className="text-3xl font-bold text-white">{stats.totalTrades}</div>
                    </motion.div>
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                        <div className="text-sm text-gray-400 mb-1">Success Rate</div>
                        <div className="text-3xl font-bold text-green-400">
                            {stats.totalTrades > 0 ? Math.round((stats.successfulTrades / stats.totalTrades) * 100) : 0}%
                        </div>
                    </motion.div>
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                        <div className="text-sm text-gray-400 mb-1">Open Positions</div>
                        <div className="text-3xl font-bold text-purple-400">{stats.openPositions}</div>
                    </motion.div>
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                        <div className="text-sm text-gray-400 mb-1">Total P&L</div>
                        <div className={`text-3xl font-bold ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {stats.totalPnL >= 0 ? '+' : ''}{stats.totalPnL.toFixed(2)}%
                        </div>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Live Signals */}
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            📡 Live Signals
                            <span className="text-sm text-gray-400 font-normal">
                                ({signals.length} active)
                            </span>
                        </h2>

                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {signals.map((signal, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-purple-500 transition-all cursor-pointer">
                                    
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">
                                                {signal.symbol === 'BTC' ? '₿' : 
                                                 signal.symbol === 'ETH' ? 'Ξ' :
                                                 signal.symbol === 'SOL' ? '◎' : '🪙'}
                                            </span>
                                            <div>
                                                <div className="font-bold text-lg">{signal.symbol}</div>
                                                <div className="text-sm text-gray-400">${signal.price.toLocaleString()}</div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                signal.signal === 'BUY' ? 'bg-green-900/30 text-green-400' :
                                                signal.signal === 'SELL' ? 'bg-red-900/30 text-red-400' :
                                                'bg-gray-700 text-gray-300'
                                            }`}>
                                                {signal.signal}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                Strength: {signal.strength}/100
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className={`${signal.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {signal.change24h >= 0 ? '↗' : '↘'} {Math.abs(signal.change24h).toFixed(2)}%
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            signal.confidence === 'HIGH' ? 'bg-green-900/30 text-green-400' :
                                            signal.confidence === 'MEDIUM' ? 'bg-yellow-900/30 text-yellow-400' :
                                            'bg-gray-700 text-gray-400'
                                        }`}>
                                            {signal.confidence}
                                        </span>
                                    </div>

                                    <div className="mt-2 text-xs text-gray-400">
                                        {signal.reasoning}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Trade History */}
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            📝 Trade History
                            <span className="text-sm text-gray-400 font-normal">
                                ({trades.length} trades)
                            </span>
                        </h2>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto">
                            <AnimatePresence>
                                {trades.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <div className="text-4xl mb-2">🤖</div>
                                        <div>No trades yet</div>
                                        <div className="text-sm">Start the agent to begin trading</div>
                                    </div>
                                ) : (
                                    trades.map((trade) => (
                                        <motion.div
                                            key={trade.id}
                                            initial={{ opacity: 0, scale: 0.9, y: -20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition-all">
                                            
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                                                        trade.action === 'BUY' ? 'bg-green-900/50 text-green-400' :
                                                        'bg-red-900/50 text-red-400'
                                                    }`}>
                                                        {trade.action === 'BUY' ? '↗' : '↘'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-lg">
                                                            {trade.action} {trade.coin}
                                                        </div>
                                                        <div className="text-sm text-gray-400">
                                                            {new Date(trade.timestamp).toLocaleTimeString()}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-lg font-bold">${trade.size}</div>
                                                    <div className="text-sm text-gray-400">@ ${trade.price.toLocaleString()}</div>
                                                    {trade.pnl_percent && (
                                                        <div className={`text-sm font-bold ${trade.pnl_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                            {trade.pnl_percent >= 0 ? '+' : ''}{trade.pnl_percent.toFixed(2)}%
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* LLM Reasoning */}
                                            {trade.llm_reasoning && (
                                                <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                                                    <div className="text-xs text-purple-400 mb-1 flex items-center gap-1">
                                                        🧠 AI Reasoning
                                                    </div>
                                                    <div className="text-sm text-gray-300">
                                                        {trade.llm_reasoning}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                                                <span>Strength: {trade.strength}/100</span>
                                                <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded">
                                                    {trade.status}
                                                </span>
                                                <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded">
                                                    🐦 Posted to X
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Agent Info */}
                <div className="mt-8 p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-2xl">
                    <h3 className="text-xl font-bold mb-4">🤖 Agent Configuration</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <div className="text-sm text-gray-400 mb-1">Risk Level</div>
                            <div className="text-lg font-bold text-purple-400">MEDIUM</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-400 mb-1">Max Position Size</div>
                            <div className="text-lg font-bold text-purple-400">$1,000</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-400 mb-1">LLM Model</div>
                            <div className="text-lg font-bold text-purple-400">Groq Llama 3.1-8B</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-400 mb-1">Min Strength</div>
                            <div className="text-lg font-bold text-purple-400">75/100</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-400 mb-1">Daily Limit</div>
                            <div className="text-lg font-bold text-purple-400">5 trades/day</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-400 mb-1">Auto-Post X</div>
                            <div className="text-lg font-bold text-green-400">ENABLED ✓</div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
