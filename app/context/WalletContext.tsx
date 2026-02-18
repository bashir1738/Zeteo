'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { connect, disconnect, type StarknetWindowObject } from '@starknet-io/get-starknet';
import { AccountInterface } from 'starknet';

interface WalletContextType {
    isConnected: boolean;
    walletAddress: string | null;
    connectWallet: (onConnected?: () => void) => Promise<void>;
    disconnectWallet: () => void;
    account: AccountInterface | null;
}

interface LegacyStarknetWindowObject extends StarknetWindowObject {
    isConnected?: boolean;
    account?: AccountInterface;
    selectedAddress?: string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [account, setAccount] = useState<AccountInterface | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    useEffect(() => {
        // Check if wallet was previously connected
        const checkConnection = async () => {
            try {
                const wallet = await connect({ modalMode: 'neverAsk' }) as LegacyStarknetWindowObject;
                const address = wallet?.account?.address || wallet?.selectedAddress;

                if (wallet?.account || (wallet?.isConnected && address)) {
                    setAccount(wallet.account || null);
                    setWalletAddress(address || null);
                }
            } catch {
                console.log('No wallet connected');
            }
        };
        checkConnection();
    }, []);

    const connectWallet = async (onConnected?: () => void) => {
        try {
            const wallet = await connect({ modalMode: 'alwaysAsk' }) as LegacyStarknetWindowObject;
            const address = wallet?.account?.address || wallet?.selectedAddress;

            if (wallet?.account || (wallet?.isConnected && address)) {
                setAccount(wallet.account || null);
                setWalletAddress(address || null);
                if (address && onConnected) onConnected();
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            throw error;
        }
    };

    const disconnectWallet = async () => {
        try {
            await disconnect();
            setAccount(null);
            setWalletAddress(null);
        } catch (error) {
            console.error('Failed to disconnect wallet:', error);
        }
    };

    const isConnected = !!walletAddress;

    return (
        <WalletContext.Provider
            value={{ isConnected, walletAddress, connectWallet, disconnectWallet, account }}
        >
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
