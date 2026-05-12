import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Deployment script for EcoSponsor.sol
 *
 * Usage:
 *   Local:   npx hardhat run scripts/deploy.ts --network localhost
 *   Sepolia: npx hardhat run scripts/deploy.ts --network sepolia
 *   Amoy:    npx hardhat run scripts/deploy.ts --network amoy
 *
 * On local network, a MockUSDC is deployed first.
 * On testnets/mainnet, set USDC_ADDRESS in .env.
 */

// Known USDC addresses per network
const USDC_ADDRESSES: Record<number, string> = {
  11155111: process.env.USDC_ADDRESS || "", // Sepolia
  80002:    process.env.USDC_ADDRESS || "", // Polygon Amoy
};

async function main() {
  const [deployer] = await ethers.getSigners();
  const { chainId } = await ethers.provider.getNetwork();
  const chainIdNum = Number(chainId);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  EcoHub — EcoSponsor.sol Deployment");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Network:  ${network.name} (chainId: ${chainId})`);
  console.log(`  Deployer: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`  Balance:  ${ethers.formatEther(balance)} ETH/MATIC\n`);

  let usdcAddress: string;

  // ── Step 1: Determine USDC address ─────────────────────────────────────────
  if (network.name === "localhost" || network.name === "hardhat") {
    console.log("🪙  Deploying MockUSDC for local testing...");
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const mockUsdc = await MockUSDC.deploy();
    await mockUsdc.waitForDeployment();
    usdcAddress = await mockUsdc.getAddress();
    console.log(`✅  MockUSDC deployed at: ${usdcAddress}`);

    // Mint 10,000 USDC to deployer for testing
    const mintAmount = ethers.parseUnits("10000", 6);
    await mockUsdc.mint(deployer.address, mintAmount);
    console.log(`    Minted 10,000 mUSDC to deployer`);
  } else {
    usdcAddress = USDC_ADDRESSES[chainIdNum];
    if (!usdcAddress || usdcAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error(
        `No USDC address configured for chain ${chainIdNum}. Set USDC_ADDRESS in your .env file.`
      );
    }
    console.log(`🪙  Using USDC at: ${usdcAddress}`);
  }

  // ── Step 2: Deploy EcoSponsor ───────────────────────────────────────────────
  console.log("\n🚀  Deploying EcoSponsor...");
  const EcoSponsor = await ethers.getContractFactory("EcoSponsor");
  const ecoSponsor = await EcoSponsor.deploy(usdcAddress);
  await ecoSponsor.waitForDeployment();

  const contractAddress = await ecoSponsor.getAddress();
  const deployTx = ecoSponsor.deploymentTransaction();

  console.log(`✅  EcoSponsor deployed at: ${contractAddress}`);
  console.log(`    Tx hash: ${deployTx?.hash}`);

  // ── Step 3: Save deployment info ───────────────────────────────────────────
  const deploymentInfo = {
    network:         network.name,
    chainId:         chainIdNum,
    deployer:        deployer.address,
    contractAddress: contractAddress,
    usdcAddress:     usdcAddress,
    txHash:          deployTx?.hash,
    timestamp:       new Date().toISOString(),
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const outputPath = path.join(deploymentsDir, `${network.name}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n📄  Deployment info saved to: deployments/${network.name}.json`);

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Next steps:");
  console.log(`  1. Update CONTRACT_ADDRESS in your .env:`);
  console.log(`     CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`  2. Update USDC_ADDRESS in your .env:`);
  console.log(`     USDC_ADDRESS=${usdcAddress}`);
  console.log(`  3. Verify contract on explorer (optional):`);
  console.log(`     npx hardhat verify --network ${network.name} ${contractAddress} ${usdcAddress}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌  Deployment failed:", error);
    process.exit(1);
  });
