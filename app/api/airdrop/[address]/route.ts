import { createClient } from 'redis';
import { NextRequest, NextResponse } from 'next/server';
import { getSubscription } from '@/app/lib/contract';

const REDIS_URL = process.env.REDIS_URL || process.env.NEXT_PUBLIC_REDIS_URL || 'redis://localhost:6379';
const IS_PROD = process.env.NODE_ENV === 'production';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ address: string }> }
) {
    try {
        const { address } = await params;

        // Fetch user data from Redis (Optional, and skip if default localhost on prod)
        let redisData = null;
        const isDefaultRedis = REDIS_URL.includes('localhost') || REDIS_URL.includes('127.0.0.1');

        if (!IS_PROD || !isDefaultRedis) {
            try {
                const redisClient = createClient({
                    url: REDIS_URL,
                    socket: {
                        connectTimeout: 2000 // 2 second timeout for Vercel functions
                    }
                });
                await redisClient.connect();
                const key = `user:${address}:data`;
                redisData = await redisClient.get(key);
                await redisClient.disconnect();
            } catch (redisError: unknown) {
                const message = redisError instanceof Error ? redisError.message : String(redisError);
                console.warn('Redis unavailable, falling back to contract check:', message);
            }
        }

        if (redisData) {
            const userData = JSON.parse(redisData);
            return NextResponse.json(userData);
        }

        // Check smart contract directly
        console.log(`Checking subscription for ${address} on contract...`);
        try {
            const { expiry: expiryTimestamp, tier } = await getSubscription(address);
            const now = Math.floor(Date.now() / 1000);

            if (expiryTimestamp > now) {
                console.log(`User ${address} has active subscription (Tier: ${tier}, Expiry: ${expiryTimestamp})`);

                // Fetch live airdrops as fallback with Tier-based limits
                let liveAirdrops = [];
                const maxLive = tier === 1 ? 0 : (tier === 2 ? 5 : 20);

                if (maxLive > 0) {
                    try {
                        const response = await fetch('https://api.llama.fi/airdrops');
                        if (response.ok) {
                            const data = await response.json();
                            liveAirdrops = (data || []).slice(0, maxLive).map((drop: { project?: string; link?: string; status?: string }) => ({
                                name: drop.project || 'Unknown Project',
                                url: drop.link || 'https://defillama.com/airdrops',
                                amount: 'Check eligibility',
                                status: drop.status === 'active' ? 'Claimable' : 'Potential',
                                expiry: now + (90 * 24 * 60 * 60)
                            }));
                        }
                    } catch (e) {
                        console.warn('Fallback live fetch failed', e);
                    }
                }

                const mockData = {
                    status: 'Active',
                    tier: tier || 1,
                    expiry: expiryTimestamp,
                    airdrops: [
                        {
                            name: 'Zeteo Milestone #1',
                            url: 'https://starknet.io/claim',
                            amount: '1000 ZET',
                            status: 'Claimable',
                            expiry: now + 30 * 24 * 60 * 60,
                        },
                        ...liveAirdrops
                    ]
                };
                return NextResponse.json(mockData);
            } else {
                return NextResponse.json(
                    { error: 'No active subscription found. Please subscribe to access the dashboard.', code: 'NO_SUBSCRIPTION' },
                    { status: 404 }
                );
            }
        } catch (contractError: unknown) {
            console.error('Contract check failed:', contractError);
            const message = contractError instanceof Error ? contractError.message : String(contractError);
            return NextResponse.json(
                { error: `Contract interaction failed: ${message}`, code: 'CONTRACT_ERROR' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch airdrop data' },
            { status: 500 }
        );
    }
}
