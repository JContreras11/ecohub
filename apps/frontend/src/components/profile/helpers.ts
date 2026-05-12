import { formatUsdcFromBaseUnits, shortenAddress } from "@/components/project-detail/helpers";

export const PROFILE_BANNER_IMAGE = "/images/profile-banner.jpg";
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
export const DEFAULT_AVATAR = "/images/avatar-placeholder.png";

export { formatUsdcFromBaseUnits, shortenAddress };

export function formatContributionDate(value: bigint | number | string, locale?: string): string {
  const raw = typeof value === "bigint" ? Number(value) : Number(value);
  const date = Number.isFinite(raw) && raw > 0 ? new Date(raw * 1000) : null;

  if (!date) return "Unknown date";

  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(-diffDays, "day");
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function getProfileInitials(name?: string | null, ensName?: string | null, address?: string | null): string {
  const source = (name || ensName || "").trim();
  if (source) {
    return source
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2);
  }

  if (address) {
    return shortenAddress(address).replace("…", "").slice(0, 2).toUpperCase();
  }

  return "ES";
}

export function normalizeWalletAddress(address?: string | null): string | null {
  return address ? address.toLowerCase() : null;
}

export function sumContributionAmounts(values: { amount: bigint }[]): bigint {
  return values.reduce((total, item) => total + item.amount, BigInt(0));
}

export function sortContributionItems(a: { timestamp: bigint }, b: { timestamp: bigint }): number {
  if (a.timestamp === b.timestamp) return 0;
  return a.timestamp > b.timestamp ? -1 : 1;
}
