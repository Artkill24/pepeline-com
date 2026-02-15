'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import IndexInlineDisplay from '@/components/IndexInlineDisplay';
import IndexHistoryChart from '@/components/IndexHistoryChart';
import TopCoinsSection from '@/components/TopCoinsSection';
import MarketBrief from '@/components/MarketBrief';
import Roadmap from '@/components/Roadmap';
import Footer from '@/components/Footer';
import SEOContent from '@/components/SEOContent';
import AutoTweetButton from '@/components/AutoTweetButton';
import NFTTrendingSection from '@/components/NFTTrendingSection';

export default function Home() {
  const [index, setIndex] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchAll();
    // Force loading off after 8 seconds no matter what
    const timeout = setTimeout(() => setLoading(false), 8000);
    const interval = setInterval(fetchAll, 30000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  const fetchWithTimeout = (url, ms = 6000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    return fetch(url, { signal: controller.signal })
      .finally(() => clearTimeout(timer));
  };

  const fetchAll = async () => {
    try {
      const [indexRes, metricsRes, coinsRes] = await Promise.allSettled([
        fetchWithTimeout('/api/index', 6000),
        fetchWithTimeout('/api/advanced-metrics', 6000),
        fetchWithTimeout('/api/all-coins', 6000),
      ]);

      if (indexRes.status === 'fulfilled') {
        const indexData = await indexRes.value.json();
        setIndex(indexData);
      }
      if (metricsRes.status === 'fulfilled') {
        const metricsData = await metricsRes.value.json();
        setMetrics(metricsData);
      }
      if (coinsRes.status === 'fulfilled') {
        const coinsData = await coinsRes.value.json();
        setCoins(coinsData.coins?.slice(0, 8) || []);
      }

      setLastUpdate(new Date());
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSignalColor = (signal) => {
    if (!signal) return 'text-gray-400';
    if (signal.includes('BUY')) return 'text-green-400';
    if (signal.includes('SELL')) return 'text-red-400';
    return 'text-yellow-400';
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return '—';
    if (price < 0.001) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 1000) return `$${price.toFixed(2)}`;
    return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  return (
    <main className="min-h-screen bg-[#0a0a14] text-white overflow-hidden relative">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-700/10 rounded-full blur-3xl" />
      </div>

      <Header />

      {/* Live Ticker Bar */}
      {coins.length > 0 && (
        <div className="w-full bg-purple-950/40 border-y border-purple-800/30 overflow-hidden py-2">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex gap-8 whitespace-nowrap"
          >
            {[...coins, ...coins].map((coin, i) => (
              <span key={i} className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">{coin.symbol}</span>
                <span className="font-semibold">{formatPrice(coin.price)}</span>
                <span className={coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h || 0).toFixed(2)}%
                </span>
                <span className="text-purple-700 mx-2">|</span>
              </span>
            ))}
          </motion.div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12 relative z-10">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
            className="text-8xl mb-6 inline-block"
          >
            🐸
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
            Pepeline
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">
            Real-Time Crypto Sentiment Intelligence
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
            {['Alchemy On-Chain', 'Gemini AI', 'Live Data', '20+ Tokens'].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-purple-900/40 border border-purple-700/40 rounded-full text-xs text-purple-300">
                {tag}
              </span>
            ))}
          </div>

          {lastUpdate && (
            <p className="text-xs text-gray-600 mb-8">
              🔄 Updated {lastUpdate.toLocaleTimeString()} — auto-refresh every 30s
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-900/40">
              📊 Dashboard
            </Link>
            <Link href="/whitelist"
              className="px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-pink-900/40">
              🎯 Get Whitelist
            </Link>
            <a href="https://t.me/Pepelinebot" target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-900/30">
              🤖 Telegram
            </a>
            <Link href="/coins"
              className="px-8 py-4 bg-gray-800/80 hover:bg-gray-700/80 border border-purple-700/30 rounded-xl font-bold text-lg transition-all transform hover:scale-105">
              ⛓️ Coins
            </Link>
          </div>
        </motion.div>

        {/* Main Index Display */}
        <div className="mb-14">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-purple-500/30"></div>
                </div>
                <p className="text-gray-400 text-sm">Fetching on-chain data...</p>
              </div>
            </div>
          ) : index ? (
            <IndexInlineDisplay index={index} />
          ) : (
            <div className="text-center py-12 text-gray-400">
              Failed to load index. Please refresh.
            </div>
          )}
        </div>

        {/* Historical Chart */}
        <IndexHistoryChart />

        {/* Live On-Chain Stats */}
        <AnimatePresence>
          {metrics && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-14"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">⛓️ Live On-Chain Data</h2>
                <span className="flex items-center gap-2 text-xs text-purple-400">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                  Alchemy Ethereum Mainnet
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <motion.div whileHover={{ scale: 1.03 }} className="p-5 bg-gradient-to-br from-orange-900/20 to-purple-950/50 rounded-xl border border-orange-500/20">
                  <div className="text-3xl mb-2">⛽</div>
                  <p className="text-xs text-gray-400 mb-1">Gas Price</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {metrics.onchain?.gas?.safe || '—'} <span className="text-sm">Gwei</span>
                  </p>
                  <p className={`text-xs mt-1 ${metrics.onchain?.gas?.congestion === 'LOW' ? 'text-green-400' : metrics.onchain?.gas?.congestion === 'HIGH' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {metrics.onchain?.gas?.congestion || 'UNKNOWN'}
                  </p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} className="p-5 bg-gradient-to-br from-purple-900/20 to-purple-950/50 rounded-xl border border-purple-500/20">
                  <div className="text-3xl mb-2">🐋</div>
                  <p className="text-xs text-gray-400 mb-1">Whale Activity</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {metrics.onchain?.whales?.recentTransfers || 0}
                  </p>
                  <p className={`text-xs mt-1 ${metrics.onchain?.whales?.signal === 'ACCUMULATION' ? 'text-green-400' : metrics.onchain?.whales?.signal === 'DISTRIBUTION' ? 'text-red-400' : 'text-gray-400'}`}>
                    {metrics.onchain?.whales?.signal || 'NEUTRAL'}
                  </p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} className="p-5 bg-gradient-to-br from-blue-900/20 to-purple-950/50 rounded-xl border border-blue-500/20">
                  <div className="text-3xl mb-2">🔗</div>
                  <p className="text-xs text-gray-400 mb-1">Network Load</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {metrics.onchain?.network?.utilization || 0}%
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Block #{(metrics.onchain?.network?.blockNumber || 0).toLocaleString()}
                  </p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} className="p-5 bg-gradient-to-br from-fuchsia-900/20 to-purple-950/50 rounded-xl border border-fuchsia-500/20">
                  <div className="text-3xl mb-2">🎯</div>
                  <p className="text-xs text-gray-400 mb-1">Alpha Score</p>
                  <p className="text-2xl font-bold text-fuchsia-400">{metrics.alphaScore || 50}</p>
                  <p className={`text-xs mt-1 font-bold ${getSignalColor(metrics.signal)}`}>
                    {metrics.signal || 'HOLD'}
                  </p>
                </motion.div>
              </div>

              {/* Macro Stats */}
              {metrics.macro && (
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label: 'Fear & Greed', value: metrics.macro.fng?.value || '—', sub: metrics.macro.fng?.classification, icon: metrics.macro.fng?.emoji || '😐' },
                    { label: 'BTC Dominance', value: `${metrics.macro.btcDom?.percentage || '—'}%`, sub: metrics.macro.btcDom?.trend, icon: '₿' },
                    {
                      label: 'Total Market Cap',
                      value: metrics.macro.mcap?.formatted || '—',
                      sub: `${metrics.macro.mcap?.change24h || '0'}% (24h)`,
                      icon: '💰',
                      subColor: parseFloat(metrics.macro.mcap?.change24h || 0) > 0 ? 'text-green-400' : 'text-red-400'
                    },
                  ].map((stat) => (
                    <motion.div key={stat.label} whileHover={{ scale: 1.02 }} className="p-5 bg-purple-950/30 rounded-xl border border-purple-800/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                          <p className="text-3xl font-bold">{stat.value}</p>
                          <p className={`text-xs mt-1 ${stat.subColor || 'text-gray-400'}`}>{stat.sub}</p>
                        </div>
                        <div className="text-4xl">{stat.icon}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Top On-Chain Coins */}
        {coins.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-14"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">🔥 Top On-Chain Coins</h2>
              <Link href="/coins" className="text-sm text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                View all 20 →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {coins.map((coin, i) => (
                <Link key={coin.id} href={`/coin/${coin.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.04, y: -3 }}
                    className="p-4 bg-purple-950/30 rounded-xl border border-purple-800/30 hover:border-purple-500/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm">{coin.symbol}</p>
                        <p className="text-xs text-gray-500 truncate">{coin.name}</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-center mb-1">{coin.sentiment}</p>
                    <div className="w-full bg-gray-800 rounded-full h-1 mb-2">
                      <div
                        className={`h-1 rounded-full ${coin.sentiment >= 60 ? 'bg-green-500' : coin.sentiment >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${coin.sentiment}%` }}
                      />
                    </div>
                    <p className={`text-xs text-center ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h || 0).toFixed(2)}%
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* NFT Hype Index */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
        >
          <NFTTrendingSection compact={true} />
        </motion.section>

        {/* $PIPE Whitelist CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-14"
        >
          <div className="relative overflow-hidden p-8 md:p-12 bg-gradient-to-br from-purple-900/40 via-violet-900/30 to-fuchsia-900/30 rounded-2xl border border-purple-700/40">
            <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-3xl md:text-4xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                $PIPE Token Launch Coming
              </h3>
              <p className="text-gray-300 mb-4 max-w-2xl mx-auto">
                Earn points on pepeline.com to secure your spot in the $PIPE whitelist.
                Holders get premium access, airdrops, and DAO voting rights.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm text-gray-400">
                <span>✅ 100 pts → Whitelist</span>
                <span>⚡ 250 pts → Priority Access</span>
                <span>👑 500 pts → OG Member + NFT</span>
              </div>
              <Link href="/whitelist"
                className="inline-block px-10 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 rounded-xl font-black text-xl transition-all transform hover:scale-105 shadow-lg shadow-purple-900/40">
                Start Earning Points →
              </Link>
            </div>
          </div>
        </motion.section>

        {/* What is Pepeline */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-14"
        >
          <div className="bg-purple-950/20 rounded-2xl p-8 border border-purple-800/30">
            <h2 className="text-3xl font-bold mb-4">What is Pepeline?</h2>
            <p className="text-gray-300 mb-6">
              Pepeline combines Gemini AI, Alchemy on-chain data, social signals,
              and macro indicators into a single 0-100 sentiment index for the crypto market.
            </p>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { icon: '⛓️', title: 'Alchemy On-Chain', desc: 'Gas, whale tracking, block data' },
                { icon: '🤖', title: 'Gemini AI', desc: 'Smart market analysis & insights' },
                { icon: '📊', title: 'Live Sentiment', desc: '0-100 index updated every 30s' },
                { icon: '⚡', title: 'Telegram Alerts', desc: 'Instant notifications on extremes' },
              ].map((f) => (
                <div key={f.title} className="text-center p-4 bg-purple-900/20 rounded-xl border border-purple-800/20">
                  <div className="text-4xl mb-3">{f.icon}</div>
                  <h3 className="font-bold mb-2 text-sm">{f.title}</h3>
                  <p className="text-xs text-gray-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Telegram CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-14"
        >
          <div className="p-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl border border-blue-700/30 text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-3xl font-bold mb-3">Never Miss a Market Move</h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              Get instant Telegram alerts on whale movements, gas spikes, and extreme sentiment levels.
            </p>
            <a href="https://t.me/Pepelinebot" target="_blank" rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg transition-all transform hover:scale-105">
              Start Bot - Free Forever
            </a>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
              <span>✅ Extreme Alerts</span>
              <span>✅ Whale Tracking</span>
              <span>✅ Gas Spikes</span>
              <span>✅ Daily Summary</span>
            </div>
          </div>
        </motion.section>

        {/* Market Brief */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-14"
        >
          <MarketBrief />
        </motion.section>

        {/* Roadmap */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mb-14"
        >
          <Roadmap />
        </motion.section>

        {/* SEO */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-14"
        >
          <SEOContent />
        </motion.section>

      </div>

      <Footer />
    </main>
  );
}
