"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useChainId, useReadContract } from "wagmi";
import { Coins, Leaf, MapPin, ShieldCheck } from "lucide-react";
import { WaterCursor, WindCanvas } from "@/components/effects";
import {
  ECOSPONSOR_ABI,
  PROJECT_DETAIL_STAGE_LABELS,
  ZERO_ADDRESS,
  getContractAddress,
} from "@/lib/contracts";
import { formatProjectDate, formatUsdcFromBaseUnits, getFundingRatio, getProjectImageUrl, shortenAddress } from "./helpers";
import type { BackendProject, LiveContribution, LiveProject } from "./types";
import ProjectStageSection from "./ProjectStageSection";
import ContributorsPanel from "./ContributorsPanel";
import ProjectActionPanel from "./ProjectActionPanel";

interface ProjectDetailClientProps {
  project: BackendProject;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const router = useRouter();
  const chainId = useChainId();
  const contractAddress = getContractAddress(chainId || 11155111);
  const onChainId = project.onChainId != null ? BigInt(project.onChainId) : undefined;
  const canReadOnChain = onChainId !== undefined && contractAddress !== ZERO_ADDRESS;

  const {
    data: liveProjectRaw,
    isLoading: isLiveProjectLoading,
    refetch: refetchLiveProject,
  } = useReadContract({
    address: contractAddress,
    abi: ECOSPONSOR_ABI,
    functionName: "getProject",
    args: onChainId !== undefined ? [onChainId] : undefined,
    query: {
      enabled: canReadOnChain,
    },
  });

  const liveProject = liveProjectRaw as LiveProject | undefined;
  const currentStage = liveProject ? Number(liveProject.currentStage) : project.currentStage;

  const {
    data: liveContributionsRaw,
    isLoading: isContributionsLoading,
    refetch: refetchContributions,
  } = useReadContract({
    address: contractAddress,
    abi: ECOSPONSOR_ABI,
    functionName: "getContributions",
    args: onChainId !== undefined ? [onChainId] : undefined,
    query: {
      enabled: canReadOnChain,
    },
  });

  const {
    data: acceptedTokenRaw,
    refetch: refetchAcceptedToken,
  } = useReadContract({
    address: contractAddress,
    abi: ECOSPONSOR_ABI,
    functionName: "acceptedToken",
    query: {
      enabled: contractAddress !== ZERO_ADDRESS,
    },
  });

  const {
    data: currentWithdrawableRaw,
    isLoading: isWithdrawableLoading,
    refetch: refetchWithdrawable,
  } = useReadContract({
    address: contractAddress,
    abi: ECOSPONSOR_ABI,
    functionName: "getWithdrawableAmount",
    args:
      onChainId !== undefined && currentStage < PROJECT_DETAIL_STAGE_LABELS.length
        ? [onChainId, BigInt(currentStage)]
        : undefined,
    query: {
      enabled: canReadOnChain && currentStage < PROJECT_DETAIL_STAGE_LABELS.length,
    },
  });

  const liveContributions = liveContributionsRaw as readonly LiveContribution[] | undefined;
  const acceptedToken = acceptedTokenRaw as `0x${string}` | undefined;
  const currentWithdrawable = currentWithdrawableRaw as bigint | undefined;

  const fundingGoal = liveProject?.fundingGoal ?? BigInt(project.fundingGoal || "0");
  const totalFunded = liveProject?.totalFunded ?? BigInt(project.totalFunded || "0");
  const fundingRatio = getFundingRatio(totalFunded, fundingGoal);
  const [imageUrl, setImageUrl] = useState("/images/project-placeholder.png");
  const readmeContent = project.readme?.trim() || project.description;
  const contributorCount = useMemo(() => {
    if (liveContributions?.length) {
      return new Set(liveContributions.map((entry) => entry.contributor.toLowerCase())).size;
    }

    if (project.contributions?.length) {
      return new Set(project.contributions.map((entry) => entry.contributorAddress.toLowerCase())).size;
    }

    return 0;
  }, [liveContributions, project.contributions]);

  useEffect(() => {
    const nextImageUrl = getProjectImageUrl(project.imageCid);

    if (nextImageUrl === "/images/project-placeholder.png") {
      setImageUrl(nextImageUrl);
      return;
    }

    const probe = new window.Image();
    probe.onload = () => setImageUrl(nextImageUrl);
    probe.onerror = () => setImageUrl("/images/project-placeholder.png");
    probe.src = nextImageUrl;
  }, [project.imageCid]);

  async function refreshLiveData() {
    await Promise.all([
      refetchLiveProject(),
      refetchContributions(),
      refetchAcceptedToken(),
      currentStage < PROJECT_DETAIL_STAGE_LABELS.length ? refetchWithdrawable() : Promise.resolve(null),
    ]);

    router.refresh();
  }

  return (
    <div className="bg-[var(--bg)]">
      <section className="relative overflow-hidden bg-earth-950 text-bone-50">
        <div className="absolute inset-0">
          <img
            src={imageUrl}
            alt={project.title}
            className="h-full w-full object-cover opacity-55"
            onError={() => {
              setImageUrl("/images/project-placeholder.png");
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.20_0.05_145/0.55),oklch(0.20_0.05_145/0.9))]" />
        </div>
        <div className="pointer-events-none absolute inset-0">
          <WindCanvas density={0.45} palette="forest" />
          <WaterCursor tint="solar" />
        </div>

        <div className="relative mx-auto flex min-h-[620px] max-w-[1480px] items-end px-4 pb-20 pt-28 sm:px-8 lg:pt-36">
          <div className="grid w-full gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <div>
              <div className="mb-5 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-solar-300/30 bg-solar-400/90 px-3 py-1 text-xs font-medium text-earth-950">
                  <span className="h-1.5 w-1.5 rounded-full bg-earth-950" />
                  {project.onChainId == null ? "Pending sync" : `Funding · ${PROJECT_DETAIL_STAGE_LABELS[Math.min(currentStage, PROJECT_DETAIL_STAGE_LABELS.length - 1)]}`}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-bone-50/20 bg-bone-50/10 px-3 py-1 text-xs font-medium text-bone-50/90">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {project.onChainId == null ? "Backend metadata live" : "Contract state live"}
                </span>
                {project.tags?.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-bone-50/15 bg-bone-50/10 px-3 py-1 text-xs font-medium text-bone-50/80"
                  >
                    <Leaf className="h-3.5 w-3.5 text-verdant-300" />
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="display max-w-5xl text-[clamp(3.5rem,7vw,6.75rem)] leading-[0.95] text-bone-50">
                {project.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-bone-50/85 sm:text-xl">
                {project.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4 rounded-[1.5rem] border border-bone-50/15 bg-bone-50/10 px-4 py-4 backdrop-blur-xl sm:gap-6 sm:px-6">
                <div>
                  <div className="text-sm font-medium text-bone-50">{shortenAddress(project.ownerAddress)}</div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-solar-200">
                    Creator wallet
                  </div>
                </div>
                <div className="hidden h-10 w-px bg-bone-50/20 sm:block" />
                <div>
                  <div className="text-sm font-medium text-bone-50">DB project #{project.id}</div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-verdant-200">
                    {project.onChainId == null ? "Awaiting chain id" : `On-chain id ${project.onChainId}`}
                  </div>
                </div>
                <div className="hidden h-10 w-px bg-bone-50/20 sm:block" />
                <div>
                  <div className="text-sm font-medium text-bone-50">{formatProjectDate(project.updatedAt || project.createdAt)}</div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-bio-200">
                    Last cached update
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-bone-50/15 bg-bone-50/10 p-6 backdrop-blur-xl shadow-bloom">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-solar-200">Funding snapshot</div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <div className="display text-4xl text-bone-50">{formatUsdcFromBaseUnits(totalFunded)}</div>
                  <div className="mt-2 text-sm text-bone-50/75">
                    of {formatUsdcFromBaseUnits(fundingGoal)} goal
                  </div>
                </div>
                <div className="rounded-full border border-bone-50/15 bg-bone-50/10 px-3 py-2 text-right">
                  <div className="text-lg font-semibold text-bone-50">{Math.round(fundingRatio * 100)}%</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone-50/65">Live ratio</div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[1.25rem] bg-black/15 px-4 py-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone-50/60">Backers</div>
                  <div className="mt-2 text-2xl font-semibold text-bone-50">{contributorCount}</div>
                </div>
                <div className="rounded-[1.25rem] bg-black/15 px-4 py-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone-50/60">Current stage</div>
                  <div className="mt-2 text-2xl font-semibold text-bone-50">{Math.min(currentStage + 1, 3)}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-bone-50/70">
                <Coins className="h-4 w-4 text-solar-300" />
                {project.onChainId == null
                  ? "Actions stay disabled until on-chain sync completes."
                  : "Live contract reads override cached totals whenever possible."}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1480px] gap-8 px-4 py-10 sm:px-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-start lg:py-14">
        <div className="flex flex-col gap-8">
          <ProjectStageSection
            project={project}
            liveProject={liveProject}
            currentWithdrawable={currentWithdrawable}
            isLoading={isLiveProjectLoading || isWithdrawableLoading}
          />

          <section className="rounded-[2rem] border border-line-strong bg-bone-50 p-6 shadow-bloom dark:bg-earth-900/40 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-verdant-100 px-3 py-1 text-xs font-semibold text-verdant-800 dark:bg-verdant-900/30 dark:text-verdant-300">
                <MapPin className="h-3.5 w-3.5" />
                README + metadata
              </span>
              {project.metadataCid && (
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-earth-500 dark:text-verdant-500">
                  CID {project.metadataCid.slice(0, 8)}…
                </span>
              )}
            </div>
            <h2 className="display mt-4 text-3xl text-earth-900 dark:text-bone-50 sm:text-4xl">
              About this project
            </h2>
            <div className="mt-5 whitespace-pre-wrap text-[15px] leading-8 text-earth-700 dark:text-bone-300">
              {readmeContent}
            </div>
          </section>

          <ContributorsPanel
            project={project}
            liveContributions={liveContributions}
            isLoading={isContributionsLoading}
          />
        </div>

        <ProjectActionPanel
          project={project}
          liveProject={liveProject}
          acceptedToken={acceptedToken}
          currentWithdrawable={currentWithdrawable}
          contributorCount={contributorCount}
          onRefresh={refreshLiveData}
        />
      </div>
    </div>
  );
}
