import type { Address } from "viem";

export interface BackendContribution {
  id?: number;
  contributorAddress: string;
  amount: string;
  txHash?: string | null;
  blockNumber?: number | null;
  createdAt?: string;
}

export interface BackendProject {
  id: number;
  onChainId: number | null;
  ownerAddress: string;
  metadataCid: string;
  imageCid?: string | null;
  title: string;
  description: string;
  readme?: string | null;
  fundingGoal: string;
  totalFunded: string;
  currentStage: number;
  tags: string[];
  active: boolean;
  txHash?: string | null;
  contributions?: BackendContribution[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LiveProject {
  id: bigint;
  owner: Address;
  metadataCID: string;
  fundingGoal: bigint;
  totalFunded: bigint;
  currentStage: bigint;
  withdrawnAmount: bigint;
  active: boolean;
}

export interface LiveContribution {
  contributor: Address;
  amount: bigint;
  timestamp: bigint;
}
