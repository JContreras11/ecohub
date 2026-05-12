"use client";

import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig, queryClient } from "@/lib/wagmi";
import { Toaster } from "sonner";

interface Web3ProviderProps {
  children: React.ReactNode;
}

export default function Web3Provider({ children }: Web3ProviderProps) {

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background:   "rgba(17, 23, 17, 0.95)",
              border:       "1px solid rgba(34, 197, 94, 0.2)",
              color:        "#d1fae5",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
