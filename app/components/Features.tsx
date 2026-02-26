'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Search, TrendingUp, ShieldCheck, Lock, Repeat } from 'lucide-react';
import BackgroundAnimation from './BackgroundAnimation';

const features = [
    {
        title: 'Wallet Integration',
        description: 'Connect seamlessly with Argent X or Braavos wallets. Your keys, your assets, fully decentralized.',
        icon: Wallet,
        color: 'text-blue-500',
    },
    {
        title: 'Airdrop Tracker',
        description: 'Stay ahead of the curve with our real-time tracker for the most lucrative airdrops on Starknet and other L2s.',
        icon: Search,
        color: 'text-purple-500',
    },
    {
        title: 'Portfolio Manager',
        description: 'Monitor your digital assets with a sleek, high-performance dashboard designed for clarity.',
        icon: TrendingUp,
        color: 'text-green-500',
    },
    {
        title: 'Tiered Subscriptions',
        description: 'Unlock exclusive insights and advanced features with our flexible subscription plans.',
        icon: ShieldCheck,
        color: 'text-orange-500',
    },
    {
        title: 'ZK-Privacy Claims',
        description: 'Leverage Garaga-powered ZK-proofs to claim allocations anonymously and protect your data.',
        icon: Lock,
        color: 'text-red-500',
    },
    {
        title: 'Bitcoin Bridge',
        description: 'Trustlessly move your Bitcoin assets into Starknet to maximize your yield and participation.',
        icon: Repeat,
        color: 'text-yellow-500',
    },
];

const Features = () => {
    return (
        <section className="py-24 px-4 bg-[#050505] relative overflow-hidden">
            <BackgroundAnimation />
            <div className="max-w-7xl mx-auto relative lg:px-8  z-10">
                <motion.div
                    className="text-center mb-16 space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-white/5 text-xs font-mono text-purple-400 uppercase">
                        Core Capabilities
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Engineered for <span className="text-purple-500">Excellence</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                        Zeteo provides the tools you need to navigate the Starknet ecosystem with confidence and style.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300"
                        >
                            <div className={`p-3 rounded-xl bg-white/5 w-fit mb-6 group-hover:bg-white/10 transition-colors`}>
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed font-light">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
