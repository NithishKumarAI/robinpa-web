"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const setup = () => {
      if (mq.matches) {
        if (lenisRef.current) {
          lenisRef.current.destroy();
          lenisRef.current = null;
        }
        return undefined;
      }

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
      });

      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);

      const tickerCallback = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);

      return () => {
        gsap.ticker.remove(tickerCallback);
        lenis.destroy();
        lenisRef.current = null;
      };
    };

    let cleanup = setup();

    const onChange = () => {
      cleanup?.();
      cleanup = setup();
    };

    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      cleanup?.();
    };
  }, []);

  return <>{children}</>;
}
