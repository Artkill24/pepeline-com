'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const ACTIONS = [
    { id: 'daily_visit', label: 'Daily Visit', points: 5, icon: '👁️', desc: 'Visit pepeline.com', daily: true },
    { id: 'connect_wallet', label: 'Connect Wallet', points: 20, icon: '👛', desc: 'Connect your Solana wallet', daily: false },
    { id: 'telegram_bot', label: 'Use Telegram Bot', points: 10, icon: '🤖', desc: 'Use @Pepelinebot', daily: true },
    { id: 'share_twitter', label: 'Share on X', points: 15, icon: '🐦', desc: 'Share our index on Twitter', daily: true },
    { id: 'use_dashboard', label: 'Use Dashboard', points: 5, icon: '📊', desc: 'Visit the dashboard', daily: true },
    { id: 'read_brief', label: 'Read Market Brief', points: 3, icon: '📰', desc: 'Read today\'s market brief', daily: true },
    { id: 'refer_friend', label: 'Refer a Friend', points: 25, icon: '👥', desc: 'Bring a friend to pepeline', daily: false },
];

const TIERS = [
    { label: 'Whitelist', min: 100, icon: '✅', color: 'text-green-400', bg: 'bg-green-900/30 border-green-500/30' },
    { label: 'Priority', min: 250, icon: '⚡', color: 'text-yellow-400', bg: 'bg-yellow-900/30 border-yellow-500/30' },
    { label: 'OG Member', min: 500, icon: '👑', color: 'text-purple-400', bg: 'bg-purple-900/30 border-purple-500/30' },
];

export default function WhitelistPage() {
    const [wallet, setWallet] = useState('');
    const [inputWallet, setInputWallet] = useState('');
    const [userData, setUserData] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(false);
    const [claiming, setClaiming] = useState(null);
    const [message, setMessage] = useState(null);
    const [referralCode, setReferralCode] = useState('');

    useEffect(() => {
        fetchLeaderboard();
        // Get referral from URL
        const params = new URLSearchParams(window.location.search);
        if (params.get('ref')) setReferralCode(params.get('ref'));
    }, []);

    const fetchLeaderboard = async () => {
        const res = await fetch('/api/points');
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
    };

    const fetchUser = async (addr) => {
        setLoading(true);
        const res = await fetch(`/api/points?wallet=${addr}`);
        const data = await res.json();
        setUserData(data);
        setLoading(false);
    };

    const handleConnect = () => {
        if (!inputWallet || inputWallet.length < 32) {
            setMessage({ type: 'error', text: 'Enter a valid Solana wallet address' });
            return;
        }
        setWallet(inputWallet);
        fetchUser(inputWallet);
        // Auto-claim daily visit
        claimPoints(inputWallet, 'daily_visit');
        claimPoints(inputWallet, 'connect_wallet');
    };

    const claimPoints = async (addr, action, extra = {}) => {
        setClaiming(action);
        try {
            const res = await fetch('/api/points', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    wallet: addr || wallet,
                    action,
                    referral_code: referralCode || undefined,
                    ...extra
                })
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: `+${data.points_earned} points earned! Total: ${data.total_points}` });
                fetchUser(addr || wallet);
                fetchLeaderboard();
            } else {
                setMessage({ type: 'info', text: data.message || 'Already claimed' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Error claiming points' });
        }
        setClaiming(null);
        setTimeout(() => setMessage(null), 3000);
    };

    const getCurrentTier = (points) => {
        if (points >= 500) return TIERS[2];
        if (points >= 250) return TIERS[1];
        if (points >= 100) return TIERS[0];
        return null;
    };

    const getNextTier = (points) => {
        return TIERS.find(t => t.min > points);
    };

    const getProgress = (points) => {
        const next = getNextTier(points);
        if (!next) return 100;
        const prev = [...TIERS].reverse().find(t => t.min <= points);
        const base = prev ? prev.min : 0;
        return Math.round(((points - base) / (next.min - base)) * 100);
    };

    const getReferralLink = () => `https://pepeline.com/whitelist?ref=${wallet}`;

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />

            <div className="container mx-auto px-4 py-12">

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="text-7xl mb-4">🎯</div>
                    <h1 className="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-purple-500">
                        Pepeline Whitelist
                    </h1>
                    <p className="text-xl text-gray-300 mb-2">Earn points → Get $PIPE token early</p>
                    <p className="text-sm text-gray-500">
                        100 points = Whitelist · 250 = Priority · 500 = OG Member
                    </p>
                </motion.div>

                {/* Tiers */}
                <div className="grid md:grid-cols-3 gap-4 mb-10">
                    {TIERS.map((tier, i) => (
                        <motion.div
                            key={tier.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-5 rounded-xl border ${tier.bg} text-center`}
                        >
                            <div className="text-4xl mb-2">{tier.icon}</div>
                            <p className={`text-xl font-bold ${tier.color}`}>{tier.label}</p>
                            <p className="text-2xl font-bold mt-1">{tier.min}+ pts</p>
                            <p className="text-xs text-gray-400 mt-2">
                                {tier.label === 'Whitelist' && 'Guaranteed $PIPE allocation'}
                                {tier.label === 'Priority' && 'First 1hr exclusive access'}
                                {tier.label === 'OG Member' && 'Bonus NFT + max allocation'}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Message Toast */}
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`fixed top-20 right-4 z-50 p-4 rounded-xl font-semibold shadow-xl ${
                                message.type === 'success' ? 'bg-green-600' :
                                message.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
                            }`}
                        >
                            {message.type === 'success' ? '✅' : message.type === 'error' ? '❌' : 'ℹ️'} {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left - Connect + Actions */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Connect Wallet */}
                        {!wallet ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-6 bg-gray-800 rounded-2xl border border-gray-700"
                            >
                                <h2 className="text-2xl font-bold mb-4">👛 Connect Your Wallet</h2>
                                <p className="text-gray-400 mb-4 text-sm">Enter your Solana wallet address to start earning points</p>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={inputWallet}
                                        onChange={(e) => setInputWallet(e.target.value)}
                                        placeholder="Your Solana wallet address..."
                                        className="flex-1 px-4 py-3 bg-gray-900 rounded-xl border border-gray-600 focus:border-green-500 outline-none text-sm font-mono"
                                    />
                                    <button
                                        onClick={handleConnect}
                                        className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition-all"
                                    >
                                        Connect
                                    </button>
                                </div>
                                {referralCode && (
                                    <p className="text-xs text-green-400 mt-2">
                                        🎉 Referred by: {referralCode.slice(0, 8)}... (+25 bonus pts for referrer!)
                                    </p>
                                )}
                            </motion.div>
                        ) : (
                            /* User Stats */
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-6 bg-gray-800 rounded-2xl border border-gray-700"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-xs text-gray-400">Connected Wallet</p>
                                        <p className="font-mono text-sm">{wallet.slice(0, 8)}...{wallet.slice(-6)}</p>
                                    </div>
                                    {userData && getCurrentTier(userData.points) && (
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getCurrentTier(userData.points).bg} ${getCurrentTier(userData.points).color}`}>
                                            {getCurrentTier(userData.points).icon} {getCurrentTier(userData.points).label}
                                        </span>
                                    )}
                                </div>

                                {loading ? (
                                    <div className="animate-pulse h-20 bg-gray-700 rounded-xl" />
                                ) : userData ? (
                                    <>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-4xl font-bold text-green-400">{userData.points || 0}</span>
                                            <span className="text-gray-400">/ {getNextTier(userData.points)?.min || '∞'} pts</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${getProgress(userData.points || 0)}%` }}
                                                className="h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                                            />
                                        </div>
                                        <div className="flex gap-6 text-sm text-gray-400 mt-3">
                                            <span>🏆 Rank #{userData.rank || '—'}</span>
                                            <span>👁️ {userData.visits || 0} visits</span>
                                            <span>👥 {userData.referrals || 0} referrals</span>
                                        </div>
                                    </>
                                ) : null}
                            </motion.div>
                        )}

                        {/* Actions */}
                        {wallet && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-6 bg-gray-800 rounded-2xl border border-gray-700"
                            >
                                <h2 className="text-xl font-bold mb-5">🎮 Earn Points</h2>
                                <div className="space-y-3">
                                    {ACTIONS.map((action) => (
                                        <div
                                            key={action.id}
                                            className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{action.icon}</span>
                                                <div>
                                                    <p className="font-semibold text-sm">{action.label}</p>
                                                    <p className="text-xs text-gray-400">{action.desc}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-green-400 font-bold text-sm">+{action.points}</span>
                                                {action.id === 'telegram_bot' ? (
                                                    <a
                                                        href="https://t.me/Pepelinebot"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={() => claimPoints(wallet, 'telegram_bot')}
                                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold transition-all"
                                                    >
                                                        Open Bot
                                                    </a>
                                                ) : action.id === 'use_dashboard' ? (
                                                    <Link
                                                        href="/dashboard"
                                                        onClick={() => claimPoints(wallet, 'use_dashboard')}
                                                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-semibold transition-all"
                                                    >
                                                        Go
                                                    </Link>
                                                ) : action.id === 'share_twitter' ? (
                                                    <a
                                                        href={`https://twitter.com/intent/tweet?text=🐸%20Check%20out%20Pepeline%20-%20the%20real-time%20crypto%20sentiment%20tracker!%0Ahttps://pepeline.com%0A%23Crypto%20%23Pepeline`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={() => claimPoints(wallet, 'share_twitter')}
                                                        className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 rounded-lg text-xs font-semibold transition-all"
                                                    >
                                                        Share
                                                    </a>
                                                ) : action.id === 'refer_friend' ? (
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(getReferralLink());
                                                            setMessage({ type: 'success', text: 'Referral link copied!' });
                                                        }}
                                                        className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-xs font-semibold transition-all"
                                                    >
                                                        Copy Link
                                                    </button>
                                                ) : action.id === 'read_brief' ? (
                                                    <Link
                                                        href="/#market-brief"
                                                        onClick={() => claimPoints(wallet, 'read_brief')}
                                                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 rounded-lg text-xs font-semibold transition-all"
                                                    >
                                                        Read
                                                    </Link>
                                                ) : (
                                                    <button
                                                        onClick={() => claimPoints(wallet, action.id)}
                                                        disabled={claiming === action.id}
                                                        className="px-3 py-1.5 bg-green-700 hover:bg-green-600 disabled:opacity-50 rounded-lg text-xs font-semibold transition-all"
                                                    >
                                                        {claiming === action.id ? '...' : 'Claim'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right - Leaderboard */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-6 bg-gray-800 rounded-2xl border border-gray-700 sticky top-4"
                        >
                            <h2 className="text-xl font-bold mb-5">🏆 Leaderboard</h2>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {leaderboard.length === 0 ? (
                                    <p className="text-gray-400 text-sm text-center py-8">
                                        Be the first to join!
                                    </p>
                                ) : (
                                    leaderboard.map((user, i) => (
                                        <div
                                            key={user.wallet_address}
                                            className={`flex items-center justify-between p-3 rounded-xl ${
                                                user.wallet_address === wallet
                                                    ? 'bg-green-900/30 border border-green-500/30'
                                                    : 'bg-gray-900/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-gray-400 w-5">
                                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                                                </span>
                                                <span className="font-mono text-xs text-gray-300">
                                                    {user.wallet_address.slice(0, 6)}...{user.wallet_address.slice(-4)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-400 font-bold text-sm">{user.points}</span>
                                                {user.whitelisted && <span className="text-xs">✅</span>}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
