"use client";

import React, { useEffect, useRef, useState } from "react";
import { ParticlesOrb } from "./robin-orb/ParticlesOrb";
import type { OrbState } from "./robin-orb/orb-state";

export type RobinOrbState = OrbState;

export interface RobinOrbProps {
  className?: string;
  state?: RobinOrbState;
  label?: string;
  speed?: number;
  colorFrom?: string;
  colorTo?: string;
}

const DEFAULT_SIZE = 300;
const MIN_SIZE = 120;

export function RobinOrb({
  className,
  state = "idle",
  label = "Robin orb",
  speed = 1,
  colorFrom = "#f0abfc",
  colorTo = "#818cf8",
}: RobinOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<number>(DEFAULT_SIZE);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof ResizeObserver === "undefined") {
      const w = el.clientWidth || DEFAULT_SIZE;
      const h = el.clientHeight || DEFAULT_SIZE;
      const initial = Math.max(MIN_SIZE, Math.floor(Math.min(w, h)));
      setSize(initial);
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        const target = Math.max(MIN_SIZE, Math.floor(Math.min(width, height)));
        setSize((prev) => (Math.abs(prev - target) >= 2 ? target : prev));
      } else if (width > 0) {
        const target = Math.max(MIN_SIZE, Math.floor(width));
        setSize((prev) => (Math.abs(prev - target) >= 2 ? target : prev));
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={
        className ??
        "w-full h-72 sm:h-80 md:h-96 relative flex items-center justify-center pointer-events-none select-none"
      }
    >
      <ParticlesOrb
        state={state}
        size={size}
        speed={speed}
        colorFrom={colorFrom}
        colorTo={colorTo}
        label={label}
      />
    </div>
  );
}
