'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { connect, disconnect, type StarknetWindowObject } from '@starknet-io/get-starknet';
import { Account, AccountInterface, RpcProvider } from 'starknet';
import { withRetry, getRpcUrl } from '@/app/lib/contract';

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
    const [isConnectedState, setIsConnectedState] = useState(false);

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
                    const provider = await withRetry(async () => {
                        return new RpcProvider({
                            nodeUrl: getRpcUrl(),
                        });
                    });

                    // @ts-expect-error - wallet.account.signer is compatible with Account constructor
                    const robustAccount = new Account(provider, wallet.account.address, wallet.account.signer);

                    setAccount(robustAccount);
                    setWalletAddress(wallet.account.address);
                    setIsConnectedState(true);
                    return;
                }

                const walletAccount = await createAccountFromWallet(wallet);

                if (walletAccount) {
                    setAccount(walletAccount);
                    setWalletAddress(walletAccount.address);
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
    }, []);

    const connectWallet = useCallback(async (onConnected?: () => void) => {
        try {
            const wallet = await connect({ modalMode: 'alwaysAsk' });

            if (!wallet) {
                throw new Error('No wallet selected');
            }

            const walletExtended = wallet as ExtendedStarknetWindow;

            if (walletExtended.account) {
                const provider = await withRetry(async () => {
                    return new RpcProvider({
                        nodeUrl: getRpcUrl(),
                    });
                });

                // @ts-expect-error - wallet.account.signer is compatible with Account constructor
                const robustAccount = new Account(provider, walletExtended.account.address, walletExtended.account.signer);

                setAccount(robustAccount);
                setWalletAddress(walletExtended.account.address);
                setIsConnectedState(true);
                if (onConnected) onConnected();
                return;
            }

            const walletAccount = await createAccountFromWallet(walletExtended);

            if (walletAccount) {
                setAccount(walletAccount);
                setWalletAddress(walletAccount.address);
                setIsConnectedState(true);
            } else if (walletExtended.selectedAddress) {
                setWalletAddress(walletExtended.selectedAddress);
                setIsConnectedState(true);
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
    }, []);

    const disconnectWallet = useCallback(async () => {
        try {
            await disconnect();
            setAccount(null);
            setWalletAddress(null);
            setIsConnectedState(false);
        } catch (error) {
            console.error('Failed to disconnect wallet:', error);
        }
    }, []);

    const isConnected = isConnectedState || !!walletAddress;

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
