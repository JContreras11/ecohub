"use client";

import { useState, useEffect } from "react";
import { useAccount, useChainId, useBalance, useEnsName } from "wagmi";
import { mainnet } from "viem/chains";
import { useTranslations } from "next-intl";

interface WalletStatusProps {
  /** Show full address or truncated */
  truncate?: boolean;
  /** Show balance */
  showBalance?: boolean;
  /** Show network badge */
  showNetwork?: boolean;
  /** Compact mode (icon only when connected) */
  compact?: boolean;
}

function shortenAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function getChainName(chainId: number): string {
  const chains: Record<number, string> = {
    1: "Mainnet",
    10: "Optimism",
    137: "Polygon",
    8453: "Base",
    11155111: "Sepolia",
    31337: "Localhost",
    80002: "Amoy",
  };
  return chains[chainId] || `Chain ${chainId}`;
}

function WalletStatusInner({
  truncate = true,
  showBalance = false,
  showNetwork = true,
  compact = false,
}: WalletStatusProps) {
  const t = useTranslations("Wallet");
  const { address, isConnected, isConnecting } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const { data: ensName } = useEnsName({ address, chainId: mainnet.id });

  if (isConnecting) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bone-200 dark:bg-earth-800 animate-pulse">
        <div className="w-2 h-2 rounded-full bg-solar-500" />
        <span className="text-xs font-mono text-earth-600 dark:text-solar-400">{t("connecting")}</span>
      </div>
    );
  }

  if (!isConnected || !address) {
    return (
      <div className="text-xs font-mono text-earth-400 dark:text-verdant-700 italic">
        {t("not_connected")}
      </div>
    );
  }

  const displayName = ensName || (truncate ? shortenAddress(address) : address);

  if (compact) {
    return (
      <div className="relative group cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-earth-900 dark:bg-verdant-500/20 flex items-center justify-center border border-line-strong dark:border-verdant-500/30">
          <div className="w-2 h-2 rounded-full bg-verdant-500 shadow-[0_0_8px_oklch(var(--verdant-500))] animate-pulse" />
        </div>
        <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <div className="glass-leaf p-3 rounded-xl border border-line-strong shadow-leaf min-w-[160px]">
             <p className="text-xs font-mono text-earth-900 dark:text-verdant-100 mb-1">{displayName}</p>
             <p className="text-[10px] text-earth-500 dark:text-verdant-300">{getChainName(chainId)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {showNetwork && (
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bone-200 dark:bg-[oklch(0.99_0.005_90/0.06)] border border-line-strong dark:border-earth-800">
          <div className="w-1.5 h-1.5 rounded-full bg-verdant-500" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-earth-900 dark:text-bone-100">
            {getChainName(chainId)}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-earth-900 dark:bg-earth-900/50 border border-earth-800 dark:border-verdant-500/20 shadow-leaf">
        <div className="flex flex-col items-end">
          <span className="text-xs font-mono font-bold text-bone-50 dark:text-verdant-100 leading-none">
            {displayName}
          </span>
          {showBalance && balance && (
            <span className="text-[10px] font-mono text-bone-400 dark:text-verdant-300 mt-1">
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </span>
          )}
        </div>
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-solar-400 to-coral-500 flex-shrink-0" />
      </div>
    </div>
  );
}

export default function WalletStatus(props: WalletStatusProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-8 w-24 bg-bone-200 dark:bg-earth-800 rounded-lg animate-pulse" />
    );
  }

  return <WalletStatusInner {...props} />;
}
