"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Container } from "../ui/Container";
import { RobinOrb } from "../visual/RobinOrb";
import { ModelRouteCard, ActiveRoute } from "./local-first/ModelRouteCard";
import { ConnectedServicesPills } from "./local-first/ConnectedServicesPills";
import { RuntimeBoundary } from "./local-first/RuntimeBoundary";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

export function LocalFirstSection() {
  const prefersReducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const orbContainerRef = useRef<HTMLDivElement>(null);
  const orbGlowRef = useRef<HTMLDivElement>(null);

  // Headlines
  const m1HeaderRef = useRef<HTMLDivElement>(null);
  const m2HeaderRef = useRef<HTMLDivElement>(null);
  const m3HeaderRef = useRef<HTMLDivElement>(null);
  const m4HeaderRef = useRef<HTMLDivElement>(null);
  const m5HeaderRef = useRef<HTMLDivElement>(null);

  // Card containers
  const modelCardRef = useRef<HTMLDivElement>(null);
  const servicesCardRef = useRef<HTMLDivElement>(null);

  // Dynamic route state
  const [activeRoute, setActiveRoute] = useState<ActiveRoute>("idle");

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // =======================================================================
      // DESKTOP & TABLET PINNED SEQUENCE (~300vh)
      // =======================================================================
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(m1HeaderRef.current, { opacity: 1, y: 0 });
          gsap.set(
            [
              m2HeaderRef.current,
              m3HeaderRef.current,
              m4HeaderRef.current,
              m5HeaderRef.current,
            ],
            { opacity: 0, y: 15 }
          );

          gsap.set(modelCardRef.current, { opacity: 0, y: 25, scale: 0.96, pointerEvents: "none" });
          gsap.set(servicesCardRef.current, { opacity: 0, y: 25, scale: 0.96, pointerEvents: "none" });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              pin: pin,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = self.progress;
                if (p < 0.22) {
                  setActiveRoute("idle");
                } else if (p >= 0.22 && p < 0.44) {
                  setActiveRoute("local");
                } else if (p >= 0.44 && p < 0.66) {
                  setActiveRoute("cloud");
                } else if (p >= 0.66 && p < 0.84) {
                  setActiveRoute("both");
                } else {
                  setActiveRoute("idle");
                }
              },
            },
          });

          // -------------------------------------------------------------
          // MOMENT 1 -> MOMENT 2: Local AI (Ollama) (0 -> 0.28)
          // -------------------------------------------------------------
          tl.to(
            m1HeaderRef.current,
            { opacity: 0, y: -15, duration: 0.08, ease: "power2.in" },
            0.1
          )
            .to(
              m2HeaderRef.current,
              { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
              0.16
            )
            .to(
              modelCardRef.current,
              { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "power2.out" },
              0.18
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.6, scale: 1.1, duration: 0.14 },
              0.18
            );

          // -------------------------------------------------------------
          // MOMENT 2 -> MOMENT 3: Cloud AI (Gemini) (0.28 -> 0.54)
          // -------------------------------------------------------------
          tl.to(
            m2HeaderRef.current,
            { opacity: 0, y: -15, duration: 0.08, ease: "power2.in" },
            0.36
          )
            .to(
              m3HeaderRef.current,
              { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
              0.42
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.75, scale: 1.15, duration: 0.14 },
              0.42
            );

          // -------------------------------------------------------------
          // MOMENT 3 -> MOMENT 4: Unification (Same Robin) (0.54 -> 0.76)
          // -------------------------------------------------------------
          tl.to(
            m3HeaderRef.current,
            { opacity: 0, y: -15, duration: 0.08, ease: "power2.in" },
            0.58
          )
            .to(
              m4HeaderRef.current,
              { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
              0.64
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.85, scale: 1.2, duration: 0.14 },
              0.64
            );

          // -------------------------------------------------------------
          // MOMENT 4 -> MOMENT 5: Connected Online Services (0.76 -> 0.92)
          // -------------------------------------------------------------
          tl.to(
            m4HeaderRef.current,
            { opacity: 0, y: -15, duration: 0.08, ease: "power2.in" },
            0.76
          )
            .to(
              modelCardRef.current,
              { opacity: 0, y: -15, scale: 0.96, duration: 0.08, ease: "power2.in" },
              0.76
            )
            .to(
              m5HeaderRef.current,
              { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
              0.82
            )
            .to(
              servicesCardRef.current,
              { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "power2.out" },
              0.84
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.6, scale: 1.1, duration: 0.14 },
              0.84
            );

          // -------------------------------------------------------------
          // MOMENT 5 -> CLEAN OUTRO (0.92 -> 1.0)
          // -------------------------------------------------------------
          tl.to(
            m5HeaderRef.current,
            { opacity: 0, y: -15, duration: 0.06, ease: "power2.in" },
            0.93
          )
            .to(
              servicesCardRef.current,
              { opacity: 0, y: -15, scale: 0.96, duration: 0.06, ease: "power2.in" },
              0.93
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.35, scale: 1, duration: 0.07, ease: "power1.out" },
              0.94
            );
        }
      );

      // =======================================================================
      // MOBILE PINNED SEQUENCE (OVERFLOW-SAFE)
      // =======================================================================
      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(m1HeaderRef.current, { opacity: 1, y: 0 });
          gsap.set(
            [
              m2HeaderRef.current,
              m3HeaderRef.current,
              m4HeaderRef.current,
              m5HeaderRef.current,
            ],
            { opacity: 0, y: 12 }
          );

          const tlMobile = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              pin: pin,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = self.progress;
                if (p < 0.22) {
                  setActiveRoute("idle");
                } else if (p >= 0.22 && p < 0.44) {
                  setActiveRoute("local");
                } else if (p >= 0.44 && p < 0.66) {
                  setActiveRoute("cloud");
                } else if (p >= 0.66 && p < 0.84) {
                  setActiveRoute("both");
                } else {
                  setActiveRoute("idle");
                }
              },
            },
          });

          tlMobile
            .to(m1HeaderRef.current, { opacity: 0, y: -10, duration: 0.1 }, 0.1)
            .to(m2HeaderRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.16)
            .to(modelCardRef.current, { opacity: 1, y: 0, duration: 0.12 }, 0.18)
            .to(m2HeaderRef.current, { opacity: 0, y: -10, duration: 0.1 }, 0.34)
            .to(m3HeaderRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.4)
            .to(m3HeaderRef.current, { opacity: 0, y: -10, duration: 0.1 }, 0.58)
            .to(m4HeaderRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.64)
            .to(m4HeaderRef.current, { opacity: 0, y: -10, duration: 0.1 }, 0.76)
            .to(modelCardRef.current, { opacity: 0, y: -10, duration: 0.1 }, 0.76)
            .to(m5HeaderRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.82)
            .to(servicesCardRef.current, { opacity: 1, y: 0, duration: 0.12 }, 0.84)
            .to(m5HeaderRef.current, { opacity: 0, y: -10, duration: 0.08 }, 0.94)
            .to(servicesCardRef.current, { opacity: 0, y: -10, duration: 0.08 }, 0.94);
        }
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  // =========================================================================
  // ACCESSIBLE STATIC VIEW FOR REDUCED MOTION
  // =========================================================================
  if (prefersReducedMotion) {
    return (
      <section
        id="local-first"
        className="relative isolate w-full py-20 sm:py-24 bg-background border-b border-white/[0.06]"
        aria-label="Robin Local First Architecture and Model Choice"
      >
        <Container size="narrow" className="flex flex-col items-center text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-violet">
            06 / Architecture
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Robin lives on your Windows PC.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-foreground-muted max-w-lg">
            Your assistant, memory, preferences and local workspace are managed by the desktop application. Run with local AI or connect a cloud model.
          </p>

          {/* Central Robin Orb */}
          <div className="relative w-40 sm:w-48 aspect-square flex items-center justify-center my-6">
            <RobinOrb className="w-full h-full" />
          </div>

          {/* Model Route & Services Cards in a clear vertical flow */}
          <div className="w-full max-w-lg flex flex-col gap-6 mt-2">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-indigo text-center">
                Local AI &bull; Cloud Models
              </span>
              <ModelRouteCard activeRoute="both" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-magenta text-center">
                Authorized Connections
              </span>
              <ConnectedServicesPills />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  // =========================================================================
  // STANDARD CINEMATIC PINNED VIEW
  // =========================================================================
  return (
    <section
      id="local-first"
      ref={sectionRef}
      className="relative isolate w-full h-[220vh] bg-background border-b border-white/[0.06]"
      aria-label="Robin Local First Architecture and Model Choice"
    >
      {/* Pinned Viewport Scene (No sticky top-0, managed cleanly by ScrollTrigger) */}
      <div
        ref={pinRef}
        className="w-full h-screen flex flex-col items-center justify-between py-10 sm:py-14 overflow-hidden"
      >
        {/* Ambient illumination behind the central orb */}
        <div
          ref={orbGlowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] h-[340px] sm:h-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.14)_0%,rgba(139,92,246,0.06)_45%,transparent_70%)] blur-2xl pointer-events-none -z-10 transition-all duration-300"
        />

        {/* ============================================================= */}
        {/* TOP: Dynamic Moment Headlines */}
        {/* ============================================================= */}
        <Container size="narrow" className="relative flex flex-col items-center text-center z-20 pointer-events-none px-4">
          <div className="relative h-20 sm:h-24 w-full flex items-center justify-center">
            {/* Moment 1: Robin on your computer */}
            <div ref={m1HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-violet">
                06 / Architecture
              </span>
              <h2 className="mt-1 text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
                Robin lives on your Windows PC.
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted max-w-lg">
                Your assistant, memory, preferences and local workspace are managed by the desktop application.
              </p>
            </div>

            {/* Moment 2: Local AI */}
            <div ref={m2HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-violet">
                On-Device Execution &bull; Ollama
              </span>
              <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                Run with Local AI.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
                Run on your hardware through Ollama without sending your requests to third-party model providers.
              </p>
            </div>

            {/* Moment 3: Cloud AI */}
            <div ref={m3HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-indigo font-semibold">
                High Capability &bull; Cloud Models
              </span>
              <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                Or connect a cloud model.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
                Choose cloud intelligence like Gemini when you want broader reasoning power.
              </p>
            </div>

            {/* Moment 4: Same Robin */}
            <div ref={m4HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-violet font-semibold">
                Pluggable Infrastructure
              </span>
              <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                Different models. Same assistant.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
                Robin&apos;s tools, memory, approvals and interface don&apos;t change just because the model does.
              </p>
            </div>

            {/* Moment 5: Connected Services */}
            <div ref={m5HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-magenta">
                Authorized Connections
              </span>
              <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                Local when you want it. Cloud when you choose it.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
                Robin connects to services you&apos;ve authorized when a request needs them.
              </p>
            </div>
          </div>
        </Container>

        {/* ============================================================= */}
        {/* CENTER: Central RobinOrb & Runtime Boundary Paths */}
        {/* ============================================================= */}
        <div className="relative w-full max-w-2xl h-[280px] sm:h-[340px] flex items-center justify-center my-auto px-4">
          
          {/* Subtle runtime boundary vector */}
          <RuntimeBoundary activeRoute={activeRoute} />

          {/* Central Orb Container */}
          <div
            ref={orbContainerRef}
            className="relative w-44 sm:w-56 md:w-64 aspect-square flex items-center justify-center z-10 pointer-events-none select-none"
          >
            <RobinOrb className="w-full h-full" />
          </div>
        </div>

        {/* ============================================================= */}
        {/* BOTTOM: Model Route Card / Connected Services Display */}
        {/* ============================================================= */}
        <div className="relative w-full max-w-lg h-36 sm:h-40 flex items-center justify-center px-4 z-20 pointer-events-none">
          {/* Moments 2, 3, 4 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <ModelRouteCard ref={modelCardRef} activeRoute={activeRoute} />
          </div>

          {/* Moment 5 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <ConnectedServicesPills ref={servicesCardRef} />
          </div>
        </div>

      </div>
    </section>
  );
}
