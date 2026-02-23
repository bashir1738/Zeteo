'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { connect, disconnect, type StarknetWindowObject } from '@starknet-io/get-starknet';
import { AccountInterface, RpcProvider } from 'starknet';
import { withRetry, getRpcUrl } from '@/app/lib/contract';

interface WalletContextType {
    isConnected: boolean;
    walletAddress: string | null;
    connectWallet: (onConnected?: () => void) => Promise<void>;
    disconnectWallet: () => void;
    account: AccountInterface | null;
    network: 'mainnet' | 'sepolia';
    switchNetwork: (newNetwork: 'mainnet' | 'sepolia') => void;
}

// Type for wallet with additional properties
type ExtendedStarknetWindow = StarknetWindowObject & {
    isConnected?: boolean;
    account?: AccountInterface;
    selectedAddress?: string;
    enable?: () => Promise<string[]>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [account, setAccount] = useState<AccountInterface | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [isConnectedState, setIsConnectedState] = useState(false);
    const [network, setNetwork] = useState<'mainnet' | 'sepolia'>('sepolia');

    // Create AccountInterface from wallet
    const createAccountFromWallet = useCallback(async (wallet: ExtendedStarknetWindow): Promise<AccountInterface | null> => {
        // Check if wallet has enable method
        if (typeof wallet.enable === 'function') {
            await wallet.enable();
        }

        // Modern wallets populate account after enable
        if (wallet.account) {
            // Override the provider with retry logic
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (wallet.account as any).provider = await withRetry(async () => {
                return new RpcProvider({
                    nodeUrl: getRpcUrl(network),
                });
            });
            return wallet.account;
        }

        return null;
    }, [network]);

    useEffect(() => {
        const checkConnection = async () => {
            // Only attempt silent reconnect if user previously connected
            if (localStorage.getItem('starknet_connected') !== 'true') return;

            try {
                const wallet = await connect({ modalMode: 'neverAsk' }) as ExtendedStarknetWindow;

                if (!wallet) {
                    return;
                }

                const walletAccount = await createAccountFromWallet(wallet);

                if (walletAccount) {
                    setAccount(walletAccount);
                    setWalletAddress(walletAccount.address || wallet.selectedAddress || null);
                    setIsConnectedState(true);
                } else if (wallet.selectedAddress) {
                    setWalletAddress(wallet.selectedAddress);
                    setIsConnectedState(true);
                }
            } catch {
                console.log('No wallet connected or error checking connection');
            }
        };
        checkConnection();
    }, [createAccountFromWallet, network]);

    const connectWallet = useCallback(async (onConnected?: () => void) => {
        try {
            const wallet = await connect({ modalMode: 'alwaysAsk' });

            if (!wallet) {
                throw new Error('No wallet selected');
            }

            const walletExtended = wallet as ExtendedStarknetWindow;

            const walletAccount = await createAccountFromWallet(walletExtended);

            if (walletAccount) {
                setAccount(walletAccount);
                setWalletAddress(walletAccount.address || walletExtended.selectedAddress || null);
                setIsConnectedState(true);
                localStorage.setItem('starknet_connected', 'true');
            } else if (walletExtended.selectedAddress) {
                setWalletAddress(walletExtended.selectedAddress);
                setIsConnectedState(true);
                localStorage.setItem('starknet_connected', 'true');
            } else {
                throw new Error('Failed to get wallet address');
            }

            if (onConnected) {
                onConnected();
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            throw error;
        }
    }, [createAccountFromWallet]);

    const disconnectWallet = useCallback(async () => {
        try {
            await disconnect();
            setAccount(null);
            setWalletAddress(null);
            setIsConnectedState(false);
            localStorage.removeItem('starknet_connected');
        } catch (error) {
            console.error('Failed to disconnect wallet:', error);
        }
    }, []);

    const switchNetwork = useCallback((newNetwork: 'mainnet' | 'sepolia') => {
        setNetwork(newNetwork);
        // In a more robust implementation, we might want to reload the page or 
        // re-initialize the provider here. For balance tracking, updating state is enough.
    }, []);

    const isConnected = isConnectedState || !!walletAddress;

    return (
        <WalletContext.Provider
            value={{ isConnected, walletAddress, connectWallet, disconnectWallet, account, network, switchNetwork }}
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
