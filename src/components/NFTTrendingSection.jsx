'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

function formatUSD(val) {
    if (!val || val === 0) return '—';
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
    return `$${val.toFixed(2)}`;
}

function ChangeTag({ value }) {
    if (value === 0 || value === undefined || value === null) {
        return <span className="text-gray-500 text-xs">—</span>;
    }
    const positive = value >= 0;
    return (
        <span className={`text-xs font-bold ${positive ? 'text-green-400' : 'text-red-400'}`}>
            {positive ? '▲' : '▼'} {Math.abs(value).toFixed(1)}%
        </span>
    );
}

export default function NFTTrendingSection({ compact = false }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch('/api/nft-trending')
            .then(r => r.json())
            .then(d => {
                if (d.error && !d.collections?.length) setError(true);
                else setData(d);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    if (error) return null;

    const displayCollections = compact
        ? (data?.collections || []).slice(0, 6)
        : (data?.collections || []);

    return (
        <section className="mb-14">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">🖼️ NFT Hype Index</h2>
                    {data?.stats && (
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                            data.stats.avgHypeScore > 65
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : data.stats.avgHypeScore > 45
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                            {data.stats.signalEmoji} {data.stats.marketSignal}
                        </span>
                    )}
                </div>
                {compact && (
                    <Link href="/nft" className="text-sm text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                        View all →
                    </Link>
                )}
            </div>

            {/* Loading skeleton */}
            {loading && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(compact ? 6 : 10)].map((_, i) => (
                        <div key={i} className="p-4 bg-gray-800/50 rounded-xl animate-pulse h-36" />
                    ))}
                </div>
            )}

            {/* Grid */}
            {!loading && displayCollections.length > 0 && (
                <div className={`grid gap-4 ${compact
                    ? 'grid-cols-2 md:grid-cols-3'
                    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
                }`}>
                    {displayCollections.map((col, i) => (
                        <motion.div
                            key={col.rank}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.04, y: -4 }}
                            className="relative p-4 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/60 hover:border-purple-500/40 transition-all cursor-default overflow-hidden"
                        >
                            {/* Rank badge */}
                            <div className="absolute top-3 left-3 text-xs font-black text-gray-500">
                                #{col.rank}
                            </div>

                            {/* Hype bar accent */}
                            <div
                                className={`absolute top-0 left-0 h-0.5 bg-gradient-to-r ${col.hypeColor}`}
                                style={{ width: `${col.hypeScore}%` }}
                            />

                            {/* Collection image */}
                            <div className="flex justify-center mb-3 mt-3">
                                {col.image ? (
                                    <img
                                        src={col.image}
                                        alt={col.name}
                                        className="w-12 h-12 rounded-xl object-cover border border-gray-700"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                ) : (
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${col.hypeColor} flex items-center justify-center text-xl`}>
                                        🖼️
                                    </div>
                                )}
                            </div>

                            {/* Name */}
                            <p className="text-xs font-bold text-center text-white truncate mb-2 px-1">
                                {col.name}
                            </p>

                            {/* Hype score */}
                            <div className="text-center mb-3">
                                <p className="text-2xl font-black">{col.hypeScore}</p>
                                <p className="text-xs text-gray-400">
                                    {col.hypeEmoji} {col.hypeLabel}
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="space-y-1.5 border-t border-gray-700/50 pt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Floor</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-semibold">{formatUSD(col.floorPrice)}</span>
                                        <ChangeTag value={col.floorChange24h} />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Vol 24h</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-semibold">{formatUSD(col.volume24h)}</span>
                                        <ChangeTag value={col.volumeChange24h} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Stats bar (full page only) */}
            {!compact && data?.stats && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 p-4 rounded-xl bg-purple-950/30 border border-purple-800/30 flex flex-wrap gap-4 justify-center text-center"
                >
                    <div>
                        <p className="text-xs text-gray-400">Avg Hype Score</p>
                        <p className="text-xl font-black">{data.stats.avgHypeScore}/100</p>
                    </div>
                    <div className="w-px bg-gray-700 self-stretch" />
                    <div>
                        <p className="text-xs text-gray-400">Total Vol 24h</p>
                        <p className="text-xl font-black">{formatUSD(data.stats.totalVolume24h)}</p>
                    </div>
                    <div className="w-px bg-gray-700 self-stretch" />
                    <div>
                        <p className="text-xs text-gray-400">Data source</p>
                        <p className="text-xs text-gray-400 mt-1">Moralis Multi-Chain</p>
                    </div>
                    <div className="w-px bg-gray-700 self-stretch" />
                    <div>
                        <p className="text-xs text-gray-400">Updated</p>
                        <p className="text-xs text-gray-400 mt-1">{data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : '—'}</p>
                    </div>
                </motion.div>
            )}
        </section>
    );
}
