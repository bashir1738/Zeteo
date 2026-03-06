'use client';

import React from 'react';
import { CheckCircle2, Check, X, LucideIcon } from 'lucide-react';
import clsx from 'clsx';

export interface StatusStep {
    id: string;
    label: string;
}

interface StatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    status: 'idle' | 'processing' | 'success' | 'error';
    title: string;
    step?: string;
    currentStepId?: string;
    steps?: StatusStep[];
    txHash?: string;
    txLabel?: string;
    successMessage?: string;
    Icon: LucideIcon;
    iconColor?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const StatusModal = ({
    isOpen,
    onClose,
    status,
    title,
    step,
    currentStepId,
    steps,
    txHash,
    txLabel = "Transaction Hash",
    successMessage,
    Icon,
    iconColor = "text-orange-400",
    actionLabel = "Return to Dashboard",
    onAction
}: StatusModalProps) => {
    if (!isOpen || status === 'idle') return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-md flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
                
                {/* Background glow for success */}
                {status === 'success' && (
                    <div className="absolute inset-0 bg-green-500/10 animate-pulse pointer-events-none" />
                )}

                {/* Top Right Close Button for Success */}
                {status === 'success' && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                )}

                {/* Icon */}
                <div className="relative">
                    {status === 'success' ? (
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-4 border-green-500/30 animate-bounce">
                            <CheckCircle2 className="w-10 h-10 text-green-400" />
                        </div>
                    ) : (
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-current rounded-full border-t-transparent animate-spin text-orange-500"></div>
                            <Icon className={clsx("w-10 h-10", iconColor)} />
                        </div>
                    )}
                </div>

                {/* Text Content */}
                <div className="text-center space-y-2 relative z-10 w-full">
                    <h3 className="text-2xl font-bold text-white">
                        {status === 'success' ? 'Successful!' : title}
                    </h3>

                    {status === 'success' ? (
                        <div className="space-y-4 mt-4 text-center">
                            <p className="text-gray-400 text-sm">
                                {successMessage}
                            </p>
                            {txHash && (
                                <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex flex-col gap-1 items-center">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">{txLabel}</span>
                                    <span className="text-orange-400 font-mono text-sm break-all">{txHash}</span>
                                </div>
                            )}
                            <button
                                onClick={onAction || onClose}
                                className="w-full mt-2 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                {actionLabel}
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="text-orange-400 font-medium animate-pulse">{step}</p>

                            {steps && (
                                <div className="mt-6 space-y-3 text-left">
                                    {steps.map((s) => {
                                        const stepIndex = steps.findIndex(step => step.id === s.id);
                                        const currentIndex = steps.findIndex(step => step.id === currentStepId);
                                        const isActive = s.id === currentStepId;
                                        const isPast = currentIndex > stepIndex;

                                        return (
                                            <div key={s.id} className="flex items-center gap-3">
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
                                                )}>{s.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
