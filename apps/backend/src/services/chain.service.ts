import { ethers } from "ethers";
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load ABI from compiled artifacts (generated after `npm run contracts:compile`)
function loadABI(): any[] {
  const artifactPath = path.resolve(
    __dirname,
    "../../../../packages/contracts/artifacts/contracts/EcoSponsor.sol/EcoSponsor.json"
  );
  if (!fs.existsSync(artifactPath)) {
    console.warn("[Chain] Contract artifact not found. Run `npm run contracts:compile` first.");
    return [];
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  return artifact.abi;
}

function getProvider(): ethers.JsonRpcProvider {
  const rpcUrl = process.env.RPC_URL_SEPOLIA || process.env.RPC_URL_AMOY || "http://127.0.0.1:8545";
  return new ethers.JsonRpcProvider(rpcUrl);
}

function getContract(): ethers.Contract | null {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
    console.warn("[Chain] CONTRACT_ADDRESS not configured.");
    return null;
  }

  const abi = loadABI();
  if (abi.length === 0) return null;

  return new ethers.Contract(contractAddress, abi, getProvider());
}

export interface OnChainProject {
  id:              bigint;
  owner:           string;
  metadataCID:     string;
  fundingGoal:     bigint;
  totalFunded:     bigint;
  currentStage:    bigint;
  withdrawnAmount: bigint;
  active:          boolean;
}

/**
 * Fetch a project from the smart contract by its on-chain ID.
 */
export async function getProjectFromChain(projectId: string | number | bigint): Promise<OnChainProject | null> {
  const contract = getContract();
  if (!contract) return null;

  try {
    const data = await contract.getProject(BigInt(projectId));
    return {
      id:              data.id,
      owner:           data.owner,
      metadataCID:     data.metadataCID,
      fundingGoal:     data.fundingGoal,
      totalFunded:     data.totalFunded,
      currentStage:    data.currentStage,
      withdrawnAmount: data.withdrawnAmount,
      active:          data.active,
    };
  } catch (err) {
    console.error(`[Chain] Failed to fetch project ${projectId}:`, err);
    return null;
  }
}

/**
 * Get the total project count from the smart contract.
 */
export async function getProjectCount(): Promise<number> {
  const contract = getContract();
  if (!contract) return 0;

  try {
    const count = await contract.projectCount();
    return Number(count);
  } catch (err) {
    console.error("[Chain] Failed to fetch project count:", err);
    return 0;
  }
}
