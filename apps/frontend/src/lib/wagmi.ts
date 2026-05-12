"use client";

import { createConfig, http } from "wagmi";
import { sepolia, polygonAmoy, mainnet, polygon, localhost } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { QueryClient } from "@tanstack/react-query";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo";

const connectors = [
  injected(),
];

// Supported chains (localhost first for development)
export const supportedChains = [localhost, sepolia, polygonAmoy, mainnet, polygon] as const;

// wagmi config
export const wagmiConfig = createConfig({
  chains: supportedChains,
  connectors,
  transports: {
    [localhost.id]:   http("http://127.0.0.1:8545"),
    [sepolia.id]:     http(process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA || undefined),
    [polygonAmoy.id]: http(process.env.NEXT_PUBLIC_RPC_URL_AMOY   || undefined),
    [mainnet.id]:     http(),
    [polygon.id]:     http(),
  },
  ssr: true,
});

// React Query client (shared)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 minutes
      retry: 2,
    },
  },
});
