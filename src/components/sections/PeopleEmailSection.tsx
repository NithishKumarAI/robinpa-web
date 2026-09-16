"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "../ui/Container";
import { ArrowDown } from "lucide-react";

export function PeopleEmailSection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="people-email"
      ref={sectionRef}
      className="relative isolate min-h-[100svh] flex items-center py-12 sm:py-16 lg:py-24 overflow-hidden border-b border-white/[0.06] bg-transparent"
      aria-label="Your People and Email"
    >
      {/* Ambient glow positioned behind Robin on the right */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[300px] sm:w-[460px] md:w-[540px] h-[300px] sm:h-[460px] md:h-[540px] rounded-full pointer-events-none -z-10"
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12)_0%,rgba(99,102,241,0.03)_50%,transparent_70%)] blur-3xl" />
      </div>

      <Container size="wide" className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Headline & Visual Demonstration (7 cols) */}
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
                People + Email
              </span>
            </div>

            {/* Major Headline: Spoken Request (height-aware) */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[clamp(2.5rem,min(4.8vw,6vh),4.5rem)] font-semibold tracking-tighter text-white leading-[1.06]">
              &ldquo;Draft a reply to my latest email.&rdquo;
            </h2>

            {/* Supporting Statement (height-aware) */}
            <p className="mt-3 sm:mt-5 text-[clamp(1.125rem,min(1.8vw,2.2vh),1.5rem)] text-white/70 font-normal leading-relaxed max-w-xl">
              Robin understands the context and prepares the draft.
            </p>

            {/* 3-Step Visual Confirmation Flow */}
            <div className="mt-6 sm:mt-10 w-full max-w-xl rounded-2xl border border-white/[0.1] bg-neutral-950/80 lg:bg-white/[0.03] backdrop-blur-md p-5 sm:p-7 space-y-3 sm:space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.36)]">
              {/* Step 1 */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[clamp(1rem,min(1.5vw,2vh),1.375rem)] font-medium text-white">
                  Context detected
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-white/40">
                  Resolved
                </span>
              </div>

              {/* Arrow */}
              <div className="flex justify-center text-brand-violet/70">
                <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              {/* Step 2 */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-brand-violet/[0.06] border border-brand-violet/25">
                <span className="text-[clamp(1rem,min(1.5vw,2vh),1.375rem)] font-medium text-brand-violet">
                  Reply prepared
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-brand-violet/80">
                  Drafted
                </span>
              </div>

              {/* Arrow */}
              <div className="flex justify-center text-brand-violet/70">
                <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              {/* Step 3 */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[clamp(1rem,min(1.5vw,2vh),1.375rem)] font-medium text-white">
                  Awaiting your approval
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-white/40">
                  Ready
                </span>
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
