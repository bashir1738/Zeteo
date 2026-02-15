'use client';

import React, { useState } from 'react';
import { Check, Star, Zap, Diamond } from 'lucide-react';
import clsx from 'clsx';
import { useWallet } from '@/app/context/WalletContext';
import { motion } from 'framer-motion';

import BackgroundAnimation from './BackgroundAnimation';

const plans = [
    {
        number: '01',
        name: 'Basic',
        duration: '1 Month',
        price: '0.05 ETH',
        bestFor: 'Short-term tracking',
        features: ['Access to active airdrops', 'Basic allocation tracking', 'Community support'],
        popular: false,
        icon: Star,
    },
    {
        number: '02',
        name: 'Standard',
        duration: '6 Months',
        price: '0.25 ETH',
        bestFor: 'Active hunters',
        features: ['Priority notifications', 'Advanced analytics', 'Auto-claim helper', 'Discord access'],
        popular: true,
        icon: Zap,
    },
    {
        number: '03',
        name: 'Premium',
        duration: '1 Year',
        price: '0.45 ETH',
        bestFor: 'Long-term investors',
        features: ['Direct VC insights', 'Whale tracking alerts', 'Private alpha group', 'One-on-one strategy'],
        popular: false,
        icon: Diamond,
    },
];

const Subscription = () => {
    const { connectWallet, isConnected } = useWallet();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const handleSelect = (planName: string) => {
        if (!isConnected) {
            connectWallet();
        } else {
            console.log(`Selected ${planName}`);
            window.location.href = '/dashboard';
        }
    };

    return (
        <section id="pricing" className="relative py-32 px-4 overflow-hidden bg-[#050505] border-t border-white/5">
            <BackgroundAnimation />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    className="text-center mb-24 space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-white/5 text-xs font-mono text-purple-400">
                        PRICING PLANS
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                        Choose Your <span className="text-purple-500">Tier</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                        Flexible plans designed to scale with your portfolio.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {plans.map((plan, index) => {
                        const isHovered = hoveredIndex === index;

                        return (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.5 }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300"
                            >
                                {/* Large Background Number */}
                                <div className="absolute top-4 right-8 text-[120px] font-bold text-white/[0.02] group-hover:text-purple-500/[0.05] transition-colors leading-none select-none pointer-events-none">
                                    {plan.number}
                                </div>

                                <div className="relative z-10 h-full flex flex-col">
                                    {/* Header */}
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                        <p className="text-sm text-gray-500 font-light max-w-[80%]">
                                            {plan.bestFor}
                                        </p>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-8 flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-white">{plan.price}</span>
                                        <span className="text-sm text-gray-600 uppercase font-mono">{plan.duration}</span>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full h-px bg-white/5 mb-8 group-hover:bg-purple-500/20 transition-colors" />

                                    {/* Features */}
                                    <ul className="space-y-4 mb-8 flex-1">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3 text-gray-400 group-hover:text-gray-300 transition-colors">
                                                <Check className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => handleSelect(plan.name)}
                                        className={clsx(
                                            "w-full py-4 rounded-lg font-bold text-sm transition-all border",
                                            plan.popular
                                                ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-500"
                                                : "bg-transparent text-white border-white/10 hover:border-white/30 hover:bg-white/5"
                                        )}
                                    >
                                        Select Plan
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Subscription;
