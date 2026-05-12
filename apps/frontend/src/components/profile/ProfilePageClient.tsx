"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { readContract } from "wagmi/actions";
import { mainnet } from "wagmi/chains";
import { useAccount, useChainId, useEnsName } from "wagmi";
import {
  ArrowRight,
  Coins,
  Leaf,
  Loader2,
  PencilLine,
  Plus,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import ProjectCard from "@/components/ProjectCard";
import WalletStatus from "@/components/widgets/WalletStatus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { WaterCursor, WindCanvas, SunRays } from "@/components/effects";
import { ECOSPONSOR_ABI, ZERO_ADDRESS, getContractAddress } from "@/lib/contracts";
import { wagmiConfig } from "@/lib/wagmi";
import type { LiveContribution } from "@/components/project-detail/types";
import type { BackendProject } from "@/components/project-detail/types";
import ProfileEditSheet from "./ProfileEditSheet";
import {
  BACKEND_URL,
  DEFAULT_AVATAR,
  PROFILE_BANNER_IMAGE,
  formatContributionDate,
  formatUsdcFromBaseUnits,
  getProfileInitials,
  normalizeWalletAddress,
  shortenAddress,
  sortContributionItems,
  sumContributionAmounts,
} from "./helpers";
import type { ProfileContributionItem, ProfileUser, ProjectsResponse } from "./types";

const CREATED_PROJECTS_LIMIT = 24;
const CONTRIBUTION_SCAN_LIMIT = 100;

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || `Request failed: ${response.status}`);
  }

  return payload as T;
}

export default function ProfilePageClient() {
  const t = useTranslations("Profile");
  const locale = useLocale();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: ensName } = useEnsName({ address, chainId: mainnet.id });

  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [createdProjects, setCreatedProjects] = useState<BackendProject[]>([]);
  const [contributions, setContributions] = useState<ProfileContributionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingContributions, setIsLoadingContributions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contributionError, setContributionError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const normalizedAddress = normalizeWalletAddress(address);
  const contractAddress = getContractAddress(chainId || 11155111);
  const displayName = profile?.displayName || ensName || t("fallback_name");
  const profileBio = profile?.bio || t("default_bio");

  useEffect(() => {
    if (!normalizedAddress) {
      setProfile(null);
      setCreatedProjects([]);
      setContributions([]);
      setError(null);
      setContributionError(null);
      return;
    }

    let isCancelled = false;

    async function loadProfile() {
      setIsLoading(true);
      setError(null);

      try {
        const [userPayload, projectsPayload] = await Promise.all([
          fetchJson<ProfileUser>(`${BACKEND_URL}/api/users/${normalizedAddress}`),
          fetchJson<ProjectsResponse>(
            `${BACKEND_URL}/api/projects?ownerAddress=${normalizedAddress}&limit=${CREATED_PROJECTS_LIMIT}`,
          ),
        ]);

        if (isCancelled) return;

        setProfile(userPayload);
        setCreatedProjects(projectsPayload.data || []);
      } catch (loadError: any) {
        if (isCancelled) return;
        setError(loadError.message || t("load_error"));
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isCancelled = true;
    };
  }, [normalizedAddress, t]);

  useEffect(() => {
    if (!normalizedAddress) {
      setContributions([]);
      setContributionError(null);
      return;
    }

    if (contractAddress === ZERO_ADDRESS) {
      setContributions([]);
      setContributionError(t("unsupported_network"));
      return;
    }

    let isCancelled = false;

    async function loadContributions() {
      setIsLoadingContributions(true);
      setContributionError(null);

      try {
        const projectsPayload = await fetchJson<ProjectsResponse>(
          `${BACKEND_URL}/api/projects?onChainOnly=true&limit=${CONTRIBUTION_SCAN_LIMIT}`,
        );

        const scanProjects = (projectsPayload.data || []).filter((project) => project.onChainId != null);
        const results = await Promise.allSettled(
          scanProjects.map(async (project) => {
            const liveEntries = (await readContract(wagmiConfig, {
              address: contractAddress,
              abi: ECOSPONSOR_ABI,
              functionName: "getContributions",
              args: [BigInt(project.onChainId!)],
            })) as readonly LiveContribution[];

            return liveEntries
              .filter((entry) => entry.contributor.toLowerCase() === normalizedAddress)
              .map((entry) => ({
                projectId: project.id,
                projectTitle: project.title,
                projectDescription: project.description,
                projectImageCid: project.imageCid,
                ownerAddress: project.ownerAddress,
                onChainId: project.onChainId!,
                amount: entry.amount,
                timestamp: entry.timestamp,
                currentStage: project.currentStage,
              } satisfies ProfileContributionItem));
          }),
        );

        if (isCancelled) return;

        const aggregated = results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
        setContributions(aggregated.sort(sortContributionItems));
      } catch (loadError: any) {
        if (isCancelled) return;
        setContributionError(loadError.message || t("contributions_error"));
      } finally {
        if (!isCancelled) {
          setIsLoadingContributions(false);
        }
      }
    }

    loadContributions();

    return () => {
      isCancelled = true;
    };
  }, [contractAddress, normalizedAddress, t]);

  const contributionTotal = useMemo(() => sumContributionAmounts(contributions), [contributions]);
  const createdProjectsRaised = useMemo(
    () => createdProjects.reduce((total, project) => total + BigInt(project.totalFunded || "0"), BigInt(0)),
    [createdProjects],
  );

  const fallbackInitials = getProfileInitials(profile?.displayName, ensName, normalizedAddress);

  if (!isConnected || !address) {
    return (
      <div className="relative overflow-hidden bg-[var(--bg)]">
        <section className="relative min-h-[720px] overflow-hidden bg-earth-950 text-bone-50">
          <div className="absolute inset-0">
            <img src={PROFILE_BANNER_IMAGE} alt="Solarpunk ecological landscape" className="h-full w-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.20_0.05_145/0.42),oklch(0.20_0.05_145/0.88))]" />
          </div>
          <div className="pointer-events-none absolute inset-0">
            <WindCanvas density={0.5} palette="forest" />
            <WaterCursor tint="bio" />
            <SunRays size={980} opacity={0.12} top={-420} left="70%" />
          </div>

          <div className="relative mx-auto flex min-h-[720px] max-w-[1480px] items-end px-4 pb-20 pt-28 sm:px-8 lg:pt-36">
            <div className="grid w-full gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-bone-50/15 bg-bone-50/10 px-3 py-1 text-xs font-medium text-bone-50/80">
                  <Leaf className="h-3.5 w-3.5 text-verdant-300" />
                  {t("kicker")}
                </div>
                <h1 className="display max-w-4xl text-[clamp(3.4rem,7vw,6.6rem)] leading-[0.95] text-bone-50">
                  {t("empty_title")}
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-bone-50/82 sm:text-xl">
                  {t("empty_body")}
                </p>
              </div>

              <div className="rounded-[2rem] border border-bone-50/15 bg-bone-50/10 p-6 backdrop-blur-xl shadow-bloom">
                <div className="inline-flex items-center gap-2 rounded-full bg-solar-400/90 px-3 py-1 text-xs font-semibold text-earth-950">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("empty_card_badge")}
                </div>
                <div className="mt-5 space-y-4">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-solar-200">{t("empty_card_label")}</div>
                    <div className="mt-2 text-2xl font-semibold text-bone-50">{t("empty_card_heading")}</div>
                  </div>
                  <p className="text-sm leading-7 text-bone-50/75">{t("empty_card_copy")}</p>
                  <div className="pt-2">
                    <ConnectWalletButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg)]">
      <section className="relative overflow-hidden bg-earth-950 text-bone-50">
        <div className="absolute inset-0">
          <img src={PROFILE_BANNER_IMAGE} alt="Maker profile hero" className="h-full w-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.20_0.05_145/0.45),oklch(0.20_0.05_145/0.9))]" />
        </div>
        <div className="pointer-events-none absolute inset-0">
          <WindCanvas density={0.55} palette="forest" />
          <WaterCursor tint="bio" />
          <SunRays size={980} opacity={0.12} top={-420} left="75%" />
        </div>

        <div className="relative mx-auto max-w-[1480px] px-4 pb-20 pt-28 sm:px-8 lg:pt-36">
          <div className="rounded-[2.25rem] border border-bone-50/15 bg-bone-50/10 p-6 shadow-bloom backdrop-blur-xl sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">
              <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-bone-50/90 bg-gradient-to-br from-solar-300 to-verdant-500 text-3xl font-semibold text-earth-950 shadow-bloom sm:h-36 sm:w-36">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      const target = event.currentTarget;
                      target.onerror = null;
                      target.src = DEFAULT_AVATAR;
                    }}
                  />
                ) : (
                  fallbackInitials
                )}
                <div className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-bone-50 bg-solar-400 text-earth-950 shadow-glow-solar">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </div>

              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-solar-400/95 px-3 py-1 text-xs font-semibold text-earth-950">
                    <Sparkles className="h-3.5 w-3.5" />
                    {t("verified_badge")}
                  </span>
                  {ensName && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-bone-50/15 bg-bone-50/10 px-3 py-1 text-xs font-medium text-bone-50/85">
                      {ensName}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-bone-50/15 bg-bone-50/10 px-3 py-1 text-xs font-medium text-bone-50/75">
                    <Wallet className="h-3.5 w-3.5 text-verdant-300" />
                    {shortenAddress(address)}
                  </span>
                </div>

                <h1 className="display text-[clamp(3rem,6vw,4.75rem)] leading-[0.95] text-bone-50">
                  {displayName}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-8 text-bone-50/82 sm:text-lg">
                  {profileBio}
                </p>

                <div className="mt-6 flex flex-wrap gap-6 font-mono text-[11px] uppercase tracking-[0.16em] text-solar-200">
                  <span>
                    <strong className="mr-2 font-display text-2xl tracking-normal text-bone-50">{createdProjects.length}</strong>
                    {t("stats.created")}
                  </span>
                  <span>
                    <strong className="mr-2 font-display text-2xl tracking-normal text-bone-50">{contributions.length}</strong>
                    {t("stats.contributions")}
                  </span>
                  <span>
                    <strong className="mr-2 font-display text-2xl tracking-normal text-bone-50">{formatUsdcFromBaseUnits(createdProjectsRaised)}</strong>
                    {t("stats.raised")}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:min-w-[240px]">
                <Button asChild className="h-11 rounded-2xl bg-solar-400 text-earth-950 hover:bg-solar-300">
                  <Link href="/create">
                    <Plus className="h-4 w-4" />
                    {t("new_project")}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-11 rounded-2xl border-bone-50/20 bg-bone-50/10 text-bone-50 hover:bg-bone-50/15 hover:text-white"
                  onClick={() => setIsEditOpen(true)}
                >
                  <PencilLine className="h-4 w-4" />
                  {t("edit_profile")}
                </Button>
                <div className="rounded-[1.25rem] border border-bone-50/15 bg-black/15 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-50/55">{t("wallet_status")}</div>
                  <div className="mt-3">
                    <WalletStatus showBalance showNetwork />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1480px] gap-8 px-4 py-10 sm:px-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-start lg:py-14">
        <div className="flex flex-col gap-6">
          <Tabs defaultValue="created" className="w-full">
            <TabsList className="h-auto rounded-full border border-line-strong bg-bone-100/80 p-1 dark:border-earth-800 dark:bg-earth-900/50">
              <TabsTrigger
                value="created"
                className="rounded-full px-5 py-2.5 data-[state=active]:bg-bone-50 data-[state=active]:text-earth-950 dark:data-[state=active]:bg-verdant-500/20 dark:data-[state=active]:text-bone-50"
              >
                {t("tabs.created")}
              </TabsTrigger>
              <TabsTrigger
                value="contributions"
                className="rounded-full px-5 py-2.5 data-[state=active]:bg-bone-50 data-[state=active]:text-earth-950 dark:data-[state=active]:bg-verdant-500/20 dark:data-[state=active]:text-bone-50"
              >
                {t("tabs.contributions")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="created" className="mt-6">
              <section className="rounded-[2rem] border border-line-strong bg-bone-50 p-6 shadow-bloom dark:bg-earth-900/40 sm:p-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-verdant-600 dark:text-verdant-400">
                      {t("created_kicker")}
                    </div>
                    <h2 className="display mt-2 text-3xl text-earth-900 dark:text-bone-50">{t("tabs.created")}</h2>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-earth-500 dark:text-bone-500">
                    {createdProjects.length} {t("items")}
                  </span>
                </div>

                {isLoading ? (
                  <div className="flex min-h-[220px] items-center justify-center rounded-[1.5rem] border border-dashed border-line-strong bg-bone-100/60 text-earth-500 dark:border-earth-800 dark:bg-earth-900/30 dark:text-bone-400">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("loading")}
                  </div>
                ) : error ? (
                  <div className="rounded-[1.5rem] border border-coral-500/30 bg-coral-500/10 px-5 py-4 text-sm text-coral-700 dark:text-coral-300">
                    {error}
                  </div>
                ) : createdProjects.length > 0 ? (
                  <div className="grid gap-5 md:grid-cols-2">
                    {createdProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} layout="grid" />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[1.5rem] border border-dashed border-line-strong bg-bone-100/60 px-5 py-8 dark:border-earth-800 dark:bg-earth-900/30">
                    <div className="text-lg font-semibold text-earth-900 dark:text-bone-50">{t("created_empty_title")}</div>
                    <p className="mt-2 max-w-xl text-sm leading-7 text-earth-600 dark:text-bone-400">{t("created_empty_body")}</p>
                    <Button asChild className="mt-5 rounded-2xl bg-verdant-600 text-white hover:bg-verdant-500">
                      <Link href="/create">
                        <ArrowRight className="h-4 w-4" />
                        {t("new_project")}
                      </Link>
                    </Button>
                  </div>
                )}
              </section>
            </TabsContent>

            <TabsContent value="contributions" className="mt-6">
              <section className="rounded-[2rem] border border-line-strong bg-bone-50 p-6 shadow-bloom dark:bg-earth-900/40 sm:p-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-bio-700 dark:text-bio-300">
                      {t("contributions_kicker")}
                    </div>
                    <h2 className="display mt-2 text-3xl text-earth-900 dark:text-bone-50">{t("tabs.contributions")}</h2>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-earth-500 dark:text-bone-500">
                    {formatUsdcFromBaseUnits(contributionTotal, 2)} {t("backed_total")}
                  </span>
                </div>

                {isLoadingContributions ? (
                  <div className="flex min-h-[220px] items-center justify-center rounded-[1.5rem] border border-dashed border-line-strong bg-bone-100/60 text-earth-500 dark:border-earth-800 dark:bg-earth-900/30 dark:text-bone-400">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("loading_contributions")}
                  </div>
                ) : contributionError ? (
                  <div className="rounded-[1.5rem] border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-800 dark:text-amber-200">
                    {contributionError}
                  </div>
                ) : contributions.length > 0 ? (
                  <div className="space-y-3">
                    {contributions.map((item) => (
                      <Link
                        key={`${item.projectId}-${item.timestamp.toString()}-${item.amount.toString()}`}
                        href={`/projects/${item.projectId}`}
                        className="group flex flex-col gap-3 rounded-[1.5rem] border border-line-strong bg-bone-100/70 px-5 py-4 transition-colors hover:border-verdant-400/40 hover:bg-bone-50 dark:border-earth-800 dark:bg-earth-900/40 dark:hover:bg-earth-900/70"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="text-lg font-semibold text-earth-900 transition-colors group-hover:text-verdant-700 dark:text-bone-50 dark:group-hover:text-verdant-300">
                              {item.projectTitle}
                            </div>
                            <p className="mt-1 max-w-2xl text-sm leading-7 text-earth-600 dark:text-bone-400">
                              {item.projectDescription}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-semibold text-verdant-700 dark:text-verdant-300">
                              {formatUsdcFromBaseUnits(item.amount, 2)}
                            </div>
                            <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-earth-500 dark:text-bone-500">
                              {formatContributionDate(item.timestamp, locale)}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-earth-500 dark:text-bone-500">
                          <span className="inline-flex items-center gap-1 rounded-full bg-verdant-100 px-2.5 py-1 text-verdant-700 dark:bg-verdant-500/10 dark:text-verdant-300">
                            <Coins className="h-3.5 w-3.5" />
                            {t("contribution_stage", { stage: item.currentStage + 1 })}
                          </span>
                          <span>{t("project_link_hint")}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[1.5rem] border border-dashed border-line-strong bg-bone-100/60 px-5 py-8 dark:border-earth-800 dark:bg-earth-900/30">
                    <div className="text-lg font-semibold text-earth-900 dark:text-bone-50">{t("contributions_empty_title")}</div>
                    <p className="mt-2 max-w-xl text-sm leading-7 text-earth-600 dark:text-bone-400">{t("contributions_empty_body")}</p>
                  </div>
                )}
              </section>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="flex flex-col gap-6">
          <section className="rounded-[2rem] border border-line-strong bg-bone-50 p-6 shadow-bloom dark:bg-earth-900/40 sm:p-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-earth-500 dark:text-verdant-300">
              {t("wallet_summary")}
            </div>
            <div className="mt-4 text-3xl font-semibold text-earth-900 dark:text-bone-50">
              {shortenAddress(address)}
            </div>
            <div className="mt-2 text-sm text-earth-600 dark:text-bone-400">
              {ensName || t("ens_missing")}
            </div>
            <div className="mt-5 rounded-[1.5rem] bg-verdant-100/70 px-4 py-4 dark:bg-verdant-500/10">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-verdant-700 dark:text-verdant-300">
                {t("stats.contributions")}
              </div>
              <div className="mt-2 text-2xl font-semibold text-verdant-700 dark:text-verdant-300">{formatUsdcFromBaseUnits(contributionTotal, 2)}</div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-line-strong bg-earth-950 p-6 text-bone-50 shadow-bloom sm:p-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-solar-300">{t("activity_kicker")}</div>
            <h2 className="display mt-3 text-3xl text-bone-50">{t("activity_title")}</h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-bone-300">
              <div className="rounded-[1.25rem] bg-bone-50/5 px-4 py-3">
                {t("activity_created", { count: createdProjects.length })}
              </div>
              <div className="rounded-[1.25rem] bg-bone-50/5 px-4 py-3">
                {t("activity_backed", { count: contributions.length })}
              </div>
              <div className="rounded-[1.25rem] bg-bone-50/5 px-4 py-3">
                {t("activity_profile")}
              </div>
            </div>
          </section>
        </aside>
      </div>

      <ProfileEditSheet
        open={isEditOpen}
        walletAddress={normalizedAddress || address}
        profile={profile}
        onOpenChange={setIsEditOpen}
        onSaved={setProfile}
      />
    </div>
  );
}
