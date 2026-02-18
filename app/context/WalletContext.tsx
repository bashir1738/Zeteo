'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { connect, disconnect, type StarknetWindowObject } from '@starknet-io/get-starknet';
import { Account, AccountInterface, RpcProvider } from 'starknet';

// RPC URL with fallback - can be overridden via env var
const getRpcUrl = () => {
    return process.env.NEXT_PUBLIC_STARKNET_RPC_URL
        || 'https://free-rpc.nethermind.io/sepolia-juno';
};

// Retry helper with exponential backoff for provider operations
const withRetry = async function <T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
): Promise<T> {
    let lastError: Error | null = null;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error: unknown) {
            lastError = error as Error;
            const err = error as { code?: number; message?: string };
            // Check if it's a rate limit error (code -32029)
            if (err?.code === -32029 || err?.message?.includes('Too Many Requests')) {
                const delay = baseDelay * Math.pow(2, i);
                console.log(`Rate limited, retrying in ${delay}ms... (attempt ${i + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
    throw lastError;
};

interface WalletContextType {
    isConnected: boolean;
    walletAddress: string | null;
    connectWallet: (onConnected?: () => void) => Promise<void>;
    disconnectWallet: () => void;
    account: AccountInterface | null;
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
    const [isConnected, setIsConnected] = useState(false);

    // Create AccountInterface from wallet
    const createAccountFromWallet = async (wallet: ExtendedStarknetWindow): Promise<AccountInterface | null> => {
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
                    nodeUrl: getRpcUrl(),
                });
            });
            return wallet.account;
        }

        return null;
    };

    useEffect(() => {
        // Check if wallet was previously connected
        const checkConnection = async () => {
            try {
                const wallet = await connect({ modalMode: 'neverAsk' }) as ExtendedStarknetWindow;

                if (!wallet) {
                    return;
                }

                // Prioritize wallet.account if available (standard and reliable)
                if (wallet.account) {
                    // Create a robust Account instance using our provider but the wallet's signer
                    const provider = await withRetry(async () => {
                        return new RpcProvider({
                            nodeUrl: getRpcUrl(),
                        });
                    });

                    // @ts-expect-error - wallet.account.signer is compatible with Account constructor
                    const account = new Account(provider, wallet.account.address, wallet.account.signer);

                    setAccount(account);
                    setWalletAddress(wallet.account.address);
                    setIsConnected(true);
                    console.log('Wallet already connected (robust account):', wallet.account.address);
                    return;
                }

                const walletAccount = await createAccountFromWallet(wallet);

                if (walletAccount) {
                    setAccount(walletAccount);
                    setWalletAddress(walletAccount.address);
                    setIsConnected(true);
                    console.log('Wallet already connected (custom account):', walletAccount.address);
                } else if (wallet.selectedAddress) {
                    setWalletAddress(wallet.selectedAddress);
                    setIsConnected(true);
                }
            } catch {
                console.log('No wallet connected or error checking connection');
            }
        };
        checkConnection();
    }, []);

    const connectWallet = useCallback(async (onConnected?: () => void) => {
        try {
            console.log('Starting wallet connection...');

            const wallet = await connect({ modalMode: 'alwaysAsk' });

            if (!wallet) {
                console.log('No wallet selected by user');
                throw new Error('No wallet selected');
            }

            const walletExtended = wallet as ExtendedStarknetWindow;
            console.log('Wallet response:', walletExtended);

            if (walletExtended.account) {
                // Create a robust Account instance using our provider but the wallet's signer
                const provider = await withRetry(async () => {
                    return new RpcProvider({
                        nodeUrl: getRpcUrl(),
                    });
                });

                // @ts-expect-error - wallet.account.signer is compatible with Account constructor
                const account = new Account(provider, walletExtended.account.address, walletExtended.account.signer);

                setAccount(account);
                setWalletAddress(walletExtended.account.address);
                setIsConnected(true);
                console.log('Wallet connected successfully (robust account):', walletExtended.account.address);
                if (onConnected) onConnected();
                return;
            }

            const walletAccount = await createAccountFromWallet(walletExtended);

            if (walletAccount) {
                setAccount(walletAccount);
                setWalletAddress(walletAccount.address);
                setIsConnected(true);
                console.log('Wallet connected successfully (custom account):', walletAccount.address);
            } else if (walletExtended.selectedAddress) {
                setWalletAddress(walletExtended.selectedAddress);
                setIsConnected(true);
            } else {
                throw new Error('Failed to get wallet address');
            }

            // Call the onConnected callback if provided
            if (onConnected) {
                console.log('Calling onConnected callback...');
                onConnected();
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            throw error;
        }
    }, []);

    const disconnectWallet = useCallback(async () => {
        try {
            await disconnect();
            setAccount(null);
            setWalletAddress(null);
            setIsConnected(false);
            console.log('Wallet disconnected');
        } catch (error) {
            console.error('Failed to disconnect wallet:', error);
        }
    }, []);

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
