'use client';

import React, { useState, useEffect } from 'react';
import { Bitcoin, ArrowRight, Wallet } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useWallet as useStarknetWallet } from '@/app/context/WalletContext';
import { StatusModal, StatusStep } from './StatusModal';


const BRIDGE_STEPS: StatusStep[] = [
    { id: 'initiating', label: 'Wallet Signature Required' },
    { id: 'confirming_l1', label: 'L1 Finality (Ethereum)' },
    { id: 'relaying', label: 'ZK-Proof Generation (ZETEORelay)' },
    { id: 'minting_l2', label: 'Minting Assets (Starknet)' }
];

export default function BitcoinBridge() {
    const { address: ethAddress, isConnected: isEthConnected } = useAccount();
    const { connect: connectEth } = useConnect();
    const { disconnect: disconnectEth } = useDisconnect();
    const { walletAddress: starknetAddress } = useStarknetWallet();

    const [amount, setAmount] = useState('');
    const [btcPrice, setBtcPrice] = useState(65000);
    
    
    const [demoStatus, setDemoStatus] = useState<'idle' | 'processing' | 'success'>('idle');
    const [currentStepId, setCurrentStepId] = useState<string>('initiating');
    const [mockTxHash, setMockTxHash] = useState<string>('');


    useEffect(() => {
        fetch('/api/prices?ids=bitcoin&vs_currencies=usd')
            .then(res => res.json())
            .then(data => data?.bitcoin?.usd && setBtcPrice(data.bitcoin.usd))
            .catch(console.error);
    }, []);

    const handleBridge = () => {
        if (!amount || !starknetAddress) return;
        
        setDemoStatus('processing');
        setCurrentStepId('initiating');
        
        
        setTimeout(() => {
            setCurrentStepId('confirming_l1');
            
           
            setTimeout(() => {
                setCurrentStepId('relaying');
             
                setTimeout(() => {
                    setCurrentStepId('minting_l2');
                    
                  
                    setTimeout(() => {
                        setDemoStatus('success');
                        setMockTxHash('0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 10));
                        setAmount('');
                    }, 2500);
                }, 3500);
            }, 3000);
        }, 1500);
    };

    return (
        <div className="p-8 rounded-3xl bg-linear-to-br from-orange-500/10 via-transparent to-purple-500/10 border border-white/10 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                            <Bitcoin className="text-white w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Bitcoin Bridge</h2>
                    </div>

                    <p className="text-gray-400 mb-6 leading-relaxed">
                        Securely move your BTC directly into Starknet. Join the **BTCFi** movement and earn rewards.
                    </p>

                    {!isEthConnected ? (
                        <div className="bg-linear-to-b from-orange-500/20 to-orange-500/5 border border-orange-500/30 rounded-3xl p-8 text-center backdrop-blur-md group shadow-2xl">
                            <div className="w-16 h-16 bg-black/50 border border-orange-500/40 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                                <Wallet className="w-8 h-8 text-orange-400" />
                            </div>
                            <h3 className="text-xl text-white font-bold mb-2 tracking-tight">Connect L1 Wallet</h3>
                            <button
                                onClick={() => connectEth({ connector: injected() })}
                                className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-500/25 cursor-pointer"
                            >
                                Connect Wallet
                            </button>
                        </div>
                    ) : (
                        <div className="bg-black/60 p-4 rounded-3xl border border-white/10 flex flex-col gap-4 shadow-2xl">
                            <div className="flex items-center px-2 py-1">
                                <div className="flex-1 flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5 px-1">Send Amount (WBTC)</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="bg-transparent text-4xl font-bold text-white outline-none w-full placeholder:text-gray-700 font-mono"
                                    />
                                    {amount && <span className="text-xs text-gray-500 font-mono mt-1 px-1">${(Number(amount) * btcPrice).toLocaleString()}</span>}
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    <button onClick={() => setAmount('0.1')} className="px-3 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-[10px] font-bold text-orange-400 border border-orange-500/20 transition-colors cursor-pointer">MAX</button>
                                    <button
                                        onClick={handleBridge}
                                        disabled={!amount || Number(amount) <= 0 || demoStatus === 'processing'}
                                        className="px-6 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-white/5 disabled:text-gray-500 text-white font-bold rounded-xl transition-all hover:scale-[1.02] flex items-center gap-2 shadow-lg cursor-pointer"
                                    >
                                        {demoStatus === 'processing' ? 'Bridging...' : 'Bridge'} <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-xs pt-3 border-t border-white/5">
                                <span className="text-green-400 font-mono bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" /> {ethAddress?.slice(0, 6)}...{ethAddress?.slice(-4)}
                                </span>
                                <button onClick={() => disconnectEth()} className="text-gray-500 hover:text-white underline underline-offset-4">Disconnect L1</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-full md:w-80 p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-sm flex flex-col justify-center">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg">Zeteo Bridge Route</h3>
                    <div className="space-y-6">
                        {[
                            { step: '1', title: 'Ethereum L1', desc: 'Lock WBTC' },
                            { step: '2', title: 'Cross-Chain', desc: 'Messaging' },
                            { step: '3', title: 'Starknet L2', desc: 'Mint WBTC' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-start">
                                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-orange-500 shrink-0 border border-orange-500/30">{item.step}</div>
                                <div>
                                    <div className="text-white text-sm font-bold">{item.title}</div>
                                    <div className="text-gray-500 text-xs mt-1">{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <StatusModal
                isOpen={demoStatus !== 'idle'}
                onClose={() => setDemoStatus('idle')}
                status={demoStatus}
                title="Bridging to Starknet"
                step={BRIDGE_STEPS.find(s => s.id === currentStepId)?.label}
                steps={BRIDGE_STEPS}
                currentStepId={currentStepId}
                txHash={mockTxHash}
                txLabel="Zeteo Bridge L1 Tx Hash"
                successMessage="Your Bitcoin has been securely bridged. You will now see WBTC in your portfolio."
                Icon={Bitcoin}
            />
        </div>
    );
}
