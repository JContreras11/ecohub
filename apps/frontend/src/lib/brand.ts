export const BRAND = {
  name: "EcoHub",
  wordmark: {
    leading: "Eco",
    accent: "Hub",
  },
  eyebrow: "Open · Solar · On-Chain",
  tagline: "The GitHub of Ecology",
  shortDescription: "Discover and fund open-source ecological projects with transparent, milestone-based on-chain releases.",
  longDescription:
    "Publish ecological projects. Fund real-world milestones. Track every contribution on-chain. EcoHub helps regenerative builders raise support with transparent stage-based escrow.",
  communityLabel: "EcoHub",
  contractName: "EcoHub",
  repositoryUrl: "https://github.com/JContreras11/ecohub",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  noticeStorageKey: "ecohub_disclaimer_accepted",
  socialCardAlt:
    "EcoHub share image with a solarpunk sunrise gradient, a leaf emblem, and the tagline The GitHub of Ecology.",
} as const;

export function brandTitle(title?: string): string {
  return title ? `${title} — ${BRAND.name}` : `${BRAND.name} — ${BRAND.tagline}`;
}
