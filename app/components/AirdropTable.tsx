'use client';

import React from 'react';
import { ExternalLink, Rocket, Lightbulb } from 'lucide-react';

interface Airdrop {
    name: string;
    url: string;
    amount: string;
    status: string;
    expiry: number;
    type?: 'eligible' | 'suggested';
}

interface AirdropTableProps {
    airdrops: Airdrop[];
}

const calculateTimeLeft = (expiration: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = expiration - now;
    if (diff <= 0) return 'Expired';
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    return `${days}d ${hours}h`;
};

const AirdropRow = ({ airdrop, suggested }: { airdrop: Airdrop; suggested?: boolean }) => (
    <tr className="hover:bg-white/2 transition-colors group">
        <td className="p-4">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${suggested
                    ? 'bg-[#111] border-white/5 group-hover:border-yellow-500/30'
                    : 'bg-[#111] border-white/5 group-hover:border-purple-500/50'}`}>
                    {suggested
                        ? <Lightbulb className="w-5 h-5 text-yellow-500/60 group-hover:text-yellow-400 transition-colors" />
                        : <Rocket className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />}
                </div>
                <div>
                    <div className="font-bold text-white text-sm">{airdrop.name}</div>
                    <div className="text-[10px] text-purple-400/70 font-mono mt-0.5">
                        {calculateTimeLeft(airdrop.expiry)}
                    </div>
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
                {new Date(airdrop.expiry * 1000).toLocaleDateString()}
            </span>
        </td>
        <td className="p-4 text-center">
            <a
                href={airdrop.url}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:-translate-y-px ${suggested
                        ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
            >
                {suggested ? 'Explore' : 'Claim Tokens'}
                <ExternalLink className="w-4 h-4" />
            </a>
        </td>
    </tr>
);

const MobileAirdropCard = ({ airdrop, suggested }: { airdrop: Airdrop; suggested?: boolean }) => (
    <div className={`p-4 rounded-xl border space-y-3 ${suggested
        ? 'bg-yellow-500/5 border-yellow-500/10'
        : 'bg-white/5 border-white/5'}`}>
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-bold text-lg text-white">{airdrop.name}</h3>
                {suggested && <span className="text-[10px] text-yellow-400 font-mono uppercase tracking-wider">Suggestion</span>}
            </div>
            <div className="text-right">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Allocation</div>
                <div className="font-mono font-bold text-white">{airdrop.amount}</div>
                <div className="mt-2 text-xs text-gray-400">
                    Exp: {new Date(airdrop.expiry * 1000).toLocaleDateString()}
                </div>
            </div>
        </div>
        <div className="flex justify-between items-center py-3 border-t border-white/5 mt-2">
            <span className="font-mono text-xs text-purple-400">{calculateTimeLeft(airdrop.expiry)}</span>
            <a
                href={airdrop.url}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${suggested
                    ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                    : 'bg-white text-black hover:bg-gray-200'}`}
            >
                {suggested ? 'Explore' : 'Claim'}
                <ExternalLink className="w-4 h-4" />
            </a>
        </div>
    </div>
);

const TableHeader = () => (
    <thead>
        <tr className="bg-[#111] text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-white/5">
            <th className="p-4">Project Name</th>
            <th className="p-4">Allocation</th>
            <th className="p-4">Expires</th>
            <th className="p-4 text-center">Action</th>
        </tr>
    </thead>
);

const AirdropTable = ({ airdrops }: AirdropTableProps) => {
    if (!airdrops || airdrops.length === 0) {
        return (
            <div className="w-full overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-2xl p-12 text-center">
                <p className="text-gray-400 text-lg">No airdrops available yet.</p>
                <p className="text-gray-500 text-sm mt-2">Check back after subscribing or when new airdrops are detected.</p>
            </div>
        );
    }

    const eligibleAirdrops = airdrops.filter(a => a.type === 'eligible' || !a.type);
    const suggestedAirdrops = airdrops.filter(a => a.type === 'suggested');

    return (
        <div className="space-y-6">
            {/* Eligible Airdrops Section */}
            <div className="w-full overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-2xl">
                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-purple-500" />
                    <h3 className="font-semibold text-white text-sm">Your Eligible Airdrops</h3>
                    <span className="ml-auto text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{eligibleAirdrops.length}</span>
                </div>
                {/* Mobile */}
                <div className="md:hidden space-y-4 p-4">
                    {eligibleAirdrops.map((airdrop, i) => <MobileAirdropCard key={i} airdrop={airdrop} />)}
                </div>
                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <TableHeader />
                        <tbody className="divide-y divide-white/5">
                            {eligibleAirdrops.map((airdrop, i) => <AirdropRow key={i} airdrop={airdrop} />)}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Suggested Airdrops Section */}
            {suggestedAirdrops.length > 0 && (
                <div className="w-full overflow-hidden bg-[#0a0a0a] border border-yellow-500/10 rounded-2xl">
                    <div className="px-6 py-4 border-b border-yellow-500/10 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        <h3 className="font-semibold text-white text-sm">Airdrop Opportunities</h3>
                        <span className="text-[10px] text-yellow-500/70 font-mono ml-1">Based on your tier</span>
                        <span className="ml-auto text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{suggestedAirdrops.length}</span>
                    </div>
                    <p className="px-6 py-3 text-xs text-gray-500 border-b border-white/5">
                        These are potential airdrops you may qualify for based on your activity. They are not guaranteed — do your own research.
                    </p>
                    {/* Mobile */}
                    <div className="md:hidden space-y-4 p-4">
                        {suggestedAirdrops.map((airdrop, i) => <MobileAirdropCard key={i} airdrop={airdrop} suggested />)}
                    </div>
                    {/* Desktop */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <TableHeader />
                            <tbody className="divide-y divide-white/5">
                                {suggestedAirdrops.map((airdrop, i) => <AirdropRow key={i} airdrop={airdrop} suggested />)}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AirdropTable;
