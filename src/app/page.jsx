'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import IndexDisplay3D from '@/components/IndexDisplay3D';
import AboutSection3D from '@/components/AboutSection3D';
import ShareButton3D from '@/components/ShareButton3D';
import Footer from '@/components/Footer';

export default function Home() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIndex();
        const interval = setInterval(fetchIndex, 300000);
        return () => clearInterval(interval);
    }, []);

    const fetchIndex = async () => {
        try {
            const response = await fetch('/api/index');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Failed to fetch index:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 relative overflow-hidden">
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header with Logo */}
                <Header />

                {/* Index */}
                <IndexDisplay3D data={data} />

                {/* CTA */}
                {data && (
                    <motion.div
                        className="text-center mt-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                    >
                        <ShareButton3D index={data.index} level={data.level} />
                        <motion.p
                            className="text-sm text-gray-500 mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                        >
                            Updates every hour • Auto-refresh every 5 minutes
                        </motion.p>
                    </motion.div>
                )}

                {/* About & How It Works */}
                <AboutSection3D />

                {/* Footer */}
                <Footer />
            </div>
        </main>
    );
}
