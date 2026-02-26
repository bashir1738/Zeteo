/* eslint-disable @typescript-eslint/no-require-imports */
const { Account, RpcProvider, json, CallData } = require("starknet");
const fs = require("fs");
const path = require("path");

async function main() {
    try {
        console.log("🚀 Starting deployment to Starknet Sepolia...");
        console.log("   RPC: Alchemy v0.8 (spec 0.8.1)");
        console.log("   starknet.js: v9\n");

        const provider = new RpcProvider({
            nodeUrl: "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_8/***REMOVED***"
        });

        const privateKey = "***REMOVED***";
        const accountAddress = "***REMOVED***";

        // starknet.js v9 uses options object
        const account = new Account({
            provider: provider,
            address: accountAddress,
            signer: privateKey
        });

        // Read the compiled contract
        const sierraPath = path.join(__dirname, "contracts/target/dev/zeteo_Subscription.contract_class.json");
        const casmPath = path.join(__dirname, "contracts/target/dev/zeteo_Subscription.compiled_contract_class.json");

        const sierra = json.parse(fs.readFileSync(sierraPath, "utf8"));
        const casm = json.parse(fs.readFileSync(casmPath, "utf8"));

        console.log("📄 Contract files loaded successfully\n");

        // Check nonce to verify connectivity
        const nonce = await provider.getNonceForAddress(accountAddress);
        console.log("   Account nonce: " + nonce);

        // Use declare directly
        console.log("\n📝 Declaring contract...");
        const declareResponse = await account.declare({
            contract: sierra,
            casm: casm
        });

        console.log("   Transaction hash: " + declareResponse.transaction_hash);
        console.log("   Waiting for transaction confirmation...");
        await provider.waitForTransaction(declareResponse.transaction_hash);

        console.log("✅ Contract declared successfully!");
        console.log("   Class hash: " + declareResponse.class_hash + "\n");

        // Deploy the contract
        console.log("🚢 Deploying contract instance...");
        // First deploy the MockVerifier contract so we have a real address
        console.log("🔧 Deploying MockVerifier first...");
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
        console.log("✅ MockVerifier deployed at: " + verifierAddress + "\n");

        const subscriptionConstructorArgs = CallData.compile([
            "0x02514876abc10f016f63112187a5523555ae99b1b0521e16f3f0196238b6935d", // Pragma Oracle Sepolia
            "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7", // ETH Token Sepolia
            verifierAddress // MockVerifier deployed address
        ]);

        const deployResponse = await account.deployContract({
            classHash: declareResponse.class_hash,
            constructorCalldata: subscriptionConstructorArgs
        });

        console.log("   Transaction hash: " + deployResponse.transaction_hash);
        console.log("   Waiting for transaction confirmation...");
        await provider.waitForTransaction(deployResponse.transaction_hash);

        console.log("✅ Contract deployed successfully!");
        console.log("   Contract address: " + deployResponse.contract_address + "\n");

        // Update .env.local
        const envPath = path.join(__dirname, ".env.local");
        let envContent = fs.readFileSync(envPath, "utf8");
        envContent = envContent.replace(
            /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
            "NEXT_PUBLIC_CONTRACT_ADDRESS=" + deployResponse.contract_address
        );
        fs.writeFileSync(envPath, envContent);

        console.log("📝 Updated .env.local with contract address");
        console.log("\n🎉 Deployment complete!");
        console.log("\nContract Address: " + deployResponse.contract_address);
        console.log("Class Hash: " + declareResponse.class_hash);
        console.log("\nView on Starkscan: https://sepolia.starkscan.co/contract/" + deployResponse.contract_address);

    } catch (error) {
        console.error("❌ Deployment failed:");
        console.error("   Message:", error.message);
        if (error.baseError) console.error("   RPC Error:", JSON.stringify(error.baseError));
        process.exit(1);
    }
}

main();
