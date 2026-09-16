"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Container } from "../ui/Container";
import { VoiceVisualizer, VoiceState } from "./voice/VoiceVisualizer";
import { VoiceStateBadge } from "./voice/VoiceStateBadge";
import { TranscriptCard } from "./voice/TranscriptCard";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { setRobinStateOverride } from "../visual/persistent-stage/stage-state";

export function VoiceSection() {
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

  // Dynamic voice state for visualizer & transcript
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");

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
                  setVoiceState("idle");
                  setRobinStateOverride("idle");
                } else if (p >= 0.22 && p < 0.48) {
                  setVoiceState("listening");
                  setRobinStateOverride("listening");
                } else if (p >= 0.48 && p < 0.72) {
                  setVoiceState("thinking");
                  setRobinStateOverride("thinking");
                } else if (p >= 0.72 && p < 0.88) {
                  setVoiceState("speaking");
                  setRobinStateOverride("speaking");
                } else {
                  setVoiceState("conversation");
                  setRobinStateOverride("speaking");
                }
              },
            },
          });

          // -------------------------------------------------------------
          // MOMENT 1 -> MOMENT 2: Listening (0 -> 0.24)
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
              orbGlowRef.current,
              { opacity: 0.7, scale: 1.15, duration: 0.14 },
              0.18
            );

          // -------------------------------------------------------------
          // MOMENT 2 -> MOMENT 3: Thinking (0.24 -> 0.52)
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
              { opacity: 0.5, scale: 1.05, duration: 0.14 },
              0.42
            );

          // -------------------------------------------------------------
          // MOMENT 3 -> MOMENT 4: Speaking (0.52 -> 0.76)
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
              { opacity: 0.85, scale: 1.25, duration: 0.14 },
              0.64
            );

          // -------------------------------------------------------------
          // MOMENT 4 -> MOMENT 5: Natural Conversation (0.76 -> 0.92)
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
              orbGlowRef.current,
              { opacity: 0.6, scale: 1.1, duration: 0.14 },
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
                  setVoiceState("idle");
                  setRobinStateOverride("idle");
                } else if (p >= 0.22 && p < 0.48) {
                  setVoiceState("listening");
                  setRobinStateOverride("listening");
                } else if (p >= 0.48 && p < 0.72) {
                  setVoiceState("thinking");
                  setRobinStateOverride("thinking");
                } else if (p >= 0.72 && p < 0.88) {
                  setVoiceState("speaking");
                  setRobinStateOverride("speaking");
                } else {
                  setVoiceState("conversation");
                  setRobinStateOverride("speaking");
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
      setRobinStateOverride(null);
    };
  }, [prefersReducedMotion]);

  // =========================================================================
  // ACCESSIBLE STATIC VIEW FOR REDUCED MOTION
  // =========================================================================
  if (prefersReducedMotion) {
    return (
      <section
        id="voice"
        className="relative isolate w-full py-20 sm:py-24 bg-transparent border-b border-white/[0.06]"
        aria-label="Robin Natural Voice Interaction System"
      >
        <Container size="narrow" className="flex flex-col items-center text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-magenta">
            04 / Voice
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Or just talk.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-foreground-muted max-w-lg">
            Speak naturally. Robin listens, understands, and responds.
          </p>

          <div className="mt-6 mb-4">
            <VoiceStateBadge state="conversation" />
          </div>

          {/* Central Robin Orb with visualizer */}
          <div className="relative w-44 sm:w-56 md:w-64 aspect-square flex items-center justify-center my-8">
            <VoiceVisualizer state="conversation" />
            <div className="relative w-36 sm:w-44 aspect-square flex items-center justify-center z-10 pointer-events-none" aria-hidden="true" />
          </div>

          {/* Conversation Transcript Card */}
          <div className="w-full max-w-lg mt-2">
            <TranscriptCard state="conversation" />
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
      id="voice"
      ref={sectionRef}
      className="relative isolate w-full h-[230vh] bg-transparent border-b border-white/[0.06]"
      aria-label="Robin Natural Voice Interaction System"
    >
      {/* Pinned Viewport Scene (No sticky top-0, managed cleanly by ScrollTrigger) */}
      <div
        ref={pinRef}
        className="w-full h-screen flex flex-col items-center justify-between py-10 sm:py-14 overflow-hidden"
      >
        {/* Ambient illumination behind the central orb and acoustic waves */}
        <div
          ref={orbGlowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] h-[340px] sm:h-[540px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.14)_0%,rgba(99,102,241,0.05)_45%,transparent_70%)] blur-2xl pointer-events-none -z-10 transition-all duration-300"
        />

        {/* ============================================================= */}
        {/* TOP: Dynamic Status Badge & Moment Headlines */}
        {/* ============================================================= */}
        <Container size="narrow" className="relative flex flex-col items-center text-center z-20 pointer-events-none px-4">
          
          {/* Dynamic Voice State Badge */}
          <div className="mb-3">
            <VoiceStateBadge state={voiceState} />
          </div>

          {/* Dynamic Headlines Container */}
          <div className="relative h-20 sm:h-24 w-full flex items-center justify-center">
            {/* Moment 1: Voice Intro */}
            <div ref={m1HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-magenta">
                04 / Voice
              </span>
              <h2 className="mt-1 text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
                Or just talk.
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted max-w-lg">
                Speak naturally. Robin listens, understands, and responds.
              </p>
            </div>

            {/* Moment 2: Listening */}
            <div ref={m2HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-indigo">
                Receptive Audio Input
              </span>
              <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                Robin listens.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
                Capturing natural voice intent seamlessly on Windows.
              </p>
            </div>

            {/* Moment 3: Thinking */}
            <div ref={m3HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-violet">
                Intent Resolution
              </span>
              <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                Robin understands.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
                Resolving your schedule context without app switching.
              </p>
            </div>

            {/* Moment 4: Speaking */}
            <div ref={m4HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-magenta">
                Streaming Speech Response
              </span>
              <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                Robin responds.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
                Direct, clear spoken answers delivered naturally.
              </p>
            </div>

            {/* Moment 5: Conversation */}
            <div ref={m5HeaderRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-violet">
                Natural Interaction
              </span>
              <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                A conversation, not a command line.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
                Type when you want. Talk when it&apos;s easier.
              </p>
            </div>
          </div>
        </Container>

        {/* ============================================================= */}
        {/* CENTER: Central RobinOrb & Dynamic Circular VoiceVisualizer */}
        {/* ============================================================= */}
        <div className="relative w-full max-w-2xl h-[280px] sm:h-[340px] flex items-center justify-center my-auto px-4">
          
          {/* Dynamic SVG Circular Waveform Visualizer around orb */}
          <VoiceVisualizer state={voiceState} />

          {/* Central Orb Layout Spacer */}
          <div
            ref={orbContainerRef}
            className="relative w-44 sm:w-56 md:w-64 aspect-square flex items-center justify-center z-10 pointer-events-none select-none"
            aria-hidden="true"
          />
        </div>

        {/* ============================================================= */}
        {/* BOTTOM: Transcript & Conversational Turn Card */}
        {/* ============================================================= */}
        <div className="relative w-full max-w-lg h-32 sm:h-36 flex items-center justify-center px-4 z-20 pointer-events-none">
          <TranscriptCard state={voiceState} />
        </div>

      </div>
    </section>
  );
}
