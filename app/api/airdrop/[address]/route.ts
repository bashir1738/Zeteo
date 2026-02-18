import { createClient } from 'redis';
import { NextRequest, NextResponse } from 'next/server';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

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

        if (!data) {
            return NextResponse.json(
                { error: 'No subscription found for this address' },
                { status: 404 }
            );
        }

        const userData = JSON.parse(data);
        return NextResponse.json(userData);
    } catch (error) {
        console.error('Redis error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch airdrop data' },
            { status: 500 }
        );
    }
}
