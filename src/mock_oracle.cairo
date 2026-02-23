#[starknet::interface]
pub trait IMockOracle<TContractState> {
    fn get_data_median(self: @TContractState, data_type: u32) -> (u128, u32, u32, u32);
}

#[starknet::contract]
mod MockOracle {
    #[storage]
    struct Storage {}

    #[abi(embed_v0)]
    impl MockOracleImpl of super::IMockOracle<ContractState> {
        fn get_data_median(self: @ContractState, data_type: u32) -> (u128, u32, u32, u32) {
            // price, decimals, last_updated, num_sources
            (100000000, 8, 0, 0)
        }
    }
}
