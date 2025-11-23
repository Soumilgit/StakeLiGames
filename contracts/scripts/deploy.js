const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying StakeLiGames to Sepolia...\n");

  // Sepolia USDC address (testnet mock)
  const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // Sepolia USDC

  console.log("📝 Contract details:");
  console.log(`   USDC Address: ${USDC_ADDRESS}`);
  console.log(`   Network: ${hre.network.name}`);
  console.log(`   Chain ID: ${(await hre.ethers.provider.getNetwork()).chainId}\n`);

  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 Deploying from: ${deployer.address}`);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${hre.ethers.formatEther(balance)} ETH\n`);

  if (balance < hre.ethers.parseEther("0.01")) {
    console.log("⚠️  WARNING: Low balance!");
    console.log("Get free Sepolia ETH from:");
    console.log("   - https://sepoliafaucet.com");
    console.log("   - https://www.alchemy.com/faucets/ethereum-sepolia");
    console.log("   - https://faucet.quicknode.com/ethereum/sepolia\n");
  }

  // Deploy contract
  console.log("🔨 Compiling contracts...");
  const StakeLiGames = await hre.ethers.getContractFactory("StakeLiGames");
  
  console.log("📤 Deploying contract...");
  const stakeLiGames = await StakeLiGames.deploy(USDC_ADDRESS);
  
  await stakeLiGames.waitForDeployment();
  const contractAddress = await stakeLiGames.getAddress();

  console.log("\n🎉 Contract deployed successfully!");
  console.log(`📋 Contract Address: ${contractAddress}`);
  console.log(`\n🔗 View on Etherscan:`);
  console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);
  
  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    usdcAddress: USDC_ADDRESS,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };
  
  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`\n✅ Deployment info saved to deployment.json`);
  
  // Update .env.local
  const envContent = `# Ethereum Network Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://rpc.sepolia.org
NEXT_PUBLIC_NETWORK_NAME=Sepolia Testnet

# Smart Contract Addresses
NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}
NEXT_PUBLIC_USDC_ADDRESS=${USDC_ADDRESS}

# Application Settings
NEXT_PUBLIC_APP_NAME=StakeLiGames
`;
  
  fs.writeFileSync("../.env.local", envContent);
  console.log(`✅ Updated .env.local with contract address\n`);
  
  console.log("📊 Next steps:");
  console.log("1. Get Sepolia ETH from faucets");
  console.log("2. Get test USDC (opt-in to token)");
  console.log("3. Run: npm run dev");
  console.log("4. Connect MetaMask to Sepolia");
  console.log("5. Start staking! 🎮\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
