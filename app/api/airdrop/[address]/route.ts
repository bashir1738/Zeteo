import { createClient } from 'redis';
import { NextRequest, NextResponse } from 'next/server';
import { getSubscription } from '@/app/lib/contract';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ address: string }> }
) {
    try {
        const { address } = await params;

        // Fetch user data from Redis (Optional)
        let redisData = null;
        try {
            const redisClient = createClient({ url: REDIS_URL });
            await redisClient.connect();
            const key = `user:${address}:data`;
            redisData = await redisClient.get(key);
            await redisClient.disconnect();
        } catch (redisError) {
            console.warn('Redis unavailable, falling back to contract check:', redisError);
        }

        if (redisData) {
            const userData = JSON.parse(redisData);
            return NextResponse.json(userData);
        }

        // Check smart contract directly
        console.log(`Checking subscription for ${address} on contract...`);
        try {
            const expiryTimestamp = await getSubscription(address);
            const now = Math.floor(Date.now() / 1000);

            if (expiryTimestamp > now) {
                console.log(`User ${address} has active subscription (Expiry: ${expiryTimestamp})`);
                const mockData = {
                    status: 'Active',
                    tier: 3,
                    expiry: expiryTimestamp,
                    airdrops: [
                        {
                            name: 'Zeteo Early Adopter',
                            url: 'https://zeteo.io/claim',
                            amount: '500 ZET',
                            status: 'Claimable',
                            expiry: now + 30 * 24 * 60 * 60,
                        },
                        {
                            name: 'Starknet Odyssey',
                            url: 'https://starknet.io/odyssey',
                            amount: '100 STRK',
                            status: 'Pending',
                            expiry: now + 45 * 24 * 60 * 60,
                        }
                    ]
                };
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
