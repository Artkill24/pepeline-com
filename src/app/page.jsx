'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import IndexDisplay3D from '@/components/IndexDisplay3D';
import TopCoinsSection from '@/components/TopCoinsSection';
import MarketBrief from '@/components/MarketBrief';
import Roadmap from '@/components/Roadmap';
import Footer from '@/components/Footer';
import SEOContent from '@/components/SEOContent';
import AutoTweetButton from '@/components/AutoTweetButton';

export default function Home() {
  const [index, setIndex] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAll = async () => {
    try {
      const [indexRes, metricsRes] = await Promise.all([
        fetch('/api/index'),
        fetch('/api/advanced-metrics')
      ]);
      const indexData = await indexRes.json();
      const metricsData = await metricsRes.json();
      setIndex(indexData);
      setMetrics(metricsData);
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

  const getIndexBg = (idx) => {
    if (!idx) return 'from-gray-800 to-gray-900';
    if (idx >= 80) return 'from-red-900/40 to-orange-900/40';
    if (idx >= 60) return 'from-orange-900/40 to-yellow-900/40';
    if (idx >= 40) return 'from-gray-800 to-gray-900';
    if (idx >= 20) return 'from-blue-900/40 to-cyan-900/40';
    return 'from-green-900/40 to-teal-900/40';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <Header />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-7xl mb-6 inline-block"
          >
            🐸
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-500">
            Pepeline
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">
            Real-Time Crypto Sentiment Intelligence
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Powered by AI • Alchemy On-Chain • Live Data • 100+ Coins
          </p>

          {lastUpdate && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-gray-600 mb-6"
            >
              Last updated: {lastUpdate.toLocaleTimeString()} — refreshes every 30s
            </motion.p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-green-900/30"
            >
              📊 Dashboard
            </Link>
            <a
              href="https://t.me/Pepelinebot"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-900/30"
            >
              🤖 Telegram Bot
            </a>
            <Link
              href="/portfolio"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
            >
              💼 Portfolio
            </Link>
          </div>
        </motion.div>

        {/* Main Index Display */}
        <div className="mb-12">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
                <p className="text-gray-400 text-sm">Loading live data...</p>
              </div>
            </div>
          ) : index ? (
            <div className="flex flex-col items-center">
              <IndexDisplay3D index={index.index} breakdown={index.breakdown} />
              <AutoTweetButton indexData={index} />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Failed to load index. Please refresh.</p>
            </div>
          )}
        </div>

        {/* Live On-Chain Stats from Alchemy */}
        <AnimatePresence>
          {metrics && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-16"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">⛓️ Live On-Chain Data</h2>
                <span className="flex items-center gap-2 text-xs text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Powered by Alchemy
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {/* Gas Price */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="p-5 bg-gradient-to-br from-orange-900/30 to-gray-800 rounded-xl border border-orange-500/20"
                >
                  <div className="text-3xl mb-2">⛽</div>
                  <p className="text-xs text-gray-400 mb-1">Gas Price</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {metrics.onchain?.gas?.safe || '—'} <span className="text-sm">Gwei</span>
                  </p>
                  <p className={`text-xs mt-1 ${
                    metrics.onchain?.gas?.congestion === 'LOW' ? 'text-green-400' :
                    metrics.onchain?.gas?.congestion === 'HIGH' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {metrics.onchain?.gas?.congestion || 'UNKNOWN'}
                  </p>
                </motion.div>

                {/* Whale Signal */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="p-5 bg-gradient-to-br from-purple-900/30 to-gray-800 rounded-xl border border-purple-500/20"
                >
                  <div className="text-3xl mb-2">🐋</div>
                  <p className="text-xs text-gray-400 mb-1">Whale Activity</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {metrics.onchain?.whales?.recentTransfers || 0}
                  </p>
                  <p className={`text-xs mt-1 ${
                    metrics.onchain?.whales?.signal === 'ACCUMULATION' ? 'text-green-400' :
                    metrics.onchain?.whales?.signal === 'DISTRIBUTION' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {metrics.onchain?.whales?.signal || 'NEUTRAL'}
                  </p>
                </motion.div>

                {/* Network Health */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="p-5 bg-gradient-to-br from-blue-900/30 to-gray-800 rounded-xl border border-blue-500/20"
                >
                  <div className="text-3xl mb-2">🔗</div>
                  <p className="text-xs text-gray-400 mb-1">Network Load</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {metrics.onchain?.network?.utilization || 0}%
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Block #{(metrics.onchain?.network?.blockNumber || 0).toLocaleString()}
                  </p>
                </motion.div>

                {/* Alpha Signal */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className={`p-5 bg-gradient-to-br ${getIndexBg(metrics.alphaScore)} rounded-xl border border-gray-700`}
                >
                  <div className="text-3xl mb-2">🎯</div>
                  <p className="text-xs text-gray-400 mb-1">Alpha Score</p>
                  <p className="text-2xl font-bold text-white">
                    {metrics.alphaScore || 50}
                  </p>
                  <p className={`text-xs mt-1 font-semibold ${getSignalColor(metrics.signal)}`}>
                    {metrics.signal || 'HOLD'}
                  </p>
                </motion.div>
              </div>

              {/* Macro Stats */}
              {metrics.macro && (
                <div className="grid md:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-5 bg-gray-800/50 rounded-xl border border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Fear & Greed Index</p>
                        <p className="text-3xl font-bold">{metrics.macro.fng?.value || '—'}</p>
                        <p className="text-xs text-gray-400 mt-1">{metrics.macro.fng?.classification || ''}</p>
                      </div>
                      <div className="text-4xl">{metrics.macro.fng?.emoji || '😐'}</div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-5 bg-gray-800/50 rounded-xl border border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">BTC Dominance</p>
                        <p className="text-3xl font-bold">{metrics.macro.btcDom?.percentage || '—'}%</p>
                        <p className="text-xs text-gray-400 mt-1">{metrics.macro.btcDom?.trend || ''}</p>
                      </div>
                      <div className="text-4xl">₿</div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-5 bg-gray-800/50 rounded-xl border border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Total Market Cap</p>
                        <p className="text-3xl font-bold">{metrics.macro.mcap?.formatted || '—'}</p>
                        <p className={`text-xs mt-1 ${
                          parseFloat(metrics.macro.mcap?.change24h || 0) > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {metrics.macro.mcap?.change24h || '0'}% (24h)
                        </p>
                      </div>
                      <div className="text-4xl">💰</div>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* What is Pepeline */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold mb-4">What is Pepeline?</h2>
            <p className="text-gray-300 mb-6">
              Pepeline combines AI analysis, real-time on-chain data via Alchemy, 
              social signals, and macro indicators into a single 0-100 index 
              representing the current crypto market sentiment.
            </p>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gray-900/50 rounded-xl">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold mb-2">Live Market Data</h3>
                <p className="text-sm text-gray-400">Real-time prices from top exchanges</p>
              </div>
              <div className="text-center p-4 bg-gray-900/50 rounded-xl">
                <div className="text-4xl mb-3">🤖</div>
                <h3 className="font-bold mb-2">AI Analysis</h3>
                <p className="text-sm text-gray-400">Gemini AI powered insights & commentary</p>
              </div>
              <div className="text-center p-4 bg-gray-900/50 rounded-xl">
                <div className="text-4xl mb-3">⛓️</div>
                <h3 className="font-bold mb-2">Alchemy On-Chain</h3>
                <p className="text-sm text-gray-400">Gas prices, whale tracking, network health</p>
              </div>
              <div className="text-center p-4 bg-gray-900/50 rounded-xl">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-bold mb-2">Telegram Alerts</h3>
                <p className="text-sm text-gray-400 mb-2">Instant notifications on extremes</p>
                <a
                  href="https://t.me/Pepelinebot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
                >
                  Try Bot →
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Top Coins */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <TopCoinsSection />
        </motion.section>

        {/* Market Brief */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <MarketBrief />
        </motion.section>

        {/* Telegram CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mb-16"
        >
          <div className="p-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl border border-blue-500/30">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-3xl font-bold mb-3">Never Miss a Market Move</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Get instant Telegram alerts when the Pepeline Index reaches extreme levels,
                whale wallets move large amounts, or gas prices spike.
              </p>
              <a
                href="https://t.me/Pepelinebot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Start Bot - Free Forever
              </a>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                <span>✅ Extreme Fear/Greed Alerts</span>
                <span>✅ Whale Movement Tracking</span>
                <span>✅ Gas Price Spikes</span>
                <span>✅ Daily Market Summary</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* SEO & Roadmap */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <SEOContent />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mb-16"
        >
          <Roadmap />
        </motion.section>
      </div>

      <Footer />
    </main>
  );
}
