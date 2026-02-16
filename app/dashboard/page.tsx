'use client';

import React from 'react';
import { useWallet } from '@/app/context/WalletContext';
import AirdropTable from '@/app/components/AirdropTable';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
    const { isConnected, connectWallet } = useWallet();

    if (!isConnected) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl animate-fade-in-up">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
                    <p className="text-gray-400 mb-8">
                        Please connect your wallet to view your personalized dashboard and active airdrops.
                    </p>
                    <div className="space-y-4">
                        <button
                            onClick={connectWallet}
                            className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Connect Wallet
                        </button>
                        <Link
                            href="/"
                            className="block w-full py-3 bg-white/5 text-gray-300 font-medium rounded-lg hover:bg-white/10 transition-colors"
                        >
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Your Dashboard
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Track and claim your active allocations.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                        <span className="text-gray-400 text-sm">Current Plan</span>
                        <div className="text-xl font-bold text-transparent bg-clip-text bg-purple-400 ">Premium</div>
                    </div>
                    <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                        <span className="text-gray-400 text-sm">Total Value Claimable</span>
                        <div className="text-xl font-bold text-green-400">$4,250.00</div>
                    </div>
                </div>
            </div>

            <AirdropTable />
        </div>
    );
}
