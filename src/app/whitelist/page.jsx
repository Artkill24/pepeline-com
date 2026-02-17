'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const ACTIONS = [
    { id: 'daily_visit',    label: 'Daily Visit',        points: 5,  icon: '👁️', desc: 'Visit pepeline.com daily',      daily: true },
    { id: 'connect_wallet', label: 'Connect Wallet',     points: 20, icon: '👛', desc: 'Connect your Solana wallet',    daily: false },
    { id: 'telegram_bot',   label: 'Use Telegram Bot',   points: 10, icon: '🤖', desc: 'Use @Pepelinebot on Telegram',  daily: true },
    { id: 'share_twitter',  label: 'Share on X',         points: 15, icon: '🐦', desc: 'Share our index on Twitter/X', daily: true },
    { id: 'use_dashboard',  label: 'Use Dashboard',      points: 5,  icon: '📊', desc: 'Visit the main dashboard',     daily: true },
    { id: 'read_brief',     label: 'Read Market Brief',  points: 3,  icon: '📰', desc: "Read today's market brief",    daily: true },
    { id: 'refer_friend',   label: 'Refer a Friend',     points: 25, icon: '👥', desc: 'Bring a friend to Pepeline',   daily: false },
];

const TIERS = [
    { label: 'Whitelist', min: 100, icon: '✅', color: 'text-green-400',  bg: 'bg-green-900/30 border-green-500/30',   bar: 'from-green-500 to-emerald-400', perk: 'Guaranteed $SENT allocation' },
    { label: 'Priority',  min: 250, icon: '⚡', color: 'text-yellow-400', bg: 'bg-yellow-900/30 border-yellow-500/30', bar: 'from-yellow-500 to-amber-400',  perk: 'First 1hr exclusive access' },
    { label: 'OG Member', min: 500, icon: '👑', color: 'text-purple-400', bg: 'bg-purple-900/30 border-purple-500/30', bar: 'from-purple-500 to-pink-400',   perk: 'Bonus NFT + max allocation' },
];

const getTier     = (pts) => pts >= 500 ? TIERS[2] : pts >= 250 ? TIERS[1] : pts >= 100 ? TIERS[0] : null;
const getNextTier = (pts) => TIERS.find((t) => t.min > pts);
const getProgress = (pts) => {
    const next = getNextTier(pts);
    if (!next) return 100;
    const prev = [...TIERS].reverse().find((t) => t.min <= pts);
    const base = prev ? prev.min : 0;
    return Math.min(100, Math.round(((pts - base) / (next.min - base)) * 100));
};

function LeaderboardRow({ user, index, currentWallet }) {
    const tier   = getTier(user.points);
    const medals = ['🥇', '🥈', '🥉'];
    const isSelf = user.wallet_address === currentWallet;
    return (
        <div className={`flex items-center justify-between px-2 md:px-3 py-2 md:py-2.5 rounded-xl transition-all ${
            isSelf ? 'bg-green-900/30 border border-green-500/30' : 'bg-gray-900/50 hover:bg-gray-700/30'
        }`}>
            <div className="flex items-center gap-1.5 md:gap-2.5 min-w-0 flex-1">
                <span className="text-xs md:text-sm font-bold text-gray-400 w-5 md:w-6 shrink-0 text-center">
                    {index < 3 ? medals[index] : index + 1}
                </span>
                <span className="font-mono text-[10px] md:text-xs text-gray-300 truncate">
                    {user.wallet_address.slice(0, 4)}…{user.wallet_address.slice(-3)}
                </span>
                {isSelf && <span className="text-[10px] md:text-xs text-green-400 shrink-0">(you)</span>}
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 shrink-0 ml-2">
                {tier && (
                    <span className={`text-[10px] md:text-xs px-1 md:px-1.5 py-0.5 rounded-md border ${tier.bg} ${tier.color} font-semibold hidden sm:inline`}>
                        {tier.icon} {tier.label}
                    </span>
                )}
                <span className="text-green-400 font-bold text-xs md:text-sm tabular-nums">{user.points}</span>
            </div>
        </div>
    );
}

function ActionRow({ action, wallet, claiming, claimPoints, setMessage, getReferralLink, claimedToday }) {
    const isDone = claimedToday?.includes(action.id);
    const base   = 'px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-xs font-semibold transition-all disabled:opacity-40';

    let btn;
    if (isDone && action.daily) {
        btn = <span className={`${base} bg-gray-700 text-gray-400`}>✓ Done</span>;
    } else if (action.id === 'telegram_bot') {
        btn = <a href="https://t.me/Pepelinebot" target="_blank" rel="noopener noreferrer"
            onClick={() => claimPoints(wallet, 'telegram_bot')}
            className={`${base} bg-blue-600 hover:bg-blue-500`}>Open Bot</a>;
    } else if (action.id === 'use_dashboard') {
        btn = <Link href="/dashboard" onClick={() => claimPoints(wallet, 'use_dashboard')}
            className={`${base} bg-purple-600 hover:bg-purple-500`}>Go</Link>;
    } else if (action.id === 'share_twitter') {
        btn = <a href="https://twitter.com/intent/tweet?text=🐸%20Real-time%20crypto%20sentiment%20→%20pepeline.com%20%23Pepeline%20%24SENT"
            target="_blank" rel="noopener noreferrer"
            onClick={() => claimPoints(wallet, 'share_twitter')}
            className={`${base} bg-gray-600 hover:bg-gray-500`}>Share</a>;
    } else if (action.id === 'refer_friend') {
        btn = <button onClick={() => { navigator.clipboard.writeText(getReferralLink()); setMessage({ type: 'success', text: 'Referral link copied! 🎉' }); }}
            className={`${base} bg-yellow-600 hover:bg-yellow-500 whitespace-nowrap`}>Copy Link</button>;
    } else if (action.id === 'read_brief') {
        btn = <Link href="/#market-brief" onClick={() => claimPoints(wallet, 'read_brief')}
            className={`${base} bg-teal-600 hover:bg-teal-500`}>Read</Link>;
    } else {
        btn = <button onClick={() => claimPoints(wallet, action.id)} disabled={claiming === action.id}
            className={`${base} bg-green-700 hover:bg-green-600`}>
            {claiming === action.id ? '…' : 'Claim'}
        </button>;
    }

    return (
        <div className="flex items-center justify-between p-2 md:p-3 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all">
            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                <span className="text-xl md:text-2xl shrink-0">{action.icon}</span>
                <div className="min-w-0 flex-1">
                    <p className="font-semibold text-xs md:text-sm truncate">{action.label}</p>
                    <p className="text-[10px] md:text-xs text-gray-500 hidden sm:block">{action.desc}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-2">
                <span className="text-green-400 font-bold text-xs md:text-sm whitespace-nowrap">+{action.points}</span>
                {btn}
            </div>
        </div>
    );
}

export default function WhitelistPage() {
    const { publicKey, connected } = useWallet();
    const { setVisible } = useWalletModal();
    const [user, setUser] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [globalStats, setGlobalStats] = useState(null);
    const [claiming, setClaiming] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [claimedToday, setClaimedToday] = useState([]);

    const wallet = publicKey?.toString();

    useEffect(() => {
        if (wallet && connected) {
            fetchUser();
            claimPoints(wallet, 'connect_wallet');
            claimPoints(wallet, 'daily_visit');
        }
    }, [wallet, connected]);

    useEffect(() => {
        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchUser = async () => {
        if (!wallet) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/points?wallet=${wallet}`);
            const data = await res.json();
            setUser(data);
            setClaimedToday(data.claimed_today || []);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const fetchLeaderboard = async () => {
        try {
            const res = await fetch('/api/points');
            const data = await res.json();
            setLeaderboard(data.leaderboard || []);
            setGlobalStats({ total: data.total_users || 0, whitelisted: data.whitelisted || 0 });
        } catch (err) {
            console.error(err);
        }
    };

    const claimPoints = async (w, actionId) => {
        if (!w || claiming === actionId) return;
        setClaiming(actionId);
        try {
            const res = await fetch('/api/points', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ wallet: w, action: actionId }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: `+${data.points_earned} points! 🎉` });
                fetchUser();
                fetchLeaderboard();
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to claim' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Network error' });
        }
        setClaiming(null);
        setTimeout(() => setMessage(null), 3000);
    };

    const getReferralLink = () => `${window.location.origin}/whitelist?ref=${wallet}`;

    const tier = user ? getTier(user.points) : null;
    const nextTier = user ? getNextTier(user.points) : null;
    const progress = user ? getProgress(user.points) : 0;

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />
            <div className="container mx-auto px-3 sm:px-4 py-6 md:py-12 max-w-6xl">
                
                {/* Hero */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 md:mb-12">
                    <div className="text-4xl md:text-6xl mb-3 md:mb-4">🎯</div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 md:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                        $SENT Token Whitelist
                    </h1>
                    <p className="text-sm md:text-xl text-gray-300">
                        Earn points to secure your spot in the token launch
                    </p>
                </motion.div>

                {/* Global Stats */}
                {globalStats && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-2 md:gap-4 mb-6 md:mb-8">
                        <div className="p-3 md:p-4 bg-purple-900/20 rounded-xl border border-purple-700/30 text-center">
                            <p className="text-xs md:text-sm text-gray-400 mb-1">Total Participants</p>
                            <p className="text-2xl md:text-3xl font-bold text-purple-400">{globalStats.total}</p>
                        </div>
                        <div className="p-3 md:p-4 bg-green-900/20 rounded-xl border border-green-700/30 text-center">
                            <p className="text-xs md:text-sm text-gray-400 mb-1">Whitelisted</p>
                            <p className="text-2xl md:text-3xl font-bold text-green-400">{globalStats.whitelisted}</p>
                        </div>
                    </motion.div>
                )}

                {/* Message Toast */}
                <AnimatePresence>
                    {message && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className={`mb-4 md:mb-6 p-3 md:p-4 rounded-xl text-center font-semibold ${
                                message.type === 'success' ? 'bg-green-900/50 text-green-300 border border-green-500/50' : 'bg-red-900/50 text-red-300 border border-red-500/50'
                            }`}>
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Connect Wallet CTA */}
                {!connected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="mb-6 md:mb-8 p-4 md:p-6 bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-2xl border border-purple-500/30 text-center">
                        <p className="text-base md:text-lg mb-3 md:mb-4">Connect your Solana wallet to start earning points</p>
                        <button onClick={() => setVisible(true)}
                            className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-bold text-sm md:text-base transition-all transform active:scale-95">
                            👛 Connect Wallet
                        </button>
                    </motion.div>
                )}

                {connected && (
                    <>
                        {/* User Stats Card */}
                        {user && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="mb-6 md:mb-8 p-4 md:p-6 bg-gray-800 rounded-2xl border border-gray-700">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs md:text-sm text-gray-400 mb-1">Your Wallet</p>
                                        <p className="font-mono text-sm md:text-base font-bold truncate">{wallet.slice(0, 8)}...{wallet.slice(-6)}</p>
                                    </div>
                                    <button onClick={() => setVisible(true)}
                                        className="px-3 md:px-4 py-1.5 md:py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap">
                                        Disconnect
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                                    <div className="text-center p-3 md:p-4 bg-gray-900/50 rounded-xl">
                                        <p className="text-xs md:text-sm text-gray-400 mb-1">Your Points</p>
                                        <p className="text-3xl md:text-4xl font-bold text-green-400">{user.points}</p>
                                    </div>
                                    <div className="text-center p-3 md:p-4 bg-gray-900/50 rounded-xl">
                                        <p className="text-xs md:text-sm text-gray-400 mb-1">Referrals</p>
                                        <p className="text-3xl md:text-4xl font-bold text-purple-400">{user.referrals || 0}</p>
                                    </div>
                                </div>

                                {tier ? (
                                    <div className={`p-3 md:p-4 rounded-xl border ${tier.bg} ${tier.color}`}>
                                        <p className="text-xs md:text-sm font-semibold mb-1">{tier.icon} {tier.label} Unlocked!</p>
                                        <p className="text-[10px] md:text-xs text-gray-400">{tier.perk}</p>
                                    </div>
                                ) : nextTier ? (
                                    <div className="p-3 md:p-4 bg-gray-900/50 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs md:text-sm text-gray-400">Progress to {nextTier.label}</p>
                                            <p className="text-xs md:text-sm font-bold">{user.points}/{nextTier.min}</p>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className={`h-2 rounded-full bg-gradient-to-r ${nextTier.bar}`} style={{ width: `${progress}%` }} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 md:p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl text-center">
                                        <p className="font-bold text-sm md:text-base">🎉 Max Tier Achieved!</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Actions Grid */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                            className="mb-6 md:mb-8">
                            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">💎 Earn Points</h2>
                            <div className="space-y-2 md:space-y-3">
                                {ACTIONS.map((action) => (
                                    <ActionRow key={action.id} action={action} wallet={wallet} claiming={claiming}
                                        claimPoints={claimPoints} setMessage={setMessage} getReferralLink={getReferralLink}
                                        claimedToday={claimedToday} />
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}

                {/* Leaderboard */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">🏆 Leaderboard</h2>
                    <div className="space-y-1.5 md:space-y-2 max-h-96 overflow-y-auto">
                        {leaderboard.slice(0, 50).map((u, i) => (
                            <LeaderboardRow key={u.wallet_address} user={u} index={i} currentWallet={wallet} />
                        ))}
                    </div>
                </motion.div>

                {/* Tiers Info */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    className="mt-6 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    {TIERS.map((t) => (
                        <div key={t.label} className={`p-4 md:p-6 rounded-xl border ${t.bg}`}>
                            <p className={`text-2xl md:text-3xl ${t.color} font-bold mb-2`}>{t.icon} {t.label}</p>
                            <p className="text-xs md:text-sm text-gray-400 mb-2">{t.min}+ points</p>
                            <p className="text-xs md:text-sm text-gray-300">{t.perk}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
            <Footer />
        </main>
    );
}
