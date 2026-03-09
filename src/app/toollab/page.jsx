'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ToolLabValidation() {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        fetch('/api/toollab/validation')
            .then(res => res.json())
            .then(setData)
            .catch(err => console.error(err));
    }, []);
    
    if (!data) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">⏳</div>
                    <div>Loading validation data...</div>
                </div>
            </div>
        );
    }
    
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="text-6xl mb-4">🤝</div>
                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                        ToolLab Validation Dashboard
                    </h1>
                    <p className="text-xl text-gray-400">Live system metrics & integration status</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Partner: <a href="https://toollab.ai" className="text-purple-400 hover:underline">ToolLab</a>
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 bg-gray-800 rounded-xl border border-green-500/30">
                        <div className="text-green-400 text-4xl mb-2">✓</div>
                        <div className="text-2xl font-bold">{data.status.toUpperCase()}</div>
                        <div className="text-sm text-gray-400">System Status</div>
                    </div>
                    <div className="p-6 bg-gray-800 rounded-xl border border-purple-500/30">
                        <div className="text-purple-400 text-4xl mb-2">⚡</div>
                        <div className="text-2xl font-bold">{data.metrics.responseTime}</div>
                        <div className="text-sm text-gray-400">Response Time</div>
                    </div>
                    <div className="p-6 bg-gray-800 rounded-xl border border-blue-500/30">
                        <div className="text-blue-400 text-4xl mb-2">💰</div>
                        <div className="text-2xl font-bold">{data.metrics.cost}</div>
                        <div className="text-sm text-gray-400">Monthly Cost</div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {Object.entries(data.metrics).map(([key, value]) => (
                        <div key={key} className="p-4 bg-gray-800 rounded-xl">
                            <div className="text-gray-400 text-sm capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            <div className="text-2xl font-bold text-purple-400">{value}</div>
                        </div>
                    ))}
                </div>

                {/* Features */}
                <div className="bg-gray-800 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span>🎯</span> Features
                    </h2>
                    <div className="grid md:grid-cols-2 gap-3">
                        {data.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                                <span className="text-green-400 text-xl">✓</span>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Validation Status */}
                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-2 border-purple-500/50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span>🔬</span> Validation Status
                    </h2>
                    <div className="space-y-3">
                        {Object.entries(data.validation).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                                <span className="text-gray-300 capitalize">{key}:</span>
                                <span className="text-purple-400 font-bold">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="bg-gray-800 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span>⚙️</span> Tech Stack
                    </h2>
                    <div className="grid md:grid-cols-2 gap-3">
                        {Object.entries(data.tech).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                                <span className="text-gray-400 capitalize">{key}:</span>
                                <span className="text-white font-mono">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Endpoints */}
                <div className="bg-gray-800 rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span>🔗</span> Live Endpoints
                    </h2>
                    <div className="space-y-2">
                        {Object.entries(data.endpoints).map(([key, url]) => (
                            <a 
                                key={key} 
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <div className="text-gray-400 text-sm capitalize">{key}</div>
                                <div className="text-purple-400 font-mono text-sm">{url}</div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-gray-500 text-sm">
                    <p>Last updated: {new Date(data.timestamp).toLocaleString()}</p>
                    <p className="mt-2">
                        Built with ❤️ for the crypto community • 
                        <a href="https://pepeline.com" className="text-purple-400 hover:underline ml-1">pepeline.com</a>
                    </p>
                </div>
            </div>
        </main>
    );
}
