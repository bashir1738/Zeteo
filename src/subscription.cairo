use starknet::ContractAddress;

#[starknet::interface]
pub trait ISubscription<TContractState> {
    fn subscribe(ref self: TContractState, tier: u8);
    fn get_subscription(self: @TContractState, user: ContractAddress) -> u64;
    fn get_price(self: @TContractState, tier: u8) -> u256;
}

#[starknet::interface]
pub trait IPragmaOracle<TContractState> {
    fn get_data_median(self: @TContractState, data_type: u32) -> (u128, u32, u32, u32);
}

#[starknet::contract]
pub mod Subscription {
    use core::num::traits::Zero;
    use starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
    };
    use starknet::{ContractAddress, get_block_timestamp, get_caller_address};
    use super::IPragmaOracleDispatcher;

    #[storage]
    struct Storage {
        subscriptions: Map<ContractAddress, u64>, // User -> Expiry Timestamp
        owner: ContractAddress,
        oracle_address: ContractAddress,
        eth_token_address: ContractAddress // For payment, if we were doing real transfers
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        NewSubscription: NewSubscription,
    }

    #[derive(Drop, starknet::Event)]
    pub struct NewSubscription {
        #[key]
        pub user: ContractAddress,
        pub tier: u8,
        pub expiry: u64,
        pub timestamp: u64,
    }

    const ETH_USD_PAIR_ID: u32 = 1951444240; // 'ETH/USD' encoded
    const TIER_1_PRICE_USD: u128 = 5
        * 100000000; // $5 with 8 decimals (assuming oracle uses 8 decimals)
    const TIER_2_PRICE_USD: u128 = 10 * 100000000;
    const TIER_3_PRICE_USD: u128 = 20 * 100000000;

    #[constructor]
    fn constructor(
        ref self: ContractState, oracle_address: ContractAddress, eth_address: ContractAddress,
    ) {
        self.owner.write(get_caller_address());
        self.oracle_address.write(oracle_address);
        self.eth_token_address.write(eth_address);
    }

    #[abi(embed_v0)]
    impl SubscriptionImpl of super::ISubscription<ContractState> {
        fn subscribe(ref self: ContractState, tier: u8) {
            let caller = get_caller_address();
            let oracle_address = self.oracle_address.read();

            // Defensive check: Ensure oracle address is initialized
            assert(!oracle_address.is_zero(), 'Oracle not initialized');

            let _oracle_dispatcher = IPragmaOracleDispatcher { contract_address: oracle_address };

            // Logical check for tier
            assert(tier >= 1 && tier <= 3, 'Invalid tier');

            let duration = 30 * 24 * 60 * 60; // 30 days
            let current_expiry = self.subscriptions.entry(caller).read();
            let now = get_block_timestamp();

            let new_expiry = if current_expiry > now {
                current_expiry + duration
            } else {
                now + duration
            };

            self.subscriptions.entry(caller).write(new_expiry);

            self
                .emit(
                    NewSubscription {
                        user: caller, tier: tier, expiry: new_expiry, timestamp: now,
                    },
                );
        }

        fn get_subscription(self: @ContractState, user: ContractAddress) -> u64 {
            self.subscriptions.entry(user).read()
        }

        fn get_price(self: @ContractState, tier: u8) -> u256 {
            // Placeholder for view function to help frontend estimate cost
            0
        }
    }
}
