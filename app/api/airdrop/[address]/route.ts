import { createClient } from 'redis';
import { NextRequest, NextResponse } from 'next/server';
import { getSubscription } from '@/app/lib/contract';

const REDIS_URL = process.env.REDIS_URL || process.env.NEXT_PUBLIC_REDIS_URL || 'redis://localhost:6379';
const IS_PROD = process.env.NODE_ENV === 'production';

type LiveDrop = { project?: string; link?: string; status?: string };

/**
 * Fetch live airdrops from DefiLlama based on tier limits.
 * Tier 1 = 0 live drops, Tier 2 = 5, Tier 3 = 20
 */
async function fetchLiveAirdrops(tier: number, now: number) {
    const maxLive = tier === 1 ? 0 : tier === 2 ? 5 : 20;
    if (maxLive === 0) return [];
    try {
        const response = await fetch('https://api.llama.fi/airdrops');
        if (!response.ok) return [];
        const data = await response.json();
        return (data || []).slice(0, maxLive).map((drop: LiveDrop) => ({
            name: drop.project || 'Unknown Project',
            url: drop.link || 'https://defillama.com/airdrops',
            amount: 'Check eligibility',
            status: drop.status === 'active' ? 'Claimable' : 'Potential',
            expiry: now + 90 * 24 * 60 * 60,
        }));
    } catch {
        console.warn('Live airdrop fetch failed');
        return [];
    }
}

/**
 * Build a full airdrop response based on the on-chain subscription.
 * Merges Zeteo milestone drops with tier-gated live drops.
 */
async function buildAirdropPayload(tier: number, expiryTimestamp: number) {
    const now = Math.floor(Date.now() / 1000);
    const liveAirdrops = await fetchLiveAirdrops(tier, now);

    return {
        status: 'active_subscription',
        tier,
        expiry: expiryTimestamp,
        last_updated: now,
        airdrops: [
            {
                name: 'Zeteo Milestone #1',
                url: 'https://starknet.io/claim',
                amount: '1000 ZET',
                status: 'Claimable',
                expiry: now + 30 * 24 * 60 * 60,
            },
            ...liveAirdrops,
        ],
    };
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ address: string }> }
) {
    try {
        const { address } = await params;
        const now = Math.floor(Date.now() / 1000);

        // ── Step 1: Always verify on-chain state first ──────────────────────────
        let onChainTier = 0;
        let onChainExpiry = 0;
        try {
            const sub = await getSubscription(address);
            onChainTier = sub.tier;
            onChainExpiry = sub.expiry;
        } catch (contractError) {
            console.error('Contract check failed:', contractError);
            return NextResponse.json(
                { error: 'Contract interaction failed', code: 'CONTRACT_ERROR' },
                { status: 500 }
            );
        }

        // No active subscription on-chain
        if (onChainExpiry <= now) {
            return NextResponse.json(
                { error: 'No active subscription found. Please subscribe to access the dashboard.', code: 'NO_SUBSCRIPTION' },
                { status: 404 }
            );
        }

        // ── Step 2: Try Redis cache ──────────────────────────────────────────────
        let redisClient = null;
        let cachedData = null;
        const isDefaultRedis = REDIS_URL.includes('localhost') || REDIS_URL.includes('127.0.0.1');

        if (!IS_PROD || !isDefaultRedis) {
            try {
                redisClient = createClient({
                    url: REDIS_URL,
                    socket: { connectTimeout: 2000 },
                });
                await redisClient.connect();
                const key = `user:${address}:data`;
                const raw = await redisClient.get(key);
                if (raw) cachedData = JSON.parse(raw);
            } catch (redisError) {
                console.warn('Redis unavailable:', redisError instanceof Error ? redisError.message : redisError);
            }
        }

        // ── Step 3: Hot Cache Update ─────────────────────────────────────────────
        // If cached tier matches on-chain tier, serve cache directly
        if (cachedData && cachedData.tier === onChainTier && cachedData.expiry === onChainExpiry) {
            console.log(`Cache hit for ${address} (Tier ${onChainTier})`);
            if (redisClient) await redisClient.disconnect();
            return NextResponse.json(cachedData);
        }

        // Tier mismatch or no cache — rebuild from scratch
        console.log(`Cache miss/upgrade detected for ${address}: on-chain Tier ${onChainTier}, cached Tier ${cachedData?.tier ?? 'none'}`);
        const freshPayload = await buildAirdropPayload(onChainTier, onChainExpiry);

        // Write fresh data back to Redis
        if (redisClient) {
            try {
                const key = `user:${address}:data`;
                await redisClient.set(key, JSON.stringify(freshPayload), { EX: 24 * 60 * 60 });
                console.log(`Redis updated for ${address} (Tier ${onChainTier})`);
            } catch (writeError) {
                console.warn('Redis write failed:', writeError);
            } finally {
                await redisClient.disconnect();
            }
        }

        return NextResponse.json(freshPayload);

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch airdrop data' },
            { status: 500 }
        );
    }
}
