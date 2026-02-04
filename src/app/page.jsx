'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
          <p className="text-sm text-gray-500">
            Powered by AI • Live Market Data • 100+ Coins
          </p>
        </motion.div>

        <div className="mb-12">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : index ? (
            <div className="flex flex-col items-center">
              <IndexDisplay3D index={index} />
              <AutoTweetButton indexData={index} />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Failed to load index. Please refresh.</p>
            </div>
          )}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold mb-4">What is Pepeline?</h2>
            <p className="text-gray-300 mb-4">
              Pepeline is a real-time crypto sentiment tracker that combines market data, 
              social signals, and AI analysis to give you a single number (0-100) representing 
              the current crypto market vibe.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="font-bold mb-2">Live Market Data</h3>
                <p className="text-sm text-gray-400">
                  Real-time prices from CoinMarketCap, Binance & CoinGecko
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🤖</div>
                <h3 className="font-bold mb-2">AI-Powered Analysis</h3>
                <p className="text-sm text-gray-400">
                  Gemini AI generates insights, risk scores & commentary
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="font-bold mb-2">Portfolio Advisor</h3>
                <p className="text-sm text-gray-400">
                  Get personalized advice based on your holdings
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <TopCoinsSection />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <MarketBrief />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <SEOContent />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <Roadmap />
        </motion.section>
      </div>

      <Footer />
    </main>
  );
}
