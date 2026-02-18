'use client';

import React from 'react';
import { ExternalLink, Rocket } from 'lucide-react';

interface Airdrop {
    name: string;
    url: string;
    amount: string;
    expiry?: number;
}

interface AirdropTableProps {
    airdrops: Airdrop[];
}

const AirdropTable = ({ airdrops }: AirdropTableProps) => {
    // Use a stable timestamp for rendering consistency (optional: could be passed as prop)
    // For now, we'll just skip the "expired" red text check to avoid hydration mismatch/impurity
    if (!airdrops || airdrops.length === 0) {
        return (
            <div className="w-full overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-2xl p-12 text-center">
                <p className="text-gray-400 text-lg">No airdrops available yet.</p>
                <p className="text-gray-500 text-sm mt-2">Check back after subscribing or when new airdrops are detected.</p>
            </div>
        );
    }


    return (
        <div className="w-full overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-2xl">
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4">
                {airdrops.map((airdrop, index) => (
                    <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-white">{airdrop.name}</h3>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Allocation</div>
                                <div className="font-mono font-bold text-white">{airdrop.amount}</div>
                                {airdrop.expiry && (
                                    <div className="mt-2 text-xs text-gray-400">
                                        Exp: {new Date(airdrop.expiry * 1000).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-center py-3 border-t border-white/5 mt-2">
                            <a
                                href={airdrop.url}
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
                            <th className="p-4">Project Name</th>
                            <th className="p-4">Allocation</th>
                            <th className="p-4">Expires</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {airdrops.map((airdrop, index) => (
                            <tr key={index} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[#111] flex items-center justify-center border border-white/5 group-hover:border-purple-500/50 transition-colors">
                                            <Rocket className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{airdrop.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="font-mono text-sm text-gray-300 bg-[#111] border border-white/5 px-3 py-1.5 rounded-md">
                                        {airdrop.amount}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className="text-sm text-gray-400">
                                        {airdrop.expiry ? new Date(airdrop.expiry * 1000).toLocaleDateString() : 'N/A'}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <a
                                        href={airdrop.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-semibold transition-all hover:-translate-y-px"
                                    >
                                        Claim Tokens
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
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
