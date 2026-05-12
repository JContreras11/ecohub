"use client";

import { Coins, Sprout, Waves } from "lucide-react";
import { PROJECT_DETAIL_STAGE_LABELS } from "@/lib/contracts";
import { ProgressArc, StageBar } from "@/components/widgets";
import { BRAND } from "@/lib/brand";
import { formatUsdcFromBaseUnits, getFundingRatio } from "./helpers";
import type { BackendProject, LiveProject } from "./types";

interface ProjectStageSectionProps {
  project: BackendProject;
  liveProject?: LiveProject;
  currentWithdrawable?: bigint;
  isLoading?: boolean;
}

const STAGE_COPY = [
  {
    title: "Stage 01 · Funding root",
    description: "Backers seed the escrow. Capital accumulates while the creator prepares the first deliverable.",
    icon: Sprout,
  },
  {
    title: "Stage 02 · Attest & release",
    description: "Validators confirm the milestone and unlock the next tranche from the contract.",
    icon: Waves,
  },
  {
    title: "Stage 03 · Final canopy",
    description: "The last claim releases the remaining balance, including any rounding remainder held by the escrow.",
    icon: Coins,
  },
] as const;

export default function ProjectStageSection({
  project,
  liveProject,
  currentWithdrawable,
  isLoading = false,
}: ProjectStageSectionProps) {
  const fundingGoal = liveProject?.fundingGoal ?? BigInt(project.fundingGoal || "0");
  const totalFunded = liveProject?.totalFunded ?? BigInt(project.totalFunded || "0");
  const currentStage = liveProject ? Number(liveProject.currentStage) : project.currentStage;
  const fundingRatio = getFundingRatio(totalFunded, fundingGoal);
  const stageCount = PROJECT_DETAIL_STAGE_LABELS.length;
  const baseTranche =
    fundingGoal > BigInt(0) ? fundingGoal / BigInt(stageCount) : BigInt(0);
  const finalTranche =
    fundingGoal > BigInt(0)
      ? fundingGoal - baseTranche * BigInt(stageCount - 1)
      : BigInt(0);

  return (
    <section className="glass-leaf rounded-[2rem] border border-line-strong p-6 sm:p-8 shadow-bloom">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-solar-600 dark:text-solar-300">
              Stage tree
            </div>
            <h2 className="display mt-3 text-3xl text-earth-900 dark:text-bone-50 sm:text-4xl">
              Contract-aware milestone flow
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-earth-600 dark:text-bone-400">
              This view follows the real {BRAND.contractName} contract: three claimable stages, live escrow totals,
              and validator-gated releases instead of the four-stage mock shown in the design artboard.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-[1.5rem] border border-line-strong bg-bone-50/70 px-4 py-3 dark:bg-earth-900/40">
            <ProgressArc value={fundingRatio} size={68} stroke={5} />
            <div>
              <div className="font-display text-2xl text-earth-900 dark:text-bone-50">
                {formatUsdcFromBaseUnits(totalFunded)}
              </div>
              <div className="text-xs text-earth-500 dark:text-verdant-300">
                of {formatUsdcFromBaseUnits(fundingGoal)} goal funded
              </div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-verdant-700 dark:text-verdant-300">
                {Math.round(fundingRatio * 100)}% live progress
              </div>
            </div>
          </div>
        </div>

        <StageBar cachedCurrentStage={currentStage} stages={[...PROJECT_DETAIL_STAGE_LABELS]} />

        {project.onChainId == null && (
          <div className="rounded-[1.25rem] border border-dashed border-solar-400/60 bg-solar-100/60 px-4 py-3 text-sm text-solar-800 dark:bg-solar-900/20 dark:text-solar-200">
            This project has not finished on-chain registration yet. Stage status uses backend cache until
            `onChainId` becomes available.
          </div>
        )}

        <div className="grid gap-4 xl:grid-cols-3">
          {STAGE_COPY.map((stage, index) => {
            const Icon = stage.icon;
            const state = index < currentStage ? "done" : index === currentStage ? "active" : "future";
            const amountForStage = index === stageCount - 1 ? finalTranche : baseTranche;
            const activeAmount = state === "active" && currentWithdrawable !== undefined ? currentWithdrawable : amountForStage;

            const styles = {
              done: {
                wrapper: "border-verdant-300 bg-verdant-100/80 dark:border-verdant-700/40 dark:bg-verdant-900/20",
                badge: "bg-verdant-500 text-bone-50",
                accent: "text-verdant-700 dark:text-verdant-300",
                label: "Validated release",
              },
              active: {
                wrapper: "border-solar-400 bg-solar-100/80 dark:border-solar-600/40 dark:bg-solar-900/20",
                badge: "bg-solar-500 text-earth-950",
                accent: "text-solar-800 dark:text-solar-200",
                label: "Current claim window",
              },
              future: {
                wrapper: "border-line-strong bg-bone-50/90 dark:bg-earth-900/40",
                badge: "bg-bone-300 text-earth-700 dark:bg-earth-800 dark:text-bone-200",
                accent: "text-earth-500 dark:text-verdant-300",
                label: "Queued behind previous release",
              },
            }[state];

            return (
              <article
                key={stage.title}
                className={`rounded-[1.5rem] border p-5 shadow-sm transition-colors ${styles.wrapper}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styles.badge}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-earth-500 dark:text-verdant-300">
                      {PROJECT_DETAIL_STAGE_LABELS[index]}
                    </div>
                    <div className={`mt-1 text-xs font-medium ${styles.accent}`}>{styles.label}</div>
                  </div>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-earth-900 dark:text-bone-50">{stage.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-earth-600 dark:text-bone-400">
                  {stage.description}
                </p>

                <div className="mt-5 rounded-[1.1rem] border border-black/5 bg-black/5 px-4 py-3 dark:border-white/5 dark:bg-white/5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-earth-500 dark:text-verdant-300">
                    Estimated tranche
                  </div>
                  <div className="mt-2 font-display text-2xl text-earth-900 dark:text-bone-50">
                    {isLoading && state === "active"
                      ? "Loading…"
                      : formatUsdcFromBaseUnits(activeAmount, 0)}
                  </div>
                  <div className="mt-2 text-xs text-earth-500 dark:text-verdant-300">
                    Final stage claims any remainder still held in escrow after earlier releases.
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
