#!/usr/bin/env python3
"""
Starknet Contract Deployment Script using starknet.py
"""
import asyncio
import json
from pathlib import Path
from starknet_py.net.account.account import Account
from starknet_py.net.full_node_client import FullNodeClient
from starknet_py.net.models import StarknetChainId
from starknet_py.net.signer.stark_curve_signer import KeyPair

async def main():
    print("🚀 Starting deployment to Starknet Sepolia...\n")
    
    # Configuration
    node_url = "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_8/Nq135DBhsJsBkzaEg2uc3"
    private_key = 0x02d18daa37632eb21186925e57fcf74ffc933058df3e3c05a291288e4baab8ce
    account_address = 0x006283c8344b4f568903eef536855ef34a4ae607b065bb2253505ecd5cf0f90c
    
    # Initialize client and account
    client = FullNodeClient(node_url=node_url)
    key_pair = KeyPair.from_private_key(private_key)
    
    account = Account(
        client=client,
        address=account_address,
        key_pair=key_pair,
        chain=StarknetChainId.SEPOLIA
    )
    
    print(f"📝 Account: {hex(account_address)}")
    print(f"🌐 Network: Sepolia Testnet\n")
    
    # Load contract files
    sierra_path = Path("contracts/zeteo/target/dev/zeteo_Subscription.contract_class.json")
    casm_path = Path("contracts/zeteo/target/dev/zeteo_Subscription.compiled_contract_class.json")
    
    with open(sierra_path, "r") as f:
        sierra = json.load(f)
    
    with open(casm_path, "r") as f:
        casm = json.load(f)
    
    print(f"📄 Loaded contract files:")
    print(f"   Sierra: {sierra_path}")
    print(f"   CASM: {casm_path}\n")
    
    try:
        # Declare the contract
        print("📝 Declaring contract...")
        declare_result = await account.sign_declare_v2(
            compiled_contract=sierra,
            compiled_class_hash=int(casm["compiled_class_hash"], 16)
        )
        
        resp = await account.client.declare(declare_result)
        
        print(f"✅ Contract declared successfully!")
        print(f"   Class hash: {hex(declare_result.class_hash)}")
        print(f"   Transaction hash: {hex(declare_result.transaction_hash)}\n")
        
        # Wait for declaration
        print("⏳ Waiting for transaction confirmation...")
        await account.client.wait_for_tx(declare_result.transaction_hash)
        
        # Deploy the contract
        print("\n🚢 Deploying contract instance...")
        # Constructor args: oracle_address (0), eth_address (Sepolia ETH)
        eth_address = 0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
        deploy_result = await account.sign_deploy_v1(
            class_hash=declare_result.class_hash,
            constructor_calldata=[0, eth_address],  # oracle_address, eth_address
            contract_address_salt=0
        )
        
        await account.client.deploy(deploy_result)
        
        print(f"✅ Contract deployed successfully!")
        print(f"   Contract address: {hex(deploy_result.address)}")
        print(f"   Transaction hash: {hex(deploy_result.transaction_hash)}\n")
        
        # Update .env.local
        env_path = Path(".env.local")
        if env_path.exists():
            with open(env_path, "r") as f:
                env_content = f.read()
            
            # Update or add contract address
            if "NEXT_PUBLIC_CONTRACT_ADDRESS" in env_content:
                lines = env_content.split("\n")
                for i, line in enumerate(lines):
                    if line.startswith("NEXT_PUBLIC_CONTRACT_ADDRESS"):
                        lines[i] = f"NEXT_PUBLIC_CONTRACT_ADDRESS={hex(deploy_result.address)}"
                env_content = "\n".join(lines)
            else:
                env_content += f"\nNEXT_PUBLIC_CONTRACT_ADDRESS={hex(deploy_result.address)}\n"
            
            with open(env_path, "w") as f:
                f.write(env_content)
            
            print("📝 Updated .env.local with contract address")
        
        print("\n🎉 Deployment complete!")
        print(f"\nContract Address: {hex(deploy_result.address)}")
        print(f"Class Hash: {hex(declare_result.class_hash)}")
        print(f"\nView on Starkscan: https://sepolia.starkscan.co/contract/{hex(deploy_result.address)}")
        
    except Exception as e:
        print(f"❌ Deployment failed: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)
