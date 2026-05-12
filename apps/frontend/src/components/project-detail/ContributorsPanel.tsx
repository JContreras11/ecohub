"use client";

import { HandCoins, Users } from "lucide-react";
import {
  aggregateBackendContributions,
  aggregateLiveContributions,
  formatUsdcFromBaseUnits,
  shortenAddress,
} from "./helpers";
import type { BackendProject, LiveContribution } from "./types";

interface ContributorsPanelProps {
  project: BackendProject;
  liveContributions?: readonly LiveContribution[];
  isLoading?: boolean;
}

export default function ContributorsPanel({
  project,
  liveContributions,
  isLoading = false,
}: ContributorsPanelProps) {
  const onChainContributors = aggregateLiveContributions(liveContributions);
  const fallbackContributors = aggregateBackendContributions(project.contributions);
  const contributors = onChainContributors.length > 0 ? onChainContributors : fallbackContributors;
  const sourceLabel = onChainContributors.length > 0 ? "Live on-chain" : "Backend fallback";

  return (
    <section className="glass-leaf rounded-[2rem] border border-line-strong p-6 sm:p-8 shadow-bloom">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-bio-700 dark:text-bio-300">
            Contributors
          </div>
          <h2 className="display mt-3 text-3xl text-earth-900 dark:text-bone-50 sm:text-4xl">
            Capital roots visible
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-earth-600 dark:text-bone-400">
            Backers are grouped by wallet so repeated funding activity reads as one relationship, not noisy rows.
          </p>
        </div>

        <div className="rounded-full border border-line-strong bg-bone-50/80 px-4 py-2 text-right dark:bg-earth-900/50">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-earth-500 dark:text-verdant-300">
            {sourceLabel}
          </div>
          <div className="mt-1 text-lg font-semibold text-earth-900 dark:text-bone-50">{contributors.length}</div>
        </div>
      </div>

      {isLoading && project.onChainId != null && contributors.length === 0 ? (
        <div className="mt-6 rounded-[1.25rem] border border-line-strong bg-bone-50/70 px-4 py-5 text-sm text-earth-500 dark:bg-earth-900/40 dark:text-verdant-300">
          Loading contributor history from the contract…
        </div>
      ) : contributors.length === 0 ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-line-strong bg-bone-50/70 px-6 py-8 text-center dark:bg-earth-900/30">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-verdant-100 text-verdant-700 dark:bg-verdant-900/30 dark:text-verdant-300">
            <HandCoins className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-earth-900 dark:text-bone-50">No backers yet</h3>
          <p className="mt-2 text-sm leading-relaxed text-earth-500 dark:text-verdant-300">
            The first verified contribution will appear here as soon as capital reaches the project.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {contributors.map((contributor, index) => (
            <div
              key={`${contributor.address}-${index}`}
              className="flex flex-col gap-3 rounded-[1.35rem] border border-line-strong bg-bone-50/80 p-4 dark:bg-earth-900/40 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-verdant-100 text-verdant-700 dark:bg-verdant-900/30 dark:text-verdant-300">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-mono text-sm font-semibold text-earth-900 dark:text-bone-50">
                    {shortenAddress(contributor.address)}
                  </div>
                  <div className="mt-1 text-xs text-earth-500 dark:text-verdant-300">
                    {contributor.count} contribution{contributor.count === 1 ? "" : "s"}
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="font-display text-2xl text-earth-900 dark:text-bone-50">
                  {formatUsdcFromBaseUnits(contributor.total)}
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-verdant-700 dark:text-verdant-300">
                  Total committed
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
