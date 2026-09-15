"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Container } from "../ui/Container";
import { RobinOrb } from "../visual/RobinOrb";
import { MemoryFragment } from "./memory/MemoryFragment";
import { RecallConversation } from "./memory/RecallConversation";
import { MemoryConnector } from "./memory/MemoryConnector";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

export function MemorySection() {
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

  // Fragments
  const fragPrefRef = useRef<HTMLDivElement>(null);
  const fragProjRef = useRef<HTMLDivElement>(null);
  const fragPersonRef = useRef<HTMLDivElement>(null);

  // Dynamic recall state
  const [isRecalled, setIsRecalled] = useState(false);
  const [activeMode, setActiveMode] = useState<"input" | "recall" | "summary">("input");

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // =======================================================================
      // DESKTOP & TABLET PINNED SEQUENCE (~310vh)
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

          gsap.set(fragPrefRef.current, { opacity: 0, y: 30, scale: 0.9 });
          gsap.set([fragProjRef.current, fragPersonRef.current], {
            opacity: 0,
            scale: 0.9,
          });

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
                if (p < 0.46) {
                  setActiveMode("input");
                  setIsRecalled(false);
                } else if (p >= 0.46 && p < 0.68) {
                  setActiveMode("input");
                  setIsRecalled(false);
                } else if (p >= 0.68 && p < 0.88) {
                  setActiveMode("recall");
                  setIsRecalled(true);
                } else {
                  setActiveMode("summary");
                  setIsRecalled(false);
                }
              },
            },
          });

          // -------------------------------------------------------------
          // MOMENT 1 -> MOMENT 2: First Fragment (Preference) (0 -> 0.28)
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
              fragPrefRef.current,
              { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "back.out(1.2)" },
              0.18
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.6, scale: 1.1, duration: 0.14 },
              0.18
            );

          // -------------------------------------------------------------
          // MOMENT 2 -> MOMENT 3: Additional Fragments (Project & Person) (0.28 -> 0.58)
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
              [fragProjRef.current, fragPersonRef.current],
              { opacity: 1, scale: 1, stagger: 0.05, duration: 0.14, ease: "back.out(1.2)" },
              0.44
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.75, scale: 1.15, duration: 0.14 },
              0.44
            );

          // -------------------------------------------------------------
          // MOMENT 3 -> MOMENT 4: Recall into New Conversation (0.58 -> 0.78)
          // -------------------------------------------------------------
          tl.to(
            m3HeaderRef.current,
            { opacity: 0, y: -15, duration: 0.08, ease: "power2.in" },
            0.62
          )
            .to(
              m4HeaderRef.current,
              { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
              0.66
            )
            .to(
              fragPrefRef.current,
              { scale: 1.08, duration: 0.12, ease: "power2.out" },
              0.68
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.9, scale: 1.25, duration: 0.14 },
              0.68
            );

          // -------------------------------------------------------------
          // MOMENT 4 -> MOMENT 5: Long-term Continuity (0.78 -> 0.92)
          // -------------------------------------------------------------
          tl.to(
            m4HeaderRef.current,
            { opacity: 0, y: -15, duration: 0.08, ease: "power2.in" },
            0.78
          )
            .to(
              m5HeaderRef.current,
              { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
              0.82
            )
            .to(
              [fragPrefRef.current, fragProjRef.current, fragPersonRef.current],
              { opacity: 0.6, scale: 0.95, duration: 0.1 },
              0.82
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.55, scale: 1.05, duration: 0.14 },
              0.82
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
              [fragPrefRef.current, fragProjRef.current, fragPersonRef.current],
              { opacity: 0.7, scale: 1, duration: 0.07, ease: "power1.out" },
              0.94
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
                if (p < 0.46) {
                  setActiveMode("input");
                  setIsRecalled(false);
                } else if (p >= 0.46 && p < 0.68) {
                  setActiveMode("input");
                  setIsRecalled(false);
                } else if (p >= 0.68 && p < 0.88) {
                  setActiveMode("recall");
                  setIsRecalled(true);
                } else {
                  setActiveMode("summary");
                  setIsRecalled(false);
                }
              },
            },
          });

          tlMobile
            .to(m1HeaderRef.current, { opacity: 0, y: -10, duration: 0.1 }, 0.1)
            .to(m2HeaderRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.16)
            .to(m2HeaderRef.current, { opacity: 0, y: -10, duration: 0.1 }, 0.34)
            .to(m3HeaderRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.4)
            .to(m3HeaderRef.current, { opacity: 0, y: -10, duration: 0.1 }, 0.58)
            .to(m4HeaderRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.64)
            .to(m4HeaderRef.current, { opacity: 0, y: -10, duration: 0.1 }, 0.78)
            .to(m5HeaderRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.84)
            .to(m5HeaderRef.current, { opacity: 0, y: -10, duration: 0.08 }, 0.94);
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
        id="memory"
        className="relative isolate w-full py-20 sm:py-24 bg-background border-b border-white/[0.06]"
        aria-label="Robin Memory and Continuity System"
      >
        <Container size="narrow" className="flex flex-col items-center text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-indigo">
            05 / Continuity
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Robin remembers the context that matters.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-foreground-muted max-w-lg">
            So you don&apos;t have to explain everything again. Preferences, people, and projects carried forward seamlessly.
          </p>

          {/* Central Robin Orb */}
          <div className="relative w-40 sm:w-48 aspect-square flex items-center justify-center my-6">
            <RobinOrb className="w-full h-full" />
          </div>

          {/* Memory Fragments Preview */}
          <div className="flex flex-wrap justify-center gap-3 max-w-lg mb-8">
            <MemoryFragment
              type="preference"
              label="Preference"
              value="Concise updates"
              isRecalled={true}
            />
            <MemoryFragment
              type="project"
              label="Project"
              value="Robin"
            />
            <MemoryFragment
              type="person"
              label="Person"
              value="Vicky — confirmed contact"
            />
          </div>

          {/* Recall Conversation Card */}
          <div className="w-full max-w-lg">
            <RecallConversation mode="summary" />
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
      id="memory"
      ref={sectionRef}
      className="relative isolate w-full h-[310vh] bg-background border-b border-white/[0.06]"
      aria-label="Robin Memory and Continuity System"
    >
      {/* Pinned Viewport Scene (No sticky top-0, managed cleanly by ScrollTrigger) */}
      <div
        ref={pinRef}
        className="w-full h-screen flex flex-col items-center justify-between py-10 sm:py-14 overflow-hidden"
      >
        {/* Ambient illumination behind the central orb and memory fragments */}
        <div
          ref={orbGlowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] h-[340px] sm:h-[540px] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.14)_0%,rgba(139,92,246,0.05)_45%,transparent_70%)] blur-2xl pointer-events-none -z-10 transition-all duration-300"
        />

        {/* ============================================================= */}
        {/* TOP: Dynamic Moment Headlines */}
        {/* ============================================================= */}
        <Container size="narrow" className="relative flex flex-col items-center text-center z-20 pointer-events-none px-4">
          <div className="relative h-20 sm:h-24 w-full flex items-center justify-center">
            {/* Moment 1: Starting Context */}
            <div ref={m1HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-indigo">
                05 / Continuity
              </span>
              <h2 className="mt-1 text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
                Robin remembers the context that matters.
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted max-w-lg">
                So you don&apos;t have to explain everything again.
              </p>
            </div>

            {/* Moment 2: A Useful Detail */}
            <div ref={m2HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-violet">
                Extracting Preferences
              </span>
              <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                Retaining meaningful preferences.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
                Preferences carry forward without reading your mind.
              </p>
            </div>

            {/* Moment 3: More Context */}
            <div ref={m3HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-indigo">
                Orbital Context
              </span>
              <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                Lightweight contextual fragments.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
                Projects, key contacts, and working preferences connected to Robin.
              </p>
            </div>

            {/* Moment 4: Recall */}
            <div ref={m4HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-violet font-semibold">
                Contextual Recall
              </span>
              <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                Recalled when it helps.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
                Robin applied your saved preference instead of starting from zero.
              </p>
            </div>

            {/* Moment 5: Continuity */}
            <div ref={m5HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-magenta">
                Cross-Conversation Continuity
              </span>
              <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                Less repeating yourself. More continuity.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
                Robin can use relevant remembered context when it helps the conversation.
              </p>
            </div>
          </div>
        </Container>

        {/* ============================================================= */}
        {/* CENTER: Central RobinOrb & Surrounding Memory Fragments */}
        {/* ============================================================= */}
        <div className="relative w-full max-w-2xl h-[280px] sm:h-[340px] flex items-center justify-center my-auto px-4">
          
          {/* Subtle connecting vectors */}
          <MemoryConnector isRecalled={isRecalled} />

          {/* Fragment 1: Preference (Recalled in Moment 4) */}
          <div className="absolute left-[4%] sm:left-[8%] top-[12%] z-20">
            <MemoryFragment
              type="preference"
              label="Preference"
              value="Concise updates"
              isRecalled={isRecalled}
              nodeRef={fragPrefRef}
            />
          </div>

          {/* Fragment 2: Project */}
          <div className="absolute right-[4%] sm:right-[10%] top-[18%] z-20">
            <MemoryFragment
              type="project"
              label="Project"
              value="Robin"
              nodeRef={fragProjRef}
            />
          </div>

          {/* Fragment 3: Person */}
          <div className="absolute left-[6%] sm:left-[12%] bottom-[12%] z-20">
            <MemoryFragment
              type="person"
              label="Person"
              value="Vicky — confirmed contact"
              nodeRef={fragPersonRef}
            />
          </div>

          {/* Central Orb Container */}
          <div
            ref={orbContainerRef}
            className="relative w-44 sm:w-56 md:w-64 aspect-square flex items-center justify-center z-10 pointer-events-none select-none"
          >
            <RobinOrb className="w-full h-full" />
          </div>
        </div>

        {/* ============================================================= */}
        {/* BOTTOM: Conversation / Recall Interaction Card */}
        {/* ============================================================= */}
        <div className="relative w-full max-w-lg h-36 sm:h-40 flex items-center justify-center px-4 z-20 pointer-events-none">
          <RecallConversation mode={activeMode} />
        </div>

      </div>
    </section>
  );
}
