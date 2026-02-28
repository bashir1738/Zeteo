'use client';

import React from 'react';
import { ExternalLink, Rocket, Lightbulb, Shield, Lock, Fingerprint, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

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

const AirdropRow = ({
    airdrop,
    suggested,
    isPrivateMode,
    onPrivateCheck,
    onPrivateClaim
}: {
    airdrop: Airdrop;
    suggested?: boolean;
    isPrivateMode?: boolean;
    onPrivateCheck?: (name: string) => void;
    onPrivateClaim?: (name: string) => void;
}) => {
    return (
        <tr className="hover:bg-white/2 transition-colors group">
            <td className="p-4">
                <div className="flex items-center gap-4">
                    <div className={clsx(
                        "w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300",
                        isPrivateMode ? "bg-white/5 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]" :
                            suggested ? "bg-[#111] border-white/5 group-hover:border-yellow-500/30" :
                                "bg-[#111] border-white/5 group-hover:border-purple-500/50"
                    )}>
                        {isPrivateMode ? (
                            <Shield className="w-5 h-5 text-white animate-pulse" />
                        ) : suggested ? (
                            <Lightbulb className="w-5 h-5 text-yellow-500/60 group-hover:text-yellow-400" />
                        ) : (
                            <Rocket className="w-5 h-5 text-gray-400 group-hover:text-purple-500" />
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                            {airdrop.name}
                            {isPrivateMode && <Lock size={12} className="text-gray-500" />}
                        </div>
                        <div className="text-[10px] text-purple-400/70 font-mono mt-0.5">
                            {calculateTimeLeft(airdrop.expiry)}
                        </div>
                    </div>
                </div>
            </td>
            <td className="p-4">
                <span className={clsx(
                    "font-mono text-sm px-3 py-1.5 rounded-md border transition-all",
                    isPrivateMode ? "bg-white/5 border-white/20 text-white blur-xs hover:blur-none cursor-help" : "bg-[#111] border-white/5 text-gray-300"
                )}>
                    {isPrivateMode ? 'HIDDEN_AMT' : airdrop.amount}
                </span>
            </td>
            <td className="p-4">
                <span className="text-sm text-gray-400">
                    {new Date(airdrop.expiry * 1000).toLocaleDateString()}
                </span>
            </td>
            <td className="p-4 text-center">
                {isPrivateMode ? (
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => onPrivateCheck?.(airdrop.name)}
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all group/btn"
                            title="Check Privately via ZK-Proof"
                        >
                            <Fingerprint size={18} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button
                            onClick={() => onPrivateClaim?.(airdrop.name)}
                            className="px-4 py-2 rounded-lg bg-white text-black font-bold text-sm flex items-center gap-2 hover:bg-gray-200 transition-all shadow-lg"
                        >
                            <Lock size={14} />
                            Claim (ZK)
                        </button>
                    </div>
                ) : (
                    <a
                        href={airdrop.url}
                        target="_blank"
                        rel="noreferrer"
                        className={clsx(
                            "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:-translate-y-px",
                            suggested ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                        )}
                    >
                        {suggested ? 'Explore' : 'Claim Tokens'}
                        <ExternalLink className="w-4 h-4" />
                    </a>
                )}
            </td>
        </tr>
    );
};

interface MobileAirdropCardProps {
    airdrop: Airdrop;
    suggested?: boolean;
    isPrivateMode?: boolean;
    onPrivateCheck?: (name: string) => void;
    onPrivateClaim?: (name: string) => void;
}

const MobileAirdropCard = ({ airdrop, suggested, isPrivateMode, onPrivateCheck, onPrivateClaim }: MobileAirdropCardProps) => {
    return (
        <div className={`p-4 rounded-xl border space-y-3 ${suggested
            ? 'bg-yellow-500/5 border-yellow-500/10'
            : isPrivateMode ? 'bg-white/5 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'bg-white/5 border-white/5'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                        {airdrop.name}
                        {isPrivateMode && <Lock size={14} className="text-gray-500" />}
                    </h3>
                    {suggested && <span className="text-[10px] text-yellow-400 font-mono uppercase tracking-wider">Suggestion</span>}
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        {isPrivateMode ? 'Confidential Amount' : 'Allocation'}
                    </div>
                    <div className={clsx(
                        "font-mono font-bold",
                        isPrivateMode ? "text-white blur-sm" : "text-white"
                    )}>
                        {isPrivateMode ? 'HIDDEN_AMT' : airdrop.amount}
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-white/5 mt-2">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider">Expires</span>
                    <span className="font-mono text-xs text-purple-400">{calculateTimeLeft(airdrop.expiry)}</span>
                </div>
                {isPrivateMode ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPrivateCheck?.(airdrop.name)}
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all group/btn"
                            title="Check Privately via ZK-Proof"
                        >
                            <Fingerprint size={18} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button
                            onClick={() => onPrivateClaim?.(airdrop.name)}
                            className="px-4 py-2 rounded-lg bg-white text-black font-bold text-sm flex items-center gap-2 hover:bg-gray-200 transition-all shadow-lg"
                        >
                            <Lock size={14} />
                            Claim (ZK)
                        </button>
                    </div>
                ) : (
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
                )}
            </div>
        </div>
    );
};

const TableHeader = ({ isPrivateMode }: { isPrivateMode?: boolean }) => {
    return (
        <thead>
            <tr className="bg-[#111] text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-white/5">
                <th className="p-4">Project Name</th>
                <th className="p-4">{isPrivateMode ? 'Confidential Amount' : 'Allocation'}</th>
                <th className="p-4">Expires</th>
                <th className="p-4 text-center">Action</th>
            </tr>
        </thead>
    );
};

const AirdropTable = ({ airdrops }: AirdropTableProps) => {
    const [isPrivateMode, setIsPrivateMode] = React.useState(false);
    const [processingAction, setProcessingAction] = React.useState<string | null>(null);

    if (!airdrops || airdrops.length === 0) {
        return (
            <div className="w-full overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-2xl p-12 text-center relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Shield size={160} />
                </div>
                <p className="text-gray-400 text-lg relative z-10">No airdrops available yet.</p>
                <p className="text-gray-500 text-sm mt-2 relative z-10">Check back after subscribing or when new airdrops are detected.</p>
            </div>
        );
    }

    const eligibleAirdrops = airdrops.filter(a => a.type === 'eligible' || !a.type);
    const suggestedAirdrops = airdrops.filter(a => a.type === 'suggested');

    const handlePrivateCheck = (name: string) => {
        setProcessingAction(`Verifying eligibility for ${name}...`);
        setTimeout(() => setProcessingAction(null), 2000);
    };

    const handlePrivateClaim = (name: string) => {
        setProcessingAction(`Generating ZK-Proof & Nullifier for ${name}...`);
        setTimeout(() => setProcessingAction(null), 3000);
    };

    return (
        <div className="space-y-6 animate-fade-in relative">
            {processingAction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 p-8 rounded-2xl flex flex-col items-center gap-4 shadow-2xl">
                        <RefreshCw className="w-10 h-10 text-purple-500 animate-spin" />
                        <div className="text-white font-bold">{processingAction}</div>
                        <div className="text-xs text-gray-500 font-mono">ZK-Proof Engine: Garaga</div>
                    </div>
                </div>
            )}

            {/* Eligible Airdrops Section */}
            <div className="w-full overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-2xl">
                <div className="px-4 py-4 sm:px-6 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-purple-500 shrink-0" />
                        <h3 className="font-semibold text-white text-sm whitespace-nowrap">Your Eligible Airdrops</h3>
                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{eligibleAirdrops.length}</span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 p-1 rounded-xl bg-white/5 border border-white/10 ml-auto sm:ml-0 overflow-x-auto">
                        <button
                            onClick={() => setIsPrivateMode(false)}
                            className={clsx(
                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                !isPrivateMode ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-white"
                            )}
                        >
                            Public
                        </button>
                        <button
                            onClick={() => setIsPrivateMode(true)}
                            className={clsx(
                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap",
                                isPrivateMode ? "bg-white text-black shadow-md" : "text-gray-400 hover:text-white"
                            )}
                        >
                            <Shield size={12} />
                            ZK-Privacy
                        </button>
                    </div>
                </div>
                {/* Mobile */}
                <div className="md:hidden space-y-4 p-4 text-center text-gray-500 text-xs italic">
                    Mobile ZK-proof generation optimization scheduled for Phase 2.
                    {eligibleAirdrops.map((airdrop, i) => (
                        <div key={i} className="not-italic text-left mt-2">
                            <MobileAirdropCard
                                airdrop={airdrop}
                                isPrivateMode={isPrivateMode}
                                onPrivateCheck={handlePrivateCheck}
                                onPrivateClaim={handlePrivateClaim}
                            />
                        </div>
                    ))}
                </div>
                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <TableHeader isPrivateMode={isPrivateMode} />
                        <tbody className="divide-y divide-white/5">
                            {eligibleAirdrops.map((airdrop, i) => (
                                <AirdropRow
                                    key={i}
                                    airdrop={airdrop}
                                    isPrivateMode={isPrivateMode}
                                    onPrivateCheck={handlePrivateCheck}
                                    onPrivateClaim={handlePrivateClaim}
                                />
                            ))}
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
                        {suggestedAirdrops.map((airdrop, i) => (
                            <MobileAirdropCard
                                key={i}
                                airdrop={airdrop}
                                suggested
                                isPrivateMode={isPrivateMode}
                                onPrivateCheck={handlePrivateCheck}
                                onPrivateClaim={handlePrivateClaim}
                            />
                        ))}
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
