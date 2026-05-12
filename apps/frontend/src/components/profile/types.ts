import type { BackendProject } from "@/components/project-detail/types";

export interface ProfileUser {
  exists: boolean;
  walletAddress: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  twitterHandle: string | null;
  githubHandle: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ProjectsResponse {
  data: BackendProject[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProfileContributionItem {
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  projectDescription: string;
  projectImageCid?: string | null;
  ownerAddress: string;
  onChainId: string;
  amount: bigint;
  timestamp: bigint;
  currentStage: number;
}
