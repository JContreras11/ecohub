'use client';

import React, { useEffect } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useLowEndDevice } from '../../hooks/useLowEndDevice';
import { useInView } from '../../hooks/useInView';

interface WindCanvasProps {
  density?: number;
  palette?: 'forest' | 'gold' | 'bone';
  className?: string;
  style?: React.CSSProperties;
}

export default function WindCanvas({
  density = 1,
  palette = 'forest',
  className = '',
  style = {},
}: WindCanvasProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLowEndDevice = useLowEndDevice();
  const { ref, isInView } = useInView<HTMLCanvasElement>();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    // Do not run if reduced motion or low end device
    if (prefersReducedMotion || isLowEndDevice) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const colors =
      palette === 'forest'
        ? [
            'oklch(0.66 0.14 145 / 0.35)',
            'oklch(0.78 0.13 85 / 0.35)',
            'oklch(0.72 0.12 195 / 0.30)',
            'oklch(0.86 0.07 145 / 0.45)',
          ]
        : palette === 'gold'
        ? [
            'oklch(0.85 0.11 85 / 0.5)',
            'oklch(0.76 0.12 195 / 0.3)',
            'oklch(0.99 0.01 90 / 0.6)',
          ]
        : [
            'oklch(0.99 0.01 90 / 0.5)',
            'oklch(0.86 0.07 145 / 0.4)',
            'oklch(0.72 0.12 195 / 0.3)',
          ];

    const COUNT = Math.max(8, Math.floor(40 * density));
    const seeds: any[] = [];

    function reset(s: any) {
      s.x = Math.random() * w;
      s.y = h + Math.random() * 100;
      s.vx = (Math.random() - 0.5) * 0.25;
      s.vy = -0.15 - Math.random() * 0.45;
      s.r = 1.5 + Math.random() * 4.5;
      s.rot = Math.random() * Math.PI * 2;
      s.spin = (Math.random() - 0.5) * 0.02;
      s.color = colors[Math.floor(Math.random() * colors.length)];
      s.shape = Math.random() < 0.55 ? 'leaf' : 'dot';
      s.phase = Math.random() * Math.PI * 2;
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      resize();
      seeds.length = 0;
      for (let i = 0; i < COUNT; i++) {
        const s: any = {};
        reset(s);
        s.y = Math.random() * h;
        seeds.push(s);
      }
    }

    function tick() {
      if (!isInView) {
        // Paused because out of view
        return;
      }

      ctx!.clearRect(0, 0, w, h);
      for (const s of seeds) {
        s.phase += 0.015;
        s.x += s.vx + Math.sin(s.phase) * 0.4;
        s.y += s.vy;
        s.rot += s.spin;
        if (s.y < -20 || s.x < -20 || s.x > w + 20) reset(s);

        ctx!.save();
        ctx!.translate(s.x, s.y);
        ctx!.rotate(s.rot);
        ctx!.fillStyle = s.color;
        if (s.shape === 'leaf') {
          ctx!.beginPath();
          ctx!.ellipse(0, 0, s.r * 1.6, s.r * 0.7, 0, 0, Math.PI * 2);
          ctx!.fill();
        } else {
          ctx!.beginPath();
          ctx!.arc(0, 0, s.r * 0.6, 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.restore();
      }
      rafId = requestAnimationFrame(tick);
    }

    init();
    
    if (isInView) {
      rafId = requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(init);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [density, palette, isInView, prefersReducedMotion, isLowEndDevice]);

  if (prefersReducedMotion || isLowEndDevice) return null;

  return (
    <canvas
      ref={ref}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}
