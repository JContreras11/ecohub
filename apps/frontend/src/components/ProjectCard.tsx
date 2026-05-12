"use client";

import { ExternalLink, Globe, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ProgressArc, StageBar } from "@/components/widgets";

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  fundingGoal: string;
  totalFunded: string;
  currentStage: number;
  ownerAddress: string;
  metadataCid: string;
  imageCid?: string | null;
}

interface ProjectCardProps {
  project: Project;
  layout?: "grid" | "list";
}

const GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs";

function formatUSDC(baseUnits: string): string {
  try {
    const num = parseInt(baseUnits, 10) / 1_000_000;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return "$0";
  }
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export default function ProjectCard({ project, layout = "grid" }: ProjectCardProps) {
  const t = useTranslations("ProjectCard");
  const router = useRouter();
  const fundedPercent = Math.min(
    100,
    Math.round((parseInt(project.totalFunded, 10) / parseInt(project.fundingGoal, 10)) * 100),
  );
  const initialImageUrl = project.imageCid ? `${GATEWAY}/${project.imageCid}` : "/images/project-placeholder.png";
  const [imgSrc, setImgSrc] = useState(initialImageUrl);

  const handleNavigate = () => {
    router.push(`/projects/${project.id}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigate();
    }
  };

  const stopCardNavigation = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  if (layout === "list") {
    return (
      <article
        className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-line-strong glass-leaf p-4 transition-all duration-300 hover:border-verdant-500/40 dark:border-[oklch(0.99_0.005_90/0.12)]"
        onClick={handleNavigate}
        onKeyDown={handleKeyDown}
        role="link"
        tabIndex={0}
        aria-label={t("open", { title: project.title })}
      >
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
          <Image
            src={imgSrc}
            alt={project.title}
            fill
            onError={() => setImgSrc("/images/project-placeholder.png")}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 truncate text-base font-bold leading-tight text-earth-900 dark:text-verdant-100">
            {project.title}
          </h3>
          <p className="mb-2 line-clamp-1 text-xs text-earth-500 dark:text-verdant-400">{project.description}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-earth-500 dark:text-verdant-300">
              <TrendingUp className="h-3 w-3" />
              <span className="font-medium text-earth-900 dark:text-verdant-200">{formatUSDC(project.totalFunded)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-earth-500 dark:text-verdant-300">
              <Users className="h-3 w-3" />
              <span className="font-mono">{shortenAddress(project.ownerAddress)}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-3">
          <ProgressArc value={fundedPercent / 100} size={40} stroke={3} />
          <div className="h-8 w-px bg-line-strong dark:bg-earth-800" />
          <a
            href={`${GATEWAY}/${project.metadataCid}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={stopCardNavigation}
            className="rounded-full p-2 text-earth-400 transition-colors hover:bg-bone-200 dark:text-verdant-300 dark:hover:bg-earth-800"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </article>
    );
  }

  return (
    <article
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-line-strong glass-leaf shadow-leaf transition-all duration-300 hover:-translate-y-1 hover:border-verdant-500/40 hover:shadow-card-hover dark:border-[oklch(0.99_0.005_90/0.12)]"
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`Open ${project.title}`}
    >
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-verdant-900 to-earth-800">
        <Image
          src={imgSrc}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgSrc("/images/project-placeholder.png")}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-900/80 to-transparent" />

        <div className="absolute bottom-3 left-3 right-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <StageBar cachedCurrentStage={project.currentStage} />
        </div>
      </div>

      <div className="p-5">
        {project.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-verdant-200 bg-verdant-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-verdant-700 dark:border-verdant-700/30 dark:bg-verdant-900/50 dark:text-verdant-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight text-earth-900 transition-colors group-hover:text-verdant-600 dark:text-verdant-100 dark:group-hover:text-verdant-300">
          {project.title}
        </h3>
        <p className="mb-4 h-10 line-clamp-2 text-sm leading-relaxed text-earth-600 dark:text-verdant-400">
          {project.description}
        </p>

        <div className="flex items-center justify-between border-t border-line-strong py-4 dark:border-earth-800">
          <div className="flex flex-col">
            <span className="mb-1 text-[10px] font-mono uppercase tracking-widest text-earth-400 dark:text-verdant-400">
              {t("funding_progress")}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-earth-900 dark:text-verdant-100">
                {formatUSDC(project.totalFunded)}
              </span>
              <span className="text-xs text-earth-400 dark:text-verdant-300">/ {formatUSDC(project.fundingGoal)}</span>
            </div>
          </div>
          <ProgressArc value={fundedPercent / 100} size={52} stroke={4} />
        </div>

        <div className="flex items-center justify-between border-t border-line-strong pt-4 dark:border-earth-800">
          <div className="flex items-center gap-1.5 text-xs text-earth-500 dark:text-verdant-300">
            <Users className="h-3 w-3" />
            <span className="font-mono">{shortenAddress(project.ownerAddress)}</span>
          </div>
          <a
            href={`${GATEWAY}/${project.metadataCid}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={stopCardNavigation}
            className="flex items-center gap-1.5 text-xs font-medium text-bio-600 transition-colors hover:text-bio-700 dark:text-bio-400 dark:hover:text-bio-300"
          >
            <Globe className="h-3 w-3" />
            {t("ipfs")}
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 ring-1 ring-verdant-400/20 shadow-glow-verdant transition-opacity duration-300 group-hover:opacity-100" />
    </article>
  );
}
