'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import BackgroundAnimation from './BackgroundAnimation';

const faqs = [
    {
        question: 'What is Zeteo?',
        answer: 'Zeteo is a premium dashboard built for the Starknet ecosystem. It helps users manage their digital assets, track eligible airdrops, and stay updated with the latest projects in a single, beautiful interface.',
    },
    {
        question: 'How do I connect my wallet?',
        answer: 'You can connect your Starknet wallet (Argent X or Braavos) by clicking the "Connect Wallet" button in the navigation bar. This secure connection allows us to display your portfolio and track your airdrop eligibility.',
    },
    {
        question: 'Is Zeteo safe to use?',
        answer: 'Yes. Zeteo works by reading public blockchain data based on your wallet address. We never ask for your private keys or seed phrase. Transactions for subscriptions are handled through standard Starknet wallet protocols.',
    },
    {
        question: 'What are the subscription tiers?',
        answer: 'We offer Basic, Standard, and Premium tiers. Basic covers active airdrop tracking, Standard adds priority notifications and advanced analytics, and Premium provides direct VC insights and private alpha group access.',
    },
    {
        question: 'Can I upgrade my plan later?',
        answer: 'Absolutely! You can upgrade your plan at any time. Our smart contracts will automatically calculate the remaining time on your current plan and apply it towards your new tier.',
    },
];

const FAQItem = ({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) => {
    return (
        <div className="border-b border-white/5 last:border-0">
            <button
                className="w-full py-6 flex items-center justify-between text-left hover:text-purple-400 transition-colors focus:outline-none group"
                onClick={onClick}
            >
                <span className="text-lg font-medium text-white group-hover:text-purple-400 decoration-purple-500 underline-offset-4 decoration-2 transition-all">
                    {question}
                </span>
                <div className={`p-2 rounded-lg bg-white/5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-gray-400 leading-relaxed font-light">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 px-4 bg-[#050505] relative overflow-hidden">
            <BackgroundAnimation />
            <div className="max-w-3xl mx-auto relative z-10">
                <motion.div
                    className="text-center mb-16 space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-white/5 text-xs font-mono text-purple-400 uppercase">
                        Questions & Answers
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Frequently Asked <span className="text-purple-500">Questions</span>
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
                >
                    {/* Subtle glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

                    <div>
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openIndex === index}
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQ;
