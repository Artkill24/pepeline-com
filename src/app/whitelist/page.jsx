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

// ─── Leaderboard row ────────────────────────────────────────────────────────
function LeaderboardRow({ user, index, currentWallet }) {
    const tier   = getTier(user.points);
    const medals = ['🥇', '🥈', '🥉'];
    const isSelf = user.wallet_address === currentWallet;
    return (
        <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
            isSelf ? 'bg-green-900/30 border border-green-500/30' : 'bg-gray-900/50 hover:bg-gray-700/30'
        }`}>
            <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-sm font-bold text-gray-400 w-6 shrink-0 text-center">
                    {index < 3 ? medals[index] : index + 1}
                </span>
                <span className="font-mono text-xs text-gray-300 truncate">
                    {user.wallet_address.slice(0, 6)}…{user.wallet_address.slice(-4)}
                </span>
                {isSelf && <span className="text-xs text-green-400 shrink-0">(you)</span>}
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
                {tier && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-md border ${tier.bg} ${tier.color} font-semibold hidden sm:inline`}>
                        {tier.icon} {tier.label}
                    </span>
                )}
                <span className="text-green-400 font-bold text-sm tabular-nums">{user.points}</span>
            </div>
        </div>
    );
}

// ─── Action row ─────────────────────────────────────────────────────────────
function ActionRow({ action, wallet, claiming, claimPoints, setMessage, getReferralLink, claimedToday }) {
    const isDone = claimedToday?.includes(action.id);
    const base   = 'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40';

    let btn;
    if (isDone && action.daily) {
        btn = <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-700 text-gray-400">✓ Done</span>;
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
            className={`${base} bg-yellow-600 hover:bg-yellow-500`}>Copy Link</button>;
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
        <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
            isDone && action.daily
                ? 'bg-gray-900/20 border-gray-700/40 opacity-60'
                : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
        }`}>
            <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0">{action.icon}</span>
                <div className="min-w-0">
                    <p className="font-semibold text-sm">{action.label}</p>
                    <p className="text-xs text-gray-400 truncate">{action.desc}</p>
                </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className="text-green-400 font-bold text-sm">+{action.points}</span>
                {btn}
            </div>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function WhitelistPage() {
    const { publicKey, connected, disconnect } = useWallet();
    const { setVisible } = useWalletModal();

    const [wallet,         setWallet]         = useState('');
    const [userData,       setUserData]       = useState(null);
    const [leaderboard,    setLeaderboard]    = useState([]);
    const [stats,          setStats]          = useState({ total_users: 0, whitelisted: 0 });
    const [loading,        setLoading]        = useState(false);
    const [claiming,       setClaiming]       = useState(null);
    const [message,        setMessage]        = useState(null);
    const [referralCode,   setReferralCode]   = useState('');
    const [referralCopied, setReferralCopied] = useState(false);

    const claimedToday = userData?.claimed_today || [];

    // Auto-connect when wallet connects
    useEffect(() => {
        if (connected && publicKey) {
            const addr = publicKey.toBase58();
            setWallet(addr);
            fetchUser(addr);
            claimPoints(addr, 'daily_visit');
            claimPoints(addr, 'connect_wallet');
        }
        if (!connected) {
            setWallet('');
            setUserData(null);
        }
    }, [connected, publicKey]);

    useEffect(() => {
        fetchLeaderboard();
        const p = new URLSearchParams(window.location.search);
        if (p.get('ref')) setReferralCode(p.get('ref'));
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res  = await fetch('/api/points');
            const data = await res.json();
            setLeaderboard(data.leaderboard || []);
            setStats({ total_users: data.total_users || 0, whitelisted: data.whitelisted || 0 });
        } catch (_) {}
    };

    const fetchUser = async (addr) => {
        setLoading(true);
        try {
            const res  = await fetch(`/api/points?wallet=${addr}`);
            const data = await res.json();
            setUserData(data);
        } catch (_) {}
        setLoading(false);
    };

    const claimPoints = async (addr, action) => {
        setClaiming(action);
        try {
            const res  = await fetch('/api/points', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ wallet: addr || wallet, action, referral_code: referralCode || undefined }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: `+${data.points_earned} pts! Total: ${data.total_points} 🎉` });
                fetchUser(addr || wallet);
                fetchLeaderboard();
            } else {
                setMessage({ type: 'info', text: data.message || 'Already claimed today' });
            }
        } catch (_) {
            setMessage({ type: 'error', text: 'Network error — try again' });
        }
        setClaiming(null);
        setTimeout(() => setMessage(null), 3500);
    };

    const handleDisconnect = () => {
        disconnect();
        setWallet('');
        setUserData(null);
    };

    const getReferralLink    = () => `https://pepeline.com/whitelist?ref=${wallet}`;
    const handleCopyReferral = () => {
        navigator.clipboard.writeText(getReferralLink());
        setReferralCopied(true);
        setMessage({ type: 'success', text: 'Referral link copied! 🎉' });
        setTimeout(() => setReferralCopied(false), 2000);
    };

    const currentTier = userData ? getTier(userData.points)     : null;
    const nextTier    = userData ? getNextTier(userData.points) : TIERS[0];
    const progress    = userData ? getProgress(userData.points || 0) : 0;

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header />

            {/* Toast */}
            <AnimatePresence>
                {message && (
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl font-semibold shadow-2xl text-sm max-w-xs ${
                            message.type === 'success' ? 'bg-green-600' : message.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
                        }`}>
                        {message.type === 'success' ? '✅' : message.type === 'error' ? '❌' : 'ℹ️'} {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4 py-12 max-w-6xl">

                {/* Hero */}
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                    <div className="text-7xl mb-4 select-none">🎯</div>
                    <h1 className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-purple-500">
                        Pepeline Whitelist
                    </h1>
                    <p className="text-xl text-gray-300 mb-2">
                        Earn points → Get <span className="text-green-400 font-bold">$SENT</span> token early
                    </p>
                    <p className="text-sm text-gray-500">100 pts = Whitelist · 250 = Priority · 500 = OG Member</p>

                    {/* Global stats */}
                    <div className="flex justify-center gap-8 mt-6">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">{stats.total_users.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Participants</p>
                        </div>
                        <div className="w-px bg-gray-700" />
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-400">{stats.whitelisted.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Whitelisted</p>
                        </div>
                        <div className="w-px bg-gray-700" />
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-400">{leaderboard.length}</p>
                            <p className="text-xs text-gray-500">On leaderboard</p>
                        </div>
                    </div>
                </motion.div>

                {/* Tier cards */}
                <div className="grid md:grid-cols-3 gap-4 mb-10">
                    {TIERS.map((tier, i) => {
                        const isActive = currentTier?.label === tier.label;
                        return (
                            <motion.div key={tier.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                className={`p-5 rounded-2xl border text-center transition-all ${tier.bg} ${isActive ? 'ring-2 ring-offset-1 ring-offset-gray-900' : ''}`}>
                                <div className="text-4xl mb-2">{tier.icon}</div>
                                <p className={`text-xl font-bold ${tier.color}`}>{tier.label}</p>
                                <p className="text-2xl font-extrabold mt-1">{tier.min}+ pts</p>
                                <p className="text-xs text-gray-400 mt-2 leading-relaxed">{tier.perk}</p>
                                {isActive && <span className="mt-3 inline-block text-xs px-2 py-0.5 rounded-full bg-white/10 text-white font-semibold">Your tier ✓</span>}
                            </motion.div>
                        );
                    })}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">

                        {/* Connect wallet OR User stats */}
                        {!wallet ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="p-8 bg-gray-800 rounded-2xl border border-gray-700 text-center">
                                <div className="text-5xl mb-4">👻</div>
                                <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
                                <p className="text-gray-400 text-sm mb-6">
                                    Connect your Solana wallet to start earning points toward{' '}
                                    <span className="text-green-400 font-bold">$SENT</span>
                                </p>
                                <button
                                    onClick={() => setVisible(true)}
                                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 rounded-xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-green-900/30"
                                >
                                    <span className="text-xl">👛</span> Connect Phantom / Solflare
                                </button>

                                {/* Supported wallets */}
                                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                                    <span>Supports:</span>
                                    <span className="flex items-center gap-1">👻 Phantom</span>
                                    <span>·</span>
                                    <span className="flex items-center gap-1">🔥 Solflare</span>
                                </div>

                                {referralCode && (
                                    <p className="text-xs text-green-400 mt-4">
                                        🎉 Referred by <span className="font-mono">{referralCode.slice(0, 8)}…</span> — your referrer earns +25 pts!
                                    </p>
                                )}
                            </motion.div>
                        ) : (
                            /* User stats card */
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="p-6 bg-gray-800 rounded-2xl border border-gray-700">
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Connected</p>
                                        <p className="font-mono text-sm text-gray-200">{wallet.slice(0, 8)}…{wallet.slice(-6)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {currentTier
                                            ? <span className={`px-3 py-1.5 rounded-full text-sm font-bold border ${currentTier.bg} ${currentTier.color}`}>{currentTier.icon} {currentTier.label}</span>
                                            : <span className="px-3 py-1.5 rounded-full text-sm font-bold border bg-gray-700/50 border-gray-600 text-gray-400">No tier yet</span>
                                        }
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="space-y-3 animate-pulse">
                                        <div className="h-10 bg-gray-700 rounded-xl w-1/3" />
                                        <div className="h-3 bg-gray-700 rounded-full" />
                                    </div>
                                ) : userData ? (
                                    <>
                                        <div className="flex items-end justify-between mb-2">
                                            <span className="text-5xl font-extrabold text-green-400 tabular-nums leading-none">
                                                {(userData.points || 0).toLocaleString()}
                                            </span>
                                            <span className="text-gray-400 text-sm mb-1">
                                                / {nextTier ? `${nextTier.min} pts` : 'MAX'} for {nextTier?.label ?? '👑 OG Member'}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden mb-4">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                                                className={`h-3 rounded-full bg-gradient-to-r ${currentTier?.bar || 'from-green-500 to-blue-500'}`} />
                                        </div>

                                        {/* Mini stats */}
                                        <div className="grid grid-cols-3 gap-3 text-center text-sm mb-5">
                                            <div className="bg-gray-900/50 rounded-xl p-3">
                                                <p className="text-lg font-bold text-white">#{userData.rank || '—'}</p>
                                                <p className="text-xs text-gray-500">Rank</p>
                                            </div>
                                            <div className="bg-gray-900/50 rounded-xl p-3">
                                                <p className="text-lg font-bold text-blue-400">{userData.visits || 0}</p>
                                                <p className="text-xs text-gray-500">Visits</p>
                                            </div>
                                            <div className="bg-gray-900/50 rounded-xl p-3">
                                                <p className="text-lg font-bold text-yellow-400">{userData.referrals || 0}</p>
                                                <p className="text-xs text-gray-500">Referrals</p>
                                            </div>
                                        </div>

                                        {/* Referral box */}
                                        <div className="p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-xl mb-4">
                                            <p className="text-xs text-yellow-400 font-semibold mb-2">👥 Your Referral Link — +25 pts per friend</p>
                                            <div className="flex gap-2">
                                                <input readOnly value={getReferralLink()}
                                                    className="flex-1 px-3 py-2 bg-gray-900 rounded-lg text-xs font-mono text-gray-300 border border-gray-700 outline-none" />
                                                <button onClick={handleCopyReferral}
                                                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all text-white ${referralCopied ? 'bg-green-600' : 'bg-yellow-600 hover:bg-yellow-500'}`}>
                                                    {referralCopied ? '✓ Copied' : 'Copy'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Disconnect */}
                                        <button onClick={handleDisconnect}
                                            className="w-full py-2 bg-gray-700/50 hover:bg-gray-700 rounded-xl text-xs text-gray-400 hover:text-gray-300 transition-all">
                                            Disconnect wallet
                                        </button>
                                    </>
                                ) : null}
                            </motion.div>
                        )}

                        {/* Actions */}
                        {wallet && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="p-6 bg-gray-800 rounded-2xl border border-gray-700">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-xl font-bold">🎮 Earn Points</h2>
                                    <span className="text-xs text-gray-500">Daily tasks reset at 00:00 UTC</span>
                                </div>
                                <div className="space-y-2.5">
                                    {ACTIONS.map((action) => (
                                        <ActionRow key={action.id} action={action} wallet={wallet} claiming={claiming}
                                            claimPoints={claimPoints} setMessage={setMessage}
                                            getReferralLink={getReferralLink} claimedToday={claimedToday} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Leaderboard */}
                    <div>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                            className="p-6 bg-gray-800 rounded-2xl border border-gray-700 sticky top-4">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-xl font-bold">🏆 Leaderboard</h2>
                                <span className="text-xs text-gray-500">Top {Math.min(leaderboard.length, 50)}</span>
                            </div>
                            {leaderboard.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-4xl mb-3">🚀</p>
                                    <p className="text-gray-400 text-sm">Be the first to join!</p>
                                    <p className="text-gray-600 text-xs mt-1">Connect your wallet to claim the #1 spot</p>
                                </div>
                            ) : (
                                <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                                    {leaderboard.map((user, i) => (
                                        <LeaderboardRow key={user.wallet_address} user={user} index={i} currentWallet={wallet} />
                                    ))}
                                </div>
                            )}
                            {/* Tier legend */}
                            <div className="mt-5 pt-4 border-t border-gray-700 space-y-1.5">
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Tier legend</p>
                                {TIERS.map((t) => (
                                    <div key={t.label} className="flex items-center justify-between text-xs">
                                        <span className={`flex items-center gap-1.5 ${t.color}`}>{t.icon} {t.label}</span>
                                        <span className="text-gray-500">{t.min}+ pts</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
