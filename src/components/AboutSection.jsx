'use client';

import { useState } from 'react';

export default function AboutSection() {
    const [showFormula, setShowFormula] = useState(false);

    return (
        <div className="max-w-4xl mx-auto mt-20 space-y-12">
            {/* What is Pepeline */}
            <div className="bg-gray-800 rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-4">🐸 What is Pepeline?</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-4">
                    Pepeline is a <span className="text-green-400 font-semibold">real-time crypto sentiment engine</span> that 
                    cuts through the noise. No BS, no moon promises — just data-driven insights into market chaos.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                    We track sentiment, volatility, FOMO, and meme intensity to give you a single number: 
                    <span className="text-blue-400 font-semibold"> the Pepeline Index</span> (0-100).
                </p>
            </div>

            {/* How It Works */}
            <div className="bg-gray-800 rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-6">⚙️ How It Works</h2>
                
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="text-3xl">😎</div>
                        <div>
                            <h3 className="text-xl font-semibold text-green-400 mb-2">Sentiment (40%)</h3>
                            <p className="text-gray-300">Fear & Greed Index + Twitter vibes. Are people bullish or rekt?</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="text-3xl">📊</div>
                        <div>
                            <h3 className="text-xl font-semibold text-blue-400 mb-2">Volatility (30%)</h3>
                            <p className="text-gray-300">BTC + ETH price swings in 24h. Higher = more chaos.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="text-3xl">🚀</div>
                        <div>
                            <h3 className="text-xl font-semibold text-yellow-400 mb-2">FOMO (20%)</h3>
                            <p className="text-gray-300">Google searches, trading volume, new wallets. Is retail FOMO-ing in?</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="text-3xl">🎪</div>
                        <div>
                            <h3 className="text-xl font-semibold text-orange-400 mb-2">Meme Intensity (10%)</h3>
                            <p className="text-gray-300">DOGE, PEPE, SHIB activity. Peak degeneracy indicator.</p>
                        </div>
                    </div>
                </div>

                {/* Formula Toggle */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                    <button 
                        onClick={() => setShowFormula(!showFormula)}
                        className="text-gray-400 hover:text-white transition flex items-center gap-2"
                    >
                        <span>{showFormula ? '▼' : '►'}</span>
                        <span className="underline">Show the formula</span>
                    </button>
                    
                    {showFormula && (
                        <div className="mt-4 bg-gray-900 p-4 rounded font-mono text-sm text-green-400">
                            <p>Pepeline Index = (S × 0.4) + (V × 0.3) + (F × 0.2) + (M × 0.1)</p>
                            <p className="text-gray-500 mt-2">Where S, V, F, M are normalized 0-100 scores</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reading the Index */}
            <div className="bg-gray-800 rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-6">📖 Reading the Index</h2>
                
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">🟢</span>
                        <div className="flex-1">
                            <span className="font-semibold">0-20: Calm</span>
                            <p className="text-gray-400 text-sm">Market bottom? Everyone's depressed.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-3xl">🔵</span>
                        <div className="flex-1">
                            <span className="font-semibold">21-40: Neutral</span>
                            <p className="text-gray-400 text-sm">Healthy vibes. Business as usual.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-3xl">🟡</span>
                        <div className="flex-1">
                            <span className="font-semibold">41-60: Active</span>
                            <p className="text-gray-400 text-sm">Things heating up. Pay attention.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-3xl">🟠</span>
                        <div className="flex-1">
                            <span className="font-semibold">61-80: Hyped</span>
                            <p className="text-gray-400 text-sm">FOMO zone. Be careful.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-3xl">🔴</span>
                        <div className="flex-1">
                            <span className="font-semibold">81-100: Peak Degen</span>
                            <p className="text-gray-400 text-sm">Everyone's a genius. Top signal?</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
