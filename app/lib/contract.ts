import { Contract, RpcProvider, AccountInterface } from 'starknet';

// RPC endpoints with fallback
const getRpcUrl = () => {
    return process.env.NEXT_PUBLIC_STARKNET_RPC_URL
        || process.env.NEXT_PUBLIC_STARKNET_NETWORK === 'mainnet'
        ? 'https://free-rpc.nethermind.io/mainnet-juno'
        : 'https://free-rpc.nethermind.io/sepolia-juno';
};

// Retry helper with exponential backoff
interface RpcError {
    code?: number;
    message?: string;
}

const withRetry = async <T>(
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
        outputs: [{ type: 'core::integer::u64' }],
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
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0';

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

export async function getSubscription(userAddress: string): Promise<number> {
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
        return Number(result);
    } catch (error) {
        console.error('Get subscription error:', error);
        return 0;
    }
}
