import { Contract, RpcProvider, AccountInterface } from 'starknet';

// RPC endpoints with fallback
export const getRpcUrl = (network?: 'mainnet' | 'sepolia') => {
    const apiKey = process.env.NEXT_PUBLIC_INFURA_STARKNET_API_KEY || '1393f762ef174747b0ff964dfbbfe8ab';

    // If a specific network is requested, return the corresponding Infura URL
    if (network === 'mainnet') return `https://starknet-mainnet.infura.io/v3/${apiKey}`;
    if (network === 'sepolia') return `https://starknet-sepolia.infura.io/v3/${apiKey}`;

    // Fallback to environment variable if explicitly set, otherwise use Infura based on global network setting
    return process.env.NEXT_PUBLIC_STARKNET_RPC_URL
        || (process.env.NEXT_PUBLIC_STARKNET_NETWORK === 'mainnet'
            ? `https://starknet-mainnet.infura.io/v3/${apiKey}`
            : `https://starknet-sepolia.infura.io/v3/${apiKey}`);
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

// Contract ABI - simplified for subscribe function
export const SUBSCRIPTION_ABI = [
    {
        name: 'subscribe',
        type: 'function',
        inputs: [{ name: 'tier', type: 'core::integer::u8' }],
        outputs: [],
        state_mutability: 'external',
    },
    {
        name: 'get_subscription',
        type: 'function',
        inputs: [{ name: 'user', type: 'core::starknet::contract_address::ContractAddress' }],
        outputs: [
            {
                type: 'struct',
                name: 'SubscriptionInfo',
                members: [
                    { name: 'expiry', type: 'core::integer::u64' },
                    { name: 'tier', type: 'core::integer::u8' }
                ]
            }
        ],
        state_mutability: 'view',
    },
    {
        name: 'get_price',
        type: 'function',
        inputs: [{ name: 'tier', type: 'core::integer::u8' }],
        outputs: [{ type: 'core::integer::u256' }],
        state_mutability: 'view',
    },
];

export const CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x70cf4464e7d360f6ca6f9d2221c16e49c5867923965b11ac542ae56324265f3';

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

export async function getSubscription(userAddress: string): Promise<{ expiry: number; tier: number }> {
    const provider = new RpcProvider({
        nodeUrl: getRpcUrl(),
    });

    // Create contract with new API (single options object)
    const contract = new Contract({
        abi: SUBSCRIPTION_ABI,
        address: CONTRACT_ADDRESS,
        providerOrAccount: provider,
    });

    try {
        const result = await withRetry(async () => {
            return await contract.call('get_subscription', [userAddress]);
        });

        console.log(`DEBUG: Raw result for ${userAddress}:`, result);

        // Handle different Starknet.js return formats:
        let expiry = 0;
        let tier = 1;

        if (typeof result === 'object' && result !== null) {
            const info = result as any;

            // 1. Check for explicit struct fields (Ideal new format)
            if (info.expiry !== undefined) {
                expiry = Number(info.expiry);
                tier = Number(info.tier !== undefined ? info.tier : 1);
            }
            // 2. Check for wrapped result: { SubscriptionInfo: 1234n }
            else if (info.SubscriptionInfo !== undefined) {
                expiry = Number(info.SubscriptionInfo);
                tier = 1; // Default for legacy
            }
            // 3. Check for array-like result: [expiry, tier]
            else if (info[0] !== undefined) {
                expiry = Number(info[0]);
                tier = Number(info[1] !== undefined ? info[1] : 1);
            }
            // 4. Final fallback for other object types
            else {
                expiry = Number(result || 0);
            }
        } else {
            // 5. Direct legacy result (bigint or number)
            expiry = Number(result || 0);
        }

        console.log(`Parsed Subscription: expiry=${expiry}, tier=${tier}`);

        return { expiry, tier };
    } catch (error) {
        console.error('Get subscription error:', error);
        return { expiry: 0, tier: 0 };
    }
}
