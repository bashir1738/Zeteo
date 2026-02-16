'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
    isConnected: boolean;
    walletAddress: string | null;
    connectWallet: () => void;
    disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    // Load from local storage on mount to persist state
    useEffect(() => {
        const storedConnected = localStorage.getItem('walletConnected');
        if (storedConnected === 'true') {
            setIsConnected(true);
            setWalletAddress('0x71C...9A23');
        }
    }, []);

    const connectWallet = () => {
        // Mock connection
        setTimeout(() => {
            setIsConnected(true);
            setWalletAddress('0x71C...9A23');
            localStorage.setItem('walletConnected', 'true');
        }, 500);
    };

    const disconnectWallet = () => {
        setIsConnected(false);
        setWalletAddress(null);
        localStorage.removeItem('walletConnected');
    };

    return (
        <WalletContext.Provider value={{ isConnected, walletAddress, connectWallet, disconnectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};
