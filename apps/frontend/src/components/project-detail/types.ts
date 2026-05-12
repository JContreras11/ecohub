import type { Address } from "viem";

export interface BackendContribution {
  id?: string;
  contributorAddress: string;
  amount: string;
  txHash?: string | null;
  blockNumber?: number | null;
  createdAt?: string;
}

export type AssetKind = "IMAGE" | "VIDEO" | "EMBED";

export interface BackendProjectAsset {
  id: string;
  stage: number;
  kind: AssetKind;
  url: string;
  thumbnailUrl?: string | null;
  caption?: string | null;
  description?: string | null;
  capturedAt?: string | null;
  sortOrder: number;
}

export interface BackendProject {
  id: string;
  slug: string;
  onChainId: string | null;
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
  assets?: BackendProjectAsset[];
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
