import { createClient } from 'redis';
import { NextRequest, NextResponse } from 'next/server';
import { Contract, RpcProvider } from 'starknet';
import { SUBSCRIPTION_ABI, CONTRACT_ADDRESS } from '@/app/lib/contract';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const RPC_URL = process.env.NEXT_PUBLIC_STARKNET_RPC_URL || (process.env.NEXT_PUBLIC_STARKNET_NETWORK === 'mainnet'
    ? 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7'
    : 'https://free-rpc.nethermind.io/sepolia-juno');

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ address: string }> }
) {
    try {
        const { address } = await params;

        // Connect to Redis
        const redisClient = createClient({ url: REDIS_URL });
        await redisClient.connect();

        // Fetch user data
        const key = `user:${address}:data`;
        const data = await redisClient.get(key);

        await redisClient.disconnect();

        if (data) {
            const userData = JSON.parse(data);
            return NextResponse.json(userData);
        }

        // Fallback: Check smart contract directly if not in Redis
        console.log(`No Redis data for ${address}, checking contract...`);
        const provider = new RpcProvider({ nodeUrl: RPC_URL });
        const contract = new Contract({
            abi: SUBSCRIPTION_ABI,
            address: CONTRACT_ADDRESS,
            providerOrAccount: provider,
        });

        try {
            // Get subscription expiry
            const subscription = await contract.get_subscription(address);
            const expiryTimestamp = Number(subscription);
            const now = Math.floor(Date.now() / 1000);

            if (expiryTimestamp > now) {
                console.log(`User ${address} has active subscription (Expiry: ${expiryTimestamp})`);
                // Valid subscription found! Return mock data with real expiry
                // Since contract doesn't store tier, we default to Premium (3) for now
                const mockData = {
                    status: 'Active',
                    tier: 3, // Default to Premium
                    expiry: expiryTimestamp,
                    airdrops: [
                        {
                            name: 'Zeteo Early Adopter',
                            amount: '500 ZET',
                            status: 'Claimable',
                            expiry: now + 30 * 24 * 60 * 60, // 30 days from now
                            url: 'https://zeteo.io/claim'
                        },
                        {
                            name: 'Starknet Odyssey',
                            amount: '100 STRK',
                            status: 'Pending',
                            expiry: now + 45 * 24 * 60 * 60, // 45 days from now
                            url: 'https://starknet.io/odyssey'
                        }
                    ]
                };

                // TODO: Save to Redis here for future requests
                return NextResponse.json(mockData);
            }
        } catch (contractError) {
            console.error('Contract check failed:', contractError);
        }

        return NextResponse.json(
            { error: 'No subscription found for this address' },
            { status: 404 }
        );
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch airdrop data' },
            { status: 500 }
        );
    }
}
