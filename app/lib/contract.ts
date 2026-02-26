import { Contract, RpcProvider, AccountInterface } from 'starknet';

// RPC endpoints with fallback
export const getRpcUrl = (network?: 'mainnet' | 'sepolia') => {
    const apiKey = process.env.NEXT_PUBLIC_INFURA_STARKNET_API_KEY || '***REMOVED***';

    // 1. If an explicit network is requested, use Infura for that network
    if (network === 'mainnet') return `https://starknet-mainnet.infura.io/v3/${apiKey}`;
    if (network === 'sepolia') return `https://starknet-sepolia.infura.io/v3/${apiKey}`;

    // 2. If no network is requested, check the general RPC override
    if (process.env.NEXT_PUBLIC_STARKNET_RPC_URL) return process.env.NEXT_PUBLIC_STARKNET_RPC_URL;

    // 3. Fallback to Infura based on the global network environment variable
    return process.env.NEXT_PUBLIC_STARKNET_NETWORK === 'mainnet'
        ? `https://starknet-mainnet.infura.io/v3/${apiKey}`
        : `https://starknet-sepolia.infura.io/v3/${apiKey}`;
};

// Retry helper with exponential backoff
interface RpcError {
    code?: number;
    message?: string;
}

export const withRetry = async <T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
): Promise<T> => {
    let lastError: Error | null = null;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error: unknown) {
            const err = error as RpcError;
            lastError = error as Error;
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

// Full starknet.js v9 ABI format - struct must be defined as a top-level ABI entry
export const SUBSCRIPTION_ABI = [
    {
        type: 'struct',
        name: 'example::subscription::Subscription::SubscriptionInfo',
        members: [
            { name: 'expiry', type: 'core::integer::u64' },
            { name: 'tier', type: 'core::integer::u8' },
        ],
    },
    {
        name: 'subscribe',
        type: 'function',
        inputs: [{ name: 'tier', type: 'core::integer::u8' }],
        outputs: [],
        state_mutability: 'external',
    },
    {
        name: 'subscribe_with_proof',
        type: 'function',
        inputs: [
            { name: 'tier', type: 'core::integer::u8' },
            { name: 'proof', type: 'core::array::Span::<core::felt252>' }
        ],
        outputs: [],
        state_mutability: 'external',
    },
    {
        name: 'get_subscription',
        type: 'function',
        inputs: [{ name: 'user', type: 'core::starknet::contract_address::ContractAddress' }],
        outputs: [{
            type: 'example::subscription::Subscription::SubscriptionInfo',
            name: 'info'
        }],
        state_mutability: 'view',
    },
    {
        name: 'get_price',
        type: 'function',
        inputs: [{ name: 'tier', type: 'core::integer::u8' }],
        outputs: [{ type: 'core::integer::u256', name: 'price' }],
        state_mutability: 'view',
    },
];

export const CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x1a5ea2b21b844511b0efea856b2058f0bff5c925a88328828f6dd158368fcdd';

export async function subscribeToTier(account: AccountInterface, tier: number) {
    if (!account) throw new Error('No account connected');

    // Create contract with new API (single options object)
    const contract = new Contract({
        abi: SUBSCRIPTION_ABI,
        address: CONTRACT_ADDRESS,
        providerOrAccount: account,
    });

    try {
        // Use retry logic to handle rate limiting
        const result = await withRetry(async () => {
            // Use the contract's invoke method which handles nonce and fee estimation automatically
            // The account's execute method will handle the transaction
            return await contract.invoke('subscribe', [tier]);
        });

        await account.waitForTransaction(result.transaction_hash);
        return result;
    } catch (error) {
        console.error('Subscription error:', error);
        throw error;
    }
}

export async function subscribeWithProof(account: AccountInterface, tier: number, proof: string[]) {
    if (!account) throw new Error('No account connected');

    const contract = new Contract({
        abi: SUBSCRIPTION_ABI,
        address: CONTRACT_ADDRESS,
        providerOrAccount: account,
    });

    try {
        const result = await withRetry(async () => {
            // proof is Span<felt252> in Cairo
            return await contract.invoke('subscribe_with_proof', [tier, proof]);
        });

        await account.waitForTransaction(result.transaction_hash);
        return result;
    } catch (error) {
        console.error('ZK Subscription error:', error);
        throw error;
    }
}

export async function getSubscription(userAddress: string): Promise<{ expiry: number; tier: number }> {
    const provider = new RpcProvider({
        nodeUrl: getRpcUrl(),
    });

    try {
        // Use raw callContract to bypass ABI decoding.
        // The compiled ABI only exposes get_subscription as returning u64,
        // but Cairo serializes the full SubscriptionInfo struct as 2 felts:
        //   [0] = expiry (u64)
        //   [1] = tier   (u8)
        const result = await withRetry(async () => {
            return await provider.callContract({
                contractAddress: CONTRACT_ADDRESS,
                entrypoint: 'get_subscription',
                calldata: [userAddress],
            }, 'latest');
        });

        console.log(`Raw callContract result for ${userAddress}:`, result);

        // result is string[] of hex felts
        const expiry = result[0] ? Number(BigInt(result[0])) : 0;
        let tier = result[1] ? Number(BigInt(result[1])) : 0;

        // Fallback: If tier is 0 but expiry is active, try the new get_tier method
        // (This will work once the contract is redeployed with the get_tier function)
        if (tier === 0 && expiry > Math.floor(Date.now() / 1000)) {
            try {
                const tierResult = await withRetry(async () => {
                    return await provider.callContract({
                        contractAddress: CONTRACT_ADDRESS,
                        entrypoint: 'get_tier',
                        calldata: [userAddress],
                    }, 'latest');
                });
                if (tierResult && tierResult[0]) {
                    tier = Number(BigInt(tierResult[0]));
                    console.log(`Fallback get_tier successful: tier=${tier}`);
                }
            } catch {
                // get_tier likely doesn't exist yet on-chain
                console.log('get_tier fallback failed (likely not deployed yet)');
            }
        }

        console.log(`Parsed Subscription: expiry=${expiry}, tier=${tier}`);
        return { expiry, tier };
    } catch (error: unknown) {
        const rpcError = error as { message?: string; reason?: string };
        const reason = rpcError?.reason || rpcError?.message || 'Unknown RPC error';
        console.error('Get subscription error:', reason);
        return { expiry: 0, tier: 0 };
    }
}
