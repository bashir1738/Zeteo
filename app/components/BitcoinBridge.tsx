'use client';

import React from 'react';
import { Bitcoin, ArrowRight, ExternalLink, ShieldCheck, RefreshCw, CheckCircle2, Check, X } from 'lucide-react';
import clsx from 'clsx';

export default function BitcoinBridge() {
    const [bridgeAmount, setBridgeAmount] = React.useState('');
    const [bridgeStatus, setBridgeStatus] = React.useState<{
        status: 'idle' | 'initiating' | 'confirming_l1' | 'minting_l2' | 'success';
        step: string;
        txHash?: string;
    }>({ status: 'idle', step: '' });

    const handleMaxClick = () => {
        setBridgeAmount('0.54'); // Mocked user balance
    };

    const handleBridgeSubmit = () => {
        if (!bridgeAmount || isNaN(Number(bridgeAmount)) || Number(bridgeAmount) <= 0) return;

        setBridgeStatus({ status: 'initiating', step: 'Initiating StarkGate Protocol...' });

        setTimeout(() => {
            setBridgeStatus({ status: 'confirming_l1', step: 'Awaiting L1 (Bitcoin) Finality...' });

            setTimeout(() => {
                setBridgeStatus({ status: 'minting_l2', step: 'Minting WBTC on Starknet...' });

                setTimeout(() => {
                    setBridgeStatus({
                        status: 'success',
                        step: 'Completed',
                        txHash: '0x' + Math.random().toString(16).slice(2, 8) + '...' + Math.random().toString(16).slice(2, 8)
                    });
                    setBridgeAmount('');
                }, 3000);
            }, 3000);
        }, 1500);
    };
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

                    <div className="bg-black/30 p-1.5 rounded-2xl border border-white/5 flex items-center mb-6 pl-4 transition-all focus-within:border-orange-500/50 focus-within:bg-black/50 overflow-hidden">
                        <div className="flex flex-col grow pr-2">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1 mb-0.5">Amount (BTC)</span>
                            <input
                                type="number"
                                value={bridgeAmount}
                                onChange={(e) => setBridgeAmount(e.target.value)}
                                placeholder="0.00"
                                className="bg-transparent text-2xl font-bold text-white outline-none w-full"
                            />
                            {bridgeAmount && !isNaN(Number(bridgeAmount)) && (
                                <span className="text-xs text-gray-500 font-mono pl-1 mt-0.5">${(Number(bridgeAmount) * 65000).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleMaxClick}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-orange-400 transition-colors cursor-pointer"
                            >
                                MAX
                            </button>
                            <button
                                onClick={handleBridgeSubmit}
                                disabled={!bridgeAmount || isNaN(Number(bridgeAmount)) || Number(bridgeAmount) <= 0 || bridgeStatus.status !== 'idle'}
                                className="inline-flex items-center gap-2 px-6 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/30 disabled:text-white/50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-500/20 group cursor-pointer"
                            >
                                Bridge Native
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
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

            {/* Simulated Bridge Transaction Modal */}
            {bridgeStatus.status !== 'idle' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
                    <div className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-md flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">

                        {/* Background glow for success */}
                        {bridgeStatus.status === 'success' && (
                            <div className="absolute inset-0 bg-green-500/10 animate-pulse pointer-events-none" />
                        )}

                        {/* Top Right Close Button for Success */}
                        {bridgeStatus.status === 'success' && (
                            <button
                                onClick={() => setBridgeStatus({ status: 'idle', step: '' })}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        )}

                        {/* Icon */}
                        <div className="relative">
                            {bridgeStatus.status === 'success' ? (
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-4 border-green-500/30 animate-bounce">
                                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                                </div>
                            ) : (
                                <div className="relative w-24 h-24 flex items-center justify-center">
                                    <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
                                    <Bitcoin className="w-10 h-10 text-orange-400" />
                                </div>
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="text-center space-y-2 relative z-10 w-full">
                            <h3 className={clsx(
                                "text-2xl font-bold",
                                bridgeStatus.status === 'success' ? "text-white" : "text-white"
                            )}>
                                {bridgeStatus.status === 'success' ? 'Bridge Successful!' : 'Bridging to Starknet'}
                            </h3>

                            {bridgeStatus.status === 'success' ? (
                                <div className="space-y-4 mt-4 text-center">
                                    <p className="text-gray-400 text-sm">
                                        Your native Bitcoin has been securely bridged. You will now see <strong className="text-orange-400">WBTC</strong> in your Starknet portfolio.
                                    </p>
                                    <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex flex-col gap-1 items-center">
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">StarkGate L2 Tx Hash</span>
                                        <span className="text-orange-400 font-mono text-sm">{bridgeStatus.txHash}</span>
                                    </div>
                                    <button
                                        onClick={() => setBridgeStatus({ status: 'idle', step: '' })}
                                        className="w-full mt-2 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Return to Dashboard
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <p className="text-orange-400 font-medium animate-pulse">{bridgeStatus.step}</p>

                                    <div className="mt-6 space-y-3">
                                        {[
                                            { id: 'initiating', label: 'Initiating Contract' },
                                            { id: 'confirming_l1', label: 'L1 Finality (Bitcoin)' },
                                            { id: 'minting_l2', label: 'Minting WBTC on Starknet' }
                                        ].map((step) => {
                                            const isActive = bridgeStatus.status === step.id;
                                            const isPast = ['initiating', 'confirming_l1', 'minting_l2'].indexOf(bridgeStatus.status) > ['initiating', 'confirming_l1', 'minting_l2'].indexOf(step.id);

                                            return (
                                                <div key={step.id} className="flex items-center gap-3">
                                                    <div className={clsx(
                                                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors",
                                                        isPast ? "bg-green-500 border-green-500 text-white" :
                                                            isActive ? "bg-orange-500/20 border-orange-500 text-orange-400" :
                                                                "bg-white/5 border-white/10 text-gray-600"
                                                    )}>
                                                        {isPast ? <Check size={12} /> : <div className={clsx("w-2 h-2 rounded-full", isActive ? "bg-orange-400 animate-pulse" : "bg-gray-600")} />}
                                                    </div>
                                                    <span className={clsx(
                                                        "text-sm font-medium",
                                                        isPast ? "text-gray-400" :
                                                            isActive ? "text-white" :
                                                                "text-gray-600"
                                                    )}>{step.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
