'use client';

import React from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useInView } from '../../hooks/useInView';

interface AuroraGradientProps {
  intensity?: number;
}

export default function AuroraGradient({ intensity = 1 }: AuroraGradientProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { ref, isInView } = useInView<HTMLDivElement>();

  if (prefersReducedMotion) return null;

  const playState = isInView ? 'running' : 'paused';

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #061018 0%, #0a1f2a 35%, #143645 65%, #1f5366 100%)',
      }}
    >
      {/* aurora blob layer — clipped so blooms stay above water line */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {/* deep verdant green */}
        <div
          className="eh-aurora-blob eh-aurora-1"
          style={{
            position: 'absolute',
            width: 6,
            height: 6,
            borderRadius: '50%',
            opacity: 0.78 * intensity,
            boxShadow: '0 0 45vmax 38vmax oklch(0.72 0.20 155)',
            animation: 'eh-aurora-hue 14s linear infinite, eh-aurora-path-1 22s linear infinite',
            animationPlayState: playState,
            mixBlendMode: 'screen',
          }}
        />
        {/* turquoise / bio */}
        <div
          className="eh-aurora-blob eh-aurora-2"
          style={{
            position: 'absolute',
            width: 6,
            height: 6,
            borderRadius: '50%',
            opacity: 0.72 * intensity,
            boxShadow: '0 0 45vmax 38vmax oklch(0.78 0.16 195)',
            animation: 'eh-aurora-hue 18s linear infinite, eh-aurora-path-2 28s linear infinite',
            animationPlayState: playState,
            mixBlendMode: 'screen',
          }}
        />
        {/* solar warm accent (rare amber wash) */}
        <div
          className="eh-aurora-blob eh-aurora-3"
          style={{
            position: 'absolute',
            width: 6,
            height: 6,
            borderRadius: '50%',
            opacity: 0.55 * intensity,
            boxShadow: '0 0 45vmax 36vmax oklch(0.80 0.18 130)',
            animation: 'eh-aurora-hue 22s linear infinite, eh-aurora-path-3 18s linear infinite',
            animationPlayState: playState,
            mixBlendMode: 'screen',
          }}
        />
      </div>

      {/* stars (subtle, behind the glow) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.7,
          backgroundImage:
            'radial-gradient(1px 1px at 12% 18%, oklch(0.99 0.01 90 / 0.9), transparent 50%),' +
            'radial-gradient(1px 1px at 28% 12%, oklch(0.99 0.01 90 / 0.6), transparent 50%),' +
            'radial-gradient(1.5px 1.5px at 64% 8%, oklch(0.99 0.01 90 / 0.85), transparent 50%),' +
            'radial-gradient(1px 1px at 78% 22%, oklch(0.99 0.01 90 / 0.5), transparent 50%),' +
            'radial-gradient(1px 1px at 88% 14%, oklch(0.99 0.01 90 / 0.7), transparent 50%),' +
            'radial-gradient(1px 1px at 44% 6%, oklch(0.99 0.01 90 / 0.65), transparent 50%),' +
            'radial-gradient(1px 1px at 52% 26%, oklch(0.99 0.01 90 / 0.45), transparent 50%)',
          animation: 'eh-aurora-twinkle 6s ease-in-out infinite',
          animationPlayState: playState,
        }}
      />

      {/* mountain silhouettes — distant + foreground */}
      <svg
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '32%',
          width: '100%',
          height: '32%',
        }}
        preserveAspectRatio="none"
        viewBox="0 0 1000 200"
      >
        <path
          d="M 0 200 L 0 130 L 80 90 L 140 110 L 220 60 L 310 100 L 380 75 L 460 115 L 550 85 L 640 105 L 730 70 L 820 95 L 900 80 L 1000 110 L 1000 200 Z"
          fill="#0a1f2a"
          opacity="0.85"
        />
        <path
          d="M 0 200 L 0 160 L 100 140 L 200 155 L 320 130 L 440 150 L 560 135 L 700 155 L 820 140 L 1000 160 L 1000 200 Z"
          fill="#061419"
          opacity="0.95"
        />
      </svg>

      {/* water reflection — fjord with mirrored aurora */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '32%',
          background: 'linear-gradient(180deg, #0a2030 0%, #051218 60%, #020a0e 100%)',
          borderTop: '1px solid oklch(0.78 0.15 175 / 0.2)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 70% 90% at 50% 0%, oklch(0.72 0.20 155 / 0.22), transparent 70%)',
            animation: 'eh-aurora-hue 14s linear infinite',
            animationPlayState: playState,
            mixBlendMode: 'screen',
          }}
        />
        {/* horizontal water sheen */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(180deg, transparent 0%, oklch(0.78 0.10 195 / 0.06) 12%, transparent 14%, oklch(0.78 0.10 195 / 0.04) 28%, transparent 30%)',
          }}
        />
      </div>
    </div>
  );
}
