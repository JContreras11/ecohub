import type { Abi } from "viem";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;
export const PROJECT_DETAIL_STAGE_LABELS = ["Stage 01", "Stage 02", "Stage 03"] as const;

// ── EcoSponsor contract ABI (MVP functions only) ─────────────────────────────
export const ECOSPONSOR_ABI = [
  {
    inputs: [
      { name: "metadataCID", type: "string" },
      { name: "fundingGoal", type: "uint256" },
    ],
    name: "createProject",
    outputs: [{ name: "projectId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "projectId", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    name: "fundProject",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "projectId", type: "uint256" },
      { name: "stageIndex", type: "uint256" },
    ],
    name: "withdrawFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "projectId", type: "uint256" }],
    name: "deactivateProject",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "projectId", type: "uint256" }],
    name: "getProject",
    outputs: [
      {
        components: [
          { name: "id", type: "uint256" },
          { name: "owner", type: "address" },
          { name: "metadataCID", type: "string" },
          { name: "fundingGoal", type: "uint256" },
          { name: "totalFunded", type: "uint256" },
          { name: "currentStage", type: "uint256" },
          { name: "withdrawnAmount", type: "uint256" },
          { name: "active", type: "bool" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "projectId", type: "uint256" }],
    name: "getContributions",
    outputs: [
      {
        components: [
          { name: "contributor", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "timestamp", type: "uint256" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "projectId", type: "uint256" },
      { name: "stageIndex", type: "uint256" },
    ],
    name: "getWithdrawableAmount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "acceptedToken",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "projectCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "id", type: "uint256" },
      { indexed: true, name: "owner", type: "address" },
      { indexed: false, name: "metadataCID", type: "string" },
      { indexed: false, name: "fundingGoal", type: "uint256" },
    ],
    name: "ProjectCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "id", type: "uint256" },
      { indexed: true, name: "contributor", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "totalFunded", type: "uint256" },
    ],
    name: "ProjectFunded",
    type: "event",
  },
] as const satisfies Abi;

export const ERC20_ABI = [
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const satisfies Abi;

export const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  31337: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ZERO_ADDRESS) as `0x${string}`,
  11155111: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ZERO_ADDRESS) as `0x${string}`,
  80002: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ZERO_ADDRESS) as `0x${string}`,
};

export function getContractAddress(chainId: number): `0x${string}` {
  return CONTRACT_ADDRESSES[chainId] || ZERO_ADDRESS;
}
