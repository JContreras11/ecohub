'use client';

import { useState, useEffect } from 'react';

export function useLowEndDevice(): boolean {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lowEnd = false;

    // Check hardware concurrency (CPU cores)
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
      lowEnd = true;
    }

    // Check device memory (RAM in GB)
    // deviceMemory is non-standard but available in Chromium-based browsers
    if ('deviceMemory' in navigator) {
      const memory = (navigator as any).deviceMemory;
      if (memory && memory <= 2) {
        lowEnd = true;
      }
    }

    setIsLowEnd(lowEnd);
  }, []);

  return isLowEnd;
}
