'use client';

import { motion } from 'framer-motion';

export default function SEOContent() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mt-20 mb-16"
        >
            <div className="p-8 bg-gray-800/30 rounded-xl border border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    What is Crypto Sentiment Analysis?
                </h2>
                
                <div className="space-y-4 text-gray-300">
                    <p>
                        <strong className="text-white">Pepeline</strong> is a free cryptocurrency sentiment tracker that analyzes market mood for 100+ digital assets. Our AI-powered sentiment engine combines multiple data sources to give you a real-time view of crypto market psychology.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                        How We Calculate Crypto Sentiment
                    </h3>
                    <p>
                        Our sentiment score (0-100) combines the Fear & Greed Index, price volatility, FOMO signals from Google Trends, and meme coin intensity. Each cryptocurrency gets its own sentiment rating updated hourly.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                        Features for Crypto Traders
                    </h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Individual Coin Sentiment:</strong> Track Bitcoin, Ethereum, and 100+ altcoins</li>
                        <li><strong>AI Risk Scores:</strong> Know your exposure with algorithmic risk analysis</li>
                        <li><strong>Portfolio Advisor:</strong> Get AI-powered recommendations for your holdings</li>
                        <li><strong>Market Brief:</strong> Daily crypto market summary with top gainers and losers</li>
                        <li><strong>Real-Time Data:</strong> Updates every hour from CoinGecko API</li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                        Why Track Cryptocurrency Sentiment?
                    </h3>
                    <p>
                        Market sentiment drives crypto prices as much as fundamentals. By tracking fear, greed, and FOMO levels, you can identify opportunities when others panic and avoid tops when euphoria peaks. Pepeline makes sentiment analysis accessible to everyone.
                    </p>
                    
                    <p className="text-sm text-gray-500 mt-6">
                        <strong>Keywords:</strong> crypto sentiment tracker, bitcoin sentiment analysis, cryptocurrency fear and greed index, crypto market psychology, altcoin sentiment, portfolio risk analysis, crypto trading signals, market mood tracker
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
