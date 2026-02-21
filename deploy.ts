import { Account, RpcProvider, json, CallData } from "starknet";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const provider = new RpcProvider({
    nodeUrl: "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_8/***REMOVED***"
});

const privateKey = "***REMOVED***";
const accountAddress = "***REMOVED***";

const account = new Account({
    provider,
    address: accountAddress,
    signer: privateKey,
});

async function main() {
    try {
        console.log("🚀 Starting deployment to Starknet Sepolia...\n");

        // Read the compiled contract
        const sierraPath = path.join(__dirname, "contracts/zeteo/target/dev/zeteo_Subscription.contract_class.json");
        const casmPath = path.join(__dirname, "contracts/zeteo/target/dev/zeteo_Subscription.compiled_contract_class.json");

        const sierra = json.parse(fs.readFileSync(sierraPath, "utf8"));
        const casm = json.parse(fs.readFileSync(casmPath, "utf8"));

        console.log("📄 Contract files loaded successfully");
        console.log(`   Sierra: ${sierraPath}`);
        console.log(`   CASM: ${casmPath}\n`);

        // Declare the contract
        console.log("📝 Declaring contract...");
        const declareResponse = await account.declareIfNot({
            contract: sierra,
            casm: casm
        });

        console.log(`   Transaction hash: ${declareResponse.transaction_hash}`);

        if (declareResponse.transaction_hash) {
            console.log("   Waiting for transaction confirmation...");
            await provider.waitForTransaction(declareResponse.transaction_hash);
        }

        console.log(`✅ Contract declared successfully!`);
        console.log(`   Class hash: ${declareResponse.class_hash}\n`);

        // Deploy the contract
        console.log("🚢 Deploying contract instance...");
        // Constructor args: oracle_address, eth_address
        // Using Sepolia ETH address and a placeholder for oracle
        const constructorArgs = CallData.compile([
            "0x0000000000000000000000000000000000000000000000000000000000000000", // placeholder oracle
            "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"  // ETH on Starknet Sepolia
        ]);
        const deployResponse = await account.deployContract({
            classHash: declareResponse.class_hash,
            constructorCalldata: constructorArgs
        });

        console.log(`   Transaction hash: ${deployResponse.transaction_hash}`);
        console.log("   Waiting for transaction confirmation...");

        await provider.waitForTransaction(deployResponse.transaction_hash);

        console.log(`✅ Contract deployed successfully!`);
        console.log(`   Contract address: ${deployResponse.contract_address}\n`);

        // Update .env.local
        const envPath = path.join(__dirname, ".env.local");
        let envContent = fs.readFileSync(envPath, "utf8");

        envContent = envContent.replace(
            /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
            `NEXT_PUBLIC_CONTRACT_ADDRESS=${deployResponse.contract_address}`
        );

        fs.writeFileSync(envPath, envContent);

        console.log("📝 Updated .env.local with contract address");
        console.log("\n🎉 Deployment complete!");
        console.log(`\nContract Address: ${deployResponse.contract_address}`);
        console.log(`Class Hash: ${declareResponse.class_hash}`);
        console.log(`\nView on Starkscan: https://sepolia.starkscan.co/contract/${deployResponse.contract_address}`);

    } catch (error) {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    }
}

main();
