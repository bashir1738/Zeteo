'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Shield, Rocket, ArrowRight, CheckCircle2, Zap, Cpu, Repeat, Lock, TrendingUp } from 'lucide-react';
import BackgroundAnimation from '../components/BackgroundAnimation';
import Footer from '../components/Footer';

const sections = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        icon: <Rocket className="w-6 h-6 text-purple-400" />,
        content: (
            <div className="space-y-4 text-gray-400 font-light">
                <p>Welcome to Zeteo, the next-generation airdrop tracking platform. To get started, connect your Web3 wallet using the &quot;Connect Wallet&quot; button in the navigation bar.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            Wallet Connection
                        </h4>
                        <p className="text-sm">Securely connect your Starknet or Ethereum wallet to track your specific allocations.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            Profile Setup
                        </h4>
                        <p className="text-sm">Customize your notifications and tracking preferences to never miss a claim.</p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'how-it-works',
        title: 'How It Works',
        icon: <Cpu className="w-6 h-6 text-blue-400" />,
        content: (
            <div className="space-y-4 text-gray-400 font-light">
                <p>Zeteo aggregates data from multiple blockchains and protocols to provide a centralized dashboard for all your airdrop needs.</p>
                <ul className="space-y-3 mt-4">
                    <li className="flex items-start gap-3">
                        <div className="mt-1 p-1 rounded-full bg-blue-500/20 text-blue-400">
                            <Zap className="w-3 h-3" />
                        </div>
                        <span><strong>Real-time Tracking:</strong> Our engine monitors on-chain events and protocol announcements continuously.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="mt-1 p-1 rounded-full bg-blue-500/20 text-blue-400">
                            <Zap className="w-3 h-3" />
                        </div>
                        <span><strong>Eligibility Checker:</strong> Automatically check if your wallet address is eligible for upcoming and active tokens.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="mt-1 p-1 rounded-full bg-blue-500/20 text-blue-400">
                            <Zap className="w-3 h-3" />
                        </div>
                        <span><strong>Secure Claims:</strong> Direct links to official claim pages, ensuring you avoid phishing attempts.</span>
                    </li>
                </ul>
            </div>
        ),
    },
    {
        id: 'strategies',
        title: 'Airdrop Strategies',
        icon: <Shield className="w-6 h-6 text-green-400" />,
        content: (
            <div className="space-y-4 text-gray-400 font-light">
                <p>Maximize your rewards by following our curated strategies and participation guides.</p>
                <div className="bg-linear-to-r from-purple-500/10 to-blue-500/10 border border-white/10 rounded-2xl p-6 mt-4">
                    <h4 className="text-white font-semibold mb-3">The &quot;Power User&quot; Approach</h4>
                    <p className="text-sm mb-4">Focus on protocols with high TVL and consistent development activity. Often, early participation in governance and liquidity provision leads to larger allocations.</p>
                    <button className="text-purple-400 text-sm font-medium flex items-center gap-1 hover:text-white transition-colors">
                        Read full guide <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        ),
    },
    {
        id: 'bitcoin-bridge',
        title: 'Bitcoin Bridge',
        icon: <Repeat className="w-6 h-6 text-yellow-500" />,
        content: (
            <div className="space-y-4 text-gray-400 font-light">
                <p>Zeteo provides a seamless, trustless gateway to bring your Bitcoin assets into the Starknet ecosystem.</p>
                <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 space-y-4">
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                            <span className="text-yellow-500 font-bold text-xs">1</span>
                        </div>
                        <p className="text-sm">Initiate a bridging request from any Bitcoin wallet.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                            <span className="text-yellow-500 font-bold text-xs">2</span>
                        </div>
                        <p className="text-sm">Verify the transaction on-chain via our decentralized verifier network.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                            <span className="text-yellow-500 font-bold text-xs">3</span>
                        </div>
                        <p className="text-sm">Receive wrapped BTC on Starknet, ready for liquidity provision or airdrop eligibility.</p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'zk-privacy',
        title: 'ZK-Privacy (Garaga)',
        icon: <Lock className="w-6 h-6 text-red-400" />,
        content: (
            <div className="space-y-4 text-gray-400 font-light">
                <p>Security and privacy are core to Zeteo. Our integration with <strong>Garaga</strong> enables zero-knowledge verification for airdrop claims.</p>
                <ul className="space-y-3">
                    <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                        <span><strong>Data Shielding:</strong> Prove you meet eligibility criteria without exposing your wallet transaction history.</span>
                    </li>
                    <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                        <span><strong>Gas Efficiency:</strong> Optimized ZK-proofs that are cheaper to verify on-chain than standard signature checks.</span>
                    </li>
                    <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                        <span><strong>Non-Custodial:</strong> Privacy is handled entirely client-side; Zeteo never sees your sensitive data.</span>
                    </li>
                </ul>
            </div>
        ),
    },
    {
        id: 'portfolio',
        title: 'Live Portfolio',
        icon: <TrendingUp className="w-6 h-6 text-green-400" />,
        content: (
            <div className="space-y-4 text-gray-400 font-light">
                <p>Track your entire Starknet wealth with our high-fidelity portfolio tracking system.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <h4 className="text-white font-medium mb-1">Real-time Valuation</h4>
                        <p className="text-xs">Live price feeds from multiple oracles ensured accurate USD balances.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <h4 className="text-white font-medium mb-1">Asset Distribution</h4>
                        <p className="text-xs">Visual breakdown of your holdings across tokens and protocols.</p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'troubleshooting',
        title: 'Troubleshooting',
        icon: <Zap className="w-6 h-6 text-red-400" />,
        content: (
            <div className="space-y-4 text-gray-400 font-light">
                <p>Common issues and their resolutions for the Zeteo platform.</p>
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <h4 className="text-white font-medium mb-1">&quot;Failed to determine starting block&quot;</h4>
                        <p className="text-xs">This error (often `SIMULATE_AND_REVIEW_FAILED`) typically indicates a connectivity issue with the Starknet RPC provider. Check your network connection and verify your `NEXT_PUBLIC_STARKNET_RPC_URL` in `.env.local`.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <h4 className="text-white font-medium mb-1">Wallet Connection Failed</h4>
                        <p className="text-xs">Ensure you have Argent X or Braavos installed and set to the correct network (Sepolia/Mainnet) matching the Zeteo configuration.</p>
                    </div>
                </div>
            </div>
        ),
    },
];

const DocsPage = () => {
    return (
        <div className="pt-24 bg-black">
            <BackgroundAnimation />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <aside className="lg:w-64 shrink-0 lg:sticky lg:top-32 h-fit">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Documentation</h3>
                                <nav className="space-y-1">
                                    {sections.map((section) => (
                                        <a
                                            key={section.id}
                                            href={`#${section.id}`}
                                            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
                                        >
                                            <span className="group-hover:scale-110 transition-transform">{section.icon}</span>
                                            {section.title}
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            <div className="p-4 rounded-2xl bg-linear-to-br from-purple-500/20 to-blue-500/20 border border-white/10">
                                <p className="text-xs text-gray-400 mb-3">Need help? Join our discord community.</p>
                                <a href="#" className="inline-flex items-center gap-2 text-xs font-bold text-white hover:underline">
                                    Join Discord <ArrowRight className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <BookOpen className="w-8 h-8 text-purple-500" />
                                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Documentation</h1>
                            </div>
                            <p className="text-xl text-gray-400 mb-12 font-light">
                                Everything you need to know about navigating the airdrop landscape with Zeteo.
                            </p>

                            <div className="space-y-20">
                                {sections.map((section, idx) => (
                                    <motion.section
                                        key={section.id}
                                        id={section.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                                        className="scroll-mt-32"
                                    >
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                                                {section.icon}
                                            </div>
                                            <h2 className="text-2xl md:text-3xl font-bold text-white">{section.title}</h2>
                                        </div>
                                        <div className="p-1 px-4 lg:px-0">
                                            {section.content}
                                        </div>
                                    </motion.section>
                                ))}
                            </div>
                        </motion.div>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DocsPage;
