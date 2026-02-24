'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/app/context/WalletContext';
import { ShieldAlert, TrendingUp, TrendingDown, Wallet, ArrowUpRight, RefreshCw, Globe, FlaskConical } from 'lucide-react';
import Link from 'next/link';
import { TOKENS, Token } from '@/app/lib/tokens';
import { fetchTokenBalances } from '@/app/lib/balance';

export default function Portfolio() {
    const { isConnected, connectWallet, walletAddress, network: walletNetwork } = useWallet();
    const [filter, setFilter] = useState('');
    const [assets, setAssets] = useState<(Token & { balance: string; price: number; change24h: number })[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    // Use LOCAL state for the network view — not bound to WalletContext so user can freely switch
    const [viewNetwork, setViewNetwork] = useState<'mainnet' | 'sepolia'>(walletNetwork);

    const loadBalances = useCallback(async () => {
        if (!walletAddress) return;

        setIsLoading(true);
        try {
            const tokensForNetwork = TOKENS[viewNetwork];
            const balances = await fetchTokenBalances(walletAddress, tokensForNetwork, viewNetwork);
            setAssets(balances);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Failed to load portfolio balances:', error);
        } finally {
            setIsLoading(false);
        }
    }, [walletAddress, viewNetwork]);

    useEffect(() => {
        if (isConnected && walletAddress) {
            loadBalances();
        } else {
            setAssets([]);
        }
    }, [isConnected, walletAddress, loadBalances]);

    // Calculate total value
    const totalValue = assets.reduce((acc, asset) => acc + (parseFloat(asset.balance) * asset.price), 0);

    const filteredAssets = assets.filter(asset =>
        asset.name.toLowerCase().includes(filter.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(filter.toLowerCase())
    );

    if (!isConnected) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center pt-24">
                <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl animate-fade-in-up">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
                    <p className="text-gray-400 mb-8">
                        Please connect your wallet to view your portfolio and assets.
                    </p>
                    <div className="space-y-4">
                        <button
                            onClick={() => connectWallet()}
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
        <div className="min-h-screen py-12 px-4 md:px-8 max-w-7xl mx-auto pt-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Balance Card */}
                <div className="md:col-span-2 bg-linear-to-br from-purple-900/40 to-black border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <Wallet className="w-5 h-5" />
                            <span className="text-sm font-medium uppercase tracking-wider">Total Balance</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h1>
                        <div className="flex items-center gap-2">
                            <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                +4.5%
                            </div>
                            <span className="text-gray-500 text-sm">vs last 24h</span>
                        </div>
                    </div>
                </div>

                {/* Quick Stats / Actions */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">Portfolio composition</h3>
                    <div className="flex gap-2 mb-2">
                        <div className="h-2 w-[60%] bg-purple-500 rounded-full" />
                        <div className="h-2 w-[25%] bg-blue-500 rounded-full" />
                        <div className="h-2 w-[15%] bg-gray-600 rounded-full" />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div>Crypto</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Stablecoins</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-600"></div>Other</div>
                    </div>
                </div>
            </div>

            {/* Assets Table Section */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold text-white">Your Assets</h2>
                        {lastUpdated && (
                            <span className="text-xs text-gray-500">
                                Last updated: {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Network Switcher */}
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                            <button
                                onClick={() => setViewNetwork('mainnet')}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${viewNetwork === 'mainnet'
                                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                                    : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                <Globe className="w-3.5 h-3.5" />
                                Mainnet
                            </button>
                            <button
                                onClick={() => setViewNetwork('sepolia')}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${viewNetwork === 'sepolia'
                                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                                    : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                <FlaskConical className="w-3.5 h-3.5" />
                                Sepolia
                            </button>
                        </div>

                        <div className="h-8 w-px bg-white/10 hidden md:block mx-1"></div>

                        <div className="relative grow md:grow-0">
                            <input
                                type="text"
                                placeholder="Search assets..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 w-full md:w-64"
                            />
                        </div>

                        <button
                            onClick={() => loadBalances()}
                            disabled={isLoading}
                            className={`p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all ${isLoading ? 'animate-spin' : ''}`}
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    {isLoading && assets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                            <p className="text-gray-400 font-medium">Fetching your assets on {viewNetwork}...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                                    <th className="p-4">Asset</th>
                                    <th className="p-4 text-right">Price</th>
                                    <th className="p-4 text-right">Balance</th>
                                    <th className="p-4 text-right">Value</th>
                                    <th className="p-4 text-right">24h Change</th>
                                    <th className="p-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredAssets.map((asset) => (
                                    <tr key={asset.id} className="hover:bg-white/2 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold overflow-hidden p-1.5">
                                                    {asset.icon ? (
                                                        /* eslint-disable-next-line @next/next/no-img-element */
                                                        <img src={asset.icon} alt={asset.symbol} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <span className="text-white">{asset.symbol[0]}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{asset.name}</div>
                                                    <div className="text-xs text-gray-500">{asset.symbol}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-mono text-gray-300">
                                            {asset.price > 0 ? `$${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                                        </td>
                                        <td className="p-4 text-right font-mono text-white">
                                            {asset.balance} <span className="text-gray-500 text-xs">{asset.symbol}</span>
                                        </td>
                                        <td className="p-4 text-right font-bold font-mono text-white">
                                            {asset.price > 0
                                                ? `$${(parseFloat(asset.balance) * asset.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                                : '-'}
                                        </td>
                                        <td className="p-4 text-right">
                                            {asset.price > 0 ? (
                                                <div className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${asset.change24h >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {asset.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                    {Math.abs(asset.change24h)}%
                                                </div>
                                            ) : (
                                                <span className="text-gray-600">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Trade">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {!isLoading && filteredAssets.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        {filter ? (
                            <>No assets found matching &quot;{filter}&quot;</>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <Wallet className="w-8 h-8 opacity-20" />
                                <p>No assets found on {viewNetwork} for this wallet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
