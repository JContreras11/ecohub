"use client";

import { useState, useEffect } from "react";
import { useReadContract, useChainId } from "wagmi";
import { ECOSPONSOR_ABI, getContractAddress } from "@/lib/contracts";

interface ProgressArcProps {
  /** 0–1 fraction (e.g. 0.65 = 65%) */
  value?: number;
  /** On-chain project ID — if provided, reads totalFunded/fundingGoal via wagmi */
  projectId?: bigint;
  /** DB-cached totalFunded (base units string) — avoids RPC when provided */
  cachedTotalFunded?: string;
  /** DB-cached fundingGoal (base units string) */
  cachedFundingGoal?: string;
  /** SVG diameter in px */
  size?: number;
  /** Stroke width in px */
  stroke?: number;
  /** Custom label (overrides percentage display) */
  label?: string;
}

/** Pure SVG rendering — no hooks, safe for SSR placeholder */
function ProgressArcVisual({
  computedValue,
  size,
  stroke,
  label,
}: {
  computedValue: number;
  size: number;
  stroke: number;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - computedValue);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--verdant-100)"
          strokeWidth={stroke}
          fill="none"
          className="dark:stroke-[oklch(0.99_0.005_90/0.1)]"
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--verdant-600)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 800ms ease" }}
          className="dark:stroke-verdant-500"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: size * 0.22,
          fontWeight: 600,
        }}
        className="text-earth-900 dark:text-verdant-100"
      >
        {label ?? `${Math.round(computedValue * 100)}%`}
      </div>
    </div>
  );
}

/** Inner component — uses wagmi hooks, only rendered client-side after mount */
function ProgressArcInner({
  value,
  projectId,
  cachedTotalFunded,
  cachedFundingGoal,
  size = 48,
  stroke = 4,
  label,
}: ProgressArcProps) {
  const chainId = useChainId();

  // On-chain read (only if projectId provided and no cached values)
  const { data: project } = useReadContract({
    address: getContractAddress(chainId),
    abi: ECOSPONSOR_ABI,
    functionName: 'getProject',
    args: projectId !== undefined ? [projectId] : undefined,
    query: {
      enabled: projectId !== undefined && cachedTotalFunded === undefined && cachedFundingGoal === undefined
    }
  });

  // Calculate computedValue
  let computedValue = 0;
  if (value !== undefined) {
    computedValue = value;
  } else if (cachedTotalFunded !== undefined && cachedFundingGoal !== undefined) {
    const funded = parseFloat(cachedTotalFunded);
    const goal = parseFloat(cachedFundingGoal);
    computedValue = goal > 0 ? funded / goal : 0;
  } else if (project) {
    const fundingGoal = project.fundingGoal;
    const totalFunded = project.totalFunded;
    computedValue = fundingGoal > BigInt(0) ? Number((totalFunded * BigInt(10000)) / fundingGoal) / 10000 : 0;
  }

  // Ensure 0-1 range
  computedValue = Math.min(1, Math.max(0, computedValue));

  return (
    <ProgressArcVisual
      computedValue={computedValue}
      size={size}
      stroke={stroke}
      label={label}
    />
  );
}

/** Exported component — applies mounted guard to protect wagmi hooks from SSR */
export default function ProgressArc(props: ProgressArcProps) {
  const { size = 48, stroke = 4, value, cachedTotalFunded, cachedFundingGoal, label } = props;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // If we have enough data to render without wagmi hooks, do it immediately (no flash)
  if (!mounted) {
    let computedValue = 0;
    if (value !== undefined) {
      computedValue = value;
    } else if (cachedTotalFunded !== undefined && cachedFundingGoal !== undefined) {
      const funded = parseFloat(cachedTotalFunded);
      const goal = parseFloat(cachedFundingGoal);
      computedValue = goal > 0 ? funded / goal : 0;
    }
    computedValue = Math.min(1, Math.max(0, computedValue));

    return (
      <ProgressArcVisual
        computedValue={computedValue}
        size={size}
        stroke={stroke}
        label={label}
      />
    );
  }

  return <ProgressArcInner {...props} />;
}
