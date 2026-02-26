'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon, Sparkles, LayoutDashboard } from 'lucide-react';
import BackgroundAnimation from './BackgroundAnimation';

const steps = [
    {
        title: 'Connect Wallet',
        description: 'Establish a secure connection with your Starknet wallet (Argent X or Braavos) to access the platform.',
        icon: LinkIcon,
    },
    {
        title: 'Bridge & Subscribe',
        description: 'Move assets via our Bitcoin Bridge and select a tiered plan to unlock high-performance tracking.',
        icon: Sparkles,
    },
    {
        title: 'Track & Claim (ZK)',
        description: 'Monitor your portfolio in real-time and claim allocations privately using ZK-proofs.',
        icon: LayoutDashboard,
    },
];

const HowItWorks = () => {
    return (
        <section className="py-24 px-4 bg-[#050505] relative overflow-hidden">
            <BackgroundAnimation />
            {/* Background Gradient Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    className="text-center mb-20 space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-white/5 text-xs font-mono text-purple-400 uppercase">
                        The Process
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Seamless <span className="text-purple-500">Onboarding</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                        Getting started with Zeteo is simple. Follow these three steps to unlock your Starknet potential.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connection lines (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="w-24 h-24 rounded-full bg-[#0a0a0a] border border-white/5 flex items-center justify-center mb-8 relative group-hover:border-purple-500/30 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all duration-500">
                                <step.icon className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center border-4 border-[#050505]">
                                    {index + 1}
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-gray-400 text-base leading-relaxed font-light max-w-xs">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
