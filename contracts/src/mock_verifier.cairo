#[starknet::interface]
pub trait IVerifier<TContractState> {
    fn verify_proof(self: @TContractState, proof: Span<felt252>) -> bool;
}

#[starknet::contract]
pub mod MockVerifier {
    #[storage]
    struct Storage {}

    #[abi(embed_v0)]
    impl VerifierImpl of super::IVerifier<ContractState> {
        fn verify_proof(self: @ContractState, proof: Span<felt252>) -> bool {
            // In a real Garaga verifier, this would perform complex math.
            // For the hackathon demo, we accept any proof that has at least one element.
            proof.len() > 0
        }
    }
}
