import type { BackendContribution, LiveContribution } from "./types";

const DEFAULT_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs";

function toBigInt(value: string | number | bigint | null | undefined): bigint {
  if (typeof value === "bigint") return value;
  if (typeof value === "number") return BigInt(Math.max(0, Math.trunc(value)));
  if (typeof value === "string" && value.trim().length > 0) {
    try {
      return BigInt(value);
    } catch {
      return BigInt(0);
    }
  }
  return BigInt(0);
}

export function getProjectImageUrl(imageCid?: string | null): string {
  return imageCid ? `${DEFAULT_GATEWAY}/${imageCid}` : "/images/project-placeholder.png";
}

export function getProjectMetadataUrl(metadataCid?: string | null): string {
  return metadataCid ? `${DEFAULT_GATEWAY}/${metadataCid}` : "#";
}

export function shortenAddress(address?: string | null): string {
  if (!address) return "Unknown";
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function formatUsdcFromBaseUnits(
  value: string | number | bigint | null | undefined,
  maximumFractionDigits = 0,
): string {
  const baseUnits = toBigInt(value);
  const whole = Number(baseUnits) / 1_000_000;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  }).format(Number.isFinite(whole) ? whole : 0);
}

export function getFundingRatio(
  totalFunded: string | number | bigint | null | undefined,
  fundingGoal: string | number | bigint | null | undefined,
): number {
  const funded = toBigInt(totalFunded);
  const goal = toBigInt(fundingGoal);

  if (goal <= BigInt(0)) return 0;

  const ratio = Number((funded * BigInt(10_000)) / goal) / 10_000;
  return Math.max(0, Math.min(1, ratio));
}

export function formatProjectDate(date?: string): string {
  if (!date) return "Recently updated";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "Recently updated";
  }
}

export interface AggregatedContribution {
  address: string;
  total: bigint;
  count: number;
}

export function aggregateLiveContributions(contributions?: readonly LiveContribution[]): AggregatedContribution[] {
  if (!contributions?.length) return [];

  const grouped = new Map<string, AggregatedContribution>();

  contributions.forEach((entry) => {
    const key = entry.contributor.toLowerCase();
    const current = grouped.get(key);
    if (current) {
      current.total += entry.amount;
      current.count += 1;
      return;
    }

    grouped.set(key, {
      address: entry.contributor,
      total: entry.amount,
      count: 1,
    });
  });

  return Array.from(grouped.values()).sort((a, b) => Number(b.total - a.total));
}

export function aggregateBackendContributions(contributions?: BackendContribution[]): AggregatedContribution[] {
  if (!contributions?.length) return [];

  const grouped = new Map<string, AggregatedContribution>();

  contributions.forEach((entry) => {
    const key = entry.contributorAddress.toLowerCase();
    const amount = toBigInt(entry.amount);
    const current = grouped.get(key);

    if (current) {
      current.total += amount;
      current.count += 1;
      return;
    }

    grouped.set(key, {
      address: entry.contributorAddress,
      total: amount,
      count: 1,
    });
  });

  return Array.from(grouped.values()).sort((a, b) => Number(b.total - a.total));
}
