import { createClient } from 'redis';
import { NextRequest, NextResponse } from 'next/server';
import { getSubscription } from '@/app/lib/contract';

const REDIS_URL = process.env.REDIS_URL || process.env.NEXT_PUBLIC_REDIS_URL || 'redis://localhost:6379';
const IS_PROD = process.env.NODE_ENV === 'production';

// Curated airdrop opportunities (used for Tier 2 & 3)
// These are real, well-known protocols with potential future airdrops
const CURATED_AIRDROPS = [
    { name: 'Starknet Odyssey', url: 'https://starknet.io', amount: '100-500 STRK', status: 'Potential' },
    { name: 'LayerZero Airdrop', url: 'https://layerzero.network', amount: 'ZRO tokens', status: 'Potential' },
    { name: 'zkSync Era Airdrop', url: 'https://zksync.io', amount: 'ZK tokens', status: 'Potential' },
    { name: 'Scroll Airdrop', url: 'https://scroll.io', amount: 'SCR tokens', status: 'Potential' },
    { name: 'Linea Airdrop', url: 'https://linea.build', amount: 'LINEA tokens', status: 'Potential' },
    { name: 'Eigenlayer Restaking', url: 'https://eigenlayer.xyz', amount: 'EIGEN tokens', status: 'Claimable' },
    { name: 'Etherfi Airdrop', url: 'https://ether.fi', amount: 'ETHFI tokens', status: 'Claimable' },
    { name: 'Arbitrum Airdrop S2', url: 'https://arbitrum.io', amount: 'ARB tokens', status: 'Potential' },
    { name: 'Base Ecosystem Grant', url: 'https://base.org', amount: 'TBD', status: 'Potential' },
    { name: 'Optimism RetroPGF', url: 'https://optimism.io', amount: 'OP tokens', status: 'Potential' },
];

/**
 * Build a full airdrop response based on the on-chain subscription.
 * Tier 1 = mock only, Tier 2 = 5 curated drops, Tier 3 = all drops
 */
async function buildAirdropPayload(tier: number, expiryTimestamp: number) {
    const now = Math.floor(Date.now() / 1000);

    // Tier 1: no curated drops, Tier 2: 5, Tier 3: all 10
    const maxCurated = tier === 1 ? 0 : tier === 2 ? 5 : CURATED_AIRDROPS.length;
    const suggestedDrops = CURATED_AIRDROPS.slice(0, maxCurated).map(drop => ({
        ...drop,
        expiry: now + 90 * 24 * 60 * 60,
        type: 'suggested' as const,
    }));

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
                type: 'eligible' as const,
            },
            ...suggestedDrops,
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
