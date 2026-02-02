'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Roadmap() {
    const features = [
        { 
            icon: '✅', 
            title: 'Pepeline Index', 
            desc: 'Real-time market sentiment (0-100)',
            status: 'live'
        },
        { 
            icon: '✅', 
            title: 'AI Commentary', 
            desc: 'Smart market analysis',
            status: 'live'
        },
        { 
            icon: '✅', 
            title: 'Individual Coins', 
            desc: 'Track sentiment for 100+ coins',
            status: 'live',
            link: '/coins'
        },
        { 
            icon: '🔜', 
            title: 'Price Alerts', 
            desc: 'Get notified on sentiment shifts',
            status: 'soon'
        },
        { 
            icon: '🔜', 
            title: 'API Access', 
            desc: 'Integrate Pepeline in your apps',
            status: 'soon'
        },
        { 
            icon: '💡', 
            title: 'Portfolio Tracking', 
            desc: 'Your holdings + sentiment overlay',
            status: 'planned'
        },
    ];

    return (
        <div className="max-w-4xl mx-auto mt-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-4xl font-bold mb-4">🗺️ Roadmap</h2>
                <p className="text-gray-400">
                    Built in public. Feedback welcome!
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        {feature.link ? (
                            <Link href={feature.link}>
                                <div className={`p-6 rounded-xl border cursor-pointer hover:scale-105 transition ${
                                    feature.status === 'live' 
                                        ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50' 
                                        : feature.status === 'coming'
                                        ? 'bg-blue-500/10 border-blue-500/30'
                                        : 'bg-gray-500/10 border-gray-500/30'
                                }`}>
                                    <FeatureContent feature={feature} />
                                </div>
                            </Link>
                        ) : (
                            <div className={`p-6 rounded-xl border ${
                                feature.status === 'live' 
                                    ? 'bg-green-500/10 border-green-500/30' 
                                    : feature.status === 'coming'
                                    ? 'bg-blue-500/10 border-blue-500/30'
                                    : 'bg-gray-500/10 border-gray-500/30'
                            }`}>
                                <FeatureContent feature={feature} />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-8 text-center"
            >
                <p className="text-gray-500 text-sm">
                    Have a feature request? 
                    <a 
                        href="https://x.com/pepeline_index" 
                        target="_blank" 
                        rel="noopener"
                        className="text-blue-400 hover:text-blue-300 ml-1"
                    >
                        Tweet at us →
                    </a>
                </p>
            </motion.div>
        </div>
    );
}

function FeatureContent({ feature }) {
    return (
        <div className="flex items-start gap-4">
            <span className="text-4xl">{feature.icon}</span>
            <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                    {feature.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                    {feature.desc}
                </p>
                <span className={`text-xs font-semibold uppercase px-2 py-1 rounded ${
                    feature.status === 'live' 
                        ? 'bg-green-500 text-white' 
                        : feature.status === 'coming'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-600 text-gray-300'
                }`}>
                    {feature.status}
                </span>
            </div>
        </div>
    );
}
