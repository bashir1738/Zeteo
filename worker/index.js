import 'dotenv/config';
import { RpcProvider, hash } from 'starknet';
import { createClient } from 'redis';

// Configuration
const PROVIDER_URL = process.env.RPC_URL || 'https://starknet-sepolia.g.alchemy.com/v2/demo';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Domain Allowlist
const ALLOWED_DOMAINS = [
    'starknet.io',
    'optimism.io',
    'polygon.io',
    'base.org',
    'eigenlayer.xyz',
    'ether.fi',
    'zksync.io',
    'arbitrum.io',
    'scroll.io'
];

// Mock Airdrop Data (Kept for demonstration)
const MOCK_AIRDROPS = [
    {
        name: 'Zeteo Milestone #1',
        url: 'https://starknet.io/claim',
        amount: '1000 ZET',
        status: 'Claimable'
    },
    {
        name: 'Early Supporter Drop',
        url: 'https://starknet.io/claim',
        amount: '500 ZET',
        status: 'Pending'
    }
];

// Fetch live airdrops from DefiLlama
async function fetchLiveAirdrops() {
    try {
        console.log('Fetching live airdrops from DefiLlama...');
        const response = await fetch('https://api.llama.fi/airdrops');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        // Map DefiLlama data to our format
        // Data format: [{ project: string, url: string, description: string, status: string, ... }]
        return (data || []).slice(0, 10).map(drop => ({
            name: drop.project || 'Unknown Project',
            url: drop.link || 'https://defillama.com/airdrops',
            amount: 'Check eligibility',
            status: drop.status === 'active' ? 'Claimable' : 'Potential',
            expiry: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60) // Default 90 days
        }));
    } catch (error) {
        console.error('Failed to fetch live airdrops:', error);
        return [];
    }
}

// Event Selector for NewSubscription(user, tier, expiry, timestamp)
// calculated keccak256("NewSubscription")
const EVENT_SELECTOR = hash.getSelectorFromName('NewSubscription');

async function main() {
    console.log('Starting Zeteo Worker...');

    // 1. Redis Setup
    const redisClient = createClient({ url: REDIS_URL });

    redisClient.on('error', (err) => {
        if (err.code === 'ECONNREFUSED') {
            console.error('Error: Redis is not running. Please start Redis server (e.g., redis-server).');
            process.exit(1);
        } else {
            console.error('Redis Client Error', err);
        }
    });

    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (err) {
        if (err.code === 'ECONNREFUSED') {
            console.error('Failed to connect to Redis. Is the server running?');
            process.exit(1);
        }
        throw err;
    }

    // 2. Starknet Setup
    const provider = new RpcProvider({ nodeUrl: PROVIDER_URL });

    console.log(`Listening for events on contract: ${CONTRACT_ADDRESS}`);

    // Polling required for simple event listening in this context
    // In a production production system, we might use an indexer. 
    // Here we poll for recent blocks/events.

    let lastBlock = await provider.getBlockNumber();
    console.log(`Starting from block ${lastBlock}`);

    setInterval(async () => {
        try {
            const currentBlock = await provider.getBlockNumber();

            if (currentBlock > lastBlock) {
                console.log(`Checking blocks ${lastBlock + 1} to ${currentBlock}...`);

                // Get events
                const eventsList = await provider.getEvents({
                    address: CONTRACT_ADDRESS,
                    from_block: { block_number: lastBlock + 1 },
                    to_block: { block_number: currentBlock },
                    keys: [[EVENT_SELECTOR]],
                    chunk_size: 10 // process in small chunks
                });

                for (const event of eventsList.events) {
                    await processEvent(event, redisClient);
                }

                lastBlock = currentBlock;
            }
        } catch (error) {
            console.error('Error polling events:', error);
        }
    }, 10000); // Check every 10 seconds
}

async function processEvent(event, redis) {
    console.log('Detected NewSubscription event:', event);

    // Parse Event Data
    const userAddress = event.keys[1];
    const tier = parseInt(event.data[0]);
    const expiry = parseInt(event.data[1]);

    console.log(`Processing subscription for ${userAddress} (Tier ${tier})`);

    // 1. Filter Mock Airdrops
    const eligibleMockAirdrops = MOCK_AIRDROPS.filter(drop => {
        try {
            const domain = new URL(drop.url).hostname;
            return ALLOWED_DOMAINS.some(allowed => domain === allowed || domain.endsWith('.' + allowed));
        } catch { return false; }
    });

    const now = Math.floor(Date.now() / 1000);
    const mockWithExpiry = eligibleMockAirdrops.map(drop => ({
        ...drop,
        expiry: drop.expiry || (now + 30 * 24 * 60 * 60)
    }));

    // 2. Fetch and merge live airdrops
    const liveAirdrops = await fetchLiveAirdrops();
    const filteredLive = liveAirdrops.filter(drop => {
        try {
            const domain = new URL(drop.url).hostname;
            return ALLOWED_DOMAINS.some(allowed => domain === allowed || domain.endsWith('.' + allowed));
        } catch { return false; }
    });

    const combinedAirdrops = [...mockWithExpiry, ...filteredLive];

    const userData = {
        status: 'active_subscription',
        tier: tier,
        expiry: expiry,
        airdrops: combinedAirdrops,
        last_updated: now
    };

    // 3. Write to Redis
    const key = `user:${userAddress}:data`;
    await redis.set(key, JSON.stringify(userData), {
        EX: 24 * 60 * 60 // 24 hours expiry
    });

    console.log(`Data written to Redis for ${userAddress} with ${combinedAirdrops.length} airdrops`);
}

main().catch(console.error);
