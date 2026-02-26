'use client';

import React, { useEffect, useState } from 'react';
import { useWallet } from '@/app/context/WalletContext';
import { fetchTokenBalances } from '@/app/lib/balance';
import { TOKENS, Token } from '@/app/lib/tokens';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import Image from 'next/image';

interface TokenBalance extends Token {
    balance: string;
    price: number;
    change24h: number;
}

export default function Portfolio() {
    const { walletAddress, network, isConnected } = useWallet();
    const [balances, setBalances] = useState<TokenBalance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBalances = async () => {
            if (!walletAddress || !network) return;
            setLoading(true);
            try {
                const tokens = TOKENS[network] || [];
                const results = await fetchTokenBalances(walletAddress, tokens, network);
                // Filter out WBTC for the dashboard view as requested
                const filteredResults = results.filter(token => token.symbol !== 'WBTC');
                setBalances(filteredResults as TokenBalance[]);
            } catch (error) {
                console.error('Error fetching balances:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isConnected) {
            getBalances();
        }
    }, [walletAddress, network, isConnected]);

    if (!isConnected) return null;

    const totalValue = balances.reduce((acc, token) => {
        return acc + (parseFloat(token.balance) * token.price);
    }, 0);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Highlights Grid */}
            <div className="grid grid-cols-1 gap-4">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet size={80} />
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Total Net Worth</h3>
                    <div className="text-3xl font-bold text-white mb-2">
                        ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
            </div>

            {/* Token List */}
            <div className="p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                            <th className="px-6 py-4 font-semibold">Asset</th>
                            <th className="px-6 py-4 font-semibold text-right">Balance</th>
                            <th className="px-6 py-4 font-semibold text-right">Price</th>
                            <th className="px-6 py-4 font-semibold text-right">Value (USD)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading assets...</td>
                            </tr>
                        ) : balances.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No assets found</td>
                            </tr>
                        ) : (
                            balances.map((token) => (
                                <tr key={token.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 relative rounded-full overflow-hidden bg-white/10">
                                                <Image
                                                    src={token.icon}
                                                    alt={token.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white group-hover:text-purple-400 transition-colors uppercase">
                                                    {token.symbol}
                                                </div>
                                                <div className="text-xs text-gray-500">{token.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="text-white font-medium">
                                            {parseFloat(token.balance).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="text-white">${token.price.toLocaleString()}</div>
                                        <div className={`text-xs flex items-center justify-end gap-1 ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {token.change24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                            {Math.abs(token.change24h).toFixed(2)}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-white">
                                        ${(parseFloat(token.balance) * token.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
