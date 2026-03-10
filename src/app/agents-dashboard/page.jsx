'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AgentsDashboard() {
    const [agentRunning, setAgentRunning] = useState(false);
    const [autoPost, setAutoPost] = useState(false);
    const [trades, setTrades] = useState([]);
    const [stats, setStats] = useState({
        totalTrades: 0,
        openPositions: 0,
        signals: 0
    });
    
    useEffect(() => {
        if (agentRunning) {
            const interval = setInterval(() => {
                generateMockTrade();
            }, 8000);
            return () => clearInterval(interval);
        }
    }, [agentRunning]);
    
    const generateMockTrade = () => {
        const coins = ['BTC', 'ETH', 'SOL', 'AVAX', 'DOGE'];
        const signals = ['BUY', 'SELL', 'HOLD'];
        const coin = coins[Math.floor(Math.random() * coins.length)];
        const signal = signals[Math.floor(Math.random() * signals.length)];
        const strength = Math.floor(Math.random() * 30) + 70;
        
        if (strength < 75) return;
        
        const newTrade = {
            id: Date.now(),
            coin,
            signal,
            strength,
            amount: 750,
            price: Math.floor(Math.random() * 100000),
            pnl: (Math.random() * 10 - 5).toFixed(2),
            timestamp: new Date().toLocaleTimeString()
        };
        
        setTrades(prev => [newTrade, ...prev].slice(0, 10));
        setStats(prev => ({
            totalTrades: prev.totalTrades + 1,
            openPositions: prev.openPositions + (signal === 'BUY' ? 1 : signal === 'SELL' ? -1 : 0),
            signals: prev.signals + 1
        }));
    };
    
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            <Header />
            
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold mb-2">🤖 AI Agents Dashboard</h1>
                    <p className="text-gray-300">Live autonomous trading</p>
                </div>
                
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setAgentRunning(!agentRunning)}
                        className={`px-8 py-3 rounded-xl font-bold transition-all ${
                            agentRunning 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        {agentRunning ? '⏸️ Stop' : '▶️ Start'}
                    </button>
                    
                    <button
                        onClick={() => setAutoPost(!autoPost)}
                        className={`px-8 py-3 rounded-xl font-bold transition-all ${
                            autoPost 
                                ? 'bg-blue-500 hover:bg-blue-600' 
                                : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                    >
                        🐦 Auto-Post: {autoPost ? 'ON' : 'OFF'}
                    </button>
                </div>
                
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                        agentRunning ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                    }`}>
                        <div className={`w-3 h-3 rounded-full ${agentRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                        {agentRunning ? 'RUNNING' : 'STOPPED'}
                    </div>
                </div>
                
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className="p-6 bg-gray-800 rounded-xl">
                        <div className="text-gray-400 text-sm">Total Trades</div>
                        <div className="text-3xl font-bold">{stats.totalTrades}</div>
                    </div>
                    <div className="p-6 bg-gray-800 rounded-xl">
                        <div className="text-gray-400 text-sm">Open Positions</div>
                        <div className="text-3xl font-bold">{stats.openPositions}</div>
                    </div>
                    <div className="p-6 bg-gray-800 rounded-xl">
                        <div className="text-gray-400 text-sm">Signals</div>
                        <div className="text-3xl font-bold">{stats.signals}</div>
                    </div>
                    <div className="p-6 bg-gray-800 rounded-xl">
                        <div className="text-gray-400 text-sm">Auto-Post</div>
                        <div className="text-3xl font-bold">{autoPost ? '✅' : '❌'}</div>
                    </div>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-4">Recent Trades</h2>
                    <div className="space-y-3">
                        {trades.length === 0 ? (
                            <div className="text-center text-gray-400 py-8">
                                Click Start to begin trading
                            </div>
                        ) : (
                            trades.map(trade => (
                                <motion.div
                                    key={trade.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-4 bg-gray-700 rounded-xl flex justify-between items-center"
                                >
                                    <div>
                                        <div className="font-bold">{trade.coin}</div>
                                        <div className={`text-sm ${
                                            trade.signal === 'BUY' ? 'text-green-400' : 
                                            trade.signal === 'SELL' ? 'text-red-400' : 'text-yellow-400'
                                        }`}>
                                            {trade.signal} ${trade.amount}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-400">{trade.timestamp}</div>
                                        <div className={`font-bold ${
                                            parseFloat(trade.pnl) > 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                            {trade.pnl}%
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            
            <Footer />
        </main>
    );
}
