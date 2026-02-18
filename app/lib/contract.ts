import { Contract, RpcProvider, AccountInterface } from 'starknet';

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

    const contract = new Contract(SUBSCRIPTION_ABI, CONTRACT_ADDRESS, account);

    try {
        const result = await contract.subscribe(tier);
        await account.waitForTransaction(result.transaction_hash);
        return result;
    } catch (error) {
        console.error('Subscription error:', error);
        throw error;
    }
}

export async function getSubscription(userAddress: string): Promise<number> {
    const provider = new RpcProvider({
        nodeUrl: process.env.NEXT_PUBLIC_STARKNET_NETWORK === 'mainnet'
            ? 'https://starknet-mainnet.g.alchemy.com/v2/demo'
            : 'https://starknet-sepolia.g.alchemy.com/v2/demo',
    });

    const contract = new Contract(SUBSCRIPTION_ABI, CONTRACT_ADDRESS, provider);

    try {
        const result = await contract.get_subscription(userAddress);
        return Number(result);
    } catch (error) {
        console.error('Get subscription error:', error);
        return 0;
    }
}
