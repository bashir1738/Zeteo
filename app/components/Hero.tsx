'use client';

import React from 'react';
import Link from 'next/link';
import { useWallet } from '@/app/context/WalletContext';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import BackgroundAnimation from './BackgroundAnimation';

const Hero = () => {
    const { isConnected } = useWallet();

    const scrollToPricing = () => {
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
    }; 

    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-20">
            <BackgroundAnimation />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8 max-w-4xl relative z-10"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-xs font-mono text-purple-400"
                >
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500"></span>
                    </span>
                    New Airdrops Added Daily
                </motion.div>

                <motion.h1
                    className="text-5xl md:text-7xl font-bold tracking-tight text-white pb-2 leading-none"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    Maximize Your <br />
                    <span className="text-purple-500">
                        Crypto Rewards
                    </span>
                </motion.h1>

                <motion.p
                    className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    The ultimate platform to track allocations, claim deadlines, and discover high-value airdrops before they sparkle out.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                >
                    {isConnected ? (
                        <Link
                            href="/dashboard"
                            className="group relative px-6 py-3 bg-white text-black rounded-lg font-semibold text-base hover:bg-gray-200 transition-all flex items-center gap-2"
                        >
                            View Benefits
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    ) : (
                        <button
                            onClick={scrollToPricing}
                            className="group relative px-6 py-3 bg-white text-black rounded-lg font-semibold text-base hover:bg-gray-200 transition-all flex items-center gap-2"
                        >
                            Get Started
                            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        </button>
                    )}

                    <Link
                        href="/docs"
                        className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-gray-300 font-medium hover:text-white text-base"
                    >
                        Read Documentation
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
