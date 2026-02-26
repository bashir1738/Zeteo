'use client';

import React, { useState, useEffect } from 'react';
import { Check, Star, Zap, Diamond, Shield, Lock, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { useWallet } from '@/app/context/WalletContext';
import { motion } from 'framer-motion';
import { fetchStarkPrice } from '@/app/utils/price';
import { useRouter } from 'next/navigation';

import BackgroundAnimation from './BackgroundAnimation';

const plans = [
    {
        number: '01',
        name: 'Basic',
        duration: '1 Month',
        price: '5 USD',
        bestFor: 'Short-term tracking',
        features: ['Access to active airdrops', 'Basic allocation tracking', 'Community support'],
        popular: false,
        icon: Star,
    },
    {
        number: '02',
        name: 'Standard',
        duration: '6 Months',
        price: '10 USD',
        bestFor: 'Active hunters',
        features: ['Priority notifications', 'Advanced analytics', 'Auto-claim helper', 'Discord access'],
        popular: true,
        icon: Zap,
    },
    {
        number: '03',
        name: 'Premium',
        duration: '1 Year',
        price: '25 USD',
        bestFor: 'Long-term investors',
        features: ['Direct VC insights', 'Whale tracking alerts', 'Private alpha group', 'Future airdrop insights'],
        popular: false,
        icon: Diamond,
    },
];

const Subscription = () => {
    const { connectWallet, isConnected, account } = useWallet();
    const router = useRouter();
    const [statusState, setStatusState] = useState<{ tier: number; message: string } | null>(null);
    const [loadingTier, setLoadingTier] = useState<number | null>(null);
    const [starkPrice, setStarkPrice] = useState<number | null>(null);
    const [currentSubscription, setCurrentSubscription] = useState<{ tier: number; expiry: number } | null>(null);
    const [isPrivateMode, setIsPrivateMode] = useState(false);

    useEffect(() => {
        const loadPrice = async () => {
            const price = await fetchStarkPrice();
            setStarkPrice(price);
        };
        loadPrice();
    }, []);

    useEffect(() => {
        const loadSubscription = async () => {
            if (isConnected && account?.address) {
                try {
                    const { getSubscription } = await import('@/app/lib/contract');
                    const sub = await getSubscription(account.address);
                    setCurrentSubscription(sub);
                } catch (error) {
                    console.error('Failed to load subscription:', error);
                }
            } else {
                setCurrentSubscription(null);
            }
        };
        loadSubscription();
    }, [isConnected, account?.address]);

    const handleSelect = async (_planName: string, tierIndex: number) => {
        if (!isConnected) {
            connectWallet();
            return;
        }

        if (!account) {
            setStatusState({ tier: tierIndex, message: 'No account connected' });
            return;
        }

        try {
            setLoadingTier(tierIndex);
            setStatusState({ tier: tierIndex, message: 'Preparing transaction...' });

            const { subscribeToTier, subscribeWithProof } = await import('@/app/lib/contract');

            setStatusState({ tier: tierIndex, message: isPrivateMode ? 'Generating ZK-Proof...' : 'Waiting for wallet approval...' });

            let result;
            if (isPrivateMode) {
                // Mock ZK-Proof generation for demo
                const mockProof = ['0x1', '0x2', '0x3'];
                result = await subscribeWithProof(account, tierIndex + 1, mockProof);
            } else {
                result = await subscribeToTier(account, tierIndex + 1);
            }

            setStatusState({ tier: tierIndex, message: 'Transaction submitted. Waiting for confirmation...' });
            console.log('Transaction hash:', result.transaction_hash);

            setStatusState({ tier: tierIndex, message: 'Success! Redirecting to dashboard...' });
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (error) {
            console.error('Subscription error:', error);
            setStatusState({ tier: tierIndex, message: 'Transaction failed. Please try again.' });
            setTimeout(() => setStatusState(null), 3000);
        } finally {
            setLoadingTier(null);
        }
    };

    return (
        <section id="pricing" className="relative py-32 px-4 overflow-hidden bg-[#050505] border-t border-white/5">
            <BackgroundAnimation />

            <div className="max-w-7xl mx-auto lg:px-8 relative z-10">
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

                    {/* Privacy Toggle (Hackathon Feature) */}
                    <div className="flex justify-center mt-8">
                        <div className="p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-1">
                            <button
                                onClick={() => setIsPrivateMode(false)}
                                className={clsx(
                                    "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                                    !isPrivateMode ? "bg-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
                                )}
                            >
                                <CheckCircle size={16} />
                                Standard
                            </button>
                            <button
                                onClick={() => setIsPrivateMode(true)}
                                className={clsx(
                                    "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 relative overflow-hidden group",
                                    isPrivateMode ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"
                                )}
                            >
                                <Lock size={16} />
                                Private (ZK-Proof)
                                {isPrivateMode && <div className="absolute inset-0 bg-linear-to-r from-transparent via-purple-500/10 to-transparent animate-shimmer" />}
                                <div className="absolute -top-1 -right-1">
                                    <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-ping opacity-75" />
                                </div>
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {plans.map((plan, index) => {
                        return (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.5 }}
                                className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300"
                            >
                                {/* Large Background Number */}
                                <div className="absolute top-4 right-8 text-[120px] font-bold text-white/2 group-hover:text-purple-500/5 transition-colors leading-none select-none pointer-events-none">
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
                                    <div className="mb-8">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-bold text-white">{plan.price}</span>
                                            <span className="text-sm text-gray-600 uppercase font-mono">{plan.duration}</span>
                                        </div>
                                        {starkPrice && (
                                            <div className="text-sm text-purple-400 font-mono mt-1">
                                                {(parseInt(plan.price) / starkPrice).toFixed(2)} STRK
                                            </div>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full h-px bg-white/5 mb-8 group-hover:bg-purple-500/20 transition-colors" />

                                    {/* Features */}
                                    <ul className="space-y-4 mb-8 flex-1">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3 text-gray-400 group-hover:text-gray-300 transition-colors">
                                                <Check className="w-4 h-4 text-purple-600 mt-1 shrink-0" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => handleSelect(plan.name, index)}
                                        disabled={loadingTier !== null}
                                        className={clsx(
                                            "w-full py-4 rounded-lg font-bold text-sm hover:cursor-pointer transition-all border relative overflow-hidden group",
                                            loadingTier !== null && "opacity-50 cursor-not-allowed",
                                            isPrivateMode
                                                ? "bg-white text-black border-transparent hover:bg-gray-200"
                                                : plan.popular
                                                    ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-500"
                                                    : "bg-transparent text-white border-white/10 hover:border-white/30 hover:bg-white/5"
                                        )}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            {isPrivateMode && <Shield className="w-4 h-4" />}
                                            {loadingTier === index
                                                ? 'Processing...'
                                                : !currentSubscription || currentSubscription.expiry < Math.floor(Date.now() / 1000)
                                                    ? (isPrivateMode ? 'Private Subscribe' : 'Select Plan')
                                                    : currentSubscription.tier === index + 1
                                                        ? 'Extend Plan'
                                                        : currentSubscription.tier < index + 1
                                                            ? 'Upgrade Plan'
                                                            : 'Switch Plan'}
                                        </div>
                                    </button>

                                    {currentSubscription && currentSubscription.expiry > Math.floor(Date.now() / 1000) && (
                                        <p className="mt-2 text-[10px] text-gray-500 text-center font-mono">
                                            Carry-over logic: Time will be added to your current expiry.
                                        </p>
                                    )}

                                    {statusState?.tier === index && (
                                        <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-sm text-purple-300 text-center">
                                            {statusState.message}
                                        </div>
                                    )}
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
