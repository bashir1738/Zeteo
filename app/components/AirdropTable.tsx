'use client';

import React, { useState } from 'react';
import { ExternalLink, Clock, ChevronUp, ChevronDown, Rocket, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { useWallet } from '@/app/context/WalletContext';

interface Airdrop {
    id: string;
    name: string;
    allocation: string;
    claimLink: string;
    expiration: string; // ISO date string
    status: 'Active' | 'Expired' | 'Claimed';
}

const mockAirdrops: Airdrop[] = [
    {
        id: '1',
        name: 'Starknet Odyssey',
        allocation: '500 STRK',
        claimLink: 'https://starknet.io',
        expiration: '2026-06-15T00:00:00Z',
        status: 'Active',
    },
    {
        id: '2',
        name: 'ZkSync Era',
        allocation: '1250 ZK',
        claimLink: 'https://zksync.io',
        expiration: '2026-05-30T00:00:00Z',
        status: 'Active',
    },
    {
        id: '3',
        name: 'LayerZero',
        allocation: '250 ZRO',
        claimLink: 'https://layerzero.network',
        expiration: '2026-04-20T00:00:00Z',
        status: 'Claimed',
    },
    {
        id: '4',
        name: 'Scroll',
        allocation: '1000 SCR',
        claimLink: 'https://scroll.io',
        expiration: '2026-07-01T00:00:00Z',
        status: 'Active',
    },
    {
        id: '5',
        name: 'Linea',
        allocation: '800 LIN',
        claimLink: 'https://linea.build',
        expiration: '2026-08-10T00:00:00Z',
        status: 'Active',
    },
];

const AirdropTable = () => {
    const [sortConfig, setSortConfig] = useState<{ key: keyof Airdrop; direction: 'asc' | 'desc' } | null>(null);

    const sortedAirdrops = React.useMemo(() => {
        let sortableItems = [...mockAirdrops];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [sortConfig]);

    const requestSort = (key: keyof Airdrop) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (name: keyof Airdrop) => {
        if (!sortConfig || sortConfig.key !== name) {
            return <div className="w-4 h-4" />; // Spacer
        }
        return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
    };

    const calculateTimeLeft = (expiration: string) => {
        const diff = new Date(expiration).getTime() - new Date().getTime();
        if (diff <= 0) return 'Expired';
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        return `${days} days left`;
    };

    return (
        <div className="w-full overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-2xl">
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4">
                {sortedAirdrops.map((airdrop) => (
                    <div key={airdrop.id} className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-white">{airdrop.name}</h3>
                                <span className={clsx(
                                    "text-xs px-2 py-1 rounded-md font-medium inline-block mt-1 font-mono uppercase tracking-wide",
                                    airdrop.status === 'Active' ? "bg-green-500/10 text-green-500" :
                                        airdrop.status === 'Claimed' ? "bg-purple-500/10 text-purple-400" : "bg-red-500/10 text-red-500"
                                )}>
                                    {airdrop.status}
                                </span>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Allocation</div>
                                <div className="font-mono font-bold text-white">{airdrop.allocation}</div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center py-3 border-t border-white/5 mt-2">
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <Clock className="w-4 h-4" />
                                <span className="font-mono text-xs">{calculateTimeLeft(airdrop.expiration)}</span>
                            </div>
                            <a
                                href={airdrop.claimLink}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg text-sm font-bold transition-colors"
                            >
                                Claim
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#111] text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-white/5">
                            <th
                                className="p-4 cursor-pointer hover:text-white transition-colors"
                                onClick={() => requestSort('name')}
                            >
                                <div className="flex items-center gap-2">Project Name {getSortIcon('name')}</div>
                            </th>
                            <th
                                className="p-4 cursor-pointer hover:text-white transition-colors"
                                onClick={() => requestSort('allocation')}
                            >
                                <div className="flex items-center gap-2">Allocation {getSortIcon('allocation')}</div>
                            </th>
                            <th
                                className="p-4 cursor-pointer hover:text-white transition-colors"
                                onClick={() => requestSort('expiration')}
                            >
                                <div className="flex items-center gap-2">Expires In {getSortIcon('expiration')}</div>
                            </th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {sortedAirdrops.map((airdrop) => (
                            <tr key={airdrop.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[#111] flex items-center justify-center border border-white/5 group-hover:border-purple-500/50 transition-colors">
                                            <Rocket className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{airdrop.name}</div>
                                            <div className="text-xs text-gray-500 font-mono mt-0.5">{airdrop.status}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="font-mono text-sm text-gray-300 bg-[#111] border border-white/5 px-3 py-1.5 rounded-md">
                                        {airdrop.allocation}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-400 font-mono text-xs">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-600" />
                                        {calculateTimeLeft(airdrop.expiration)}
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    {airdrop.status === 'Claimed' ? (
                                        <button disabled className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/5 text-green-500 border border-green-500/20 cursor-default text-xs font-bold uppercase tracking-wide">
                                            <CheckCircle className="w-4 h-4" />
                                            Claimed
                                        </button>
                                    ) : (
                                        <a
                                            href={airdrop.claimLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-semibold transition-all hover:translate-y-[-1px]"
                                        >
                                            Claim Tokens
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AirdropTable;
