"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "../ui/Container";

export function MeetRobinSection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="meet-robin"
      ref={sectionRef}
      className="relative isolate min-h-[100svh] flex items-center py-12 sm:py-16 lg:py-24 overflow-hidden border-b border-white/[0.06] bg-transparent"
      aria-label="Meet Your PA"
    >
      {/* Subtle ambient illumination behind Robin's right position */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[300px] sm:w-[460px] md:w-[540px] h-[300px] sm:h-[460px] md:h-[540px] rounded-full pointer-events-none -z-10"
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12)_0%,rgba(99,102,241,0.03)_50%,transparent_70%)] blur-3xl" />
      </div>

      <Container size="wide" className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Headline & Focused Conversation (7 cols) */}
          <motion.div
            initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.25 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left z-20"
          >
            {/* Minimal Scene Tag */}
            <div className="mb-2 sm:mb-3">
              <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-brand-violet font-medium">
                Meet your PA
              </span>
            </div>

            {/* Major Headline (height-aware) */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[clamp(2.75rem,min(5vw,6.5vh),4.75rem)] font-semibold tracking-tighter text-white leading-[1.04]">
              A real assistant for everyday life.
            </h2>

            {/* Supporting Statement (height-aware) */}
            <div className="mt-3 sm:mt-5 text-[clamp(1.125rem,min(1.8vw,2.2vh),1.5rem)] text-white/70 font-normal leading-relaxed max-w-xl">
              <p>Not another chatbot.</p>
              <p className="text-white/90">Your personal assistant for everyday work.</p>
            </div>

            {/* Large Conversational Presentation Card */}
            <div className="mt-6 sm:mt-10 w-full max-w-xl rounded-2xl border border-white/[0.1] bg-neutral-950/80 lg:bg-white/[0.03] backdrop-blur-md p-5 sm:p-7 space-y-4 sm:space-y-5 shadow-[0_8px_32px_rgba(0,0,0,0.36)]">
              {/* Turn 1: User */}
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="font-mono text-xs uppercase tracking-wider text-white/40 pt-1 w-12 shrink-0">
                  You
                </span>
                <p className="text-[clamp(1.125rem,min(1.6vw,2.2vh),1.625rem)] font-medium text-white leading-snug">
                  &ldquo;Robin.&rdquo;
                </p>
              </div>

              {/* Turn 2: Robin */}
              <div className="flex items-start gap-3 sm:gap-4 pl-3 sm:pl-5 border-l-2 border-brand-violet/60">
                <span className="font-mono text-xs uppercase tracking-wider text-brand-violet/80 pt-1 w-12 shrink-0">
                  Robin
                </span>
                <p className="text-[clamp(1.125rem,min(1.6vw,2.2vh),1.625rem)] font-medium text-brand-violet leading-snug">
                  &ldquo;Yes, sir.&rdquo;
                </p>
              </div>

              {/* Turn 3: User */}
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="font-mono text-xs uppercase tracking-wider text-white/40 pt-1 w-12 shrink-0">
                  You
                </span>
                <p className="text-[clamp(1.125rem,min(1.6vw,2.2vh),1.625rem)] font-medium text-white leading-snug">
                  &ldquo;What&apos;s on my schedule today?&rdquo;
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Robin Persistent Canvas Spacer (5 cols) */}
          <div
            className="lg:col-span-5 w-full aspect-square max-w-[280px] sm:max-w-[360px] lg:max-w-[440px] mx-auto pointer-events-none flex items-center justify-center"
            aria-hidden="true"
          />
        </div>
      </Container>
    </section>
  );
}
