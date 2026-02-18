'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Wallet, LogOut, Menu, X } from 'lucide-react';
import { useWallet } from '@/app/context/WalletContext';

const Navbar = () => {
    const router = useRouter();
    const { isConnected, walletAddress, connectWallet, disconnectWallet } = useWallet();
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="shrink-0 flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-white">Z</span>
                        </div>
                        <Link href="/" className="text-xl font-bold tracking-tight text-white">
                            Zeteo
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                            Home
                        </Link>
                        {isConnected && (
                            <>
                                <Link href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                    Dashboard
                                </Link>
                                <Link href="/portfolio" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                    Portfolio
                                </Link>
                            </>
                        )}

                        {/* Wallet Connect Button */}
                        {!isConnected ? (
                            <button
                                onClick={() => connectWallet(() => router.push('/dashboard'))}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm rounded-lg font-semibold hover:bg-gray-200 transition-all border border-transparent"
                            >
                                <Wallet className="w-4 h-4" />
                                <span>Connect Wallet</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0a] border border-white/10 rounded-lg">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <span className="font-mono text-xs text-gray-300">{walletAddress}</span>
                                </div>
                                <button
                                    onClick={disconnectWallet}
                                    className="p-2 text-gray-500 hover:text-white transition-colors"
                                    aria-label="Disconnect"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-300 hover:text-white p-2"
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-[#050505] border-b border-white/5 absolute w-full">
                    <div className="px-4 pt-2 pb-6 space-y-4">
                        <Link
                            href="/"
                            className="block text-gray-300 hover:text-white py-2 text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        {isConnected && (
                            <Link
                                href="/dashboard"
                                className="block text-gray-300 hover:text-white py-2 text-base font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                Dashboard
                            </Link>
                        )}
                        {isConnected && (
                            <Link
                                href="/portfolio"
                                className="block text-gray-300 hover:text-white py-2 text-base font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                Portfolio
                            </Link>
                        )}
                        <div className="pt-4 border-t border-white/5">
                            {!isConnected ? (
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        connectWallet(() => router.push('/dashboard'));
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-lg font-semibold text-sm"
                                >
                                    <Wallet className="w-4 h-4" />
                                    Connect Wallet
                                </button>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] rounded-lg border border-white/10">
                                        <span className="font-mono text-sm text-gray-300">{walletAddress}</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    </div>
                                    <button
                                        onClick={() => {
                                            disconnectWallet();
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:text-red-300 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Disconnect
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
