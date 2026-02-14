'use client';

import { useState, useEffect } from 'react';
import {
    ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { motion } from 'framer-motion';

const ZONE_COLORS = {
    'EXTREME GREED': '#ef4444',
    'GREED': '#f97316',
    'NEUTRAL': '#eab308',
    'FEAR': '#3b82f6',
    'EXTREME FEAR': '#22c55e',
};

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const indexVal = payload.find(p => p.dataKey === 'index')?.value;
    const btcVal = payload.find(p => p.dataKey === 'btc')?.value;

    const level = indexVal >= 80 ? 'EXTREME GREED' :
                  indexVal >= 60 ? 'GREED' :
                  indexVal >= 40 ? 'NEUTRAL' :
                  indexVal >= 20 ? 'FEAR' : 'EXTREME FEAR';

    const date = new Date(label);
    const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return (
        <div className="bg-gray-900 border border-purple-700/50 rounded-xl p-4 shadow-xl text-sm">
            <p className="text-gray-400 mb-2 font-semibold">{formatted}</p>
            {indexVal !== undefined && (
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ZONE_COLORS[level] || '#a855f7' }} />
                    <span className="text-white font-bold">Index: {indexVal}</span>
                    <span className="text-gray-400">({level})</span>
                </div>
            )}
            {btcVal !== undefined && btcVal > 0 && (
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-400" />
                    <span className="text-orange-300">BTC: ${btcVal.toLocaleString()}</span>
                </div>
            )}
        </div>
    );
};

export default function IndexHistoryChart() {
    const [history, setHistory] = useState([]);
    const [days, setDays] = useState(30);
    const [loading, setLoading] = useState(true);
    const [isDemo, setIsDemo] = useState(false);
    const [showBTC, setShowBTC] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, [days]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/index-history?days=${days}`);
            const data = await res.json();
            setHistory(data.history || []);
            setIsDemo(data.isDemo || false);

            // Compute stats
            if (data.history?.length > 1) {
                const values = data.history.map(d => d.index);
                const avg = values.reduce((a, b) => a + b, 0) / values.length;
                const min = Math.min(...values);
                const max = Math.max(...values);
                const current = values[values.length - 1];
                const first = values[0];
                const trend = current - first;
                setStats({ avg: avg.toFixed(1), min: min.toFixed(1), max: max.toFixed(1), current, trend: trend.toFixed(1) });
            }
        } catch (err) {
            console.error('History error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatXAxis = (tick) => {
        const date = new Date(tick);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getIndexColor = (val) => {
        if (val >= 80) return '#ef4444';
        if (val >= 60) return '#f97316';
        if (val >= 40) return '#a855f7';
        if (val >= 20) return '#3b82f6';
        return '#22c55e';
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-14"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        📈 Index History
                        {isDemo && (
                            <span className="text-xs px-2 py-1 bg-yellow-900/40 text-yellow-400 border border-yellow-700/40 rounded-full">
                                Demo Data
                            </span>
                        )}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Pepeline Index vs BTC Price</p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 flex-wrap">
                    {/* BTC Toggle */}
                    <button
                        onClick={() => setShowBTC(!showBTC)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                            showBTC
                                ? 'bg-orange-900/40 border-orange-600/40 text-orange-400'
                                : 'bg-gray-800 border-gray-700 text-gray-400'
                        }`}
                    >
                        ₿ BTC Overlay
                    </button>

                    {/* Day selector */}
                    <div className="flex rounded-lg overflow-hidden border border-purple-800/40">
                        {[7, 30, 90].map(d => (
                            <button
                                key={d}
                                onClick={() => setDays(d)}
                                className={`px-4 py-1.5 text-xs font-semibold transition-all ${
                                    days === d
                                        ? 'bg-purple-700 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                            >
                                {d}D
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            {stats && (
                <div className="grid grid-cols-4 gap-3 mb-6">
                    {[
                        { label: 'Current', value: stats.current, color: getIndexColor(stats.current) },
                        { label: `${days}D Avg`, value: stats.avg, color: '#a855f7' },
                        { label: 'Low', value: stats.min, color: '#22c55e' },
                        { label: 'High', value: stats.max, color: '#ef4444' },
                    ].map((s) => (
                        <div key={s.label} className="p-3 bg-purple-950/20 rounded-xl border border-purple-800/20 text-center">
                            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Chart */}
            <div className="p-6 bg-purple-950/20 rounded-2xl border border-purple-800/30">
                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500" />
                            <p className="text-gray-400 text-sm">Loading history...</p>
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={320}>
                        <ComposedChart data={history} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                            <defs>
                                <linearGradient id="indexGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" stroke="#1e1b4b" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatXAxis}
                                tick={{ fill: '#6b7280', fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                interval="preserveStartEnd"
                            />
                            {/* Left axis - Index */}
                            <YAxis
                                yAxisId="index"
                                domain={[0, 100]}
                                tick={{ fill: '#a855f7', fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v) => `${v}`}
                                width={30}
                            />
                            {/* Right axis - BTC */}
                            {showBTC && (
                                <YAxis
                                    yAxisId="btc"
                                    orientation="right"
                                    tick={{ fill: '#f97316', fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v) => v > 0 ? `$${(v / 1000).toFixed(0)}k` : ''}
                                    width={45}
                                />
                            )}

                            <Tooltip content={<CustomTooltip />} />

                            {/* Zone reference lines */}
                            <ReferenceLine yAxisId="index" y={80} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.4} label={{ value: 'Extreme Greed', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
                            <ReferenceLine yAxisId="index" y={60} stroke="#f97316" strokeDasharray="3 3" strokeOpacity={0.3} />
                            <ReferenceLine yAxisId="index" y={40} stroke="#eab308" strokeDasharray="3 3" strokeOpacity={0.3} />
                            <ReferenceLine yAxisId="index" y={20} stroke="#3b82f6" strokeDasharray="3 3" strokeOpacity={0.3} label={{ value: 'Extreme Fear', fill: '#22c55e', fontSize: 10, position: 'insideBottomRight' }} />

                            {/* Index Area */}
                            <Area
                                yAxisId="index"
                                type="monotone"
                                dataKey="index"
                                stroke="#a855f7"
                                strokeWidth={2.5}
                                fill="url(#indexGradient)"
                                dot={false}
                                name="Pepeline Index"
                            />

                            {/* BTC Line */}
                            {showBTC && (
                                <Line
                                    yAxisId="btc"
                                    type="monotone"
                                    dataKey="btc"
                                    stroke="#f97316"
                                    strokeWidth={1.5}
                                    dot={false}
                                    strokeDasharray="5 3"
                                    name="BTC Price"
                                />
                            )}

                            <Legend
                                wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
                                formatter={(value) => (
                                    <span style={{ color: value === 'Pepeline Index' ? '#a855f7' : '#f97316' }}>
                                        {value}
                                    </span>
                                )}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                )}

                {isDemo && (
                    <p className="text-center text-xs text-yellow-600 mt-3">
                        ⚠️ Demo data shown — real data starts collecting after first deploy
                    </p>
                )}
            </div>

            {/* Zone Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
                {[
                    { zone: '0-20', label: 'Extreme Fear', color: '#22c55e' },
                    { zone: '20-40', label: 'Fear', color: '#3b82f6' },
                    { zone: '40-60', label: 'Neutral', color: '#eab308' },
                    { zone: '60-80', label: 'Greed', color: '#f97316' },
                    { zone: '80-100', label: 'Extreme Greed', color: '#ef4444' },
                ].map((z) => (
                    <span key={z.zone} className="flex items-center gap-1.5 text-xs text-gray-400">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: z.color }} />
                        {z.zone}: {z.label}
                    </span>
                ))}
            </div>
        </motion.section>
    );
}
