'use client';

import React from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useLowEndDevice } from '../../hooks/useLowEndDevice';
import { useInView } from '../../hooks/useInView';

interface SunRaysProps {
  size?: number | string;
  opacity?: number;
  top?: number | string;
  left?: number | string;
}

export default function SunRays({
  size = 1200,
  opacity = 0.18,
  top = -400,
  left = '50%',
}: SunRaysProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLowEndDevice = useLowEndDevice();
  const { ref, isInView } = useInView<HTMLDivElement>();

  if (prefersReducedMotion || isLowEndDevice) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: 'absolute',
        top,
        left,
        transform: 'translateX(-50%)',
        width: size,
        height: size,
        pointerEvents: 'none',
        background: `conic-gradient(from 0deg,
          transparent 0deg,
          oklch(0.85 0.11 85 / ${opacity}) 6deg,
          transparent 12deg,
          transparent 24deg,
          oklch(0.85 0.11 85 / ${opacity * 0.6}) 30deg,
          transparent 36deg,
          transparent 90deg,
          oklch(0.85 0.11 85 / ${opacity}) 96deg,
          transparent 102deg,
          transparent 180deg,
          oklch(0.85 0.11 85 / ${opacity * 0.6}) 186deg,
          transparent 192deg,
          transparent 270deg,
          oklch(0.85 0.11 85 / ${opacity}) 276deg,
          transparent 282deg,
          transparent 360deg)`,
        borderRadius: '50%',
        animation: 'spin-slow 90s linear infinite',
        animationPlayState: isInView ? 'running' : 'paused',
      }}
    />
  );
}
