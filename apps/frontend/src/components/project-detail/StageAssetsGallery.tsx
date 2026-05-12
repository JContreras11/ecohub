"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Camera, Film, PlayCircle } from "lucide-react";
import type { BackendProjectAsset } from "./types";

interface StageAssetsGalleryProps {
  assets?: BackendProjectAsset[];
  currentStage: number;
  stageLabels: string[];
}

export default function StageAssetsGallery({
  assets,
  currentStage,
  stageLabels,
}: StageAssetsGalleryProps) {
  const t = useTranslations("ProjectDetail");
  const grouped = useMemo(() => {
    const map = new Map<number, BackendProjectAsset[]>();
    for (const asset of assets ?? []) {
      const list = map.get(asset.stage) ?? [];
      list.push(asset);
      map.set(asset.stage, list);
    }
    return map;
  }, [assets]);

  const availableStages = useMemo(
    () => Array.from(grouped.keys()).sort((a, b) => a - b),
    [grouped],
  );

  const defaultStage = availableStages.includes(currentStage)
    ? currentStage
    : availableStages[availableStages.length - 1] ?? 0;

  const [activeStage, setActiveStage] = useState<number>(defaultStage);
  const [lightbox, setLightbox] = useState<BackendProjectAsset | null>(null);

  if (!assets || assets.length === 0) return null;

  const activeAssets = grouped.get(activeStage) ?? [];

  return (
    <section className="rounded-[2rem] border border-line-strong bg-bone-50 p-6 shadow-bloom dark:bg-earth-900/40 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-bio-100 px-3 py-1 text-xs font-semibold text-bio-800 dark:bg-bio-900/30 dark:text-bio-300">
            <Camera className="h-3.5 w-3.5" />
            {t("gallery_label")}
          </span>
          <h2 className="display mt-4 text-3xl text-earth-900 dark:text-bone-50 sm:text-4xl">
            {t("gallery_title")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-earth-600 dark:text-bone-400">
            {t("gallery_subtitle")}
          </p>
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-earth-500 dark:text-verdant-300">
          {t("gallery_count", { count: assets.length })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {availableStages.map((stage) => {
          const isActive = stage === activeStage;
          const label = stageLabels[stage] ?? `Stage ${stage + 1}`;
          const count = grouped.get(stage)?.length ?? 0;
          return (
            <button
              key={stage}
              type="button"
              onClick={() => setActiveStage(stage)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
                isActive
                  ? "border-verdant-500 bg-verdant-500 text-bone-50 shadow-glow-verdant"
                  : "border-line-strong bg-bone-50/70 text-earth-700 hover:border-verdant-500 hover:text-verdant-700 dark:bg-earth-900/40 dark:text-bone-200"
              }`}
            >
              {label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${isActive ? "bg-bone-50/20" : "bg-bone-200 dark:bg-earth-800"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activeAssets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} onOpen={() => setLightbox(asset)} />
        ))}
      </div>

      {lightbox && <Lightbox asset={lightbox} onClose={() => setLightbox(null)} />}
    </section>
  );
}

function AssetCard({
  asset,
  onOpen,
}: {
  asset: BackendProjectAsset;
  onOpen: () => void;
}) {
  const isMedia = asset.kind === "VIDEO" || asset.kind === "EMBED";
  const preview = asset.thumbnailUrl ?? asset.url;

  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-line-strong bg-bg shadow-leaf transition-transform hover:-translate-y-0.5">
      <button
        type="button"
        onClick={onOpen}
        className="relative block w-full overflow-hidden bg-earth-900"
        aria-label={asset.caption ?? "asset"}
      >
        {asset.kind === "IMAGE" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt={asset.caption ?? ""}
            className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="relative aspect-[4/3] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt={asset.caption ?? ""}
              className="absolute inset-0 h-full w-full object-cover opacity-80"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-earth-950/40">
              <PlayCircle className="h-14 w-14 text-bone-50 drop-shadow-lg" />
            </div>
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-earth-950/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-bone-50">
          {isMedia ? <Film className="h-3 w-3" /> : <Camera className="h-3 w-3" />}
          {asset.kind.toLowerCase()}
        </span>
      </button>

      {(asset.caption || asset.description || asset.capturedAt) && (
        <div className="space-y-2 p-4">
          {asset.caption && (
            <h4 className="text-sm font-semibold text-earth-900 dark:text-bone-50">{asset.caption}</h4>
          )}
          {asset.description && (
            <p className="text-xs leading-relaxed text-earth-600 dark:text-bone-400">{asset.description}</p>
          )}
          {asset.capturedAt && (
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-earth-500 dark:text-verdant-300">
              {new Date(asset.capturedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </article>
  );
}

function Lightbox({ asset, onClose }: { asset: BackendProjectAsset; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-earth-950/80 p-4 backdrop-blur"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-line-strong bg-bg shadow-bloom"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-earth-950/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-bone-50 hover:bg-earth-950"
        >
          Close
        </button>
        {asset.kind === "IMAGE" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset.url} alt={asset.caption ?? ""} className="max-h-[80vh] w-full object-contain bg-earth-950" />
        ) : asset.kind === "EMBED" ? (
          <div className="relative aspect-video w-full bg-earth-950">
            <iframe
              src={asset.url}
              title={asset.caption ?? "asset"}
              className="absolute inset-0 h-full w-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <video controls className="max-h-[80vh] w-full bg-earth-950" poster={asset.thumbnailUrl ?? undefined}>
            <source src={asset.url} />
          </video>
        )}
        {(asset.caption || asset.description) && (
          <div className="space-y-2 p-5">
            {asset.caption && (
              <h4 className="text-base font-semibold text-earth-900 dark:text-bone-50">{asset.caption}</h4>
            )}
            {asset.description && (
              <p className="text-sm leading-relaxed text-earth-600 dark:text-bone-400">{asset.description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
