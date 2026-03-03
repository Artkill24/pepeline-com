'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function AgentsPage() {
    const agents = [
        {
            id: 'trading',
            name: 'Trading Agent',
            emoji: '🤖',
            description: 'Autonomous trading based on Pepeline signals with LLM reasoning',
            status: 'LIVE',
            features: [
                'Auto-execute buy/sell signals',
                'Risk management (low/med/high)',
                'Position sizing based on confidence',
                'LLM reasoning (Groq API <1s)',
                'Real-time P&L tracking'
            ]
        },
        {
            id: 'research',
            name: 'Research Agent',
            emoji: '🔍',
            description: 'Find hidden gems and analyze new projects',
            status: 'COMING SOON',
            features: [
                'Scan new tokens across chains',
                'Rug pull detection',
                'Liquidity analysis',
                'Holder distribution check',
                'Contract verification'
            ]
        },
        {
            id: 'portfolio',
            name: 'Portfolio Manager',
            emoji: '💼',
            description: 'Auto-rebalance your portfolio to target allocations',
            status: 'COMING SOON',
            features: [
                'Set target allocations',
                'Auto-rebalance when >5% off',
                'Tax-loss harvesting',
                'Multi-chain support',
                'Performance analytics'
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            
            <div className="container mx-auto px-4 py-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="text-6xl mb-4">🤖</div>
                    <h1 className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                        AI Agents
                    </h1>
                    <p className="text-xl text-gray-300 mb-4">
                        Autonomous trading, research, and portfolio management
                    </p>
                    
                    {/* Dashboard Link */}
                    <Link href="/agents-dashboard">
                        <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl">
                            🎯 Open Live Dashboard →
                        </button>
                    </Link>
                </motion.div>

                {/* Agent Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {agents.map(agent => (
                        <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 bg-gray-800 rounded-2xl border border-gray-700 hover:border-purple-500 transition-all">
                            
                            <div className="text-5xl mb-4">{agent.emoji}</div>
                            <h3 className="text-2xl font-bold mb-2">{agent.name}</h3>
                            <p className="text-gray-400 mb-4">{agent.description}</p>
                            
                            <div className="mb-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                    agent.status === 'LIVE' 
                                        ? 'bg-green-900/30 text-green-400'
                                        : 'bg-purple-900/30 text-purple-300'
                                }`}>
                                    {agent.status}
                                </span>
                            </div>

                            <div className="space-y-2">
                                {agent.features.map((feature, i) => (
                                    <p key={i} className="text-sm text-gray-400 flex items-start gap-2">
                                        <span className="text-green-400">✓</span>
                                        <span>{feature}</span>
                                    </p>
                                ))}
                            </div>

                            {agent.status === 'LIVE' && (
                                <Link href="/agents-dashboard">
                                    <button className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all">
                                        Launch Dashboard →
                                    </button>
                                </Link>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Tokenomics Preview */}
                <div className="p-8 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-2xl">
                    <h2 className="text-3xl font-bold mb-6 text-center">
                        💎 $PEPELINE Token Utility (Coming Soon)
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-4 bg-gray-800/50 rounded-xl">
                            <div className="text-3xl mb-2">🔒</div>
                            <h3 className="text-lg font-bold mb-2">Stake to Access</h3>
                            <p className="text-sm text-gray-400">
                                Stake tokens to unlock AI agents. Higher stake = more features.
                            </p>
                        </div>

                        <div className="p-4 bg-gray-800/50 rounded-xl">
                            <div className="text-3xl mb-2">💰</div>
                            <h3 className="text-lg font-bold mb-2">Earn Rewards</h3>
                            <p className="text-sm text-gray-400">
                                Profitable trades earn tokens. Share training data for rewards.
                            </p>
                        </div>

                        <div className="p-4 bg-gray-800/50 rounded-xl">
                            <div className="text-3xl mb-2">🗳️</div>
                            <h3 className="text-lg font-bold mb-2">DAO Governance</h3>
                            <p className="text-sm text-gray-400">
                                Vote on agent parameters, fees, and new features.
                            </p>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <Link href="/whitelist">
                            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                                Join Whitelist for Token Launch 🚀
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
