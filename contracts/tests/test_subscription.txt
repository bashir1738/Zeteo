use core::num::traits::Zero;
use snforge_std_deprecated::{
    ContractClassTrait, DeclareResultTrait, declare, start_cheat_caller_address,
    stop_cheat_caller_address,
};
use starknet::ContractAddress;
use zeteo::subscription::{ISubscriptionDispatcher, ISubscriptionDispatcherTrait};

fn deploy_mock_oracle() -> ContractAddress {
    let contract = declare("MockOracle").unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap();
    contract_address
}

fn deploy_subscription(
    oracle_address: ContractAddress,
    eth_address: ContractAddress,
    verifier_address: ContractAddress,
) -> ContractAddress {
    let contract = declare("Subscription").unwrap().contract_class();
    let mut constructor_calldata = ArrayTrait::new();
    constructor_calldata.append(oracle_address.into());
    constructor_calldata.append(eth_address.into());
    constructor_calldata.append(verifier_address.into());
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();
    contract_address
}

#[test]
fn test_subscription_deployment() {
    let oracle_address: ContractAddress = 1.try_into().unwrap();
    let eth_address: ContractAddress = 2.try_into().unwrap();
    let verifier_address: ContractAddress = 3.try_into().unwrap();
    let contract_address = deploy_subscription(oracle_address, eth_address, verifier_address);

    assert(!contract_address.is_zero(), 'Deployment failed');
}

#[test]
fn test_subscribe_success() {
    let oracle_address = deploy_mock_oracle();
    let eth_address: ContractAddress = 2.try_into().unwrap();
    let verifier_address: ContractAddress = 3.try_into().unwrap();
    let contract_address = deploy_subscription(oracle_address, eth_address, verifier_address);
    let dispatcher = ISubscriptionDispatcher { contract_address };

    let user: ContractAddress = 123.try_into().unwrap();
    start_cheat_caller_address(contract_address, user);

    // Subscribe to tier 1
    dispatcher.subscribe(1);

    let expiry = dispatcher.get_subscription(user);
    assert(expiry > 0, 'Subscription failed');

    stop_cheat_caller_address(contract_address);
}

#[test]
#[should_panic(expected: 'Invalid tier')]
fn test_subscribe_invalid_tier() {
    let oracle_address: ContractAddress = 1.try_into().unwrap();
    let eth_address: ContractAddress = 2.try_into().unwrap();
    let verifier_address: ContractAddress = 3.try_into().unwrap();
    let contract_address = deploy_subscription(oracle_address, eth_address, verifier_address);
    let dispatcher = ISubscriptionDispatcher { contract_address };

    dispatcher.subscribe(4); // Invalid tier
}

#[test]
fn test_constructor_zero_oracle() {
    let contract = declare("Subscription").unwrap().contract_class();
    let mut constructor_calldata = ArrayTrait::new();
    let oracle_address: ContractAddress = 0.try_into().unwrap();
    let eth_address: ContractAddress = 2.try_into().unwrap();
    let verifier_address: ContractAddress = 3.try_into().unwrap();
    constructor_calldata.append(oracle_address.into());
    constructor_calldata.append(eth_address.into());
    constructor_calldata.append(verifier_address.into());

    match contract.deploy(@constructor_calldata) {
        Result::Ok(_) => core::panic_with_felt252('Should have panicked'),
        Result::Err(panic_data) => {
            assert(*panic_data.at(0) == 'Oracle address cannot be 0', *panic_data.at(0));
        },
    }
}
