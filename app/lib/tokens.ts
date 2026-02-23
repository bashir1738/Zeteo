export interface Token {
    id: string;
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    icon: string;
}

export type Network = 'mainnet' | 'sepolia';

export const TOKENS: Record<Network, Token[]> = {
    mainnet: [
        {
            id: 'eth-mainnet',
            name: 'Ethereum',
            symbol: 'ETH',
            address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
            decimals: 18,
            icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026'
        },
        {
            id: 'strk-mainnet',
            name: 'Starknet',
            symbol: 'STRK',
            address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
            decimals: 18,
            icon: 'https://cryptologos.cc/logos/starknet-token-strk-logo.png?v=026'
        },
        {
            id: 'usdc-mainnet',
            name: 'USD Coin (Native)',
            symbol: 'USDC',
            address: '0x053b40a647cedfca6ca84f542a0fe36736031905a9639a7f19a3c1e66bfd5080',
            decimals: 6,
            icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026'
        },
        {
            id: 'usdc-bridged-mainnet',
            name: 'USD Coin (Bridged)',
            symbol: 'USDC.eth',
            address: '0x053c9125369e0151fbc23c77b947d305d7a6f22cddad0d269a962f50c76c09ad',
            decimals: 6,
            icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026'
        },
        {
            id: 'usdt-mainnet',
            name: 'Tether',
            symbol: 'USDT',
            address: '0x068f5c6a61780768455de69077e07e8978783947231454c6007e0573e3519c2',
            decimals: 6,
            icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=026'
        }
    ],
    sepolia: [
        {
            id: 'eth-sepolia',
            name: 'Ethereum',
            symbol: 'ETH',
            address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
            decimals: 18,
            icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026'
        },
        {
            id: 'strk-sepolia',
            name: 'Starknet',
            symbol: 'STRK',
            address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
            decimals: 18,
            icon: 'https://cryptologos.cc/logos/starknet-token-strk-logo.png?v=026'
        },
        {
            id: 'usdc-sepolia',
            name: 'USD Coin (Native)',
            symbol: 'USDC',
            address: '0x0512feAc6339Ff7889822cb5aA2a86C848e9D392bB0E3E237C008674feeD8343',
            decimals: 6,
            icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026'
        }
    ]
};
