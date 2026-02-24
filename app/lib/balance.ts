import { Contract, RpcProvider, uint256 } from 'starknet';
import { withRetry, getRpcUrl } from './contract';
import { Token, Network } from './tokens';

const ERC20_ABI = [
    {
        name: 'balanceOf',
        type: 'function',
        inputs: [{ name: 'account', type: 'core::starknet::contract_address::ContractAddress' }],
        outputs: [{ name: 'balance', type: 'core::integer::u256' }],
        state_mutability: 'view',
    },
    {
        name: 'decimals',
        type: 'function',
        inputs: [],
        outputs: [{ name: 'decimals', type: 'core::integer::u8' }],
        state_mutability: 'view',
    }
];

export async function fetchTokenBalances(
    accountAddress: string,
    tokens: Token[],
    network: Network
) {
    const provider = new RpcProvider({ nodeUrl: getRpcUrl(network) });

    // Map symbols to CoinGecko IDs
    const cgIds: Record<string, string> = {
        'ETH': 'ethereum',
        'STRK': 'starknet',
        'USDC': 'usd-coin',
        'USDT': 'tether',
        'DAI': 'dai'
    };

    const ids = tokens.map(t => cgIds[t.symbol]).filter(Boolean).join(',');
    let prices: Record<string, { usd: number; usd_24h_change: number }> = {};

    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
        prices = await response.json();
    } catch (e) {
        console.error('Failed to fetch prices from CoinGecko:', e);
    }

    const balancePromises = tokens.map(async (token) => {
        const nodeUrl = getRpcUrl(network);
        try {
            console.log(`Fetching balance for ${token.symbol} at ${token.address} on ${nodeUrl}`);
            const contract = new Contract({
                abi: ERC20_ABI,
                address: token.address,
                providerOrAccount: provider
            });
            const result = await withRetry(async () => {
                return await contract.call('balanceOf', [accountAddress]);
            });

            // Handle both old and new Cairo u256 formats
            // starknet.js returns an object with named properties if they exist in ABI
            // @ts-expect-error - result.balance could be u256 object or bigint
            const rawBalance = result.balance !== undefined ? result.balance : result;

            const balanceBigInt = typeof rawBalance === 'bigint' ? rawBalance : uint256.uint256ToBN(rawBalance);
            const formattedBalance = Number(balanceBigInt) / Math.pow(10, token.decimals);

            const cgId = cgIds[token.symbol];
            const priceData = cgId ? prices[cgId] : null;

            return {
                ...token,
                balance: formattedBalance.toString(),
                price: priceData?.usd || 0,
                change24h: priceData?.usd_24h_change || 0
            };
        } catch (error: any) {
            const errorMessage = error?.message || error?.toString() || '';
            const isContractNotFound = errorMessage.includes('Contract not found') ||
                (error?.code === 20) ||
                (error?.code === -32603 && errorMessage.includes('20'));

            if (isContractNotFound) {
                console.warn(`Token ${token.symbol} not found on ${network}. Skipping.`);
            } else {
                console.error(`Error fetching balance for ${token.symbol} (${token.address}) on ${nodeUrl}:`, errorMessage);
            }

            return {
                ...token,
                balance: '0',
                price: 0,
                change24h: 0
            };
        }
    });

    return Promise.all(balancePromises);
}
