"use client";

import { useState, useEffect } from "react";
import { useReadContract, useChainId } from "wagmi";
import { ECOSPONSOR_ABI, getContractAddress } from "@/lib/contracts";

interface StageBarProps {
  /** On-chain project ID — if provided, reads currentStage via wagmi */
  projectId?: bigint;
  /** DB-cached current stage index (0-based) — avoids RPC when provided */
  cachedCurrentStage?: number;
  /** Stage labels — defaults to ["Funding", "Development", "Delivery"] */
  stages?: string[];
}

/** Pure rendering — no hooks */
function StageBarVisual({
  current,
  stages,
}: {
  current: number;
  stages: string[];
}) {
  return (
    <div className="flex gap-1.5 items-center w-full">
      {stages.map((st, i) => {
        const isDone = i < current;
        const isActive = i === current;

        let stateStyles = "";
        if (isDone) {
          stateStyles = "bg-verdant-500 text-bone-50 dark:bg-verdant-600";
        } else if (isActive) {
          stateStyles = "bg-solar-500 text-earth-900 dark:bg-solar-500";
        } else {
          stateStyles = "bg-bone-300 text-earth-700 dark:bg-[oklch(0.99_0.005_90/0.06)] dark:text-[oklch(0.99_0.005_90/0.4)]";
        }

        return (
          <div
            key={i}
            className={`flex-1 px-2.5 py-2 rounded-lg font-mono text-[11px] uppercase tracking-[0.08em] flex items-center gap-1.5 min-w-0 transition-colors duration-300 ${stateStyles}`}
          >
            <span className="opacity-70">{String(i + 1).padStart(2, "0")}</span>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {st}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** Inner component — uses wagmi hooks, only rendered client-side after mount */
function StageBarInner({
  projectId,
  cachedCurrentStage,
  stages = ["Funding", "Development", "Delivery"],
}: StageBarProps) {
  const chainId = useChainId();

  // On-chain read (only if projectId provided and no cached value)
  const { data: project } = useReadContract({
    address: getContractAddress(chainId),
    abi: ECOSPONSOR_ABI,
    functionName: 'getProject',
    args: projectId !== undefined ? [projectId] : undefined,
    query: {
      enabled: projectId !== undefined && cachedCurrentStage === undefined
    }
  });

  const current = cachedCurrentStage !== undefined 
    ? cachedCurrentStage 
    : (project ? Number(project.currentStage) : 0);

  return <StageBarVisual current={current} stages={stages} />;
}

/** Exported component — applies mounted guard to protect wagmi hooks from SSR */
export default function StageBar(props: StageBarProps) {
  const { cachedCurrentStage, stages = ["Funding", "Development", "Delivery"] } = props;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // If we have cached data, render immediately without waiting for mount (zero layout shift)
  if (!mounted) {
    const current = cachedCurrentStage !== undefined ? cachedCurrentStage : 0;
    return <StageBarVisual current={current} stages={stages} />;
  }

  return <StageBarInner {...props} />;
}
