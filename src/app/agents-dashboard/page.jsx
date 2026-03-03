'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function AgentsDashboard() {
    const [agentStatus, setAgentStatus] = useState('stopped');
    const [trades, setTrades] = useState([]);
    const [signals, setSignals] = useState([]);
    const [autoPost, setAutoPost] = useState(false);
    const [stats, setStats] = useState({
        totalTrades: 0,
        openPositions: 0
    });

    useEffect(() => {
        fetchSignals();
        const interval = setInterval(fetchSignals, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchSignals = async () => {
        try {
            const res = await fetch('/api/signals-fast');
            const data = await res.json();
            setSignals(data.signals || []);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    useEffect(() => {
        if (agentStatus !== 'running') return;

        const interval = setInterval(() => {
            simulateTrade();
        }, 8000);

        return () => clearInterval(interval);
    }, [agentStatus, signals]);

    const simulateTrade = async () => {
        if (signals.length === 0) return;

        const signal = signals[Math.floor(Math.random() * signals.length)];
        
        if (signal.strength < 75) return;

        const trade = {
            id: Date.now(),
            coin: signal.symbol,
            action: signal.signal,
            price: signal.price,
            size: 750,
            strength: signal.strength,
            pnl_percent: parseFloat((Math.random() * 8 - 3).toFixed(2)),
            llm_reasoning: `${signal.reasoning}. Strong market conditions.`,
            timestamp: new Date().toISOString()
        };

        setTrades(prev => [trade, ...prev].slice(0, 10));
        
        setStats(prev => ({
            totalTrades: prev.totalTrades + 1,
            openPositions: prev.openPositions + (trade.action === 'BUY' ? 1 : -1)
        }));

        if (autoPost) {
            postToTwitter(trade);
        }
    };

    const postToTwitter = async (trade) => {
        try {
            console.log('🐦 Auto-posting...');
            
            const res = await fetch('/api/twitter/post-trade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trade })
            });
            
            const data = await res.json();
            
            if (data.posted) {
                console.log('✅ Posted!', data.url);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">🤖 AI Agents Dashboard</h1>
                    <p className="text-gray-400">Live autonomous trading</p>
                </div>

                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setAgentStatus(s => s === 'running' ? 'stopped' : 'running')}
                        className={`px-6 py-3 rounded-lg font-bold ${
                            agentStatus === 'running'
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {agentStatus === 'running' ? '⏸️ Stop' : '▶️ Start'}
                    </button>
                    
                    <button
                        onClick={() => setAutoPost(!autoPost)}
                        className={`px-6 py-3 rounded-lg font-bold ${
                            autoPost ? 'bg-purple-600' : 'bg-gray-600'
                        }`}
                    >
                        🐦 Auto-Post: {autoPost ? 'ON' : 'OFF'}
                    </button>
                </div>

                <div className="text-center mb-8">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                        agentStatus === 'running' ? 'bg-green-900/30 text-green-400' : 'bg-gray-700'
                    }`}>
                        <span className={agentStatus === 'running' ? 'animate-pulse' : ''}>
                            {agentStatus === 'running' ? '🟢' : '⚫'}
                        </span>
                        <span className="font-bold">{agentStatus.toUpperCase()}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 bg-gray-800 rounded-xl">
                        <div className="text-gray-400 text-sm">Total Trades</div>
                        <div className="text-2xl font-bold">{stats.totalTrades}</div>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-xl">
                        <div className="text-gray-400 text-sm">Open Positions</div>
                        <div className="text-2xl font-bold">{stats.openPositions}</div>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-xl">
                        <div className="text-gray-400 text-sm">Signals</div>
                        <div className="text-2xl font-bold">{signals.length}</div>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-xl">
                        <div className="text-gray-400 text-sm">Auto-Post</div>
                        <div className="text-2xl font-bold">{autoPost ? '✅' : '❌'}</div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">Recent Trades</h2>
                    
                    <AnimatePresence>
                        {trades.map(trade => (
                            <motion.div
                                key={trade.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 bg-gray-700 rounded-lg mb-3"
                            >
                                <div className="flex justify-between">
                                    <div>
                                        <div className="text-lg font-bold">{trade.coin}</div>
                                        <div className={trade.action === 'BUY' ? 'text-green-400' : 'text-red-400'}>
                                            {trade.action} ${trade.size}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-400">
                                            {new Date(trade.timestamp).toLocaleTimeString()}
                                        </div>
                                        <div className={`font-bold ${trade.pnl_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {trade.pnl_percent >= 0 ? '+' : ''}{trade.pnl_percent}%
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {trades.length === 0 && (
                        <div className="text-center text-gray-400 py-8">
                            No trades yet. Start the agent!
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
