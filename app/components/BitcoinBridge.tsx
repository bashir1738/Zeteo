'use client';

import React from 'react';
import { Bitcoin, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';

export default function BitcoinBridge() {
    return (
        <div className="p-8 rounded-3xl bg-linear-to-br from-orange-500/10 via-transparent to-purple-500/10 border border-white/10 backdrop-blur-xl relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                            <Bitcoin className="text-white w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Bitcoin Bridge</h2>
                    </div>

                    <p className="text-gray-400 mb-6 leading-relaxed">
                        Securely move your BTC from the Bitcoin network directly into your Starknet ecosystem.
                        Join the growing **BTCFi** movement and earn rewards on your native Bitcoin.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                            <ShieldCheck className="text-green-400 w-5 h-5 shrink-0" />
                            <div>
                                <div className="text-white font-semibold text-sm">Audited Security</div>
                                <div className="text-gray-500 text-xs mt-1">Trustless bridge infrastructure</div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                            <ExternalLink className="text-blue-400 w-5 h-5 shrink-0" />
                            <div>
                                <div className="text-white font-semibold text-sm">Powered by StarkGate</div>
                                <div className="text-gray-500 text-xs mt-1">Official Starknet Bridge</div>
                            </div>
                        </div>
                    </div>

                    <a
                        href="https://starkgate.starknet.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-500/20 group"
                    >
                        Bridge Your BTC
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                <div className="w-full md:w-80 p-6 rounded-2xl bg-black/40 border border-white/10">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        How it works
                    </h3>
                    <div className="space-y-4">
                        {[
                            { step: '1', title: 'Connect Bitcoin Wallet', desc: 'Connect Unisat or Xverse' },
                            { step: '2', title: 'Specify Amount', desc: 'Min 0.001 BTC required' },
                            { step: '3', title: 'Confirm on Starknet', desc: 'Receive WBTC in minutes' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-orange-500 shrink-0 border border-orange-500/20">
                                    {item.step}
                                </div>
                                <div>
                                    <div className="text-white text-sm font-medium">{item.title}</div>
                                    <div className="text-gray-500 text-xs mt-0.5">{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
