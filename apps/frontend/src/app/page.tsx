import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Leaf, Code, Coins, Verified, Shield, Users, Globe, GitFork } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { getTranslations } from "next-intl/server";
import { AuroraGradient, WindCanvas, WaterCursor } from "@/components/effects";
import { ProgressArc, StageBar } from "@/components/widgets";
import { BRAND, brandTitle } from "@/lib/brand";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Index");
  return {
    title: brandTitle(t("meta_title")),
    description: t("meta_description"),
  };
}

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000").replace(/\/+$/, "");

async function getProjects() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/projects?limit=12`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[HomePage] Backend fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("[HomePage] Backend fetch error:", err);
    return [];
  }
}

async function getProjectDetail(slug: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/projects/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function formatUsdcCompact(baseUnits: string | number | null | undefined): string {
  const value = Number(baseUnits ?? 0) / 1_000_000;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}k`;
  return `$${Math.round(value)}`;
}

function pickFeaturedCover(featured: any): string {
  const heroAsset = featured?.assets?.find?.((a: any) => a.kind === "IMAGE");
  if (heroAsset?.url) return heroAsset.url;
  return "/images/landing-hero.jpg";
}

export default async function HomePage() {
  const projects = (await getProjects()).slice(0, 5);
  const featured = projects[0] ? await getProjectDetail(projects[0].slug) : null;
  const featuredCover = featured ? pickFeaturedCover(featured) : "/images/landing-hero.jpg";
  const featuredBackerCount = featured?.contributions
    ? new Set(featured.contributions.map((c: any) => c.contributorAddress?.toLowerCase())).size
    : 0;
  const featuredStageLabel = featured ? Math.min((featured.currentStage ?? 0) + 1, 3) : 1;
  const featuredRatio = featured && Number(featured.fundingGoal) > 0
    ? Math.min(1, Number(featured.totalFunded) / Number(featured.fundingGoal))
    : 0;
  const t = await getTranslations("Index");

  const growSteps = [
    {
      step: "01",
      title: t("step1_title"),
      description: t("step1_desc"),
      icon: Code,
      color: "text-bio-500"
    },
    {
      step: "02",
      title: t("step2_title"),
      description: t("step2_desc"),
      icon: Coins,
      color: "text-solar-500"
    },
    {
      step: "03",
      title: t("step3_title"),
      description: t("step3_desc"),
      icon: Verified,
      color: "text-verdant-500"
    }
  ];

  const activityItems = [
    { action: t("act_funded"), amount: "500 USDC", project: "MYCO-1", time: t("time_minutes_ago", { count: 2 }) },
    { action: t("act_validated"), amount: t("stage_label", { n: "02" }), project: "OCEAN-3", time: t("time_minutes_ago", { count: 14 }) },
    { action: t("act_released"), amount: "12,000 USDC", project: "VERT-4", time: t("time_hours_ago", { count: 1 }) },
    { action: t("act_published"), amount: "v1.0 docs", project: "SOLAR-2", time: t("time_hours_ago", { count: 3 }) },
    { action: t("act_funded"), amount: "150 USDC", project: "REGEN-5", time: t("time_hours_ago", { count: 4 }) },
    { action: t("act_validated"), amount: t("stage_label", { n: "01" }), project: "MYCO-1", time: t("time_hours_ago", { count: 5 }) }
  ];

  return (
    <div className="w-full">
      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-start pt-28 pb-24 overflow-hidden font-body bg-bg">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <AuroraGradient intensity={1} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg" />
        </div>

        <div className="pointer-events-none">
          <WindCanvas density={0.4} />
          <WaterCursor tint="bio" />
        </div>

        <div className="relative max-w-[1480px] mx-auto w-full px-4 sm:px-8 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bone-200 dark:bg-earth-800 text-earth-900 dark:text-bone-50 text-xs font-medium border border-line-strong">
                  <div className="w-1.5 h-1.5 rounded-full bg-verdant-500 animate-pulse" />
                  {t("mainnet_live")}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bio-900/30 border border-bio-700/30 text-bio-600 dark:text-bio-300 text-xs font-medium">
                  v1.2.0
                </div>
                <span className="inline-flex items-center gap-1.5 px-[9px] py-1 rounded border border-bone-300 dark:border-bone-50/20 bg-bone-200 dark:bg-bone-50/10 font-mono text-[11px] tracking-widest uppercase text-earth-900 dark:text-bone-50">
                  <span className="w-1.5 h-1.5 rounded-full bg-verdant-500 dark:bg-verdant-400 animate-pulse" />
                  {t("tvl")}
                </span>
              </div>

              <h1 className="font-display text-[clamp(48px,8vw,132px)] text-earth-900 dark:text-bone-50 mb-6 font-bold tracking-tight leading-[0.92]">
                {t("hero_title_a")}<br />{t("hero_title_b")}<br />
                <span className="italic text-solar-500 dark:text-solar-300 font-serif font-medium">{t("hero_title_c")}</span> {t("hero_title_d")}
              </h1>

              <p className="text-lg leading-relaxed max-w-[580px] text-earth-700 dark:text-bone-50/85 mb-8 tracking-tight">
                {t("hero_subtitle")}
              </p>

              <div className="flex flex-wrap gap-2.5">
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-earth-900
                             bg-solar-400 hover:bg-solar-300 shadow-glow-solar
                             transition-all duration-200 group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  {t("launch_project")}
                </Link>
                <Link
                  href="/#explore"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-earth-900 dark:text-bone-50
                             bg-surface hover:bg-bone-200 dark:hover:bg-earth-800 border border-line-strong
                             transition-all duration-200"
                >
                  <Code className="w-4 h-4" />
                  {t("explore_protocol")}
                </Link>
              </div>

              {/* Live counters */}
              <div className="flex flex-wrap gap-6 sm:gap-9 mt-14">
                {[
                  { v: "1,284", l: t("stats_open_projects") },
                  { v: "$4.2M", l: t("stats_funded") },
                  { v: "23", l: t("stats_bioregions") },
                  { v: "412", l: t("stats_validators") },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-display text-3xl sm:text-4xl font-semibold text-earth-900 dark:text-bone-50 leading-none">{s.v}</div>
                    <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.18em] uppercase text-solar-600 dark:text-solar-300 mt-2">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating featured project card — latest published */}
            {featured && (
              <div className="animate-drift-y-slow relative mt-12 lg:mt-0 z-10 w-full max-w-md mx-auto pointer-events-auto">
                <Link
                  href={`/projects/${featured.slug}`}
                  className="block glass-leaf rounded-[2rem] overflow-hidden shadow-bloom border border-line-strong bg-bg transition-transform hover:-translate-y-1 hover:shadow-glow-verdant"
                >
                  <div className="relative w-full h-60 bg-verdant-900 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-80"
                      style={{ backgroundImage: `url('${featuredCover}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-earth-900/90 to-transparent" />
                  </div>
                  <div className="p-6 relative -mt-4 bg-bg rounded-t-3xl">
                    <div className="flex justify-between items-center mb-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-solar-100 dark:bg-solar-900/30 border border-solar-200 dark:border-solar-700/30 text-solar-700 dark:text-solar-300 text-xs font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-solar-500 dark:bg-solar-400 animate-pulse" />
                        {t("featured_card_stage", { stage: featuredStageLabel })}
                      </div>
                      <span className="font-mono text-xs text-earth-600 dark:text-verdant-300 tracking-wider uppercase">
                        {(featured.tags?.[0] ?? "project").slice(0, 14)}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-earth-900 dark:text-verdant-100 mb-2 leading-tight line-clamp-2">
                      {featured.title}
                    </h3>
                    <p className="text-sm text-earth-600 dark:text-verdant-400 mb-4 line-clamp-2 leading-relaxed">
                      {featured.description}
                    </p>
                    <StageBar cachedCurrentStage={Math.min(featured.currentStage ?? 0, 2)} />
                    <div className="flex justify-between items-center mt-5">
                      <div>
                        <div className="font-display text-2xl font-bold text-verdant-600 dark:text-verdant-300 leading-none">
                          {formatUsdcCompact(featured.totalFunded)}
                          <span className="text-sm font-normal text-earth-500 dark:text-verdant-300 font-body">
                            {" "}/ {formatUsdcCompact(featured.fundingGoal)}
                          </span>
                        </div>
                        <div className="text-xs text-earth-500 dark:text-verdant-300 mt-1">
                          {t("featured_card_backers_dynamic", { count: featuredBackerCount })}
                        </div>
                      </div>
                      <ProgressArc value={featuredRatio} size={56} stroke={4} />
                    </div>
                  </div>
                </Link>

                <div className="animate-drift-y absolute -top-9 -right-7 px-3.5 py-2.5 rounded-full bg-solar-400 text-earth-900 font-mono text-xs tracking-wider uppercase shadow-glow-solar z-20 hidden sm:block pointer-events-none">
                  {t("live_badge")}
                </div>
                <div className="animate-drift-y-slow absolute -bottom-5 -left-7 px-3.5 py-2.5 rounded-xl bg-earth-900 dark:bg-surface border border-line-strong text-bone-50 font-mono text-[11px] shadow-bloom z-20 hidden sm:block pointer-events-none">
                  {t("tx_released")}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Features Section ───────────────────────── */}
      <section className="py-24 max-w-[1480px] mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-[clamp(40px,5vw,72px)] font-bold text-earth-900 dark:text-verdant-100 mb-4 tracking-tight leading-[0.9]">
            {t("section_grow_title_a")}<br />
            <span className="text-verdant-500">{t("section_grow_title_b")}</span>
          </h2>
          <p className="text-lg text-earth-600 dark:text-verdant-400 max-w-2xl mx-auto">
            {t("section_grow_subtitle", { brand: BRAND.name })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-line-strong" />

          {growSteps.map((step) => (
            <div key={step.step} className="group relative pt-8 hover:-translate-y-1.5 transition-transform duration-300">
              <div className="w-16 h-16 rounded-[1.25rem] bg-surface border border-line-strong shadow-leaf flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:border-verdant-500/40 transition-colors">
                <step.icon className={`w-8 h-8 ${step.color}`} />
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-bg border border-line-strong flex items-center justify-center font-mono text-[10px] font-bold text-earth-500 dark:text-verdant-300">
                  {step.step}
                </div>
              </div>
              <h3 className="font-display text-xl font-bold text-center text-earth-900 dark:text-verdant-100 mb-3">{step.title}</h3>
              <p className="text-center text-earth-600 dark:text-verdant-400 text-sm leading-relaxed max-w-[280px] mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Projects Grid ────────────────────────────────────────── */}
      <section id="explore" className="py-24 border-y border-line-strong bg-surface/30">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-earth-900 dark:text-verdant-100 mb-3 tracking-tight">
                {t("featured_projects_title")}
              </h2>
              <p className="text-lg text-earth-600 dark:text-verdant-400">
                {t("featured_projects_subtitle")}
              </p>
            </div>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-verdant-600 text-bone-50 hover:bg-verdant-500 transition-colors"
            >
              <Leaf className="w-4 h-4" />
              {t("launch_project")}
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-[2rem] border border-line-strong bg-surface/50 p-12 text-center">
              <p className="font-display text-2xl font-semibold text-earth-900 dark:text-verdant-100 mb-3">
                {t("featured_projects_empty_title")}
              </p>
              <p className="text-earth-600 dark:text-verdant-400 mb-6">
                {t("featured_projects_empty_subtitle")}
              </p>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-verdant-600 text-bone-50 hover:bg-verdant-500 transition-colors"
              >
                <Leaf className="w-4 h-4" />
                {t("launch_project")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 h-full">
                <ProjectCard project={projects[0]} layout="grid" />
              </div>
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {projects.slice(1, 5).map((project: any) => (
                  <ProjectCard key={project.id} project={project} layout="grid" />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Live On-Chain Activity Feed ───────────────────────────────────── */}
      <section className="py-24 sm:py-32 max-w-[1480px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-earth-900 dark:text-verdant-100 mb-6 tracking-tight text-balance leading-[1.1]">
              {t("activity_title")}
            </h2>
            <p className="text-lg text-earth-600 dark:text-verdant-400 mb-10 text-balance leading-relaxed">
              {t("activity_subtitle", { brand: BRAND.name })}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: t("trait_transparent_title"), desc: t("trait_transparent_desc"), icon: Shield },
                { title: t("trait_forkable_title"), desc: t("trait_forkable_desc"), icon: GitFork },
                { title: t("trait_coowned_title"), desc: t("trait_coowned_desc"), icon: Users },
                { title: t("trait_license_title"), desc: t("trait_license_desc"), icon: Globe }
              ].map(b => (
                <div key={b.title} className="p-5 rounded-[1.5rem] border border-line-strong bg-surface dark:bg-earth-900/30 shadow-sm">
                  <b.icon className="w-6 h-6 text-verdant-500 mb-3" />
                  <h4 className="font-bold text-earth-900 dark:text-verdant-100">{b.title}</h4>
                  <p className="text-sm text-earth-600 dark:text-verdant-400">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative w-full h-[500px] sm:h-[600px] block">
            <div className="absolute -inset-8 bg-verdant-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 glass-leaf border border-line-strong dark:border-verdant-500/20 rounded-[2.5rem] p-6 sm:p-8 overflow-hidden shadow-bloom bg-bg/80">
              <div className="absolute inset-0 pointer-events-none">
                 <WindCanvas density={0.3} />
              </div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-8 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-solar-500 dark:bg-solar-400 animate-pulse shadow-[0_0_8px_oklch(0.82_0.16_88)]" />
                  <h3 className="font-mono text-sm tracking-widest uppercase text-verdant-700 dark:text-verdant-300 font-semibold">{t("live_on_chain")}</h3>
                </div>

                <div className="space-y-3 sm:space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {activityItems.map((act, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 rounded-2xl bg-surface/80 dark:bg-earth-900/60 border border-line-strong dark:border-verdant-700/30 backdrop-blur-sm shadow-sm hover:border-verdant-500/50 transition-colors cursor-default">
                      <div>
                        <span className="text-earth-900 dark:text-verdant-100 font-medium">{act.action} </span>
                        <span className="text-solar-600 dark:text-solar-300 font-mono text-sm">{act.amount} </span>
                        <span className="text-earth-500 dark:text-verdant-400 text-sm">→ {act.project}</span>
                      </div>
                      <span className="text-earth-400 font-mono text-[10px] uppercase tracking-wider">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
