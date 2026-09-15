"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Container } from "../ui/Container";
import { RobinOrb } from "../visual/RobinOrb";
import { ModelRouteCard, ActiveRoute } from "./local-first/ModelRouteCard";
import { ConnectedServicesPills } from "./local-first/ConnectedServicesPills";
import { RuntimeBoundary } from "./local-first/RuntimeBoundary";

export function LocalFirstSection() {
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

  useEffect(() => {
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
          // MOMENT 1 -> MOMENT 2: Local AI (0 -> 0.24)
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
              0.16
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.65, scale: 1.1, duration: 0.14 },
              0.16
            );

          // -------------------------------------------------------------
          // MOMENT 2 -> MOMENT 3: Cloud AI (0.24 -> 0.48)
          // -------------------------------------------------------------
          tl.to(
            m2HeaderRef.current,
            { opacity: 0, y: -15, duration: 0.08, ease: "power2.in" },
            0.32
          )
            .to(
              m3HeaderRef.current,
              { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
              0.38
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.75, scale: 1.15, duration: 0.14 },
              0.38
            );

          // -------------------------------------------------------------
          // MOMENT 3 -> MOMENT 4: Same Robin (0.48 -> 0.72)
          // -------------------------------------------------------------
          tl.to(
            m3HeaderRef.current,
            { opacity: 0, y: -15, duration: 0.08, ease: "power2.in" },
            0.54
          )
            .to(
              m4HeaderRef.current,
              { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
              0.6
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.85, scale: 1.2, duration: 0.14 },
              0.6
            );

          // -------------------------------------------------------------
          // MOMENT 4 -> MOMENT 5: Connected Services (0.72 -> 0.92)
          // -------------------------------------------------------------
          tl.to(
            m4HeaderRef.current,
            { opacity: 0, y: -15, duration: 0.08, ease: "power2.in" },
            0.74
          )
            .to(
              modelCardRef.current,
              { opacity: 0, y: -15, scale: 0.96, duration: 0.08, ease: "power2.in" },
              0.74
            )
            .to(
              m5HeaderRef.current,
              { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
              0.78
            )
            .to(
              servicesCardRef.current,
              { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "power2.out" },
              0.8
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.5, scale: 1.05, duration: 0.14 },
              0.8
            );

          // -------------------------------------------------------------
          // MOMENT 5 -> CLEAN OUTRO (0.92 -> 1.0)
          // -------------------------------------------------------------
          tl.to(
            m5HeaderRef.current,
            { opacity: 0, y: -15, duration: 0.06, ease: "power2.in" },
            0.94
          )
            .to(
              servicesCardRef.current,
              { opacity: 0, y: -15, scale: 0.96, duration: 0.06, ease: "power2.in" },
              0.94
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.35, scale: 1, duration: 0.06, ease: "power1.out" },
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
            { opacity: 0, y: 10 }
          );
          gsap.set([modelCardRef.current, servicesCardRef.current], { opacity: 0, y: 15 });

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

      // =======================================================================
      // PREFERS-REDUCED-MOTION FALLBACK
      // =======================================================================
      mm.add("(prefers-reduced-motion: reduce)", () => {
        setActiveRoute("both");
        gsap.set(m4HeaderRef.current, { opacity: 1, y: 0 });
        gsap.set([modelCardRef.current, servicesCardRef.current], {
          opacity: 1,
          y: 0,
          scale: 1,
        });
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="local-first"
      ref={sectionRef}
      className="relative w-full h-[300vh] bg-background border-b border-white/[0.06]"
      aria-label="Robin Local-First and Model Choice Architecture"
    >
      {/* Pinned Viewport Scene */}
      <div
        ref={pinRef}
        className="w-full h-screen sticky top-0 flex flex-col items-center justify-between py-10 sm:py-14 overflow-hidden"
      >
        {/* Ambient illumination behind the orb and PC boundary */}
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
                Use a supported model running directly on your own machine.
              </p>
            </div>

            {/* Moment 3: Cloud AI */}
            <div ref={m3HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-indigo">
                Connected Intelligence &bull; Gemini
              </span>
              <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                Or connect a Cloud Model.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
                Connect a cloud model when you prefer its capabilities.
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
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Moments 2, 3, 4 */}
            <ModelRouteCard ref={modelCardRef} activeRoute={activeRoute} />

            {/* Moment 5 */}
            <ConnectedServicesPills ref={servicesCardRef} />
          </div>
        </div>

      </div>
    </section>
  );
}
