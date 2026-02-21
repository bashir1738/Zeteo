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

// Mock Airdrop Data
const MOCK_AIRDROPS = [
    { name: 'Starknet Early Adopter', url: 'https://starknet.io/claim', amount: '500 STRK' },
    { name: 'Optimism Drop #1', url: 'https://optimism.io/airdrop', amount: '200 OP' },
    { name: 'Malicious Drop', url: 'https://scam-site.com/claim', amount: '1000 SCAM' }, // Should be filtered
];

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
    // Event layout: [user_address, tier, expiry, timestamp] (based on Cairo definition)
    // Note: Depends on how Cairo serializes. 
    // NewSubscription { user: key, tier, expiry, timestamp }
    // keys: [selector, user] (since user is key)
    // data: [tier, expiry, timestamp]

    const userAddress = event.keys[1]; // 2nd key is user (index 1)
    const tier = parseInt(event.data[0]);
    const expiry = parseInt(event.data[1]);

    console.log(`Processing subscription for ${userAddress} (Tier ${tier})`);

    // Mock Business Logic: Check Airdrops
    const eligibleAirdrops = MOCK_AIRDROPS.filter(drop => {
        // Domain Security Filter
        try {
            const domain = new URL(drop.url).hostname;
            const isAllowed = ALLOWED_DOMAINS.some(allowed => domain === allowed || domain.endsWith('.' + allowed));
            return isAllowed;
        } catch {
            console.error(`Invalid URL in mock data: ${drop.url}`);
            return false;
        }
    });

    const userData = {
        status: 'active_subscription',
        tier: tier,
        expiry: expiry,
        airdrops: eligibleAirdrops,
        last_updated: Math.floor(Date.now() / 1000)
    };

    // Write to Redis
    const key = `user:${userAddress}:data`;
    await redis.set(key, JSON.stringify(userData), {
        EX: 24 * 60 * 60 // 24 hours expiry
    });

    console.log(`Data written to Redis for ${userAddress}`);
}

main().catch(console.error);
