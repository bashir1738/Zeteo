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
        const sierraPath = path.join(__dirname, "contracts/target/dev/zeteo_Subscription.contract_class.json");
        const casmPath = path.join(__dirname, "contracts/target/dev/zeteo_Subscription.compiled_contract_class.json");

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
        console.log("🚢 Deploying contracts...");

        // Step 1: Deploy MockVerifier first (required as 3rd constructor arg for Subscription)
        console.log("   🔧 Deploying MockVerifier...");
        const verifierSierraPath = path.join(__dirname, "contracts/target/dev/zeteo_MockVerifier.contract_class.json");
        const verifierCasmPath = path.join(__dirname, "contracts/target/dev/zeteo_MockVerifier.compiled_contract_class.json");
        const verifierSierra = json.parse(fs.readFileSync(verifierSierraPath, "utf8"));
        const verifierCasm = json.parse(fs.readFileSync(verifierCasmPath, "utf8"));
        const verifierDeclare = await account.declareIfNot({ contract: verifierSierra, casm: verifierCasm });
        if (verifierDeclare.transaction_hash) {
            await provider.waitForTransaction(verifierDeclare.transaction_hash);
        }
        const verifierDeploy = await account.deployContract({ classHash: verifierDeclare.class_hash, constructorCalldata: [] });
        await provider.waitForTransaction(verifierDeploy.transaction_hash);
        const verifierAddress = verifierDeploy.contract_address;
        console.log(`   ✅ MockVerifier deployed at: ${verifierAddress}`);

        // Step 2: Deploy Subscription with all 3 required constructor args
        console.log("   🚢 Deploying Subscription contract...");
        // Constructor args: oracle_address, eth_address, verifier_address
        const constructorArgs = CallData.compile([
            "0x02514876abc10f016f63112187a5523555ae99b1b0521e16f3f0196238b6935d", // Pragma Oracle Sepolia
            "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7", // ETH on Starknet Sepolia
            verifierAddress // MockVerifier (ZK proof verifier for demo)
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
