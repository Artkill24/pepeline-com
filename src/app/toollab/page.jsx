'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';

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
                    <div>Loading...</div>
                </div>
            </div>
        );
    }
    
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <div className="text-6xl mb-4">🤝</div>
                    <h1 className="text-5xl font-bold mb-4">ToolLab Validation</h1>
                    <p className="text-xl text-gray-400">System metrics & status</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {Object.entries(data.metrics).map(([key, value]) => (
                        <div key={key} className="p-6 bg-gray-800 rounded-xl">
                            <div className="text-gray-400 text-sm capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            <div className="text-2xl font-bold text-purple-400">{value}</div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-800 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Features</h2>
                    <div className="grid md:grid-cols-2 gap-3">
                        {data.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-green-400">✓</span>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-4">Validation Status</h2>
                    <div className="space-y-3">
                        {Object.entries(data.validation).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                                <span className="text-gray-400 capitalize">{key}:</span>
                                <span className="text-purple-400 font-bold">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
