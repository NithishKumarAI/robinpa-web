"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Container } from "../ui/Container";
import { RobinOrb } from "../visual/RobinOrb";
import { ActionPipeline } from "./safety/ActionPipeline";
import { ReadActionDemo } from "./safety/ReadActionDemo";
import { SafetyReviewCard } from "./safety/SafetyReviewCard";
import { SafeguardsPills } from "./safety/SafeguardsPills";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

export function SafetySection() {
  const prefersReducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  // Orb and glow
  const orbContainerRef = useRef<HTMLDivElement>(null);
  const orbGlowRef = useRef<HTMLDivElement>(null);

  // Headlines
  const m1HeaderRef = useRef<HTMLDivElement>(null);
  const m2HeaderRef = useRef<HTMLDivElement>(null);
  const m3HeaderRef = useRef<HTMLDivElement>(null);
  const m4HeaderRef = useRef<HTMLDivElement>(null);
  const m5HeaderRef = useRef<HTMLDivElement>(null);

  // Interactive cards
  const pipelineRef = useRef<HTMLDivElement>(null);
  const readDemoRef = useRef<HTMLDivElement>(null);
  const reviewCardRef = useRef<HTMLDivElement>(null);
  const safeguardsRef = useRef<HTMLDivElement>(null);

  // Boundary element
  const gateRef = useRef<HTMLDivElement>(null);

  // Dynamic approval state tracking for react render
  const [isApproved, setIsApproved] = useState(false);

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
          // Set initial visual positions
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

          gsap.set(pipelineRef.current, { opacity: 1, y: 0 });
          gsap.set(readDemoRef.current, { opacity: 0, y: 25, scale: 0.96, pointerEvents: "none" });
          gsap.set(reviewCardRef.current, { opacity: 0, y: 25, scale: 0.96, pointerEvents: "none" });
          gsap.set(safeguardsRef.current, { opacity: 0, y: 25, scale: 0.96, pointerEvents: "none" });
          gsap.set(gateRef.current, { opacity: 0.3, scaleY: 0.8 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              pin: pin,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                // Approval triggers between Moment 3 and Moment 4 (scroll progress > 0.58)
                const shouldBeApproved = self.progress >= 0.58 && self.progress < 0.84;
                setIsApproved((prev) => (prev !== shouldBeApproved ? shouldBeApproved : prev));
              },
            },
          });

          // -------------------------------------------------------------
          // MOMENT 1 -> MOMENT 2: Read Action (0 -> 0.28)
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
              readDemoRef.current,
              { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "power2.out" },
              0.18
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.55, scale: 1.08, duration: 0.14 },
              0.18
            );

          // -------------------------------------------------------------
          // MOMENT 2 -> MOMENT 3: Mutation Gate (0.28 -> 0.58)
          // -------------------------------------------------------------
          tl.to(
            m2HeaderRef.current,
            { opacity: 0, y: -15, duration: 0.08, ease: "power2.in" },
            0.36
          )
            .to(
              readDemoRef.current,
              { opacity: 0, y: -15, scale: 0.96, duration: 0.08, ease: "power2.in" },
              0.36
            )
            .to(
              m3HeaderRef.current,
              { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
              0.42
            )
            .to(
              reviewCardRef.current,
              { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "power2.out" },
              0.44
            )
            .to(
              gateRef.current,
              { opacity: 0.8, scaleY: 1.2, duration: 0.14 },
              0.44
            );

          // -------------------------------------------------------------
          // MOMENT 3 -> MOMENT 4: Approval Granted (0.58 -> 0.78)
          // -------------------------------------------------------------
          tl.to(
            m3HeaderRef.current,
            { opacity: 0, y: -15, duration: 0.08, ease: "power2.in" },
            0.6
          )
            .to(
              m4HeaderRef.current,
              { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
              0.64
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.75, scale: 1.15, duration: 0.12 },
              0.64
            );

          // -------------------------------------------------------------
          // MOMENT 4 -> MOMENT 5: Architectural Safeguards (0.78 -> 0.92)
          // -------------------------------------------------------------
          tl.to(
            m4HeaderRef.current,
            { opacity: 0, y: -15, duration: 0.08, ease: "power2.in" },
            0.78
          )
            .to(
              reviewCardRef.current,
              { opacity: 0, y: -15, scale: 0.96, duration: 0.08, ease: "power2.in" },
              0.78
            )
            .to(
              gateRef.current,
              { opacity: 0.2, scaleY: 0.7, duration: 0.1 },
              0.78
            )
            .to(
              m5HeaderRef.current,
              { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
              0.82
            )
            .to(
              safeguardsRef.current,
              { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "power2.out" },
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
              safeguardsRef.current,
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
          gsap.set(
            [
              readDemoRef.current,
              reviewCardRef.current,
              safeguardsRef.current,
            ],
            { opacity: 0, y: 15 }
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
                const shouldBeApproved = self.progress >= 0.58 && self.progress < 0.84;
                setIsApproved((prev) => (prev !== shouldBeApproved ? shouldBeApproved : prev));
              },
            },
          });

          tlMobile
            .to(m1HeaderRef.current, { opacity: 0, y: -10, duration: 0.1 }, 0.1)
            .to(m2HeaderRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.16)
            .to(readDemoRef.current, { opacity: 1, y: 0, duration: 0.12 }, 0.18)
            .to(m2HeaderRef.current, { opacity: 0, y: -10, duration: 0.1 }, 0.34)
            .to(readDemoRef.current, { opacity: 0, y: -10, duration: 0.1 }, 0.34)
            .to(m3HeaderRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.4)
            .to(reviewCardRef.current, { opacity: 1, y: 0, duration: 0.12 }, 0.42)
            .to(m3HeaderRef.current, { opacity: 0, y: -10, duration: 0.1 }, 0.58)
            .to(m4HeaderRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.62)
            .to(m4HeaderRef.current, { opacity: 0, y: -10, duration: 0.1 }, 0.76)
            .to(reviewCardRef.current, { opacity: 0, y: -10, duration: 0.1 }, 0.76)
            .to(m5HeaderRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.82)
            .to(safeguardsRef.current, { opacity: 1, y: 0, duration: 0.12 }, 0.84)
            .to(m5HeaderRef.current, { opacity: 0, y: -10, duration: 0.08 }, 0.94)
            .to(safeguardsRef.current, { opacity: 0, y: -10, duration: 0.08 }, 0.94);
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
        id="safety"
        className="relative isolate w-full py-20 sm:py-24 bg-background border-b border-white/[0.06]"
        aria-label="Robin Safety and User Control System"
      >
        <Container size="narrow" className="flex flex-col items-center text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-violet">
            03 / Control
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Robin asks before it acts.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-foreground-muted max-w-lg">
            Read what you need. Review what changes something.
          </p>

          <div className="mt-8 mb-6">
            <ActionPipeline activeStep="review" isApproved={false} />
          </div>

          {/* Central Robin Orb */}
          <div className="relative w-40 sm:w-48 aspect-square flex items-center justify-center my-6">
            <RobinOrb className="w-full h-full" />
          </div>

          {/* Sequential showcase cards */}
          <div className="w-full max-w-xl flex flex-col gap-8 text-left mt-2">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-indigo text-center">
                Read Action &bull; Frictionless
              </span>
              <div className="flex justify-center">
                <ReadActionDemo />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-violet text-center">
                Mutation &bull; Approval Boundary
              </span>
              <div className="flex justify-center">
                <SafetyReviewCard isApproved={false} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-magenta text-center">
                Architecture &bull; Safeguards
              </span>
              <div className="flex justify-center">
                <SafeguardsPills />
              </div>
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
      id="safety"
      ref={sectionRef}
      className="relative isolate w-full h-[240vh] bg-background border-b border-white/[0.06]"
      aria-label="Robin Safety and User Control System"
    >
      {/* Pinned Viewport Scene (No sticky top-0, managed cleanly by ScrollTrigger) */}
      <div
        ref={pinRef}
        className="w-full h-screen flex flex-col items-center justify-between py-10 sm:py-14 overflow-hidden"
      >
        {/* Ambient illumination behind the central scene */}
        <div
          ref={orbGlowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] h-[340px] sm:h-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.13)_0%,rgba(99,102,241,0.05)_45%,transparent_70%)] blur-2xl pointer-events-none -z-10"
        />

        {/* ============================================================= */}
        {/* TOP: Action Pipeline & Dynamic Moment Headlines */}
        {/* ============================================================= */}
        <Container size="narrow" className="relative flex flex-col items-center text-center z-20 pointer-events-none px-4">
          
          {/* Action Pipeline Indicator */}
          <div ref={pipelineRef} className="mb-3">
            <ActionPipeline
              activeStep={
                isApproved
                  ? "execute"
                  : undefined
              }
              isApproved={isApproved}
            />
          </div>

          {/* Dynamic Headlines Container */}
          <div className="relative h-20 sm:h-24 w-full flex items-center justify-center">
            {/* Moment 1 — Principle */}
            <div ref={m1HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-violet">
                03 / Control
              </span>
              <h2 className="mt-1 text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
                Robin asks before it acts.
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted max-w-lg">
                Read what you need. Review what changes something.
              </p>
            </div>

            {/* Moment 2 — Read Action */}
            <div ref={m2HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-indigo">
                Read Action &bull; Frictionless
              </span>
              <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                Read without interruption.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
                Reading information doesn&apos;t need unnecessary friction.
              </p>
            </div>

            {/* Moment 3 — Action Requiring Approval */}
            <div ref={m3HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-violet">
                Mutation &bull; Approval Boundary
              </span>
              <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                Changing something requires your approval.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
                Robin prepares the action, but pauses at the approval gate.
              </p>
            </div>

            {/* Moment 4 — Approval State */}
            <div ref={m4HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-violet font-semibold">
                Approved &bull; Ready to Execute
              </span>
              <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                Approved by you.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
                Execution proceeds only after explicit human confirmation.
              </p>
            </div>

            {/* Moment 5 — Boundaries */}
            <div ref={m5HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-magenta">
                Architecture &bull; Safeguards
              </span>
              <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                Capability without giving up control.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
                Explicit permissions, review gates, and sandboxed file access.
              </p>
            </div>
          </div>
        </Container>

        {/* ============================================================= */}
        {/* CENTER: Central RobinOrb & Approval Gate Motif */}
        {/* ============================================================= */}
        <div className="relative w-full max-w-3xl h-[280px] sm:h-[340px] flex items-center justify-center my-auto px-4">
          
          {/* Luminous Approval Boundary Line Motif */}
          <div
            ref={gateRef}
            className={`hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[460px] h-[1px] ${
              isApproved
                ? "bg-gradient-to-r from-transparent via-brand-violet to-transparent shadow-[0_0_15px_rgba(139,92,246,0.9)]"
                : "bg-gradient-to-r from-transparent via-white/[0.15] to-transparent"
            } transition-all duration-300 pointer-events-none -z-0`}
          />

          {/* Central Orb Container */}
          <div
            ref={orbContainerRef}
            className="relative w-44 sm:w-56 md:w-64 aspect-square flex items-center justify-center z-10 pointer-events-none select-none"
          >
            <RobinOrb className="w-full h-full" />
          </div>
        </div>

        {/* ============================================================= */}
        {/* BOTTOM: Dynamic Interaction Cards / Safeguards */}
        {/* ============================================================= */}
        <div className="relative w-full max-w-2xl h-36 sm:h-40 flex items-center justify-center px-4 z-20 pointer-events-none">
          {/* Moment 2 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <ReadActionDemo ref={readDemoRef} />
          </div>

          {/* Moments 3 & 4 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <SafetyReviewCard ref={reviewCardRef} isApproved={isApproved} />
          </div>

          {/* Moment 5 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <SafeguardsPills ref={safeguardsRef} />
          </div>
        </div>

      </div>
    </section>
  );
}
