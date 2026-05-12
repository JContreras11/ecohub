'use client';

import React, { useEffect } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useLowEndDevice } from '../../hooks/useLowEndDevice';
import { useInView } from '../../hooks/useInView';

interface WaterCursorProps {
  tint?: 'bio' | 'solar' | 'forest';
}

export default function WaterCursor({ tint = 'bio' }: WaterCursorProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLowEndDevice = useLowEndDevice();
  const { ref, isInView } = useInView<HTMLDivElement>();

  useEffect(() => {
    if (prefersReducedMotion || isLowEndDevice) return;
    
    // Disable on touch devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const root = ref.current;
    if (!root) return;
    const parent = root.parentElement;
    if (!parent) return;

    const cs = getComputedStyle(parent);
    if (cs.position === 'static') parent.style.position = 'relative';

    const tintColor =
      tint === 'bio'
        ? 'oklch(0.72 0.12 195 / 0.55)'
        : tint === 'solar'
        ? 'oklch(0.85 0.11 85 / 0.55)'
        : 'oklch(0.66 0.14 145 / 0.55)';

    let last = 0;
    const onMove = (e: MouseEvent) => {
      if (!isInView) return; // Only process mouse moves when in view

      const now = performance.now();
      if (now - last < 30) return;
      last = now;

      const r = parent.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;

      const ring = document.createElement('div');
      ring.style.cssText = `
        position: absolute; left: ${x}px; top: ${y}px;
        width: 6px; height: 6px; border-radius: 50%;
        border: 1.5px solid ${tintColor};
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: ripple-out 1100ms ease-out forwards;
      `;
      root.appendChild(ring);
      setTimeout(() => {
        if (root.contains(ring)) ring.remove();
      }, 1100);

      // dot
      const dot = document.createElement('div');
      dot.style.cssText = `
        position: absolute; left: ${x + (Math.random() - 0.5) * 6}px; top: ${y + (Math.random() - 0.5) * 6}px;
        width: 3px; height: 3px; border-radius: 50%;
        background: ${tintColor};
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: dot-fade 800ms ease-out forwards;
      `;
      root.appendChild(dot);
      setTimeout(() => {
        if (root.contains(dot)) dot.remove();
      }, 800);
    };

    parent.addEventListener('mousemove', onMove);
    
    return () => {
      parent.removeEventListener('mousemove', onMove);
      // Clean up any remaining elements
      if (root) {
        root.innerHTML = '';
      }
    };
  }, [tint, isInView, prefersReducedMotion, isLowEndDevice]);

  if (prefersReducedMotion || isLowEndDevice) return null;

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 5,
      }}
    />
  );
}
