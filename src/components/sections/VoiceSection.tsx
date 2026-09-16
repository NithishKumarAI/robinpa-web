"use client";

import React, { useRef, useState } from "react";
import { Container } from "../ui/Container";
import { VoiceVisualizer, VoiceState } from "./voice/VoiceVisualizer";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setRobinStateOverride } from "../visual/persistent-stage/stage-state";

export function VoiceSection() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [voiceState, setVoiceState] = useState<VoiceState>("listening");

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: "voice-trigger",
        trigger: section,
        pin: pin,
        start: "top top",
        end: "+=120%",
        onEnter: () => {
          setVoiceState("listening");
          setRobinStateOverride("listening");
        },
        onLeave: () => {
          setRobinStateOverride(null);
        },
        onEnterBack: () => {
          setVoiceState("speaking");
          setRobinStateOverride("speaking");
        },
        onLeaveBack: () => {
          setRobinStateOverride(null);
        },
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.35) {
            setVoiceState("listening");
            setRobinStateOverride("listening");
          } else if (p < 0.7) {
            setVoiceState("thinking");
            setRobinStateOverride("thinking");
          } else {
            setVoiceState("speaking");
            setRobinStateOverride("speaking");
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const stateLabel =
    voiceState === "listening"
      ? "Robin listens."
      : voiceState === "thinking"
      ? "Robin thinks."
      : "Robin responds.";

  const badgeText =
    voiceState === "listening"
      ? "LISTENING"
      : voiceState === "thinking"
      ? "THINKING"
      : "SPEAKING";

  return (
    <div
      id="voice"
      ref={sectionRef}
      className="relative isolate border-b border-white/[0.06] bg-transparent"
    >
      <div
        ref={pinRef}
        className="min-h-[100svh] h-[100svh] flex flex-col items-center justify-between py-8 sm:py-12 md:py-16 overflow-hidden relative"
        aria-label="Voice Section"
      >
        {/* Ambient central glow */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[460px] h-[280px] sm:h-[460px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12)_0%,rgba(99,102,241,0.03)_50%,transparent_70%)] blur-3xl pointer-events-none -z-10"
        />

        {/* Top: Scene Tag & Headline */}
        <Container size="narrow" className="w-full flex flex-col items-center text-center z-20 shrink-0">
          <div className="mb-2 sm:mb-3">
            <span className="text-xs sm:text-sm uppercase tracking-[0.2em] text-brand-violet font-medium">
              Voice
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[clamp(2.75rem,min(5.5vw,7vh),5rem)] font-semibold tracking-tighter text-white leading-[1.04]">
            JUST TALK.
          </h2>
        </Container>

        {/* Middle: Robin Center Spacer with Circular Acoustic Visualizer */}
        <div
          className="relative w-full aspect-square max-w-[240px] sm:max-w-[320px] md:max-w-[380px] max-h-[36vh] mx-auto pointer-events-none flex items-center justify-center my-auto shrink-0"
          aria-hidden="true"
        >
          <VoiceVisualizer state={voiceState} />
        </div>

        {/* Bottom: Dynamic State Indicator & Subtitle */}
        <Container size="narrow" className="w-full flex flex-col items-center text-center z-20 shrink-0 space-y-2 sm:space-y-3">
          {/* State Indicator Badge */}
          <div>
            <span
              role="status"
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full font-mono text-xs uppercase tracking-widest text-brand-violet bg-brand-violet/10 border border-brand-violet/25"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-violet animate-pulse" />
              {badgeText}
            </span>
          </div>

          {/* Dynamic Human Statement */}
          <p className="text-[clamp(1.125rem,min(2vw,3vh),1.75rem)] text-white/90 font-medium leading-tight transition-all duration-300">
            {stateLabel}
          </p>

          {/* Bottom Helper */}
          <p className="text-xs sm:text-sm text-white/50 max-w-sm sm:max-w-md mx-auto leading-relaxed">
            Robin processes your voice naturally. No complex keywords required.
          </p>
        </Container>
      </div>
    </div>
  );
}
