#!/bin/bash

echo "Creating page.jsx..."

cat > src/app/page.jsx << 'EOF'
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndex = () => {
      fetch('/api/index')
        .then(res => res.json())
        .then(data => {
          setIndex(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Index fetch error:', err);
          setLoading(false);
        });
    };

    fetchIndex();
    const interval = setInterval(fetchIndex, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Pepeline
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">
            Real-Time Crypto Sentiment Tracker
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Powered by AI • Live Market Data • 100+ Coins
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link href="/dashboard" className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
              📊 Dashboard
            </Link>
            <a href="https://t.me/Pepelinebot" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
              🤖 Telegram Bot
            </a>
            <Link href="/portfolio" className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105">
              💼 Portfolio
            </Link>
          </div>
        </motion.div>

        <div className="mb-12">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
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

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-16">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold mb-4">What is Pepeline?</h2>
            <p className="text-gray-300 mb-4">
              Pepeline is a real-time crypto sentiment tracker that combines market data, 
              social signals, and AI analysis to give you a single number representing 
              the current crypto market vibe.
            </p>
            <div className="grid md:grid-cols-4 gap-6 mt-8">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="font-bold mb-2">Live Market Data</h3>
                <p className="text-sm text-gray-400">Real-time prices from top exchanges</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🤖</div>
                <h3 className="font-bold mb-2">AI Analysis</h3>
                <p className="text-sm text-gray-400">Gemini AI powered insights</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🐋</div>
                <h3 className="font-bold mb-2">Whale Tracking</h3>
                <p className="text-sm text-gray-400">Monitor smart money moves</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="font-bold mb-2">Telegram Alerts</h3>
                <p className="text-sm text-gray-400 mb-2">Instant notifications</p>
                <a href="https://t.me/Pepelinebot" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm font-semibold">Try Bot</a>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-16">
          <TopCoinsSection />
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-16">
          <MarketBrief />
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mb-16">
          <div className="p-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl border border-blue-500/30">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-3xl font-bold mb-3">Get Telegram Alerts</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Never miss a market extreme. Get instant notifications when sentiment reaches critical levels.
              </p>
              <a href="https://t.me/Pepelinebot" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
                Start Bot - Free Forever
              </a>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                <span>✅ Extreme Alerts</span>
                <span>✅ Whale Tracking</span>
                <span>✅ Daily Summary</span>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-16">
          <SEOContent />
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mb-16">
          <Roadmap />
        </motion.section>
      </div>

      <Footer />
    </main>
  );
}
EOF

echo "✅ File created successfully!"
